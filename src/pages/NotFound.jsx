import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageTransition, Reveal, ease } from '../components/Motion'

export default function NotFound() {
  return (
    <PageTransition>
      <section className="container-x flex min-h-[70vh] flex-col items-center justify-center gap-6 py-20 text-center">
        <motion.p
          className="font-serif text-[120px] leading-none text-primary md:text-[220px]"
          initial={{ opacity: 0, y: 40, rotate: -4 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.1, ease }}
        >
          4<em>0</em>4
        </motion.p>
        <Reveal delay={0.2} as="h1" className="font-serif text-[32px] md:text-[44px]">
          This page has <em>wandered off</em>
        </Reveal>
        <Reveal delay={0.3} as="p" className="max-w-[440px] opacity-75">
          The page you’re looking for doesn’t exist or has moved. Let’s get you somewhere comfortable.
        </Reveal>
        <Reveal delay={0.4} className="flex flex-wrap justify-center gap-4">
          <Link to="/" className="btn-primary">Back to home</Link>
          <Link to="/category/all" className="btn border border-ink text-ink before:bg-ink hover:text-bg">Shop all</Link>
        </Reveal>
      </section>
    </PageTransition>
  )
}
