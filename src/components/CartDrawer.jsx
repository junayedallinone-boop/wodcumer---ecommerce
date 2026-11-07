import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Close } from './Icons'
import { ease } from './Motion'
import { QtyStepper } from './Ui'
import { FREE_SHIPPING_OVER, formatPrice } from '../data'
import { useStore } from '../store'

export function FreeShippingBar() {
  const { freeShippingLeft, subtotal } = useStore()
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_OVER) * 100)
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[14px]">
        {freeShippingLeft > 0 ? (
          <>You’re <b className="font-semibold">{formatPrice(freeShippingLeft)}</b> away from free shipping</>
        ) : (
          <>You’ve unlocked <b className="font-semibold">free shipping</b> 🎉</>
        )}
      </p>
      <div className="h-1 overflow-hidden bg-ink/10">
        <motion.div className="h-full bg-primary" initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease }} />
      </div>
    </div>
  )
}

export function CartLine({ line, compact = false }) {
  const { setQty, removeLine, closeCart } = useStore()
  const { product } = line
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.45, ease }}
      className="flex gap-4 overflow-hidden border-b border-ink/10 py-5"
    >
      <Link to={`/product/${product.id}`} onClick={closeCart} className={`shrink-0 overflow-hidden bg-cream ${compact ? 'h-[110px] w-[90px]' : 'h-[150px] w-[120px]'}`}>
        <img src={product.image} alt={product.name} className="size-full object-cover transition-transform duration-700 hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col justify-between gap-3">
        <div className="flex justify-between gap-3">
          <div>
            <Link to={`/product/${product.id}`} onClick={closeCart} className="link-wipe text-[16px] font-semibold leading-[1.3] md:text-[18px]">
              {product.name}
            </Link>
            <p className="mt-1 text-[14px] opacity-70">Colour: {line.colourName}</p>
          </div>
          <p className="whitespace-nowrap text-[14px] font-semibold">{formatPrice(product.price * line.qty)}</p>
        </div>
        <div className="flex items-center justify-between">
          <QtyStepper small value={line.qty} onChange={(q) => setQty(line.key, q)} />
          <button onClick={() => removeLine(line.key)} className="link-wipe text-[13px] uppercase opacity-70 hover:opacity-100">
            Remove
          </button>
        </div>
      </div>
    </motion.li>
  )
}

export default function CartDrawer() {
  const { cartOpen, closeCart, lines, count, subtotal } = useStore()
  const { pathname } = useLocation()

  useEffect(() => closeCart(), [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!cartOpen) return
    const onKey = (e) => e.key === 'Escape' && closeCart()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [cartOpen, closeCart])

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCart} />
          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            className="fixed inset-y-0 right-0 z-[70] flex w-[min(460px,100vw)] flex-col bg-bg"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease }}
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="font-serif text-[28px] leading-none">
                Your cart <span className="font-sans text-[16px] opacity-60">({count})</span>
              </h2>
              <button aria-label="Close cart" onClick={closeCart} className="transition-transform duration-500 ease-smooth hover:rotate-90">
                <Close />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
                <p className="font-serif text-[30px] italic">Your cart is empty</p>
                <p className="opacity-70">Find something you love — free shipping on orders over {formatPrice(FREE_SHIPPING_OVER, 0)}.</p>
                <Link to="/category/all" className="btn-primary">Shop all</Link>
              </div>
            ) : (
              <>
                <div className="px-6 pt-5">
                  <FreeShippingBar />
                </div>
                <ul className="no-scrollbar flex-1 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => <CartLine key={l.key} line={l} compact />)}
                  </AnimatePresence>
                </ul>
                <div className="flex flex-col gap-4 border-t border-ink/10 px-6 py-6">
                  <div className="flex justify-between text-[18px] font-semibold">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <p className="text-[13px] opacity-70">Shipping and discount codes are calculated at checkout.</p>
                  <Link to="/checkout" className="btn-primary w-full">Checkout</Link>
                  <Link to="/cart" className="link-wipe mx-auto w-fit text-[14px] font-medium uppercase">View cart</Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
