import { nav } from '../data/profile.js';
import { useStickyHeader } from '../hooks/useStickyHeader.js';
import { useActiveSection } from '../hooks/useActiveSection.js';
import { Icon } from './Icon.jsx';
import { BrandLogo } from './BrandLogo.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';

const SECTION_IDS = nav.map((item) => item.id);

export function SiteHeader({ theme, onToggleTheme }) {
  const stuck = useStickyHeader();
  const active = useActiveSection(SECTION_IDS);
  /* The brand entrance is CSS, not useDrawOn. That hook parks every shape at
     opacity 0 until an IntersectionObserver fires, which was fine when the
     name sat outside the SVG - a miss cost you the icon. Now the wordmark is
     the whole brand, so a miss would cost the entire header lockup. */

  return (
    <header className={`site-header${stuck ? ' is-stuck' : ''}`} id="site-header">
      <div className="container site-header__inner">
        {/* The name lives on the anchor, not left to the SVG's own
            aria-label. A child's label does compute as the link's accessible
            name, but it reads as "InsightDeepak" alone - which names the
            logo rather than saying where the link goes. */}
        <a className="brand" href="#top" aria-label="InsightDeepak — back to top">
          <BrandLogo />
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
