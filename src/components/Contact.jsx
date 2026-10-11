import { contact, profile } from '../data/profile.js';
import { Icon } from './Icon.jsx';

export function Contact() {
  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="container container--narrow">
        <div className="contact js-reveal">
          <p className="eyebrow eyebrow--plain">07 &mdash; Contact</p>
          <h2 className="contact__title display" id="contact-title">{contact.title}</h2>
          <p className="section-lede" style={{ textAlign: 'center' }}>{contact.lede}</p>

          <div className="contact__actions">
            <a className="btn btn--primary" href={`mailto:${profile.email}?subject=Data%20Analyst%20role`}>
              <Icon name="mail" />
              Email me
            </a>
            <a className="btn btn--ghost" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
              <Icon name="linkedin" />
              Connect on LinkedIn
            </a>
          </div>

          <ul className="contact__links">
            {contact.links.map((link) => (
              <li key={link.href}>
                <a
                  className="contact__link"
                  href={link.href}
                  target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                >
                  <Icon name={link.icon} /> {link.label}
                </a>
              </li>
            ))}
            <li>
              <span className="contact__link"><Icon name="pin" /> Mumbai, India</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
