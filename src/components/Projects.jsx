import { projects, profile } from '../data/profile.js';
import { SectionHead } from './SectionHead.jsx';
import { TagRow } from './Tag.jsx';
import { ProjectMotif } from './ProjectMotif.jsx';
import { Icon } from './Icon.jsx';
import { SystemDiagrams } from './SystemDiagrams.jsx';

function Project({ project }) {
  return (
    <article className={`project js-reveal${project.featured ? ' project--featured' : ''}`}>
      <div className="project__preview" aria-hidden="true">
        <ProjectMotif motif={project.motif} />
        <p className="project__outcome">
          <b>{project.outcome.figure}</b> <span>{project.outcome.caption}</span>
        </p>
      </div>

      <div className="project__body">
        <p className="project__kicker">{project.kicker}</p>
        <h3 className="project__title">{project.title}</h3>
        <p className="project__summary">{project.summary}</p>

        {/* Native <details>: progressive disclosure with no JS and
            keyboard support for free. */}
        <details className="project__details">
          <summary>Case study<span className="sr-only"> for {project.title}</span></summary>
          <dl className="project__case">
            <div><dt>Problem</dt><dd>{project.problem}</dd></div>
            <div><dt>Approach</dt><dd>{project.approach}</dd></div>
            <div><dt>Outcome</dt><dd>{project.result}</dd></div>
          </dl>
          <TagRow items={project.tags} accent={project.accent} />
        </details>
      </div>

      <p className="project__footer">
        <span className="project__year">{project.year}</span>
        <a className="link-arrow" href={profile.links.github} target="_blank" rel="noopener noreferrer">
          github.com/frienf <Icon name="arrow" size={14} />
        </a>
      </p>
    </article>
  );
}

export function Projects() {
  return (
    <section className="section" id="projects" aria-labelledby="proj-title">
      <div className="container">
        <SectionHead
          index="04"
          eyebrow="Projects"
          title="Things I built to find out whether they would work."
          titleId="proj-title"
          lede="Side projects where computer vision, APIs and interface design met a concrete accuracy target. Open a card for the problem, the approach and the result."
        />
        <div className="projects">
          {projects.map((project) => <Project key={project.id} project={project} />)}
        </div>

        <SystemDiagrams />
      </div>
    </section>
  );
}
