import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FREE_SHIPPING_OVER, discountCodes, formatPrice, getActiveRegion, localize } from '../data'
import { useStore } from '../store'

// Totals panel shared by the cart page and checkout.
// `shipping` is a method object at checkout; on the cart page it's an estimate.
export default function OrderSummary({ shipping, showLines = false, children }) {
  const { lines, subtotal, discount, discountAmount, applyDiscount, removeDiscount } = useStore()
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)

  const shippingCost = shipping ? (shipping.id === 'standard' && subtotal >= FREE_SHIPPING_OVER ? 0 : shipping.price) : subtotal >= FREE_SHIPPING_OVER ? 0 : null
  const total = Math.max(0, subtotal - discountAmount + (shippingCost ?? 0))

  return (
    <div className="flex flex-col gap-5 bg-sand p-6 md:p-8">
      <h2 className="font-serif text-[28px] leading-none">Order summary</h2>

      {showLines && (
        <ul className="flex flex-col gap-4 border-b border-ink/10 pb-5">
          {lines.map((l) => (
            <li key={l.key} className="flex items-center gap-4">
              <span className="relative shrink-0">
                <img src={l.product.image} alt="" className="h-[72px] w-[60px] object-cover" />
                <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-ink text-[11px] text-bg">{l.qty}</span>
              </span>
              <span className="flex-1 text-[14px]">
                <b className="block font-semibold">{l.product.name}</b>
                <span className="opacity-70">{l.colourName}</span>
              </span>
              <span className="text-[14px] font-semibold">{formatPrice(l.product.price * l.qty)}</span>
            </li>
          ))}
        </ul>
      )}

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          setError(applyDiscount(code))
          setCode('')
        }}
      >
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Discount code (try SPRING70)"
          className="h-11 min-w-0 flex-1 border border-ink/15 bg-white/70 px-3 text-[14px] uppercase outline-none placeholder:normal-case focus:border-primary"
        />
        <button className="btn-primary h-11 px-4 py-0 text-[14px]">Apply</button>
      </form>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="-mt-3 text-[13px] text-[#b3261e]">
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <dl className="flex flex-col gap-3 text-[15px]">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        {discount && (
          <div className="flex justify-between text-primary">
            <dt className="flex items-center gap-2">
              Discount <span className="rounded-full border border-primary px-2 text-[12px] font-semibold">{discount}</span>
              <button onClick={removeDiscount} className="text-[12px] underline opacity-70">remove</button>
            </dt>
            <dd>−{formatPrice(discountAmount)}</dd>
          </div>
        )}
        {discount && !discountAmount && <p className="text-[13px] opacity-70">{localize(discountCodes[discount].label)} — add more to qualify.</p>}
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd>{shippingCost === null ? 'Calculated at checkout' : shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</dd>
        </div>
        <div className="flex justify-between border-t border-ink/15 pt-4 text-[20px] font-semibold">
          <dt>Total</dt>
          <dd>
            <span className="mr-2 text-[13px] font-normal opacity-60">{getActiveRegion().currency}</span>
            {formatPrice(total)}
          </dd>
        </div>
      </dl>
      {children?.({ total, shippingCost })}
    </div>
  )
}
