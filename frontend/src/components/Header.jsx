import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/format.js';

const LINKS = [
  { href: '#home', label: 'inicio' },
  { href: '#about', label: 'acerca de' },
  { href: '#menu', label: 'menu' },
  { href: '#products', label: 'productos' },
  { href: '#contact', label: 'contacto' },
];

export default function Header({ search, onSearchChange }) {
  const [panel, setPanel] = useState(null);
  const { items, remove, clear, total, count } = useCart();

  const toggle = (name) => {
    setPanel((current) => (current === name ? null : name));
  };

  const close = () => setPanel(null);

  useEffect(() => {
    const onScroll = () => setPanel(null);
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setPanel(null);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <header className="header">
      <a href="#home" className="logo" onClick={close}>
        <img src="/images/logo.png" alt="Petty" />
      </a>

      <nav className={`navbar ${panel === 'nav' ? 'active' : ''}`}>
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={close}>
            {link.label}
          </a>
        ))}
      </nav>

      <div className="icons">
        <button
          type="button"
          className="fas fa-search"
          aria-label="Abrir búsqueda"
          aria-expanded={panel === 'search'}
          onClick={() => toggle('search')}
        />

        <button
          type="button"
          className="fas fa-shopping-cart"
          aria-label={`Abrir carrito (${count} productos)`}
          aria-expanded={panel === 'cart'}
          onClick={() => toggle('cart')}
        >
          {count > 0 && <span className="cart-count">{count}</span>}
        </button>

        <button
          type="button"
          className="fas fa-bars"
          aria-label="Abrir menú de navegación"
          aria-expanded={panel === 'nav'}
          onClick={() => toggle('nav')}
        />
      </div>

      <form
        className={`search-form ${panel === 'search' ? 'active' : ''}`}
        onSubmit={(event) => {
          event.preventDefault();
          close();
        }}
      >
        <input
          type="search"
          id="search-box"
          placeholder="buscar producto..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <label htmlFor="search-box" className="fas fa-search" aria-label="Buscar" />
      </form>

      <aside
        className={`cart-items-container ${panel === 'cart' ? 'active' : ''}`}
        aria-label="Carrito de compras"
      >
        {items.length === 0 && <p className="cart-empty">Tu carrito está vacío.</p>}

        {items.map((item) => (
          <div className="cart-item" key={item.id}>
            <button
              type="button"
              className="fas fa-times"
              aria-label={`Quitar ${item.name} del carrito`}
              onClick={() => remove(item.id)}
            />
            <img src={item.image} alt={item.name} />
            <div className="content">
              <h3>{item.name}</h3>
              <div className="price">
                {item.qty} × {formatPrice(item.price)}
              </div>
            </div>
          </div>
        ))}

        {items.length > 0 && (
          <div className="cart-total">
            Total: <strong>{formatPrice(total)}</strong>
          </div>
        )}

        <button type="button" className="btn" onClick={clear} disabled={items.length === 0}>
          vaciar carrito
        </button>
      </aside>
    </header>
  );
}
