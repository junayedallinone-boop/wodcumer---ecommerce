import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { Search as SearchIcon } from '../components/Icons'
import { PageTransition, Reveal, ease } from '../components/Motion'
import { EmptyState, PageHeader } from '../components/Ui'
import { categories, products } from '../data'

const suggestions = ['Chair', 'Sofa', 'Table', 'Oak', 'Walnut', 'Mattress']

export const searchProducts = (q) => {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return []
  return products.filter((p) => {
    const hay = `${p.name} ${p.category} ${p.blurb ?? ''}`.toLowerCase()
    return words.every((w) => hay.includes(w))
  })
}

export default function Search() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const q = params.get('q') ?? ''
  const [input, setInput] = useState(q)
  const results = searchProducts(q)

  const go = (term) => navigate(`/search?q=${encodeURIComponent(term)}`)

  return (
    <PageTransition>
      <PageHeader crumbs={[{ label: 'Search' }]} title={q ? <>Results for <em>“{q}”</em></> : <>Search</>}>
        <Reveal delay={0.15}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (input.trim()) go(input.trim())
            }}
            className="mt-8 flex max-w-[640px] items-center gap-3 border-b-2 border-ink pb-3 focus-within:border-primary"
          >
            <SearchIcon className="size-5" />
            <input autoFocus value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search chairs, sofas, oak…" className="flex-1 bg-transparent text-[20px] outline-none placeholder:text-ink/40" />
            <button className="text-[14px] font-bold uppercase">Search</button>
          </form>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[14px]">
            <span className="opacity-60">Popular:</span>
            {suggestions.map((s) => (
              <button key={s} onClick={() => { setInput(s); go(s) }} className="rounded-full border border-ink/15 px-3 py-1 transition-colors hover:border-ink">
                {s}
              </button>
            ))}
          </div>
        </Reveal>
      </PageHeader>

      <section className="container-x pb-20 md:pb-[110px]">
        {q && (
          <p className="mb-8 text-[14px] font-medium">
            {results.length} product{results.length === 1 ? '' : 's'}
          </p>
        )}
        {q && results.length === 0 ? (
          <EmptyState
            title="Nothing matched your search"
            text="Try a different word, or browse by category."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((c) => (
                  <Link key={c.slug} to={`/category/${c.slug}`} className="rounded-full border border-ink/15 px-4 py-2 text-[14px] transition-colors hover:border-ink">{c.name}</Link>
                ))}
              </div>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-5 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {(q ? results : products).map((p, i) => (
                <motion.div key={p.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: Math.min(i, 8) * 0.05 } }} exit={{ opacity: 0, scale: 0.95 }}>
                  <ProductCard product={p} animated={false} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </PageTransition>
  )
}
