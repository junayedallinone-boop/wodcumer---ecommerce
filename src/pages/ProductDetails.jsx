import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AccordionItem from '../components/Accordion'
import Carousel from '../components/Carousel'
import ProductCard from '../components/ProductCard'
import { Check, ChevronDown, Filter, Star } from '../components/Icons'
import { PageTransition, Reveal, RevealImage, SplitText, Stagger, ease, staggerChild } from '../components/Motion'
import { VideoTile } from '../components/Video'
import { cardWidth } from './Home'
import { Heart, QtyStepper } from '../components/Ui'
import NotFound from './NotFound'
import { FREE_SHIPPING_OVER, bannerVideo, customerVideos, dimensions, faqs, features, formatPrice, getProduct, pdpGallery, productSwatches, products, reviews } from '../data'
import { useStore } from '../store'

function Gallery({ product }) {
  // The Luma chair has its own photo set; other pieces lead with their own photo
  const [main, ...rest] = product.id === 'luma-lounge-chair' ? pdpGallery : [product.image, ...pdpGallery.slice(1)]
  const tile = 'group overflow-hidden bg-cream'
  const img = 'size-full object-cover transition-transform duration-[1400ms] ease-smooth group-hover:scale-105'
  return (
    <div className="flex flex-col gap-2">
      <motion.div
        className={`${tile} aspect-square`}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease }}
      >
        <img src={main} alt={product.name} className={`${img} object-bottom`} />
      </motion.div>
      <div className="grid grid-cols-2 gap-2">
        {rest.map((src, i) => (
          <Reveal key={src} delay={(i % 2) * 0.08} className={`${tile} aspect-square md:aspect-auto md:h-[450px]`}>
            <img src={src} alt="" loading="lazy" className={img} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function Stars({ size = 'size-5' }) {
  return (
    <div className="flex gap-px text-ink">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={size} />
      ))}
    </div>
  )
}

