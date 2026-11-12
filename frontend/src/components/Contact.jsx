import { useState } from 'react';
import { sendMessage } from '../api.js';

const EMPTY_FORM = { name: '', email: '', phone: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [state, setState] = useState({ status: 'idle', message: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({ status: 'sending', message: '' });

    try {
      const result = await sendMessage(form);
      setForm(EMPTY_FORM);
      setState({ status: 'success', message: result.message });
    } catch (error) {
      setState({ status: 'error', message: error.message });
    }
  };

  return (
    <section className="contact" id="contact">
      <h1 className="heading">
        <span>contáctanos</span> ahora
      </h1>

      <div className="row">
        <iframe
          className="map"
          title="Ubicación de Petty"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63724.42501370155!2d-76.5427712!3d3.4045951999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a44077abf4bd%3A0x374a3ba6307ce68e!2sAndoke%20Mariposario%20y%20Centro%20de%20Ciencias!5e0!3m2!1ses-419!2sco!4v1794362357862!5m2!1ses-419!2sco"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />

        <form onSubmit={handleSubmit}>
          <h3>envíanos un mensaje</h3>

          <div className="inputBox">
            <span className="fas fa-user" aria-hidden="true" />
            <input
              type="text"
              name="name"
              placeholder="nombre"
              value={form.name}
              onChange={handleChange}
              maxLength={80}
              required
            />
          </div>

          <div className="inputBox">
            <span className="fas fa-envelope" aria-hidden="true" />
            <input
              type="email"
              name="email"
              placeholder="correo"
              value={form.email}
              onChange={handleChange}
              maxLength={120}
              required
            />
          </div>

          <div className="inputBox">
            <span className="fas fa-phone" aria-hidden="true" />
            <input
              type="tel"
              name="phone"
              placeholder="número de teléfono"
              value={form.phone}
              onChange={handleChange}
              maxLength={30}
            />
          </div>

          <div className="inputBox">
            <span className="fas fa-comment" aria-hidden="true" />
            <textarea
              name="message"
              placeholder="cuéntanos qué necesitas"
              value={form.message}
              onChange={handleChange}
              maxLength={1000}
              rows={4}
            />
          </div>

          <button type="submit" className="btn" disabled={state.status === 'sending'}>
            {state.status === 'sending' ? 'enviando…' : 'enviar mensaje'}
          </button>

          {state.message && (
            <p className={`form-status ${state.status}`} role="status">
              {state.message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
