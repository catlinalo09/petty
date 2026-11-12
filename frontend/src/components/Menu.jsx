import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/format.js';

export default function Menu({ products, status, search }) {
  const { add } = useCart();

  return (
    <section className="menu" id="menu">
      <h1 className="heading">
        Nuestros <span>Servicios</span>
      </h1>

      {status === 'loading' && <p className="empty-state">Cargando servicios…</p>}

      {status !== 'loading' && products.length === 0 && (
        <p className="empty-state">
          {search ? 'No hay servicios que coincidan con tu búsqueda.' : 'No hay servicios disponibles por ahora.'}
        </p>
      )}

      <div className="box-container">
        {products.map((product) => (
          <article className="box" key={product.id}>
            {product.image && (
              <img src={product.image} alt={product.name} loading="lazy" />
            )}
            <h3>{product.name}</h3>
            {product.description && <p className="description">{product.description}</p>}
            <div className="price">
              {formatPrice(product.price)}
              {product.oldPrice ? <span>{formatPrice(product.oldPrice)}</span> : null}
            </div>
            <button type="button" className="btn" onClick={() => add(product)}>
              añadir al carrito
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
