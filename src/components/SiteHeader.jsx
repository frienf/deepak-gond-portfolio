import { nav, profile } from '../data/profile.js';
import { useStickyHeader } from '../hooks/useStickyHeader.js';
import { useActiveSection } from '../hooks/useActiveSection.js';
import { Icon } from './Icon.jsx';
import { useDrawOn } from '../hooks/useDrawOn.js';
import { ThemeToggle } from './ThemeToggle.jsx';

const SECTION_IDS = nav.map((item) => item.id);

export function SiteHeader({ theme, onToggleTheme }) {
  const stuck = useStickyHeader();
  const active = useActiveSection(SECTION_IDS);
  // The mark is in view from the first frame, so this plays once on load
  const markRef = useDrawOn({ duration: 700, stagger: 90 });

  return (
    <header className={`site-header${stuck ? ' is-stuck' : ''}`} id="site-header">
      <div className="container site-header__inner">
        <a className="brand" href="#top">
          <span className="brand__mark" aria-hidden="true">
            <svg ref={markRef} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M2 11.5 6 7l3 2.5L14 4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6" cy="7" r="1.2" fill="currentColor" stroke="none" />
              <circle cx="14" cy="4" r="1.6" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span>
            {profile.shortName}
            <span className="brand__role">{profile.role}</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Sections">
          <ul className="site-nav__list">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  className="site-nav__link"
                  href={`#${item.id}`}
                  aria-current={active === item.id ? 'true' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <a className="btn btn--ghost site-header__cta" href="#contact">
            Let&rsquo;s talk
            <span className="btn__arrow" aria-hidden="true"><Icon name="arrow" /></span>
          </a>
        </div>
      </div>
    </header>
  );
}
