import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/format.js';

function Stars({ rating = 5 }) {
  return (
    <div className="stars" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, index) => {
        const value = index + 1;
        const half = rating >= value - 0.5 && rating < value;

        return (
          <i
            key={value}
            className={`${half ? 'fas fa-star-half-alt' : 'fas fa-star'}`}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

export default function Products({ products, status, search }) {
  const { add } = useCart();

  return (
    <section className="products" id="products">
      <h1 className="heading">
        Nuestros <span>Productos</span>
      </h1>

      {status === 'loading' && <p className="empty-state">Cargando productos…</p>}

      {status !== 'loading' && products.length === 0 && (
        <p className="empty-state">
          {search ? 'No hay productos que coincidan con tu búsqueda.' : 'No hay productos disponibles por ahora.'}
        </p>
      )}

      <div className="box-container">
        {products.map((product) => (
          <article className="box" key={product.id}>
            <div className="icons">
              <button
                type="button"
                className="fas fa-shopping-cart"
                aria-label={`Añadir ${product.name} al carrito`}
                onClick={() => add(product)}
              />
            </div>

            <div className="image">
              {product.image && (
                <img src={product.image} alt={product.name} loading="lazy" />
              )}
            </div>

            <div className="content">
              <h3>{product.name}</h3>
              <Stars rating={product.rating} />
              <div className="price">
                {formatPrice(product.price)}
                {product.oldPrice ? <span>{formatPrice(product.oldPrice)}</span> : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
