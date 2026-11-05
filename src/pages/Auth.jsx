import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { PageTransition, Reveal, RevealImage, SplitText, ease } from '../components/Motion'
import { Field } from '../components/Ui'
import { useStore } from '../store'

// Demo sign-in: any email + a password of 6+ characters works. Only the name and email are
// remembered in this browser — passwords are never stored.
export default function Auth({ mode }) {
  const { user, signIn, showToast } = useStore()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const next = params.get('next') || '/account'
  const isRegister = mode === 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})

  if (user) return <Navigate to={next} replace />

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (isRegister && !form.name.trim()) errs.name = 'Tell us your name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address'
    if (form.password.length < 6) errs.password = 'Use at least 6 characters'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const name = isRegister ? form.name.trim() : form.email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    signIn({ name, email: form.email.trim(), since: new Date().toISOString() })
    showToast(isRegister ? `Welcome to Wodcumer, ${name.split(' ')[0]}!` : `Welcome back, ${name.split(' ')[0]}`)
    navigate(next, { replace: true })
  }

  return (
    <PageTransition>
      <section className="container-x grid gap-10 pb-20 pt-8 md:pb-[110px] lg:grid-cols-2 lg:gap-20">
        <RevealImage src={isRegister ? '/assets/why.webp' : '/assets/pdp-4.webp'} className="hidden aspect-[4/5] lg:block" />
        <div className="flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.45, ease }} className="w-full max-w-[460px]">
              <SplitText as="h1" className="font-serif text-[40px] leading-[1.1] md:text-[56px]">
                {isRegister ? <>Create an <em>account</em></> : <>Welcome <em>back</em></>}
              </SplitText>
              <p className="mb-8 mt-3 opacity-75">
                {isRegister ? 'Track orders, save favourites and get 10% off your first order with code WELCOME10.' : 'Log in to see your orders, wishlist and saved details.'}
              </p>
              <form onSubmit={submit} noValidate className="flex flex-col gap-4">
                {isRegister && <Field label="Full name" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />}
                <Field label="Email" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
                <Field label="Password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} value={form.password} onChange={set('password')} error={errors.password} />
                {!isRegister && <a href="#" className="link-wipe -mt-1 w-fit text-[14px]">Forgot your password?</a>}
                <button className="btn-primary mt-2 w-full">{isRegister ? 'Create account' : 'Log in'}</button>
              </form>
              <p className="mt-6 text-[14px]">
                {isRegister ? 'Already have an account? ' : 'New to Wodcumer? '}
                <Link to={`${isRegister ? '/login' : '/register'}${params.get('next') ? `?next=${next}` : ''}`} className="link-wipe font-semibold text-primary">
                  {isRegister ? 'Log in' : 'Create an account'}
                </Link>
              </p>
              <Reveal delay={0.2} as="p" className="mt-8 bg-sand px-4 py-3 text-[13px] opacity-80">
                Demo store: any email and a password of 6+ characters will work. Only your name and email are kept, in this browser.
              </Reveal>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  )
}
