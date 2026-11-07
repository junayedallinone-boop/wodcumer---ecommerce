import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageTransition, Reveal, SplitText, ease } from '../components/Motion'
import { EmptyState } from '../components/Ui'
import { formatPrice } from '../data'
import { useStore } from '../store'

export default function OrderConfirmation() {
  const { id } = useParams()
  const { orders, user } = useStore()
  const order = orders.find((o) => o.id === id)

  if (!order) {
    return (
      <PageTransition>
        <EmptyState title="Order not found" text="We couldn’t find that order in this browser." action={<Link to="/" className="btn-primary">Back to home</Link>} />
      </PageTransition>
    )
  }

  const a = order.shippingAddress
  return (
    <PageTransition>
      <section className="mx-auto flex w-full max-w-[860px] flex-col items-center px-4 pb-20 pt-12 text-center md:pb-[110px]">
        <motion.svg viewBox="0 0 80 80" className="mb-6 size-20 text-primary">
          <motion.circle cx="40" cy="40" r="37" fill="none" stroke="currentColor" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease }} />
          <motion.path d="M24 41l11 11 21-23" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.7, ease }} />
        </motion.svg>
        <p className="mb-3 text-[14px] font-semibold uppercase tracking-wide text-primary">Order {order.id}</p>
        <SplitText as="h1" delay={0.3} className="font-serif text-[38px] leading-[1.1] md:text-[56px]">
          Thank you, <em>{a.name.split(' ')[0]}!</em>
        </SplitText>
        <Reveal delay={0.5} as="p" className="mt-4 max-w-[520px] opacity-80">
          Your order is confirmed. We’ve sent a receipt to <b>{order.email}</b> and will let you know as soon as it ships.
        </Reveal>

        <Reveal delay={0.6} className="mt-12 grid w-full gap-px bg-ink/10 text-left md:grid-cols-3">
          {[
            ['Ship to', <>{a.name}<br />{a.address}{a.apartment && `, ${a.apartment}`}<br />{a.postcode} {a.city}<br />{a.country}</>],
            ['Delivery', <>{order.shipping.name}<br /><span className="opacity-70">{order.shipping.eta}</span></>],
            ['Payment', <>Card ending in {order.payment.last4}<br /><span className="opacity-70">{formatPrice(order.total)}</span></>],
          ].map(([k, v]) => (
            <div key={k} className="bg-bg p-6">
              <p className="mb-2 text-[13px] uppercase opacity-60">{k}</p>
              <p className="text-[15px] leading-[1.6]">{v}</p>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.7} className="mt-10 w-full bg-sand p-6 text-left md:p-8">
          <ul className="flex flex-col gap-4">
            {order.lines.map((l) => (
              <li key={`${l.id}-${l.colour}`} className="flex items-center gap-4">
                <img src={l.image} alt="" className="h-[80px] w-[66px] object-cover" />
                <span className="flex-1">
                  <b className="block font-semibold">{l.name}</b>
                  <span className="text-[14px] opacity-70">{l.colourName} · Qty {l.qty}</span>
                </span>
                <span className="font-semibold">{formatPrice(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 flex flex-col gap-2 border-t border-ink/15 pt-5 text-[15px]">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
            {order.discount && <div className="flex justify-between text-primary"><dt>Discount ({order.discount.code})</dt><dd>−{formatPrice(order.discount.amount)}</dd></div>}
            <div className="flex justify-between"><dt>Shipping</dt><dd>{order.shipping.cost ? formatPrice(order.shipping.cost) : 'Free'}</dd></div>
            <div className="flex justify-between pt-2 text-[20px] font-semibold"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
          </dl>
        </Reveal>

        <Reveal delay={0.8} className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/category/all" className="btn-primary">Continue shopping</Link>
          <Link to={user ? '/account' : '/register'} className="btn border border-ink text-ink before:bg-ink hover:text-bg">
            {user ? 'View my orders' : 'Create an account'}
          </Link>
        </Reveal>
      </section>
    </PageTransition>
  )
}
