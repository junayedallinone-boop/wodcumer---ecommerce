import { Link } from 'react-router-dom'
import { Reveal, SplitText } from './Motion'

// Breadcrumb + serif title + optional intro, used at the top of every inner page
export function PageHeader({ crumbs = [], title, intro, center = false, children }) {
  return (
    <header className={`container-x pb-10 pt-6 md:pb-14 ${center ? 'text-center' : ''}`}>
      <nav className={`mb-6 flex flex-wrap gap-2 text-[14px] ${center ? 'justify-center' : ''}`}>
        <Link to="/" className="opacity-60 transition-opacity hover:opacity-100">Home</Link>
        {crumbs.map((c) => (
          <span key={c.label} className="flex gap-2">
            <span className="opacity-60">/</span>
            {c.to ? (
              <Link to={c.to} className="opacity-60 transition-opacity hover:opacity-100">{c.label}</Link>
            ) : (
              <span>{c.label}</span>
            )}
          </span>
        ))}
      </nav>
      <SplitText as="h1" className="font-serif text-[38px] leading-[1.1] tracking-[-0.03em] md:text-[56px]">
        {title}
      </SplitText>
      {intro && (
        <Reveal delay={0.2} as="p" className={`mt-4 max-w-[620px] text-[16px] leading-[1.5] opacity-80 md:text-[18px] ${center ? 'mx-auto' : ''}`}>
          {intro}
        </Reveal>
      )}
      {children}
    </header>
  )
}

// Labelled text input matching the site's quiet, square style
export function Field({ label, error, className = '', as = 'input', children, ...props }) {
  const Tag = as
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[14px] font-medium">{label}</span>
      {as === 'select' ? (
        <select
          {...props}
          className={`h-12 border bg-white/60 px-4 text-[16px] outline-none transition-colors duration-300 focus:border-primary focus:bg-white ${error ? 'border-[#b3261e]' : 'border-ink/15'}`}
        >
          {children}
        </select>
      ) : (
        <Tag
          {...props}
          className={`border bg-white/60 px-4 text-[16px] outline-none transition-colors duration-300 placeholder:text-ink/40 focus:border-primary focus:bg-white ${
            as === 'textarea' ? 'min-h-36 py-3' : 'h-12'
          } ${error ? 'border-[#b3261e]' : 'border-ink/15'}`}
        />
      )}
      {error && <span className="text-[13px] text-[#b3261e]">{error}</span>}
    </label>
  )
}

export function QtyStepper({ value, onChange, small = false }) {
  const btn = `flex items-center justify-center transition-colors hover:bg-ink hover:text-bg ${small ? 'size-8' : 'size-11'}`
  return (
    <div className="inline-flex items-center border border-ink/20">
      <button aria-label="Decrease quantity" className={btn} onClick={() => onChange(value - 1)}>−</button>
      <span className={`text-center tabular-nums ${small ? 'w-8 text-[14px]' : 'w-10'}`}>{value}</span>
      <button aria-label="Increase quantity" className={btn} onClick={() => onChange(value + 1)} disabled={value >= 10}>+</button>
    </div>
  )
}

export function EmptyState({ title, text, action }) {
  return (
    <Reveal className="flex flex-col items-center gap-5 py-20 text-center">
      <p className="font-serif text-[32px] italic leading-[1.1] md:text-[40px]">{title}</p>
      {text && <p className="max-w-[420px] opacity-70">{text}</p>}
      {action}
    </Reveal>
  )
}

export const Heart = ({ filled, ...props }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinejoin="round" d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.3a4.3 4.3 0 017.5 2.5C19.5 15.4 12 20 12 20z" />
  </svg>
)
