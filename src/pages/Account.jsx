import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { PageTransition, Reveal, Stagger, ease } from '../components/Motion'
import { EmptyState, PageHeader } from '../components/Ui'
import { formatPrice, getProduct } from '../data'
import { useStore } from '../store'

const tabs = ['Orders', 'Wishlist', 'Details']

export default function Account() {
  const { user, orders, wishlist, signOut, showToast } = useStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)

  if (!user) return <Navigate to="/login?next=/account" replace />

  const myOrders = orders.filter((o) => o.email === user.email)

  return (
    <PageTransition>
      <PageHeader crumbs={[{ label: 'My account' }]} title={<>Hello, <em>{user.name.split(' ')[0]}</em></>} intro={`Signed in as ${user.email}`} />
      <section className="container-x pb-20 md:pb-[110px]">
        <LayoutGroup>
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-ink/10">
            <div className="flex gap-8">
              {tabs.map((t, i) => (
                <button key={t} onClick={() => setTab(i)} className={`relative pb-4 text-[16px] font-medium transition-opacity ${tab === i ? '' : 'opacity-50 hover:opacity-80'}`}>
                  {t}
                  {i === 0 && myOrders.length > 0 && <span className="ml-1.5 text-[13px] opacity-60">({myOrders.length})</span>}
                  {i === 1 && wishlist.length > 0 && <span className="ml-1.5 text-[13px] opacity-60">({wishlist.length})</span>}
                  {tab === i && <motion.span layoutId="account-tab" className="absolute inset-x-0 -bottom-px h-[2px] bg-primary" transition={{ duration: 0.45, ease }} />}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                signOut()
                showToast('You’ve been logged out')
                navigate('/')
              }}
              className="link-wipe pb-4 text-[14px] font-medium uppercase"
            >
              Log out
            </button>
          </div>
        </LayoutGroup>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease }}>
            {tab === 0 &&
              (myOrders.length === 0 ? (
                <EmptyState title="No orders yet" text="When you place an order it will appear here." action={<Link to="/category/all" className="btn-primary">Start shopping</Link>} />
              ) : (
                <ul className="flex flex-col gap-4">
                  {myOrders.map((o) => (
                    <li key={o.id}>
                      <Link to={`/order/${o.id}`} className="group flex flex-col gap-4 border border-ink/10 bg-white/40 p-5 transition-all duration-500 ease-smooth hover:border-primary hover:bg-white md:flex-row md:items-center">
                        <div className="flex -space-x-4">
                          {o.lines.slice(0, 3).map((l) => (
                            <img key={`${l.id}-${l.colour}`} src={l.image} alt="" className="h-16 w-14 border-2 border-bg object-cover" />
                          ))}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{o.id}</p>
                          <p className="text-[14px] opacity-70">
                            {new Date(o.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })} · {o.lines.reduce((n, l) => n + l.qty, 0)} items
                          </p>
                        </div>
                        <span className="w-fit rounded-full bg-[#21b26b]/15 px-3 py-1 text-[13px] font-medium text-[#147a49]">Processing</span>
                        <span className="font-semibold">{formatPrice(o.total)}</span>
                        <span className="hidden transition-transform duration-500 group-hover:translate-x-1 md:block">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}

            {tab === 1 &&
              (wishlist.length === 0 ? (
                <EmptyState title="Nothing saved yet" text="Tap the heart on any product to save it here." action={<Link to="/category/all" className="btn-primary">Browse products</Link>} />
              ) : (
                <Stagger className="grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-5 lg:grid-cols-4">
                  {wishlist.map(getProduct).filter(Boolean).map((p) => <ProductCard key={p.id} product={p} />)}
                </Stagger>
              ))}

            {tab === 2 && (
              <Reveal className="grid max-w-[720px] gap-px bg-ink/10 md:grid-cols-2">
                {[
                  ['Name', user.name],
                  ['Email', user.email],
                  ['Member since', new Date(user.since).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })],
                  ['Saved items', `${wishlist.length} in wishlist`],
                ].map(([k, v]) => (
                  <div key={k} className="bg-bg p-6">
                    <p className="mb-1 text-[13px] uppercase opacity-60">{k}</p>
                    <p className="text-[18px]">{v}</p>
                  </div>
                ))}
              </Reveal>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </PageTransition>
  )
}
