import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { PageTransition, ease } from '../components/Motion'
import { EmptyState, PageHeader } from '../components/Ui'
import { getProduct } from '../data'
import { useStore } from '../store'

export default function Wishlist() {
  const { wishlist } = useStore()
  const items = wishlist.map(getProduct).filter(Boolean)

  return (
    <PageTransition>
      <PageHeader crumbs={[{ label: 'Wishlist' }]} title={<>Your <em>Wishlist</em></>} intro={items.length ? `${items.length} saved piece${items.length > 1 ? 's' : ''}. Saved in this browser.` : undefined} />
      <section className="container-x pb-20 md:pb-[110px]">
        {items.length === 0 ? (
          <EmptyState title="Nothing saved yet" text="Tap the heart on any product to keep it here for later." action={<Link to="/category/all" className="btn-primary">Browse products</Link>} />
        ) : (
          <motion.div layout className="grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-5 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {items.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: i * 0.05 } }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                >
                  <ProductCard product={p} animated={false} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </PageTransition>
  )
}
