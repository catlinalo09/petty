import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import About from './components/About.jsx';
import Menu from './components/Menu.jsx';
import Products from './components/Products.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { fetchProducts } from './api.js';
import { fallbackProducts } from './data/fallbackProducts.js';

export default function App() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [search, setSearch] = useState('');

  const loadProducts = useCallback(async () => {
    setStatus('loading');

    try {
      const data = await fetchProducts();
      setProducts(data);
      setStatus('ready');
    } catch (err) {
      // Si la API no responde mostramos el catálogo local para no romper la página.
      // El detalle técnico solo va a la consola, nunca al visitante.
      console.error('No se pudo cargar el catálogo desde la API:', err);
      setProducts(fallbackProducts);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;

    return products.filter((product) =>
      `${product.name} ${product.description}`.toLowerCase().includes(term),
    );
  }, [products, search]);

  const menu = visibleProducts.filter((product) => product.category === 'menu');
  const catalog = visibleProducts.filter((product) => product.category === 'producto');

  return (
    <CartProvider>
      <Header search={search} onSearchChange={setSearch} />

      <main>
        <Home />
        <About />
        <Menu products={menu} status={status} search={search} />
        <Products products={catalog} status={status} search={search} />
        <Contact />
      </main>

      <Footer />

      {status === 'error' && (
        <div className="api-toast" role="status">
          <p>
            No pudimos cargar los productos en este momento. Estás viendo el catálogo guardado
            mientras se restablece la conexión.
          </p>
          <button type="button" className="btn" onClick={loadProducts}>
            reintentar
          </button>
        </div>
      )}
    </CartProvider>
  );
}
