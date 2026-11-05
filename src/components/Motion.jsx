import { Children, cloneElement, isValidElement } from 'react'
import { motion } from 'framer-motion'

export const ease = [0.22, 1, 0.36, 1]

const headingTags = ['h1', 'h2', 'h3']

const wordVariant = {
  hidden: { y: '115%', rotate: 5, opacity: 0 },
  show: { y: 0, rotate: 0, opacity: 1, transition: { duration: 1, ease } },
}

// Wraps every word in a clipping mask so it can slide up from below the baseline.
// Keeps <em>, <br> and other inline elements intact.
function splitWords(children) {
  return Children.map(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return String(child)
        .split(/(\s+)/)
        .map((part, i) =>
          /^\s+$/.test(part) || !part ? (
            part
          ) : (
            <span key={i} className="-mb-[0.15em] inline-block overflow-hidden pb-[0.15em] align-bottom">
              <motion.span variants={wordVariant} className="inline-block origin-bottom-left will-change-transform">
                {part}
              </motion.span>
            </span>
          ),
        )
    }
    if (isValidElement(child) && child.type !== 'br') {
      return cloneElement(child, {}, splitWords(child.props.children))
    }
    return child
  })
}

// Headings: words rise out of a mask one after another
export function SplitText({ children, as = 'h2', className = '', delay = 0, ...rest }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
      {...rest}
    >
      {splitWords(children)}
    </Tag>
  )
}

// Fades, lifts and un-blurs content once it scrolls into view. Headings get the word-mask reveal instead.
export function Reveal({ children, delay = 0, y = 40, className = '', as = 'div', ...rest }) {
  if (headingTags.includes(as)) {
    return (
      <SplitText as={as} className={className} delay={delay} {...rest}>
        {children}
      </SplitText>
    )
  }
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1, ease, delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

export const staggerChild = {
  hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease } },
}

export function Stagger({ children, className = '', ...rest }) {
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

// Image that slowly zooms out when revealed — used for large editorial photos
export function RevealImage({ src, alt = '', className = '', imgClassName = '' }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover ${imgClassName}`}
        initial={{ scale: 1.15, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.4, ease }}
      />
    </div>
  )
}

export function PageTransition({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.6, ease }}
    >
      {children}
    </motion.main>
  )
}
