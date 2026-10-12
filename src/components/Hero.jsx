import { hero } from '../data/profile.js';
import { profile } from '../data/profile.js';
import { Icon } from './Icon.jsx';
import { HeroCanvas } from './HeroCanvas.jsx';

export function Hero({ onSceneReady, theme }) {
  return (
    <section className="hero section" id="top">
      <HeroCanvas onReady={onSceneReady} theme={theme} />
      <div className="hero__scrim" aria-hidden="true" />

      <div className="container">
        <div className="hero__content">
          <p className="eyebrow">{hero.eyebrow}</p>

          <h1 className="hero__title display">
            {hero.titleLead}<em>{hero.titleAccent}</em>
          </h1>

          <p className="hero__lede">{hero.lede}</p>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#impact">
              Explore my work
              <span className="btn__arrow" aria-hidden="true"><Icon name="arrow" size={18} /></span>
            </a>
            <a
              className="btn btn--ghost"
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="linkedin" />
              Connect on LinkedIn
            </a>
          </div>

          <ul className="hero__meta">
            {hero.meta.map((item) => (
              <li key={item.text}><Icon name={item.icon} />{item.text}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Names the five stages the 3D scene draws, so the visual never
          carries information the text does not. */}
      <div className="hero__legend">
        <h2 className="sr-only">The pipeline behind the visual</h2>
        <ol className="hero__legend-list">
          {hero.stages.map((stage) => (
            <li key={stage}><span className="hero__legend-dot" aria-hidden="true" />{stage}</li>
          ))}
        </ol>
      </div>

      <p className="scroll-cue" aria-hidden="true">
        <span className="scroll-cue__rail" />
        Scroll
      </p>
    </section>
  );
}
