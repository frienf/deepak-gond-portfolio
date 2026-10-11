import { roles } from '../data/profile.js';
import { SectionHead } from './SectionHead.jsx';
import { TagRow } from './Tag.jsx';

/** Renders **…** segments as the highlighted measured figure. */
function Highlight({ text }) {
  return text.split('**').map((part, i) => (
    i % 2 ? <b key={i}>{part}</b> : <span key={i}>{part}</span>
  ));
}

function Role({ role }) {
  return (
    <article className="role js-reveal">
      <div className="role__head">
        <h3 className="role__org">{role.org}</h3>
        <p className="role__dates">{role.dates}</p>
      </div>
      <p className="role__title">
        {role.title} <span>&middot; {role.meta}</span>
      </p>
      <ul className="role__points">
        {role.points.map((point) => (
          <li key={point}><span><Highlight text={point} /></span></li>
        ))}
      </ul>
      <TagRow items={role.stack} accent={role.accent} className="role__stack" />
    </article>
  );
}

export function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="exp-title">
      <div className="container">
        <SectionHead index="03" eyebrow="Experience" title="Where the work happened." titleId="exp-title" />

        <div className="timeline" data-timeline>
          <span className="timeline__progress" data-timeline-progress aria-hidden="true" />
          {roles.map((role) => <Role key={role.org} role={role} />)}
        </div>
      </div>
    </section>
  );
}
