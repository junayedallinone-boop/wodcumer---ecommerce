import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { ChevronDown } from '../components/Icons'
import { PageTransition, Reveal, ease } from '../components/Motion'
import { categories, categoryProducts, localize } from '../data'
import { useStore } from '../store'

// Grid cells stagger in on load and scale/fade when filters change
const cell = {
  hidden: { opacity: 0, y: 30, scale: 0.96, transition: { duration: 0.3, ease } },
  show: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease, delay: Math.min(i, 8) * 0.06 } }),
}

const sorts = {
  'Alphabetical: AZ': (a, b) => a.name.localeCompare(b.name),
  'Alphabetical: ZA': (a, b) => b.name.localeCompare(a.name),
  'Price: Low to High': (a, b) => a.price - b.price,
  'Price: High to Low': (a, b) => b.price - a.price,
}

const filters = {
  Availability: ['All', 'On sale', 'New'],
  Price: ['All', 'Under $250', '$250 – $400', 'Over $400'],
  Color: ['All', 'Oak', 'Walnut', 'Desert', 'Ivory', 'Natural'],
}

function Dropdown({ label, value, options, onChange, align = 'left', showValue = true }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1 text-[14px] font-medium leading-[1.16] transition-colors hover:text-primary">
        {label}
        {showValue && value && value !== 'All' && <span className="text-primary">: {localize(value)}</span>}
        <ChevronDown className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease }}
            className={`absolute top-full z-30 mt-3 min-w-[180px] origin-top bg-white py-2 shadow-[0_20px_40px_-15px_rgba(42,14,23,0.25)] ${align === 'right' ? 'right-0' : 'left-0'}`}
          >
            {options.map((o) => (
              <li key={o}>
                <button
                  onClick={() => {
                    onChange(o)
                    setOpen(false)
                  }}
                  className={`w-full px-4 py-2 text-left text-[14px] transition-colors hover:bg-bg ${value === o ? 'font-semibold text-primary' : ''}`}
                >
                  {localize(o)}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

const collections = {
  all: { title: 'Shop All', intro: 'Every piece in the Wodcumer collection.' },
  offers: { title: 'Offers', intro: 'Limited-time prices on customer favourites. Use code SPRING70 for an extra $70 off orders over $300.', match: (p) => p.badge?.includes('OFF') },
  'new-in': { title: 'New In', intro: 'Fresh from the workshop — the latest additions to the collection.', match: (p) => p.badge === 'New' },
}

const collectionFor = (slug) => {
  if (collections[slug]) return collections[slug]
  const cat = categories.find((c) => c.slug === slug)
  if (!cat) return collections.all
  return { title: cat.name, match: (p) => p.category === slug }
}

export default function Category() {
  useStore() // re-render when the currency changes
  const { slug = 'all' } = useParams()
  const [sort, setSort] = useState('Alphabetical: AZ')
  const [active, setActive] = useState({ Availability: 'All', Price: 'All', Color: 'All' })
  const collection = collectionFor(slug)
  // Categories with nothing in them yet fall back to the full range
  const base = collection.match ? categoryProducts.filter(collection.match) : categoryProducts
  const pool = base.length ? base : categoryProducts

  const products = useMemo(() => {
    const colorIdx = filters.Color.indexOf(active.Color) - 1
    return pool
      .filter((p) => active.Availability === 'All' || (active.Availability === 'New' ? p.badge === 'New' : p.badge?.includes('OFF')))
      .filter((p) => {
        if (active.Price === 'Under $250') return p.price < 250
        if (active.Price === '$250 – $400') return p.price >= 250 && p.price <= 400
        if (active.Price === 'Over $400') return p.price > 400
        return true
      })
      .filter((p) => colorIdx < 0 || p.swatches.includes(colorIdx))
      .sort(sorts[sort])
  }, [sort, active, pool])

  return (
    <PageTransition>
      <section className="container-x pb-20 pt-7 md:pb-[110px]">
        <Reveal as="h1" className="mb-3 font-serif text-[30px] leading-[1.1] tracking-[-0.03em] opacity-90 md:text-[36px]">
          {collection.title}
        </Reveal>
        {(collection.intro || !base.length) && (
          <Reveal delay={0.1} as="p" className="mb-2 max-w-[640px] opacity-75">
            {base.length ? localize(collection.intro) : `New ${collection.title.toLowerCase()} pieces are on their way — in the meantime, explore the full collection.`}
          </Reveal>
        )}
        <Reveal delay={0.15} className="no-scrollbar mb-8 mt-5 flex gap-2 overflow-x-auto">
          {[['all', 'All'], ['new-in', 'New In'], ['offers', 'Offers'], ...categories.map((c) => [c.slug, c.name])].map(([s, label]) => (
            <Link
              key={s}
              to={`/category/${s}`}
              className={`shrink-0 rounded-full border px-4 py-2 text-[14px] transition-all duration-300 ${slug === s ? 'border-primary bg-primary text-white' : 'border-ink/15 hover:border-ink'}`}
            >
              {label}
            </Link>
          ))}
        </Reveal>

        <Reveal delay={0.1} className="relative z-20 mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <span className="text-[14px] font-medium">Filter:</span>
            {Object.entries(filters).map(([label, opts]) => (
              <Dropdown key={label} label={label} value={active[label]} options={opts} onChange={(v) => setActive({ ...active, [label]: v })} />
            ))}
          </div>
          <div className="flex items-center gap-[50px]">
            <div className="flex items-center gap-2 text-[14px] font-medium">
              Sort by:
              <Dropdown label={sort} options={Object.keys(sorts)} value={sort} showValue={false} onChange={setSort} align="right" />
            </div>
            <motion.span key={products.length} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[14px] font-medium">
              {products.length} products
            </motion.span>
          </div>
        </Reveal>

        <LayoutGroup>
          <motion.div layout className="grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-5 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {products.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  variants={cell}
                  custom={i}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {products.length === 0 && (
          <p className="py-20 text-center text-[16px] opacity-70">No products match these filters.</p>
        )}
      </section>
    </PageTransition>
  )
}
