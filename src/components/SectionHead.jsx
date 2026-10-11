/** The shared eyebrow / title / lede block that opens every section. */
export function SectionHead({ index, eyebrow, title, titleId, lede }) {
  return (
    <div className="section-head js-reveal">
      <p className="eyebrow">{index} &mdash; {eyebrow}</p>
      <h2 className="section-title" id={titleId}>{title}</h2>
      {lede && <p className="section-lede">{lede}</p>}
    </div>
  );
}
