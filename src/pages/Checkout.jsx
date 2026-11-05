import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import OrderSummary from '../components/OrderSummary'
import { Check } from '../components/Icons'
import { PageTransition, ease } from '../components/Motion'
import { Field } from '../components/Ui'
import { FREE_SHIPPING_OVER, formatPrice, shippingMethods } from '../data'
import { useStore } from '../store'

const steps = ['Information', 'Shipping', 'Payment']
const countries = ['United States', 'Netherlands', 'France', 'Germany', 'United Kingdom', 'Australia', 'Bangladesh', 'Canada']

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

function validateInfo(f) {
  const e = {}
  if (!emailOk(f.email)) e.email = 'Enter a valid email address'
  if (!f.firstName.trim()) e.firstName = 'Required'
  if (!f.lastName.trim()) e.lastName = 'Required'
  if (f.address.trim().length < 4) e.address = 'Enter your street address'
  if (!f.city.trim()) e.city = 'Required'
  if (!/^[A-Za-z0-9 -]{3,10}$/.test(f.postcode.trim())) e.postcode = 'Enter a valid postcode'
  if (f.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a phone number for delivery updates'
  return e
}

function validateCard(c) {
  const e = {}
  const digits = c.number.replace(/\s/g, '')
  if (!/^\d{16}$/.test(digits)) e.number = 'Enter the 16-digit card number'
  const [mm, yy] = c.expiry.split('/')
  const exp = new Date(2000 + Number(yy), Number(mm))
  if (!/^\d{2}\/\d{2}$/.test(c.expiry) || Number(mm) < 1 || Number(mm) > 12 || exp < new Date()) e.expiry = 'Enter a valid future date (MM/YY)'
  if (!/^\d{3,4}$/.test(c.cvc)) e.cvc = '3 or 4 digits'
  if (!c.name.trim()) e.name = 'Name as shown on the card'
  return e
}

const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

function StepBar({ step, setStep }) {
  return (
    <ol className="mb-10 flex items-center gap-2 text-[14px]">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <button
            disabled={i >= step}
            onClick={() => setStep(i)}
            className={`flex items-center gap-2 transition-opacity ${i === step ? 'font-semibold' : i < step ? 'opacity-80 hover:opacity-100' : 'opacity-40'}`}
          >
            <span className={`flex size-7 items-center justify-center rounded-full border text-[12px] transition-colors duration-500 ${i <= step ? 'border-primary bg-primary text-white' : 'border-ink/30'}`}>
              {i < step ? <Check className="size-4" /> : i + 1}
            </span>
            <span className="hidden sm:inline">{s}</span>
          </button>
          {i < steps.length - 1 && <span className="h-px w-6 bg-ink/20 sm:w-12" />}
        </li>
      ))}
    </ol>
  )
}

