import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import Carousel from '../components/Carousel'
import ProductCard from '../components/ProductCard'
import { PageTransition, Reveal, SplitText, Stagger, ease, staggerChild } from '../components/Motion'
import { VideoTile } from '../components/Video'
import { bestSellers, categories, newArrivals, ugc } from '../data'

export const cardWidth = 'w-[78%] shrink-0 snap-start sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-40px)/3)] xl:w-[calc((100%-60px)/4)]'

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const words = ['New', 'Collection:']

  return (
    <section ref={ref} className="relative h-[560px] overflow-hidden md:h-[718px]">
      {/* Background video; the original photo shows while it loads and for reduced-motion users */}
      <motion.video
        src="/videos/hero.mp4"
        poster="/assets/hero.webp"
        aria-label="Living room with beige sofas"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ y }}
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease }}
        className="absolute inset-0 size-full object-cover object-bottom motion-reduce:hidden"
      />
      <img src="/assets/hero.webp" alt="" className="absolute inset-0 hidden size-full object-cover object-bottom motion-reduce:block" />
      <div className="absolute inset-0 bg-[linear-gradient(245.8deg,rgba(132,64,37,0)_21.8%,rgba(132,64,37,0.4)_100%)]" />
      <div className="absolute left-[100px] top-[371px] h-[207px] w-[598px] bg-primary/70 blur-[150px]" />

      <div className="container-x relative flex h-full flex-col justify-end pb-16 md:pb-[100px]">
        <div className="flex max-w-[811px] flex-col gap-8 text-bg">
          <div className="flex flex-col gap-4">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
              className="text-[16px] font-semibold uppercase leading-[1.2] tracking-[-0.01em] md:text-[20px]"
            >
              Back to routine
            </motion.p>
            <h1 className="font-serif text-[44px] leading-[1.1] tracking-[-0.03em] md:text-[80px]">
              {words.map((w, i) => (
                <span key={w} className="inline-block overflow-hidden pb-2 align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.45 + i * 0.1, ease }}
                  >
                    {w}&nbsp;
                  </motion.span>
                </span>
              ))}
              <br />
              <span className="inline-block overflow-hidden pb-2 align-bottom">
                <motion.em className="inline-block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.7, ease }}>
                  Autumn Winter 2026
                </motion.em>
              </span>
            </h1>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1, ease }}>
            <Link to="/category/new-in" className="btn-light">Discover Now</Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Manifesto() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const text =
    'Wodcumer was not built in a boardroom. It was built from the belief that self-confidence is the starting point for everything. For how you carry yourself, show what you allow yourself to achieve.'
  const words = text.split(' ')

  return (
    <section ref={ref} className="container-x py-20 md:py-[110px]">
      <div className="flex max-w-[1045px] flex-col gap-6">
        <p className="text-[24px] leading-[1.4] tracking-[-0.01em] md:text-[36px]">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {w}
            </Word>
          ))}
        </p>
        <Reveal as="p" className="font-serif text-[20px] italic uppercase leading-[1.48] tracking-[-0.01em] text-primary">
          - Wodcumer
        </Reveal>
      </div>
    </section>
  )
}

// Each word fades from 40% to full ink as you scroll — matches the two-tone text in the design
function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.4, 1])
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {children}{' '}
    </motion.span>
  )
}

