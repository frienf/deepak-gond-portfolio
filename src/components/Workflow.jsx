import { useRef, useState } from 'react';
import { workflow } from '../data/profile.js';
import { SectionHead } from './SectionHead.jsx';
import { TagRow } from './Tag.jsx';

const STEP = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

export function Workflow() {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef([]);

  function select(index, { focus = false } = {}) {
    setSelected(index);
    if (focus) tabRefs.current[index]?.focus();
    // Keep the active step in view on the horizontal mobile rail
    tabRefs.current[index]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function onKeyDown(event) {
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      select(event.key === 'Home' ? 0 : workflow.length - 1, { focus: true });
      return;
    }
    const step = STEP[event.key];
    if (!step) return;
    event.preventDefault();
    select((selected + step + workflow.length) % workflow.length, { focus: true });
  }

  return (
    <section className="section" id="how-i-work" aria-labelledby="work-title">
      <div className="container">
        <SectionHead
          index="02"
          eyebrow="How I work"
          title="From raw records to a decision someone can act on."
          titleId="work-title"
          lede="Seven steps, the same every time. Pick a step to see the tools I reach for and what it looked like in production."
        />

        <div className="workflow js-reveal">
          <div
            className="workflow__steps"
            role="tablist"
            aria-orientation="vertical"
            aria-label="Workflow steps"
            onKeyDown={onKeyDown}
          >
            {workflow.map((step, i) => (
              <button
                key={step.id}
                type="button"
                className="workflow__step"
                role="tab"
                id={`tab-${step.id}`}
                aria-selected={i === selected}
                aria-controls={`panel-${step.id}`}
                /* Roving tabindex: one stop in the tab order, arrows move within */
                tabIndex={i === selected ? 0 : -1}
                ref={(node) => { tabRefs.current[i] = node; }}
                onClick={() => select(i)}
              >
                <span className="workflow__step-dot" />
                <span className="workflow__step-index">{String(i + 1).padStart(2, '0')}</span>
                {' '}{step.name}
              </button>
            ))}
          </div>

          {/* Every panel stays in the DOM and inactive ones are `hidden`:
              the text of all seven steps remains crawlable and findable
              with in-page search, not just the open one. */}
          <div className="workflow__panels">
            {workflow.map((step, i) => (
              <article
                key={step.id}
                className="workflow__panel"
                role="tabpanel"
                id={`panel-${step.id}`}
                aria-labelledby={`tab-${step.id}`}
                tabIndex={0}
                hidden={i !== selected}
              >
                <div className="workflow__panel-head">
                  <h3 className="workflow__panel-title">{step.name}</h3>
                  <p className="workflow__panel-stage">{step.stage}</p>
                </div>
                <p className="workflow__panel-body">{step.body}</p>
                <p className="workflow__panel-example">
                  <strong>In production:</strong> {step.example}
                </p>
                <TagRow items={step.tags} accent={step.accent} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
