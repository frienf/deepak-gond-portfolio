import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { projects, profile } from '../data/profile.js';
import { SectionHead } from './SectionHead.jsx';
import { TagRow } from './Tag.jsx';
import { ProjectMotif } from './ProjectMotif.jsx';
import { Icon } from './Icon.jsx';
import { SystemDiagrams } from './SystemDiagrams.jsx';

// Motion-driven case study disclosure.
//
// The element stays a native <details> rather than becoming a button with
// aria-expanded: with no JS the summary still toggles it, and the keyboard
// semantics are the browser's rather than ours to re-implement.
//
// Once JS is up the summary's default action is cancelled and React owns
// `open` instead, because the native element drops its content the instant
// the attribute goes - there is nothing left to animate out. So `open` is
// held through the exit and released only when Motion reports the collapse
// finished. `is-open` carries the reader's intent, which is what the +/-
// marker follows; `open` lags it by one exit.
//
// The pre-hydration resting state is the OPEN one, not the closed one. Motion
// writes its target inline on first render, so a server-rendered height:0
// would leave the case study permanently collapsed for a reader whose JS
// never arrives. Resting open costs nothing - <details> is shut, so the
// client's collapse on hydration happens behind a closed element. (Leaving
// `animate` undefined until hydration does not work: Motion never attaches,
// and the disclosure is then stuck open.)
function CaseStudy({ project }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Adopt whatever the browser did with the summary before hydration,
    // rather than snapping a card the reader just opened back shut.
    if (ref.current?.open) { setOpen(true); setExpanded(true); }
    setHydrated(true);
  }, []);

  const rested = !hydrated || expanded;

  function toggle(event) {
    if (!hydrated) return;
    event.preventDefault();
    if (expanded) setExpanded(false);
    else { setOpen(true); setExpanded(true); }
  }

  return (
    <details
      ref={ref}
      className={`project__details${expanded ? ' is-open' : ''}`}
      open={hydrated ? open : undefined}
    >
      <summary onClick={toggle}>
        Case study<span className="sr-only"> for {project.title}</span>
      </summary>
      <motion.div
        className="project__case-wrap"
        initial={false}
        animate={rested ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        // 240ms / --dur, the same out-cubic the rest of the state layer uses.
        // No spring: DESIGN.md allows no overshoot anywhere.
        transition={{ duration: reduced ? 0 : 0.24, ease: [0.33, 1, 0.68, 1] }}
        onAnimationComplete={() => { if (!expanded) setOpen(false); }}
      >
        <dl className="project__case">
          <div><dt>Problem</dt><dd>{project.problem}</dd></div>
          <div><dt>Approach</dt><dd>{project.approach}</dd></div>
          <div><dt>Outcome</dt><dd>{project.result}</dd></div>
        </dl>
        <TagRow items={project.tags} accent={project.accent} />
      </motion.div>
    </details>
  );
}

// Motion pilot. These cards carry `project-reveal` instead of `js-reveal`, so
// GSAP's ScrollTrigger.batch('.js-reveal:not(.skill-group)') and showEverything()
// no longer select them. Motion owns opacity and y here outright - the CSS
// carries no hidden state for this class, because two owners on `opacity` is
// exactly what leaves a card stranded at 0.
//
// `initial={false}` keeps the prerender honest: Motion renders `initial` into
// SSR markup, so any hidden initial would ship opacity:0 to crawlers and no-JS
// readers. With it false the server writes the resting state instead.
//
// The entrance is then armed only for cards that are off-screen when JS takes
// over. One already in view is left alone rather than flashed out and back in,
// and a card that never receives an IntersectionObserver callback - a page
// mounted in a background tab - is simply never hidden, which is the trap
// showEverything() guards on the GSAP path.
function Project({ project }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!inView && !reduced) setArmed(true);
    // Mount only: arming later would hide a card the reader is looking at.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hidden = armed && !inView && !reduced;

  return (
    <motion.article
      ref={ref}
      className={`project project-reveal${project.featured ? ' project--featured' : ''}`}
      initial={false}
      animate={hidden ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      // 480ms / cubic-bezier(0.33, 1, 0.68, 1) - the --dur-slow and --ease
      // tokens. Explicit, because Motion's default for transforms is a spring
      // and DESIGN.md allows no overshoot anywhere.
      transition={{ duration: 0.48, ease: [0.33, 1, 0.68, 1] }}
    >
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

        <CaseStudy project={project} />
      </div>

      <p className="project__footer">
        <span className="project__year">{project.year}</span>
        <a className="link-arrow" href={profile.links.github} target="_blank" rel="noopener noreferrer">
          github.com/frienf <Icon name="arrow" size={14} />
        </a>
      </p>
    </motion.article>
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
