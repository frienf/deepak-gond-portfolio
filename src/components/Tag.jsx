/** A single technology chip. `accent` highlights the first N in a row. */
export function Tag({ children, accent = false }) {
  return <span className={accent ? 'tag tag--accent' : 'tag'}>{children}</span>;
}

/** A wrapped row of chips; the first `accent` items are highlighted. */
export function TagRow({ items, accent = 0, className = '' }) {
  return (
    <div className={`tag-row ${className}`.trim()}>
      {items.map((item, i) => (
        <Tag key={item} accent={i < accent}>{item}</Tag>
      ))}
    </div>
  );
}
