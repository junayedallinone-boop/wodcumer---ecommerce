import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bag, ChevronDown, Close, Menu, Search, User } from './Icons'
import { ease } from './Motion'
import { Heart } from './Ui'
import { categories } from '../data'
import { useStore } from '../store'

const nav = [
  { label: 'Shop All', to: '/category/all', caret: true },
  { label: 'Offers', to: '/category/offers' },
  { label: 'New In', to: '/category/new-in' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

// Hover panel under "Shop All" listing every category with its photo
function ShopMenu() {
  return (
    <div className="invisible absolute left-1/2 top-full z-50 w-[720px] -translate-x-1/2 translate-y-3 pt-6 opacity-0 transition-all duration-500 ease-smooth group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
      <div className="grid grid-cols-[180px_1fr] gap-8 bg-white p-8 shadow-[0_30px_60px_-20px_rgba(42,14,23,0.25)]">
        <ul className="flex flex-col gap-3 text-[15px]">
          {[['all', 'Shop all'], ['new-in', 'New in'], ['offers', 'Offers']].map(([s, l]) => (
            <li key={s}><Link to={`/category/${s}`} className="link-wipe">{l}</Link></li>
          ))}
          <li className="mt-2 border-t border-ink/10 pt-4"><Link to="/help" className="link-wipe opacity-70">Help centre</Link></li>
        </ul>
        <div className="grid grid-cols-5 gap-3">
          {categories.map((c) => (
            <Link key={c.slug} to={`/category/${c.slug}`} className="group/cat flex flex-col gap-2 text-[13px] font-medium">
              <span className="aspect-[3/4] overflow-hidden bg-cream">
                <img src={c.image} alt="" className="size-full object-cover transition-transform duration-700 group-hover/cat:scale-110" />
              </span>
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function CountBadge({ n }) {
  if (!n) return null
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={n}
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.3, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
        className="absolute -top-1 left-2 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium leading-none text-white"
      >
        {n}
      </motion.span>
    </AnimatePresence>
  )
}

function AnnouncementBar() {
  return (
    <div className="bg-ink text-[14px] uppercase leading-[1.16] tracking-[-0.01em] text-bg">
      <div className="container-x flex h-[34px] items-center justify-between gap-4">
        <button className="hidden items-center gap-1.5 text-white sm:flex">
          NL (USD) <ChevronDown />
        </button>
        <p className="mx-auto truncate sm:mx-0">
          Weekend bonus: extra <b className="font-bold text-white">$70 off</b>*
          <span className="mx-2 inline-block size-1 -translate-y-0.5 rounded-full bg-bg align-middle" />
          Code: <b className="font-bold text-white">SPRING70</b>
        </p>
        <button className="hidden items-center gap-1.5 sm:flex">
          <img src="/assets/flag-en.png" alt="" className="size-[18px] rounded-full object-cover" />
          En <ChevronDown />
        </button>
      </div>
    </div>
  )
}

const iconBtn = 'relative flex h-6 w-[25px] items-center transition-transform duration-300 hover:-translate-y-0.5'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { count, wishlist, user, openCart } = useStore()
  const search = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    setQuery('')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <AnnouncementBar />
      <header
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-500 ${
          scrolled ? 'shadow-[0_8px_30px_-12px_rgba(42,14,23,0.18)]' : ''
        }`}
      >
        <div className={`container-x flex items-center justify-between transition-[padding] duration-500 ease-smooth ${scrolled ? 'py-4' : 'py-6'}`}>
          <div className="flex items-end gap-8">
            <Link to="/" className="font-serif text-[22px] uppercase leading-none tracking-[0.06em] text-primary sm:text-[26px] md:text-[32px] md:tracking-[0.08em]">
              wodcumer.
            </Link>
            <form onSubmit={search} role="search" className="group hidden w-[150px] items-center gap-1.5 border-b border-ink/10 pb-2 transition-all duration-500 ease-smooth focus-within:w-[220px] focus-within:border-primary lg:flex">
              <Search className="opacity-80" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." aria-label="Search products" className="w-full bg-transparent text-[14px] outline-none placeholder:text-ink/70" />
            </form>
          </div>

          <div className="flex items-center lg:gap-[60px]">
            <nav className="hidden items-center gap-6 lg:flex">
              {nav.map((item) => (
                <div key={item.label} className="group relative">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `relative flex items-center gap-1.5 py-2 text-[14px] font-medium tracking-[-0.01em] ${isActive ? 'text-primary' : ''}`
                    }
                  >
                    {item.label}
                    {item.caret && <ChevronDown className="transition-transform duration-300 group-hover:rotate-180" />}
                    <span className="absolute bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-500 ease-smooth group-hover:scale-x-100" />
                  </NavLink>
                  {item.caret && <ShopMenu />}
                </div>
              ))}
            </nav>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link to="/search" aria-label="Search" className={`${iconBtn} lg:hidden`}>
                <Search />
              </Link>
              <Link to={user ? '/account' : '/login'} aria-label={user ? 'My account' : 'Log in'} className={iconBtn}>
                <User />
                {user && <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[#21b26b]" />}
              </Link>
              <Link to="/wishlist" aria-label="Wishlist" className={`${iconBtn} max-sm:hidden`}>
                <Heart className="size-4" />
                <CountBadge n={wishlist.length} />
              </Link>
              <button aria-label="Open cart" onClick={openCart} className={iconBtn}>
                <Bag />
                <CountBadge n={count} />
              </button>
              <button aria-label="Menu" className="lg:hidden" onClick={() => setOpen(true)}>
                <Menu />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-ink/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-[70] flex w-[min(320px,85vw)] flex-col gap-8 bg-bg p-6"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease }}
            >
              <button aria-label="Close menu" className="self-end" onClick={() => setOpen(false)}>
                <Close />
              </button>
              <nav className="flex flex-col gap-5">
                {nav.map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06, ease, duration: 0.5 }}>
                    <Link to={item.to} className="font-serif text-3xl">
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3 border-t border-ink/10 pt-6 text-[16px]">
                <Link to={user ? '/account' : '/login'}>{user ? 'My account' : 'Log in / Register'}</Link>
                <Link to="/wishlist">Wishlist ({wishlist.length})</Link>
                <Link to="/help">Help centre</Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
