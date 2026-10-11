import { metrics } from '../data/profile.js';
import { useCountUp } from '../hooks/useCountUp.js';
import { SectionHead } from './SectionHead.jsx';
import { Sparkline } from './Sparkline.jsx';

function Metric({ metric }) {
  const [ref, animated] = useCountUp(metric.value);

  return (
    <article className="metric">
      {/* The real figure renders until the count-up takes over, so the
          correct number is on screen even if it never runs. */}
      <p className="metric__value" ref={ref}>
        <span>{animated ?? metric.value}</span>
        <span className="metric__unit">{metric.unit}</span>
      </p>
      <p className="metric__label">{metric.label}</p>
      <p className="metric__note">{metric.note}</p>
      <Sparkline series={metric.series} />
    </article>
  );
}

export function Impact() {
  return (
    <section className="section" id="impact" aria-labelledby="impact-title">
      <div className="container">
        <SectionHead
          index="01"
          eyebrow="Business impact"
          title="Numbers my work moved."
          titleId="impact-title"
          lede="Every figure below comes from shipped work at Voraco Distributors — automated reporting, ERP-integrated dashboards and supply-chain trackers measured against the manual process they replaced."
        />

        <div className="dashboard js-reveal" data-dashboard>
          <div className="dashboard__bar">
            <span>Operations scorecard</span>
            <span className="dashboard__live">Measured outcomes</span>
          </div>

          <div className="dashboard__grid">
            {metrics.map((metric) => <Metric key={metric.label} metric={metric} />)}
          </div>

          <p className="dashboard__footer">
            <span>Also: 20% fewer inventory discrepancies after SQL + Python reconciliation</span>
            <span>Source: Voraco Distributors Pvt. Ltd. &middot; Sept 2025 &ndash; Jun 2026</span>
          </p>
        </div>
      </div>
    </section>
  );
}
