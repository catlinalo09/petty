export default function About() {
  return (
    <section className="about" id="about">
      <h1 className="heading">
        <span>sobre</span> nosotros
      </h1>

      <div className="row">
        <div className="image">
          <img src="/images/about.png" alt="Preparación artesanal de Petty" loading="lazy" />
        </div>

        <div className="content">
          <h3>Bienvenidos a Petty</h3>
          <p>
            En Petty nos apasiona consentir a tus peludos con productos de calidad y sabor
            excepcional. Descubre nuestra variedad de galletas, pasteles y paletas diseñadas
            especialmente para ellos.
          </p>
          <p>
            Nos enorgullece ofrecer productos elaborados con ingredientes naturales y seguros
            para la salud de tus mascotas. Cada bocado está cuidadosamente preparado para
            brindarles una experiencia deliciosa y nutritiva.
          </p>
          <a href="#products" className="btn">
            conoce más
          </a>
        </div>
      </div>
    </section>
  );
}
