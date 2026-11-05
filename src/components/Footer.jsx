import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Reveal, ease } from './Motion'

const socials = ['facebook', 'instagram', 'youtube', 'tiktok']
const quickLinks = [
  ['Shop All', '/category/all'],
  ['Offers', '/category/offers'],
  ['New In', '/category/new-in'],
  ['About Us', '/about'],
  ['Contact', '/contact'],
]
const terms = [
  ['Privacy Policy', '/privacy'],
  ['Exchanges & Returns', '/help?tab=returns'],
  ['General Terms and Conditions', '/terms'],
  ['Cookies', '/privacy'],
  ['Order & Delivery', '/help?tab=shipping'],
]

const linkClass = 'link-wipe w-fit'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <footer className="overflow-hidden bg-ink text-bg">
      <div className="container-x flex flex-col gap-[60px] pb-12 pt-16 md:pt-[100px]">
        <Reveal className="flex flex-col gap-20">
          <div className="flex flex-col justify-between gap-12 xl:flex-row">
            <div className="flex w-full max-w-[280px] flex-col gap-8">
              <p className="text-[16px] leading-[1.4] tracking-[-0.02em]">We are committed to full transparency and uncompromising quality.</p>
              <div className="flex gap-6">
                {socials.map((s) => (
                  <a key={s} href="#" aria-label={s} className="transition-transform duration-300 hover:-translate-y-1">
                    <img src={`/assets/ic-${s}.svg`} alt="" className="size-[27px]" />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-10 text-[16px] md:grid-cols-4 xl:flex xl:max-w-[980px] xl:justify-between">
              <div className="flex flex-col gap-6">
                <h4 className="whitespace-nowrap font-serif uppercase leading-[1.2]">Quick links</h4>
                <ul className="flex flex-col gap-2.5 leading-[1.5]">
                  {quickLinks.map(([l, to]) => (
                    <li key={l}>
                      <Link to={to} className={linkClass}>{l}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                <h4 className="whitespace-nowrap font-serif uppercase leading-[1.2]">Terms</h4>
                <ul className="flex w-[156px] flex-col gap-2 leading-[1.5]">
                  {terms.map(([l, to]) => (
                    <li key={l}>
                      <Link to={to} className={linkClass}>{l}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                <h4 className="whitespace-nowrap font-serif uppercase leading-[1.2]">Contact</h4>
                <address className="not-italic leading-[1.5]">
                  <a href="tel:+16462361792" className={linkClass}>+16462361792</a>
                  <p>Mon–Fri: 9:00–18:00</p>
                  <p>Saint-Germain-sur-Morin, France</p>
                  <a href="mailto:support@wodcumer.com" className={linkClass}>Support@wodcumer.com</a>
                </address>
              </div>
              <form
                className="col-span-2 flex flex-col gap-6 md:col-span-1 xl:w-[298px]"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (email) setDone(true)
                }}
              >
                <h4 className="font-serif uppercase leading-[1.2]">10% discount on your first order, sign up today!</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center border-b border-bg pb-3 transition-colors focus-within:border-white">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={done ? 'Thank you for subscribing!' : 'Your email'}
                      className="min-w-0 flex-1 bg-transparent pr-3 outline-none placeholder:text-bg"
                    />
                    <button className="link-wipe font-bold uppercase">Sign up</button>
                  </div>
                  <label className="flex items-center gap-2 text-[14px]">
                    <input type="checkbox" className="size-4 appearance-none border border-bg transition-colors checked:bg-bg" />
                    By subscribing, you agree to our privacy policy.
                  </label>
                </div>
              </form>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="h-px w-full bg-bg/15" />
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <p className="text-[16px] leading-[1.5]">© 2026 wodcumer. All rights reserved.</p>
              <img src="/assets/payments.png" alt="Accepted payment methods" className="h-6 w-auto max-w-full" />
            </div>
          </div>
        </Reveal>

        <motion.p
          className="select-none whitespace-nowrap text-center font-serif text-[min(11.6vw,190px)] uppercase leading-[0.8] tracking-[0.08em]"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease }}
        >
          wodcumer.
        </motion.p>
      </div>
    </footer>
  )
}
