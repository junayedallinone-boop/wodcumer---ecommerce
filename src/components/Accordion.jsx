import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from './Icons'
import { ease } from './Motion'

export default function AccordionItem({ title, open, onToggle, children, className = '', titleClassName = '' }) {
  return (
    <div className={`border-b border-divider ${className}`}>
      <button onClick={onToggle} aria-expanded={open} className="group flex w-full items-center justify-between gap-6 text-left">
        <span className={`transition-colors duration-300 group-hover:text-primary ${titleClassName}`}>{title}</span>
        <Plus open={open} className="shrink-0 transition-transform duration-500 ease-smooth group-hover:rotate-90" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
