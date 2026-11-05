import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatPrice, swatches } from '../data'
import { staggerChild } from './Motion'
import { Heart } from './Ui'
import { useStore } from '../store'

// `animated` = false when a parent already animates the card (filtered grids, wishlist)
export default function ProductCard({ product, className = '', animated = true }) {
  const [active, setActive] = useState(null)
  const { addToCart, isWishlisted, toggleWishlist } = useStore()
  const saved = isWishlisted(product.id)
  const href = `/product/${product.id}`

  return (
    <motion.article variants={animated ? staggerChild : undefined} className={`group flex flex-col ${className}`}>
      <Link to={href} className="relative block aspect-[335/400] overflow-hidden bg-cream">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-[1200ms] ease-smooth group-hover:scale-[1.06]"
        />
        {product.badge && (
          <span className="absolute left-4 top-4 bg-cream px-2 py-1 text-[12px] font-medium uppercase leading-[1.16] tracking-[-0.01em] text-[#111]">
            {product.badge}
          </span>
        )}
        <button
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={saved}
          onClick={(e) => {
            e.preventDefault()
            toggleWishlist(product)
          }}
          className={`absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-bg/90 backdrop-blur transition-all duration-500 ease-smooth hover:scale-110 hover:text-primary ${
            saved ? 'text-primary opacity-100' : 'opacity-0 group-hover:opacity-100 max-lg:opacity-100'
          }`}
        >
          <motion.span key={String(saved)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
            <Heart filled={saved} className="size-[18px]" />
          </motion.span>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            addToCart(product, { colour: active ?? (product.swatches.includes(2) ? 2 : product.swatches[0]) })
          }}
          className="absolute inset-x-4 bottom-4 translate-y-[calc(100%+16px)] bg-bg/95 py-3 text-[14px] font-bold uppercase text-primary opacity-0 backdrop-blur transition-all duration-500 ease-smooth hover:bg-primary hover:text-white group-hover:translate-y-0 group-hover:opacity-100"
        >
          Quick add
        </button>
      </Link>
      <div className="flex flex-col gap-3 pt-4">
        <div className="flex gap-1.5">
          {product.swatches.map((i) => (
            <button
              key={i}
              aria-label={`Colour ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-5 w-4 overflow-hidden outline-offset-2 transition-all duration-300 hover:-translate-y-0.5 ${
                active === i ? 'outline outline-1 outline-ink' : ''
              }`}
            >
              <img src={swatches[i]} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 font-semibold">
          <Link to={href} className="w-fit text-[18px] leading-[1.5] tracking-[-0.01em] transition-colors duration-300 hover:text-primary md:text-[20px]">
            {product.name}
          </Link>
          <p className="flex gap-2.5 text-[14px] uppercase leading-[1.16] tracking-[-0.01em]">
            {formatPrice(product.price)}
            {product.oldPrice && <span className="font-normal line-through opacity-40">{formatPrice(product.oldPrice)}</span>}
          </p>
        </div>
      </div>
    </motion.article>
  )
}
