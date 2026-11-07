import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { FREE_SHIPPING_OVER, discountCodes, getProduct, productSwatches, setActiveRegion } from './data'

// Everything the shop remembers: cart, wishlist, signed-in customer and past orders.
// Saved in this browser's localStorage so it survives refreshes (demo — no server).
const StoreContext = createContext(null)
const KEY = 'wodcumer-store-v1'

const empty = { cart: [], wishlist: [], user: null, orders: [], discount: null, region: 'US', language: 'en' }

function load() {
  try {
    return { ...empty, ...JSON.parse(localStorage.getItem(KEY)) }
  } catch {
    return empty
  }
}

export function discountFor(code, subtotal) {
  const d = code && discountCodes[code]
  if (!d) return 0
  if (d.min && subtotal < d.min) return 0
  return d.amount ?? Math.round(subtotal * d.percent) / 100
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState(null)

  // Set during render so every formatPrice() below this provider uses the chosen currency
  setActiveRegion(state.region)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* private mode / storage full — keep working in memory */
    }
  }, [state])

  const update = useCallback((fn) => setState((s) => ({ ...s, ...fn(s) })), [])

  const addToCart = useCallback(
    (product, { colour = 2, qty = 1, open = true } = {}) => {
      const key = `${product.id}:${colour}`
      update((s) => {
        const existing = s.cart.find((i) => i.key === key)
        const cart = existing
          ? s.cart.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + qty, 10) } : i))
          : [...s.cart, { key, id: product.id, colour, qty }]
        return { cart }
      })
      if (open) setCartOpen(true)
    },
    [update],
  )

  const setQty = useCallback(
    (key, qty) => update((s) => ({ cart: qty <= 0 ? s.cart.filter((i) => i.key !== key) : s.cart.map((i) => (i.key === key ? { ...i, qty: Math.min(qty, 10) } : i)) })),
    [update],
  )

  const toggleWishlist = useCallback(
    (product) => {
      const added = !state.wishlist.includes(product.id)
      update((s) => ({ wishlist: added ? [...s.wishlist, product.id] : s.wishlist.filter((id) => id !== product.id) }))
      setToast({ id: Date.now(), text: added ? `${product.name} saved to your wishlist` : `${product.name} removed from your wishlist` })
    },
    [update, state.wishlist],
  )

  // Cart lines joined with product data
  const lines = useMemo(
    () =>
      state.cart
        .map((i) => ({ ...i, product: getProduct(i.id), colourName: productSwatches[i.colour]?.name }))
        .filter((l) => l.product),
    [state.cart],
  )
  const count = lines.reduce((n, l) => n + l.qty, 0)
  const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0)
  const discount = discountFor(state.discount, subtotal)

  const value = {
    ...state,
    lines,
    count,
    subtotal,
    discountAmount: discount,
    freeShippingLeft: Math.max(0, FREE_SHIPPING_OVER - subtotal),
    cartOpen,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    addToCart,
    setQty,
    removeLine: (key) => setQty(key, 0),
    applyDiscount: (code) => {
      const c = code.trim().toUpperCase()
      if (!discountCodes[c]) return 'That code isn’t valid.'
      if (!discountFor(c, subtotal)) return `${c} needs a subtotal of at least $${discountCodes[c].min}.`
      update(() => ({ discount: c }))
      return null
    },
    removeDiscount: () => update(() => ({ discount: null })),
    isWishlisted: (id) => state.wishlist.includes(id),
    toggleWishlist,
    setRegion: (region) => update(() => ({ region })),
    setLanguage: (language) => update(() => ({ language })),
    signIn: (user) => update(() => ({ user })),
    signOut: () => update(() => ({ user: null })),
    placeOrder: (details) => {
      const order = {
        id: `WD-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString(),
        lines: lines.map(({ id, colour, colourName, qty, product }) => ({ id, colour, colourName, qty, name: product.name, image: product.image, price: product.price })),
        ...details,
      }
      update((s) => ({ orders: [order, ...s.orders] }))
      // Empty the cart once the checkout page has faded out, so its totals don't flash to $0
      setTimeout(() => update(() => ({ cart: [], discount: null })), 700)
      return order
    },
    toast,
    showToast: (text) => setToast({ id: Date.now(), text }),
    clearToast: () => setToast(null),
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
