import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight } from './Icons'
import { staggerParent } from './Motion'

export function Arrows({ onPrev, onNext, canPrev = true, canNext = true }) {
  const cls = 'p-1 transition-all duration-300 disabled:opacity-30 enabled:hover:text-primary'
  return (
    <div className="flex shrink-0 items-center gap-4">
      <button aria-label="Previous" onClick={onPrev} disabled={!canPrev} className={`${cls} enabled:hover:-translate-x-1`}>
        <ArrowLeft />
      </button>
      <button aria-label="Next" onClick={onNext} disabled={!canNext} className={`${cls} enabled:hover:translate-x-1`}>
        <ArrowRight />
      </button>
    </div>
  )
}

// Horizontal scroller with arrow buttons and an animated progress line.
// `controls` = 'top' renders arrows through the `header` render-prop; 'bottom' renders the progress bar + arrows below.
export default function Carousel({ children, controls = 'bottom', header, gap = 20, className = '', trackClassName = '' }) {
  const ref = useRef(null)
  const [edges, setEdges] = useState({ start: true, end: false })
  const [ratio, setRatio] = useState(0.5)
  const { scrollXProgress } = useScroll({ container: ref })
  const progress = useSpring(scrollXProgress, { stiffness: 140, damping: 26 })
  const left = useTransform(progress, (v) => `${v * (1 - ratio) * 100}%`)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      setRatio(Math.min(1, el.clientWidth / el.scrollWidth))
      setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 })
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [children])

  const scroll = (dir) => {
    const el = ref.current
    const card = el.firstElementChild?.firstElementChild
    const step = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const arrows = <Arrows onPrev={() => scroll(-1)} onNext={() => scroll(1)} canPrev={!edges.start} canNext={!edges.end} />

  return (
    <div className={className}>
      {header?.(arrows)}
      <div ref={ref} className="no-scrollbar snap-x snap-mandatory overflow-x-auto overscroll-x-contain">
        <motion.div
          className={`flex ${trackClassName}`}
          style={{ gap }}
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          {children}
        </motion.div>
      </div>
      {controls === 'bottom' && (
        <div className="mt-8 flex items-center gap-6">
          <div className="relative h-px flex-1 bg-ink/10">
            <motion.div className="absolute inset-y-0 bg-primary" style={{ left, width: `${ratio * 100}%` }} />
          </div>
          {arrows}
        </div>
      )}
    </div>
  )
}
