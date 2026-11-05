const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const ChevronDown = (props) => (
  <svg viewBox="0 0 16 16" width="16" height="16" {...base} {...props}>
    <path d="M4 6l4 4 4-4" />
  </svg>
)

export const ArrowLeft = (props) => (
  <svg viewBox="0 0 14 32" width="14" height="32" {...base} strokeWidth={1.2} {...props}>
    <path d="M11 9L4 16l7 7" />
  </svg>
)

export const ArrowRight = (props) => (
  <svg viewBox="0 0 14 32" width="14" height="32" {...base} strokeWidth={1.2} {...props}>
    <path d="M3 9l7 7-7 7" />
  </svg>
)

export const Search = (props) => (
  <svg viewBox="0 0 16 16" width="16" height="16" {...base} strokeWidth={1.2} {...props}>
    <circle cx="7.3" cy="7.3" r="5.3" />
    <path d="M11.3 11.3L14 14" />
  </svg>
)

export const User = (props) => (
  <svg viewBox="0 0 16 16" width="16" height="16" {...base} strokeWidth={1.2} {...props}>
    <circle cx="8" cy="5" r="2.7" />
    <path d="M2.7 14c.6-2.6 2.7-4.2 5.3-4.2s4.7 1.6 5.3 4.2" />
  </svg>
)

export const Bag = (props) => (
  <svg viewBox="0 0 16 16" width="16" height="16" {...base} strokeWidth={1.2} {...props}>
    <path d="M3 5.3h10l-.8 8.7H3.8L3 5.3z" />
    <path d="M5.7 5.3V4.7a2.3 2.3 0 014.6 0v.6" />
  </svg>
)

export const Plus = ({ open, ...props }) => (
  <svg viewBox="0 0 20 20" width="20" height="20" {...base} strokeWidth={1.3} {...props}>
    <path d="M4 10h12" />
    <path d="M10 4v12" className="origin-center transition-transform duration-500 ease-smooth" style={{ transform: open ? 'scaleY(0)' : 'scaleY(1)' }} />
  </svg>
)

export const Check = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
)

export const Filter = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} strokeWidth={1.3} {...props}>
    <path d="M3 7h9M16 7h5M3 17h4M11 17h10" />
    <circle cx="14" cy="7" r="2" />
    <circle cx="9" cy="17" r="2" />
  </svg>
)

export const Star = ({ className = '', ...props }) => (
  <svg viewBox="0 0 20 20" width="20" height="20" className={className} {...props}>
    <path fill="currentColor" d="M10 1.5l2.6 5.5 6 .8-4.4 4.1 1.1 5.9L10 15l-5.3 2.8 1.1-5.9L1.4 7.8l6-.8L10 1.5z" />
  </svg>
)

export const Play = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...props}>
    <path fill="currentColor" d="M8 5.5v13a1 1 0 001.5.86l10.5-6.5a1 1 0 000-1.72L9.5 4.64A1 1 0 008 5.5z" />
  </svg>
)

export const Close = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const Menu = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)
