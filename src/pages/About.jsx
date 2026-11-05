import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useInView, useScroll, useTransform } from 'framer-motion'
import { PageTransition, Reveal, RevealImage, SplitText, Stagger, ease, staggerChild } from '../components/Motion'
import { features } from '../data'

const timeline = [
  ['2016', 'A single workbench', 'Wodcumer begins in a small workshop outside Saint-Germain-sur-Morin, making chairs to order for friends and neighbours.'],
  ['2019', 'Our first collection', 'Twelve pieces in solid oak and walnut — the Luma Lounge Chair among them — launch online and sell out in a month.'],
  ['2022', 'Sustainably sourced', 'Every timber we use is now FSC-certified, and our finishes are water-based and low-VOC.'],
  ['2026', '25,000 homes', 'More than twenty-five thousand customers now live with Wodcumer pieces across Europe, the US and Australia.'],
]

function Counter({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 2, ease, onUpdate: (v) => setValue(Math.round(v)) })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>
}

export default function About() {
  const hero = useRef(null)
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

  return (
    <PageTransition>
      <section ref={hero} className="relative flex h-[520px] items-end overflow-hidden md:h-[680px]">
        <motion.img src="/assets/why.webp" alt="" style={{ y }} initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2, ease }} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(42,14,23,0)_30%,rgba(42,14,23,0.55)_100%)]" />
        <div className="container-x relative pb-14 text-bg md:pb-[100px]">
          <p className="mb-4 text-[16px] font-semibold uppercase md:text-[20px]">About us</p>
          <SplitText as="h1" className="max-w-[900px] font-serif text-[44px] leading-[1.05] tracking-[-0.03em] md:text-[80px]">
            Made slowly, <em>to be lived with</em>
          </SplitText>
        </div>
      </section>

      <section className="container-x grid gap-10 py-20 md:py-[110px] lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <Reveal as="h2" className="heading">
          Not built in a <em>boardroom</em>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col gap-5 text-[18px] leading-[1.6] opacity-90 md:text-[20px]">
          <p>Wodcumer was built from the belief that self-confidence is the starting point for everything — and that the things we live with every day should support it.</p>
          <p>We design furniture with soft curves, honest materials and proportions that make a room feel calm. Every piece is made in small batches by craftspeople we know by name, and finished by hand.</p>
        </Reveal>
      </section>

      <section className="bg-ink py-20 text-bg md:py-[100px]">
        <Stagger className="container-x grid grid-cols-2 gap-10 text-center lg:grid-cols-4">
          {[
            [25000, '+', 'Happy homes'],
            [10, '', 'Years of making'],
            [100, '%', 'FSC-certified wood'],
            [90, '-day', 'Worry-free trial'],
          ].map(([n, s, label]) => (
            <motion.div key={label} variants={staggerChild}>
              <p className="font-serif text-[48px] leading-none md:text-[72px]"><Counter to={n} suffix={s} /></p>
              <p className="mt-3 text-[14px] uppercase tracking-wide opacity-70">{label}</p>
            </motion.div>
          ))}
        </Stagger>
      </section>

      <section className="container-x py-20 md:py-[110px]">
        <Reveal as="h2" className="heading mb-14 text-center">
          Our <em>Story</em>
        </Reveal>
        <ol className="relative mx-auto max-w-[900px] border-l border-ink/15 pl-8 md:pl-14">
          {timeline.map(([year, title, text], i) => (
            <Reveal as="li" key={year} delay={i * 0.05} className="relative pb-14 last:pb-0">
              <span className="absolute -left-[37px] top-2 size-3 rounded-full bg-primary ring-8 ring-bg md:-left-[61px]" />
              <p className="font-serif text-[20px] italic text-primary">{year}</p>
              <h3 className="mt-1 text-[24px] font-semibold">{title}</h3>
              <p className="mt-2 max-w-[600px] leading-[1.6] opacity-80">{text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="container-x grid items-center gap-10 pb-20 md:pb-[110px] lg:grid-cols-2 lg:gap-20">
        <RevealImage src="/assets/pdp-3.webp" className="aspect-[4/5]" />
        <div>
          <Reveal as="h2" className="heading mb-8">
            What we <em>believe</em>
          </Reveal>
          <Stagger className="grid gap-8 sm:grid-cols-2">
            {features.map((f) => (
              <motion.div key={f.title} variants={staggerChild} className="flex flex-col gap-3 border-t border-ink/15 pt-5">
                <img src="/assets/ic-sparkle.svg" alt="" className="size-7" />
                <h3 className="font-serif text-[22px] italic">{f.title}</h3>
                <p className="opacity-80">{f.text}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="relative flex min-h-[460px] items-center justify-center overflow-hidden text-center">
        <img src="/assets/ripple.webp" alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-ink/45" />
        <Reveal className="relative flex flex-col items-center gap-8 px-4 text-white">
          <h2 className="heading max-w-[720px]">Visit our <em>showroom</em> in Saint-Germain-sur-Morin</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-light">Plan a visit</Link>
            <Link to="/category/all" className="btn-outline">Shop the collection</Link>
          </div>
        </Reveal>
      </section>
    </PageTransition>
  )
}
