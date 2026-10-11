import { about, education, beliefs } from '../data/profile.js';
import { SectionHead } from './SectionHead.jsx';
import { Icon } from './Icon.jsx';

export function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container">
        <SectionHead index="06" eyebrow="About" title="The person behind the dashboards." titleId="about-title" />

        <div className="about">
          <div className="js-reveal">
            <p className="about__lead">{about.lead}</p>
            <div className="prose" style={{ marginTop: 'var(--space-sm)' }}>
              {about.paragraphs.map((text) => <p key={text.slice(0, 32)}>{text}</p>)}
            </div>
          </div>

          <aside className="about__aside js-reveal">
            <div className="card">
              <h3 className="card__title">Education</h3>
              {education.map((item) => (
                <div className="degree" key={item.degree}>
                  <p className="degree__name">{item.degree}</p>
                  <p className="degree__meta">
                    <span>{item.school} &middot; {item.years}</span>
                    <span className="degree__cgpa">{item.cgpa}</span>
                  </p>
                </div>
              ))}
            </div>

            <div className="card">
              <h3 className="card__title">What I enjoy</h3>
              <ul className="beliefs">
                {beliefs.map((belief) => (
                  <li key={belief}><Icon name="check" /><span>{belief}</span></li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