function ProductInfo({ product }) {
  const [colour, setColour] = useState(product.swatches.includes(2) ? 2 : product.swatches[0])
  const [qty, setQty] = useState(1)
  const [open, setOpen] = useState(0)
  const [added, setAdded] = useState(false)
  const { addToCart, isWishlisted, toggleWishlist } = useStore()
  const saved = isWishlisted(product.id)
  const off = product.oldPrice && Math.round((1 - product.price / product.oldPrice) * 100)

  const handleAdd = () => {
    addToCart(product, { colour, qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const sections = [
    {
      title: 'Product Description',
      body: (
        <div className="flex flex-col gap-4 pt-2">
          <p className="text-[16px] leading-[1.5] opacity-80">
            {product.id === 'luma-lounge-chair'
              ? 'The Luma Lounge Chair brings soft curves, natural textures, and effortless comfort into your space. Its sculptural silhouette makes a statement without overwhelming the room, while its generously padded seat is designed for comfortable everyday lounging.'
              : `${product.blurb} Designed in France and finished by hand in small batches, it brings warmth and calm to any room.`}
          </p>
          <div className="flex flex-col gap-2 text-[16px]">
            <p className="font-semibold leading-[1.5] opacity-90">Dimensions</p>
            <dl className="grid w-fit grid-cols-[auto_auto] gap-x-12 leading-[1.5] opacity-80">
              {dimensions.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <img src="/assets/pdp-dims.webp" alt="Chair dimensions diagram" className="aspect-[514/443] w-full object-cover object-[50%_40%] mix-blend-multiply" />
        </div>
      ),
    },
    {
      title: 'Specification',
      body: (
        <ul className="list-disc pl-5 pt-2 text-[16px] leading-[1.7] opacity-80">
          <li>Frame: solid pine wood, hand-finished</li>
          <li>Seat: high-density foam with fibre wrap</li>
          <li>Upholstery: woven linen-blend fabric</li>
          <li>Max load: 120 kg</li>
        </ul>
      ),
    },
    { title: 'How to Use', body: <p className="pt-2 text-[16px] leading-[1.5] opacity-80">Place on a level surface away from direct heat. Plump the cushion weekly to keep its shape, and rotate it occasionally for even wear.</p> },
    { title: 'Returns Policy', body: <p className="pt-2 text-[16px] leading-[1.5] opacity-80">Not quite right? Return it within 90 days for a full refund. Free collection is included for orders within the EU and US.</p> },
  ]

  return (
    <Stagger className="flex flex-col gap-8">
      <motion.div variants={staggerChild} className="flex flex-col gap-3">
        <SplitText as="h1" delay={0.2} className="font-serif text-[38px] leading-[1.1] tracking-[-0.03em] md:text-[48px]">{product.name}</SplitText>
        <div className="flex items-center gap-2.5 text-[18px] uppercase leading-[1.16] tracking-[-0.01em]">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <>
              <span className="line-through opacity-40">{formatPrice(product.oldPrice)}</span>
              <span className="rounded-full border border-ink px-2 py-1 text-[12px] font-semibold">{off}% off</span>
            </>
          )}
          {product.badge === 'New' && <span className="rounded-full border border-ink px-2 py-1 text-[12px] font-semibold">New</span>}
        </div>
        <div className="flex items-center gap-2 text-[16px] leading-[1.5]">
          <Stars /> 4.9/5 Excellent
        </div>
      </motion.div>

      <motion.div variants={staggerChild} className="h-px bg-ink/10" />

      <motion.div variants={staggerChild} className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-4 text-[16px] font-medium leading-[1.5]">
          <span className="flex items-center gap-1"><Check /> Solid pine wood</span>
          <span className="flex items-center gap-1"><Check /> Handcrafted in USA</span>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-[14px] font-medium leading-[1.5]">
            Colour:{' '}
            <AnimatePresence mode="wait">
              <motion.span key={colour} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="inline-block">
                {productSwatches[colour].name}
              </motion.span>
            </AnimatePresence>
          </p>
          <div className="flex gap-1.5">
            {productSwatches.map((s, i) => !product.swatches.includes(i) ? null : (
              <button
                key={s.name}
                aria-label={s.name}
                onClick={() => setColour(i)}
                className={`h-[45px] w-9 border transition-all duration-300 hover:-translate-y-1 ${colour === i ? 'border-ink p-0.5' : 'border-transparent'}`}
              >
                <img src={s.src} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-[14px] font-medium leading-[1.5]">
          <span className="flex items-center gap-1.5">
            <span className="relative flex size-6 items-center justify-center">
              <span className="absolute size-4 animate-ping rounded-full bg-[#21b26b]/30 [animation-duration:2s]" />
              <span className="absolute size-4 rounded-full bg-[#21b26b]/20" />
              <span className="size-2 rounded-full bg-[#21b26b]" />
            </span>
            {product.stock <= 10 ? `Low stock — only ${product.stock} left` : `In stock — ${product.stock} left`}
          </span>
          <span className="flex items-center gap-1.5">
            <img src="/assets/ic-truck.svg" alt="" className="size-6" /> Free shipping on orders over {formatPrice(FREE_SHIPPING_OVER, 0)}
          </span>
        </div>
      </motion.div>

      <motion.div variants={staggerChild} className="flex flex-col items-center gap-4">
        <div className="flex w-full items-center gap-2 sm:gap-3">
          <QtyStepper value={qty} onChange={(q) => setQty(Math.max(1, q))} />
          <button onClick={handleAdd} className="btn-primary relative min-w-0 flex-1 overflow-hidden whitespace-nowrap px-3 py-3.5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={added ? 'added' : 'add'}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease }}
              className="flex items-center gap-2"
            >
              {added ? (
                <><Check className="size-5" /> Added</>
              ) : (
                <>Add to cart<span className="max-sm:hidden">&nbsp;· {formatPrice(product.price * qty)}</span></>
              )}
            </motion.span>
          </AnimatePresence>
          </button>
          <button
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-pressed={saved}
            onClick={() => toggleWishlist(product)}
            className={`flex size-[52px] shrink-0 items-center justify-center border transition-all duration-300 hover:border-primary hover:text-primary ${saved ? 'border-primary text-primary' : 'border-ink/20'}`}
          >
            <motion.span key={String(saved)} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
              <Heart filled={saved} />
            </motion.span>
          </button>
        </div>
        <img src="/assets/payments-pdp.png" alt="Accepted payment methods" className="h-6 w-auto max-w-full" />
      </motion.div>

      <motion.div variants={staggerChild} className="h-px bg-ink/10" />

      <motion.div variants={staggerChild}>
        {sections.map((s, i) => (
          <AccordionItem
            key={s.title}
            title={s.title}
            open={open === i}
            onToggle={() => setOpen(open === i ? -1 : i)}
            className={i === 0 ? 'pb-6' : 'py-5'}
            titleClassName="text-[20px] font-medium leading-[1.5]"
          >
            {s.body}
          </AccordionItem>
        ))}
      </motion.div>

      <motion.div variants={staggerChild} className="flex flex-col gap-3">
        <p className="font-serif text-[20px] italic leading-[1.16] tracking-[-0.03em]">Enjoy a 90-day worry-free trial!</p>
        <p className="text-[16px] leading-[1.5] opacity-90">
          The {product.name} combines comfort and modern elegance with its sleek design and high-quality craftsmanship. Live with it for 90 days —
          if it isn't right, we'll collect it and refund you in full.
        </p>
      </motion.div>
    </Stagger>
  )
}

function WhyUs() {
  return (
    <section className="container-x py-20 md:py-[110px]">
      <Reveal as="h2" className="heading mb-10 text-center">
        Why Everyone <em>Love Wodcumer</em>
      </Reveal>
      <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">
        <div className="relative grid w-full max-w-[675px] grid-cols-1 sm:grid-cols-2">
          {features.map((f, i) => (
            <Reveal
              key={f.title}
              delay={i * 0.1}
              className={`flex min-h-[230px] items-center justify-center p-8 ${i < 2 ? 'sm:border-b' : ''} ${i % 2 === 0 ? 'sm:border-r' : ''} border-ink/10 max-sm:border-b`}
            >
              <div className="flex w-[233px] flex-col gap-6">
                <motion.img
                  src="/assets/ic-sparkle.svg"
                  alt=""
                  className="size-8"
                  whileHover={{ rotate: 25, scale: 1.15 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                />
                <div className="flex flex-col gap-2">
                  <SplitText as="h3" delay={0.15 + i * 0.1} className="font-serif text-[20px] italic leading-[1.1]">{f.title}</SplitText>
                  <p className="text-[16px] leading-[1.5] opacity-90">{f.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
          <span className="absolute left-1/2 top-1/2 hidden size-[61px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg sm:block" />
        </div>
        <RevealImage src="/assets/why.webp" className="aspect-[690/540] w-full lg:w-[49%] lg:max-w-[690px] lg:shrink-0" />
      </div>
    </section>
  )
}

// Plays silently on a loop in the background; clicking opens the full video with sound
function VideoBanner() {
  return (
    <section className="h-[460px] md:h-[800px]">
      <VideoTile video={bannerVideo} autoPlay large playButton={false} className="size-full">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(270deg,rgba(42,14,23,0)_58%,rgba(42,14,23,0.16)_100%)]" />
      </VideoTile>
    </section>
  )
}

function Feedback() {
  return (
    <section className="bg-sand py-20 md:py-[110px]">
      <div className="mx-auto w-full max-w-[1164px] px-4 md:px-10 xl:px-0">
        <Reveal as="h2" className="heading mb-10 text-center">
          Our Customer <em>Feedback</em>
        </Reveal>
        <Reveal className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => <Star key={i} className="size-[18px]" />)}
              <span className="relative size-[18px]">
                <Star className="absolute size-[18px] opacity-25" />
                <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden"><Star className="size-[18px]" /></span>
              </span>
            </div>
            <button className="flex items-center gap-1.5 text-[14px] font-medium">185 Reviews <ChevronDown /></button>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-[14px] font-medium uppercase underline underline-offset-4 transition-all duration-500 ease-smooth hover:text-primary hover:underline-offset-8 md:text-[16px]">Write a review</button>
            <Filter />
          </div>
        </Reveal>
        <div className="flex flex-col gap-8">
          {reviews.map((r, i) => (
            <Reveal key={r.author} delay={i * 0.05} className="flex flex-col gap-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:gap-[58px]">
                <div className="group h-[220px] w-[180px] shrink-0 overflow-hidden">
                  <img src={r.image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-[1200ms] ease-smooth group-hover:scale-110" />
                </div>
                <div className="flex flex-col gap-4">
                  <Stars />
                  <div className="flex flex-col gap-1">
                    <SplitText as="h3" delay={0.2} className="font-serif text-[20px] italic leading-[1.5] opacity-90">{r.title}</SplitText>
                    {r.body.map((b, j) => (
                      <p key={j} className="text-[16px] leading-[1.5] opacity-90">{b}</p>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="text-[16px] font-medium opacity-90">Item type:&nbsp; {r.type}</p>
                    <div className="flex items-center gap-2">
                      <img src={r.avatar} alt="" className="size-8 rounded-full object-cover" />
                      <span className="text-[14px] font-medium opacity-90">{r.author}</span>
                      <span className="flex items-center gap-1 text-[12px] font-medium">
                        <svg viewBox="0 0 16 16" className="size-4"><path fill="currentColor" d="M8 1l1.8 1.3 2.2-.1.7 2.1 1.8 1.3-.7 2.1.7 2.1-1.8 1.3-.7 2.1-2.2-.1L8 15l-1.8-1.3-2.2.1-.7-2.1-1.8-1.3.7-2.1-.7-2.1 1.8-1.3.7-2.1 2.2.1z" /><path d="M5.5 8.2l1.7 1.6 3.3-3.4" fill="none" stroke="#f3eedd" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-px bg-ink/10" />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 flex justify-center">
          <button className="btn-primary">See All Reviews</button>
        </Reveal>
      </div>
    </section>
  )
}

function CustomerVideos() {
  return (
    <section className="container-x pt-20 md:pt-[110px]">
      <Reveal as="h2" className="heading mb-[50px] text-center">
        Over 25,000 Customers & <em>This Is Why</em>
      </Reveal>
      <Stagger className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
        {customerVideos.map((video) => (
          <motion.div key={video.src} variants={staggerChild} className="aspect-[394/572]">
            <VideoTile video={video} className="size-full" />
          </motion.div>
        ))}
      </Stagger>
    </section>
  )
}

function Faq() {
  const [open, setOpen] = useState(1)
  return (
    <section className="mx-auto w-full max-w-[926px] px-4 pt-20 md:px-10 md:pt-[110px] xl:px-0">
      <Reveal as="h2" className="heading mb-10 text-center">
        Frequently Asked <em>Question</em>
      </Reveal>
      <Reveal>
        {faqs.map((f, i) => (
          <AccordionItem
            key={f.q}
            title={f.q}
            open={open === i}
            onToggle={() => setOpen(open === i ? -1 : i)}
            className="py-8"
            titleClassName="text-[18px] font-medium leading-[1.2] tracking-[-0.01em] md:text-[20px]"
          >
            <p className="max-w-[836px] pt-4 text-[16px] leading-[1.5] opacity-90">{f.a}</p>
          </AccordionItem>
        ))}
      </Reveal>
    </section>
  )
}

function Recommended({ product }) {
  // Same category first, then everything else
  const others = products.filter((p) => p.id !== product.id)
  const list = [...others.filter((p) => p.category === product.category), ...others.filter((p) => p.category !== product.category)].slice(0, 6)
  return (
    <section className="container-x py-20 md:py-[110px]">
      <Reveal as="h2" className="heading mb-10 text-center">
        Recommended <em>For You</em>
      </Reveal>
      <Carousel>
        {list.map((p) => (
          <ProductCard key={p.id} product={p} className={cardWidth} />
        ))}
      </Carousel>
    </section>
  )
}

export default function ProductDetails() {
  const { id } = useParams()
  const product = getProduct(id)
  if (!product) return <NotFound />

  return (
    <PageTransition>
      <div className="container-x xl:pl-2">
        <nav className="flex gap-2 py-3 text-[14px] xl:pl-[92px]">
          <Link to="/" className="opacity-60 transition-opacity hover:opacity-100">Home</Link>
          <span className="opacity-60">/</span>
          <Link to={`/category/${product.category}`} className="capitalize opacity-60 transition-opacity hover:opacity-100">{product.category}</Link>
          <span className="opacity-60">/</span>
          <span>{product.name}</span>
        </nav>
        <div className="flex flex-col gap-10 pt-3 lg:flex-row lg:gap-[70px]">
          <div className="lg:w-[61%] lg:max-w-[908px]">
            <Gallery product={product} />
          </div>
          <div className="lg:flex-1">
            <ProductInfo key={product.id} product={product} />
          </div>
        </div>
      </div>
      <WhyUs />
      <VideoBanner />
      <Feedback />
      <CustomerVideos />
      <Faq />
      <Recommended product={product} />
    </PageTransition>
  )
}
