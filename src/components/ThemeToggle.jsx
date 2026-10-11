import { Icon } from './Icon.jsx';

/**
 * One button, two states. The label says what will happen, not what is
 * currently true, which is what a screen reader user needs to decide
 * whether to press it.
 */
export function ThemeToggle({ theme, onToggle }) {
  const toLight = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-pressed={!toLight}
      title={toLight ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <Icon name={toLight ? 'sun' : 'moon'} size={18} />
      <span className="sr-only">
        {toLight ? 'Switch to light theme' : 'Switch to dark theme'}
      </span>
    </button>
  );
}