export default function Checkout() {
  const { lines, user, subtotal, placeOrder, discount, discountAmount } = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [placing, setPlacing] = useState(false)
  const [info, setInfo] = useState({
    email: user?.email ?? '',
    firstName: user?.name?.split(' ')[0] ?? '',
    lastName: user?.name?.split(' ').slice(1).join(' ') ?? '',
    address: '',
    apartment: '',
    city: '',
    postcode: '',
    country: 'United States',
    phone: '',
    newsletter: true,
  })
  const [shippingId, setShippingId] = useState('standard')
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' })

  if (lines.length === 0 && !placing) return <Navigate to="/cart" replace />

  const shipping = shippingMethods.find((m) => m.id === shippingId)
  const setI = (k) => (e) => setInfo({ ...info, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const setC = (k, fmt = (v) => v) => (e) => setCard({ ...card, [k]: fmt(e.target.value) })

  const next = () => {
    if (step === 0) {
      const e = validateInfo(info)
      setErrors(e)
      if (Object.keys(e).length) return
    }
    setErrors({})
    setStep(step + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pay = (total, shippingCost) => {
    const e = validateCard(card)
    setErrors(e)
    if (Object.keys(e).length) return
    setPlacing(true)
    // Simulated payment processing — no real charge is made
    setTimeout(() => {
      const order = placeOrder({
        email: info.email,
        shippingAddress: { name: `${info.firstName} ${info.lastName}`, address: info.address, apartment: info.apartment, city: info.city, postcode: info.postcode, country: info.country, phone: info.phone },
        shipping: { ...shipping, cost: shippingCost },
        payment: { brand: 'Card', last4: card.number.replace(/\s/g, '').slice(-4) },
        subtotal,
        discount: discount ? { code: discount, amount: discountAmount } : null,
        total,
      })
      navigate(`/order/${order.id}`, { replace: true })
    }, 1800)
  }

  const panel = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.45, ease },
  }

  return (
    <PageTransition>
      <section className="container-x flex flex-col gap-10 pb-20 pt-8 lg:flex-row lg:gap-16 md:pb-[110px]">
        <div className="min-w-0 flex-1 overflow-x-clip lg:max-w-[720px]">
          <h1 className="mb-6 font-serif text-[38px] leading-[1.1] md:text-[48px]">
            Secure <em>Checkout</em>
          </h1>
          <StepBar step={step} setStep={setStep} />

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="info" {...panel} className="flex flex-col gap-8">
                <fieldset className="flex flex-col gap-4">
                  <div className="flex items-baseline justify-between">
                    <legend className="font-serif text-[24px]">Contact</legend>
                    {!user && <Link to="/login?next=/checkout" className="link-wipe text-[14px]">Have an account? Log in</Link>}
                  </div>
                  <Field label="Email" type="email" autoComplete="email" value={info.email} onChange={setI('email')} error={errors.email} />
                  <label className="flex items-center gap-2 text-[14px]">
                    <input type="checkbox" checked={info.newsletter} onChange={setI('newsletter')} className="size-4 accent-primary" />
                    Email me with news and offers
                  </label>
                </fieldset>
                <fieldset className="flex flex-col gap-4">
                  <legend className="mb-4 font-serif text-[24px]">Shipping address</legend>
                  <Field as="select" label="Country / region" value={info.country} onChange={setI('country')}>
                    {countries.map((c) => <option key={c}>{c}</option>)}
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="First name" autoComplete="given-name" value={info.firstName} onChange={setI('firstName')} error={errors.firstName} />
                    <Field label="Last name" autoComplete="family-name" value={info.lastName} onChange={setI('lastName')} error={errors.lastName} />
                  </div>
                  <Field label="Address" autoComplete="address-line1" value={info.address} onChange={setI('address')} error={errors.address} />
                  <Field label="Apartment, suite, etc. (optional)" autoComplete="address-line2" value={info.apartment} onChange={setI('apartment')} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="City" autoComplete="address-level2" value={info.city} onChange={setI('city')} error={errors.city} />
                    <Field label="Postcode" autoComplete="postal-code" value={info.postcode} onChange={setI('postcode')} error={errors.postcode} />
                  </div>
                  <Field label="Phone" type="tel" autoComplete="tel" value={info.phone} onChange={setI('phone')} error={errors.phone} />
                </fieldset>
                <div className="flex items-center justify-between">
                  <Link to="/cart" className="link-wipe text-[14px] font-medium uppercase">← Back to cart</Link>
                  <button onClick={next} className="btn-primary">Continue to shipping</button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="shipping" {...panel} className="flex flex-col gap-8">
                <Recap info={info} onEdit={() => setStep(0)} />
                <fieldset className="flex flex-col gap-3">
                  <legend className="mb-4 font-serif text-[24px]">Delivery method</legend>
                  {shippingMethods.map((m) => {
                    const free = m.id === 'standard' && subtotal >= FREE_SHIPPING_OVER
                    return (
                      <label
                        key={m.id}
                        className={`flex cursor-pointer items-center gap-4 border p-5 transition-all duration-300 ${shippingId === m.id ? 'border-primary bg-white' : 'border-ink/15 hover:border-ink/40'}`}
                      >
                        <input type="radio" name="shipping" checked={shippingId === m.id} onChange={() => setShippingId(m.id)} className="size-4 accent-primary" />
                        <span className="flex-1">
                          <b className="block font-semibold">{m.name}</b>
                          <span className="text-[14px] opacity-70">{m.eta}</span>
                        </span>
                        <span className="font-semibold">{free ? 'Free' : formatPrice(m.price)}</span>
                      </label>
                    )
                  })}
                </fieldset>
                <div className="flex items-center justify-between">
                  <button onClick={() => setStep(0)} className="link-wipe text-[14px] font-medium uppercase">← Back</button>
                  <button onClick={next} className="btn-primary">Continue to payment</button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="payment" {...panel} className="flex flex-col gap-8">
                <Recap info={info} shipping={shipping} onEdit={() => setStep(0)} />
                <fieldset className="flex flex-col gap-4">
                  <legend className="mb-2 font-serif text-[24px]">Payment</legend>
                  <p className="-mt-2 text-[14px] opacity-70">All transactions are secure and encrypted.</p>
                  <div className="flex flex-col gap-4 border border-primary bg-white p-5">
                    <div className="flex items-center justify-between">
                      <b className="font-semibold">Credit or debit card</b>
                      <img src="/assets/payments-pdp.png" alt="" className="hidden h-5 sm:block" />
                    </div>
                    <p className="bg-sand px-3 py-2 text-[13px]">
                      Demo checkout — no real payment is taken. Use <b>4242 4242 4242 4242</b>, any future date and any 3 digits.
                    </p>
                    <Field label="Card number" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" value={card.number} onChange={setC('number', formatCard)} error={errors.number} />
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Expiry (MM/YY)" inputMode="numeric" autoComplete="cc-exp" placeholder="08/29" value={card.expiry} onChange={setC('expiry', formatExpiry)} error={errors.expiry} />
                      <Field label="Security code" inputMode="numeric" autoComplete="cc-csc" placeholder="123" value={card.cvc} onChange={setC('cvc', (v) => v.replace(/\D/g, '').slice(0, 4))} error={errors.cvc} />
                    </div>
                    <Field label="Name on card" autoComplete="cc-name" value={card.name} onChange={setC('name')} error={errors.name} />
                  </div>
                </fieldset>
                <button onClick={() => setStep(1)} className="link-wipe w-fit text-[14px] font-medium uppercase">← Back to shipping</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:sticky lg:top-28 lg:w-[440px] lg:self-start">
          <OrderSummary shipping={step > 0 ? shipping : null} showLines>
            {({ total, shippingCost }) =>
              step === 2 && (
                <button onClick={() => pay(total, shippingCost)} disabled={placing} className="btn-primary w-full disabled:cursor-wait">
                  {placing ? (
                    <span className="flex items-center gap-3">
                      <motion.span className="size-4 rounded-full border-2 border-white/40 border-t-white" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} />
                      Processing payment…
                    </span>
                  ) : (
                    `Pay ${formatPrice(total)}`
                  )}
                </button>
              )
            }
          </OrderSummary>
        </div>
      </section>
    </PageTransition>
  )
}

function Recap({ info, shipping, onEdit }) {
  const rows = [
    ['Contact', info.email],
    ['Ship to', [info.address, info.apartment, info.city, info.postcode, info.country].filter(Boolean).join(', ')],
    shipping && ['Method', `${shipping.name} · ${shipping.eta}`],
  ].filter(Boolean)
  return (
    <div className="divide-y divide-ink/10 border border-ink/15 bg-white/50 px-5 text-[14px]">
      {rows.map(([k, v]) => (
        <div key={k} className="flex gap-4 py-3">
          <span className="w-20 shrink-0 opacity-60">{k}</span>
          <span className="flex-1">{v}</span>
          <button onClick={onEdit} className="link-wipe text-[13px]">Change</button>
        </div>
      ))}
    </div>
  )
}
