/**
 * References the static sprite in index.html. Decorative by default -
 * pass a label only when the icon is the sole carrier of meaning.
 */
export function Icon({ name, size = 16, label, className }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      aria-hidden={label ? undefined : 'true'}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <use href={`#i-${name}`} />
    </svg>
  );
}
