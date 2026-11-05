import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from '../components/Icons'
import { PageTransition, Reveal, Stagger, ease, staggerChild } from '../components/Motion'
import { Field, PageHeader } from '../components/Ui'

const subjects = ['Order & delivery', 'Product question', 'Returns & exchanges', 'Trade & interior designers', 'Press', 'Something else']

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', order: '', subject: subjects[0], message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address'
    if (form.message.trim().length < 10) errs.message = 'Tell us a little more (10+ characters)'
    setErrors(errs)
    // Demo: nothing is actually sent anywhere
    if (!Object.keys(errs).length) setSent(true)
  }

  return (
    <PageTransition>
      <PageHeader crumbs={[{ label: 'Contact' }]} title={<>Get in <em>touch</em></>} intro="Questions about a piece, an order or a delivery? Our team in France answers every message within one business day." />
      <section className="container-x grid gap-12 pb-20 md:pb-[110px] lg:grid-cols-[1fr_420px] lg:gap-20">
        <Reveal>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="sent" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease }} className="flex flex-col items-start gap-5 bg-sand p-8 md:p-12">
                <span className="flex size-14 items-center justify-center rounded-full bg-primary text-white"><Check /></span>
                <h2 className="font-serif text-[36px] leading-[1.1]">Thank you, <em>{form.name.split(' ')[0]}</em></h2>
                <p className="max-w-[460px] opacity-80">We’ve received your message about “{form.subject.toLowerCase()}” and will reply to {form.email} within one business day.</p>
                <button onClick={() => { setSent(false); setForm({ ...form, message: '' }) }} className="link-wipe text-[14px] font-medium uppercase">Send another message</button>
              </motion.div>
            ) : (
              <motion.form key="form" exit={{ opacity: 0, y: -20 }} onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
                <Field label="Email" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
                <Field as="select" label="Subject" value={form.subject} onChange={set('subject')}>
                  {subjects.map((s) => <option key={s}>{s}</option>)}
                </Field>
                <Field label="Order number (optional)" placeholder="WD-123456" value={form.order} onChange={set('order')} />
                <Field as="textarea" label="Message" className="sm:col-span-2" value={form.message} onChange={set('message')} error={errors.message} />
                <button className="btn-primary w-fit">Send message</button>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>

        <Stagger className="flex flex-col gap-px bg-ink/10">
          {[
            ['Customer care', <>+16462361792<br />Mon–Fri: 9:00–18:00 CET</>],
            ['Email', <a href="mailto:support@wodcumer.com" className="link-wipe">Support@wodcumer.com</a>],
            ['Showroom', <>12 Rue des Artisans<br />77860 Saint-Germain-sur-Morin, France<br /><span className="opacity-70">Tue–Sat: 10:00–18:00</span></>],
            ['Quick answers', <>Most questions are answered in our <Link to="/help" className="link-wipe font-semibold text-primary">Help centre</Link>.</>],
          ].map(([k, v]) => (
            <motion.div key={k} variants={staggerChild} className="bg-bg p-6">
              <p className="mb-2 font-serif text-[20px] italic">{k}</p>
              <p className="leading-[1.6] opacity-90">{v}</p>
            </motion.div>
          ))}
        </Stagger>
      </section>
      <section className="pb-20 md:pb-[110px]">
        <Reveal className="container-x">
          <div className="group relative aspect-[4/3] overflow-hidden md:aspect-[16/7]">
            <img src="/assets/outdoor-1c.webp" alt="Wodcumer showroom" className="size-full object-cover transition-transform duration-[1600ms] ease-smooth group-hover:scale-105" />
            <div className="absolute bottom-6 left-6 bg-bg px-5 py-4">
              <p className="font-serif text-[22px] italic">Our showroom</p>
              <p className="text-[14px] opacity-80">Saint-Germain-sur-Morin, France</p>
            </div>
          </div>
        </Reveal>
      </section>
    </PageTransition>
  )
}
