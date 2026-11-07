import { Link } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Carousel from '../components/Carousel'
import ProductCard from '../components/ProductCard'
import OrderSummary from '../components/OrderSummary'
import { CartLine, FreeShippingBar } from '../components/CartDrawer'
import { PageTransition, Reveal } from '../components/Motion'
import { EmptyState, PageHeader } from '../components/Ui'
import { cardWidth } from './Home'
import { localize, newArrivals } from '../data'
import { useStore } from '../store'

export default function Cart() {
  const { lines, count } = useStore()

  return (
    <PageTransition>
      <PageHeader crumbs={[{ label: 'Cart' }]} title={<>Your <em>Cart</em></>} intro={count ? `${count} item${count > 1 ? 's' : ''} ready to come home with you.` : undefined} />
      <section className="container-x pb-20">
        {lines.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            text={localize('Pieces you add will appear here. Free shipping on orders over $230.')}
            action={<Link to="/category/all" className="btn-primary">Continue shopping</Link>}
          />
        ) : (
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
            <Reveal className="flex-1">
              <FreeShippingBar />
              <ul className="mt-4 border-t border-ink/10">
                <AnimatePresence initial={false}>
                  {lines.map((l) => <CartLine key={l.key} line={l} />)}
                </AnimatePresence>
              </ul>
              <Link to="/category/all" className="link-wipe mt-6 inline-block text-[14px] font-medium uppercase">← Continue shopping</Link>
            </Reveal>
            <Reveal delay={0.1} className="lg:sticky lg:top-28 lg:w-[420px] lg:self-start">
              <OrderSummary>
                {() => (
                  <>
                    <Link to="/checkout" className="btn-primary w-full">Checkout securely</Link>
                    <img src="/assets/payments-pdp.png" alt="Accepted payment methods" className="mx-auto h-6 w-auto max-w-full" />
                  </>
                )}
              </OrderSummary>
            </Reveal>
          </div>
        )}
      </section>
      <section className="container-x pb-20 md:pb-[110px]">
        <Reveal as="h2" className="heading mb-10 text-center">
          You May <em>Also Like</em>
        </Reveal>
        <Carousel>
          {newArrivals.map((p) => <ProductCard key={p.id} product={p} className={cardWidth} />)}
        </Carousel>
      </section>
    </PageTransition>
  )
}
