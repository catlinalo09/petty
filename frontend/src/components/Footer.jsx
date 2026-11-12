const LINKS = [
  { href: '#home', label: 'inicio' },
  { href: '#about', label: 'acerca de' },
  { href: '#menu', label: 'menu' },
  { href: '#products', label: 'productos' },
  { href: '#contact', label: 'contacto' },
];

const SOCIAL = [
  { icon: 'fa-facebook-f', label: 'Facebook' },
  { icon: 'fa-twitter', label: 'Twitter' },
  { icon: 'fa-instagram', label: 'Instagram' },
  { icon: 'fa-linkedin', label: 'LinkedIn' },
  { icon: 'fa-pinterest', label: 'Pinterest' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="share">
        {SOCIAL.map((social) => (
          <a key={social.icon} href="#home" aria-label={social.label} className={`fab ${social.icon}`} />
        ))}
      </div>

      <div className="links">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