function ShopBy() {
  return (
    <section className="container-x pb-20 md:pb-[110px]">
      <Carousel
        controls="top"
        trackClassName="pb-1"
        header={(arrows) => (
          <div className="mb-8 flex items-center justify-between">
            <Reveal as="h2" className="heading">
              Shop <em>By</em>
            </Reveal>
            {arrows}
          </div>
        )}
      >
        {categories.map((c) => (
          <motion.div key={c.slug} variants={staggerChild} className="w-[70%] shrink-0 snap-start sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-60px)/4)] xl:w-[335px]">
            {/* Square at rest; morphs into an oval on hover while the label glides to the centre */}
            <Link
              to={`/category/${c.slug}`}
              className="group relative isolate block h-[418px] overflow-hidden rounded-[0%] transition-[border-radius] duration-700 ease-smooth [transform:translateZ(0)] hover:rounded-[50%]"
            >
              <img src={c.image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-[1400ms] ease-smooth group-hover:scale-110" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(60,16,30,0)_68%,rgba(60,16,30,0.5)_90%)]" />
              <span className="absolute bottom-6 left-8 translate-x-0 whitespace-nowrap font-serif text-[36px] leading-[1.1] tracking-[-0.03em] text-bg transition-all duration-700 ease-smooth group-hover:bottom-10 group-hover:left-1/2 group-hover:-translate-x-1/2">
                {c.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </Carousel>
    </section>
  )
}

function Outdoor() {
  const slides = [
    { image: '/assets/outdoor-1c.webp' },
    { image: '/assets/outdoor-2.webp' },
    { image: '/assets/ripple.webp' },
    { image: '/assets/cat-furniture.webp' },
  ]
  return (
    <section className="container-x pb-20 md:pb-[110px]">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-[22px]">
        <Reveal className="flex shrink-0 flex-col gap-8 lg:w-[450px]">
          <p className="text-[22px] leading-[1.48] tracking-[-0.01em] md:text-[26px]">
            Discover all-weather outdoor furniture made for alfresco dining and laid-back lounging.
          </p>
          <Link to="/category/furniture" className="btn-primary w-fit">Explore Outdoor Collection</Link>
        </Reveal>
        <Carousel className="min-w-0 flex-1">
          {slides.map((s, i) => (
            <motion.div key={i} variants={staggerChild} className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-20px)/2)]">
              <div className="group relative flex h-[440px] items-end overflow-hidden p-8 md:h-[566px]">
                <img src={s.image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-[1400ms] ease-smooth group-hover:scale-105" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(60,16,30,0)_68%,rgba(60,16,30,0.5)_90%)]" />
                <Link to="/category/furniture" className="btn-outline relative">Shop Now</Link>
              </div>
            </motion.div>
          ))}
        </Carousel>
      </div>
    </section>
  )
}

function BestSellers() {
  return (
    <section className="container-x pb-20 md:pb-[100px]">
      <Reveal as="h2" className="heading mb-8 text-center">
        Best <em>Sellers</em>
      </Reveal>
      <Carousel>
        {[...bestSellers, ...newArrivals.slice(1, 3)].map((p) => (
          <ProductCard key={p.id} product={p} className={cardWidth} />
        ))}
      </Carousel>
    </section>
  )
}

function Ripple() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  return (
    <section ref={ref} className="relative flex h-[640px] items-end overflow-hidden md:h-[900px]">
      <motion.img src="/assets/ripple.webp" alt="" style={{ y }} className="absolute inset-0 h-[120%] w-full -translate-y-[10%] object-cover" />
      <div className="absolute left-[49px] top-[571px] h-[207px] w-[495px] bg-primary blur-[150px]" />
      <div className="container-x relative pb-16 md:pb-[100px]">
        <Stagger className="flex max-w-[504px] flex-col gap-10 text-white">
          <div className="flex flex-col gap-3">
            <SplitText className="heading">
              Ferm Living Classics:
              <br />
              <em>Ripple Series</em>
            </SplitText>
            <motion.p variants={staggerChild} className="text-[16px] leading-[1.5] opacity-90">
              Thoughtful pieces designed to support comfort, confidence, and connection.
            </motion.p>
          </div>
          <motion.div variants={staggerChild}>
            <Link to="/category/lighting" className="btn-outline">Shop the New Additions</Link>
          </motion.div>
        </Stagger>
      </div>
    </section>
  )
}

const tabs = ['New', 'Upcoming', 'Top Reviews']

function NewTabs() {
  const [tab, setTab] = useState(0)
  const lists = [newArrivals, [...newArrivals].reverse(), [bestSellers[1], newArrivals[2], bestSellers[3], newArrivals[0]]]

  return (
    <section className="container-x py-20 md:py-[110px]">
      <div className="mb-10 flex flex-wrap items-end justify-center gap-x-6 gap-y-2">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`relative font-serif leading-[1.1] tracking-[-0.03em] transition-all duration-500 ease-smooth ${
              tab === i ? 'text-[34px] italic md:text-[48px]' : 'text-[26px] opacity-90 hover:opacity-60 md:text-[36px]'
            }`}
          >
            {t}
            {tab === i && <motion.span layoutId="tab-underline" className="absolute -bottom-0.5 left-0 h-[1.5px] w-full bg-ink" transition={{ duration: 0.5, ease }} />}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.45, ease }}>
          <Carousel>
            {lists[tab].map((p) => (
              <ProductCard key={p.id} product={p} className={cardWidth} />
            ))}
          </Carousel>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

function Ugc() {
  return (
    <section className="pb-20 md:pb-[100px]">
      <Reveal className="container-x mb-10 flex flex-col items-center gap-3 text-center">
        <SplitText className="heading italic">#livingwithferm</SplitText>
        <p className="text-[16px] leading-[1.5] opacity-90">We love seeing how you make our designs part of your home.</p>
      </Reveal>
      <div className="container-x">
        <Carousel controls="none">
          {ugc.map((u) => (
            <motion.div
              key={u.handle}
              variants={staggerChild}
              className={`h-[460px] shrink-0 snap-start md:h-[572px] ${u.wide ? 'w-[85%] md:w-[572px]' : 'w-[70%] md:w-[394px]'}`}
            >
              <VideoTile video={u.video} className="size-full">
                <span className="absolute bottom-5 left-5 z-10 flex h-6 items-center gap-1 rounded-full bg-bg px-2.5 text-[11px] leading-[1.2] tracking-[-0.02em]">
                  {u.handle}
                  <img src="/assets/ic-verified.svg" alt="" className="size-2.5" />
                </span>
              </VideoTile>
            </motion.div>
          ))}
        </Carousel>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <Manifesto />
      <ShopBy />
      <Outdoor />
      <BestSellers />
      <Ripple />
      <NewTabs />
      <Ugc />
    </PageTransition>
  )
}
