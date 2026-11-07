const a = (name) => `/assets/${name}`

// Small wood swatches (image 16–20 in Figma)
export const swatches = [1, 2, 3, 4, 5].map((n) => a(`sw-${n}.png`))

export const productSwatches = [
  { name: 'Oak', src: a('swl-1.png') },
  { name: 'Walnut', src: a('swl-2.png') },
  { name: 'Desert', src: a('swl-3.png') },
  { name: 'Ivory', src: a('swl-4.png') },
  { name: 'Natural', src: a('swl-5.png') },
]

const p = (id, name, image, price, category, extra = {}) => ({
  id,
  name,
  image: a(image),
  price,
  category,
  swatches: [0, 1, 2, 3, 4],
  stock: 32,
  ...extra,
})

// The whole catalogue. Every product has its own page at /product/:id
export const products = [
  p('aryie-mattress', 'Aryie Comfort Mattress', 'best-1.webp', 249, 'textile', {
    swatches: [0, 1, 3],
    blurb: 'A low, generous mattress with natural latex layers and a breathable organic-cotton cover.',
  }),
  p('luma-lounge-chair', 'Luma Lounge Chair', 'best-2.webp', 299, 'furniture', {
    oldPrice: 399,
    badge: '-20% OFF',
    blurb: 'Soft curves, natural textures and effortless comfort, built on a solid pine frame.',
  }),
  p('noma-bedside-table', 'Noma Bedside Table', 'best-3.webp', 189, 'accessories', {
    swatches: [0, 1, 2, 4],
    blurb: 'A compact bedside table with a rounded travertine-look top and one soft-close drawer.',
  }),
  p('arden-sofa', 'Arden Comfort Sofa', 'best-4.webp', 599, 'furniture', {
    oldPrice: 755,
    badge: '-35% OFF',
    stock: 8,
    blurb: 'A deep three-seater with feather-wrapped cushions and a low, relaxed silhouette.',
  }),
  p('aryie-sculpt-chair', 'Aryie Sculpt Chair', 'new-1.webp', 390.5, 'furniture', {
    badge: 'New',
    swatches: [1, 2, 3, 4],
    blurb: 'Carved from solid ash into a single flowing form — part chair, part sculpture.',
  }),
  p('luno-side-table', 'Luno Side Table', 'new-2.webp', 255.9, 'accessories', {
    badge: 'New',
    blurb: 'A set of two nesting stools in oiled walnut that double as side tables.',
  }),
  p('mori-lounge-chair', 'Mori Lounge Chair', 'new-3.webp', 295.9, 'furniture', {
    badge: 'New',
    swatches: [0, 2, 3, 4],
    blurb: 'A bent-plywood lounger with a gentle sway, finished in warm natural oak.',
  }),
  p('aster-dining-chair', 'Aster Dining Chair', 'new-4.webp', 105, 'furniture', {
    badge: 'New',
    swatches: [0, 1, 4],
    blurb: 'Hand-woven rattan back, oak frame and a removable linen seat pad.',
  }),
  p('halden-armchair', 'Halden Armchair', 'cat-p9.webp', 249, 'furniture', {
    swatches: [0, 1, 3],
    blurb: 'A classic walnut-frame armchair with a deep, oatmeal-upholstered seat.',
  }),
  p('saga-sheepskin-chair', 'Saga Sheepskin Chair', 'cat-p10.webp', 299, 'textile', {
    oldPrice: 399,
    badge: '-20% OFF',
    stock: 5,
    blurb: 'A light oak frame softened with a removable, ethically sourced sheepskin.',
  }),
]

export const getProduct = (id) => products.find((x) => x.id === id)

export const bestSellers = ['aryie-mattress', 'luma-lounge-chair', 'noma-bedside-table', 'arden-sofa'].map(getProduct)
export const newArrivals = products.filter((x) => x.badge === 'New')
export const categoryProducts = products

export const categories = [
  { slug: 'textile', name: 'Textile', image: a('cat-textile.webp') },
  { slug: 'furniture', name: 'Furniture', image: a('cat-furniture.webp') },
  { slug: 'kits', name: 'Kits', image: a('cat-kits.webp') },
  { slug: 'accessories', name: 'Accessories', image: a('cat-accessories.webp') },
  { slug: 'lighting', name: 'Lighting', image: a('cat-lighting.webp') },
]

// Videos live in public/videos. A missing file falls back to its poster image.
const v = (name, poster) => ({ src: `/videos/${name}.mp4`, poster: a(poster) })

export const ugc = [
  { handle: '@courtneyhenry', video: v('ugc-1', 'ugc-1.webp'), wide: true },
  { handle: '@cameronwilliamson', video: v('ugc-2', 'ugc-2.webp') },
  { handle: '@guyhawkins', video: v('ugc-3', 'ugc-3.webp') },
  { handle: '@junusdeone', video: v('ugc-4', 'ugc-4.webp') },
]

export const bannerVideo = v('banner', 'video-bg.webp')

export const pdpGallery = ['pdp-1.webp', 'pdp-2.webp', 'pdp-3.webp', 'pdp-4.webp', 'pdp-5.webp'].map(a)

export const features = [
  { title: 'Everyday Comfort', text: 'Generous cushioning designed for relaxed, long-lasting comfort.' },
  { title: 'Timeless Form', text: 'A soft, sculptural silhouette that works across modern interiors.' },
  { title: 'Made to Last', text: 'Quality materials selected for everyday living.' },
  { title: 'Effortless Styling', text: 'Perfect for living rooms, bedrooms, reading nooks, and creative areas.' },
]

export const reviews = [
  {
    title: 'Beautiful chair with incredible comfort',
    body: ['I’ve been looking for a lounge chair that feels comfortable without looking too bulky, and the Luma is exactly what I wanted. The shape is beautiful and works really well with the rest of my living room. The seat has a good amount of cushioning, so it’s comfortable enough to sit in for a long time without feeling too soft.'],
    type: 'Chair & Table',
    author: 'Miles, Esther',
    image: a('rev-1.webp'),
    avatar: a('av-1.png'),
  },
  {
    title: 'Beautiful design and surprisingly comfortable',
    body: [
      'The proportions are just right — it feels spacious without taking up too much room. I chose the Warm Sand color, and it blends beautifully with our neutral interior. The material feels premium and the chair feels very solid.',
      'It’s one of those pieces that looks like a designer item but is still practical enough for everyday life.',
    ],
    type: 'Chair',
    author: 'Nguyen, Shane',
    image: a('rev-2.webp'),
    avatar: a('av-2.png'),
  },
  {
    title: 'Beautiful addition to our living room',
    body: [
      'The Luma is a really beautiful chair and has completely changed the feel of our living room. The curved shape gives it a softer appearance compared with the more traditional chairs we looked at.',
      'The quality of the frame and upholstery feels excellent for the price. The Warm Sand color is also very versatile and works beautifully with wood and neutral tones.',
    ],
    type: 'Table',
    author: 'Flores, Juanita',
    image: a('rev-3.webp'),
    avatar: a('av-3.png'),
  },
]

export const customerVideos = [1, 2, 3, 4].map((n) => v(`customers-${n}`, `cust-${n}.webp`))
// Gemini delivered customers-3 with customers-2's clip as its first 10 seconds — skip to the new part
customerVideos[2].start = 10

export const faqs = [
  { q: 'Is the Luma Lounge Chair comfortable for long periods?', a: 'Yes. The seat combines high-density foam with a supportive back angle, so it stays comfortable for long reading or lounging sessions without losing its shape.' },
  { q: 'What materials is the Luma Lounge Chair made from?', a: 'The chair features a solid wood frame, supportive high-density foam, and a soft woven upholstery designed for everyday use. The combination provides both durability and a warm, tactile finish.' },
  { q: 'What are the dimensions of the chair?', a: 'Length 86–97 cm, width 41–51 cm, seat height 43–48 cm, seat depth 41–46 cm, and it weighs 5.8 kg.' },
  { q: 'Can I return the Luma Lounge Chair?', a: 'Absolutely. Every order comes with a 90-day worry-free trial. If it isn’t right for your space, we’ll arrange a free return.' },
  { q: 'How do I clean and care for the upholstery?', a: 'Vacuum regularly with a soft brush attachment and blot spills straight away with a clean, damp cloth. Avoid harsh detergents and direct sunlight to keep the colour rich.' },
]

export const dimensions = [
  ['Length', '86-97 cm'],
  ['Width', '41-51 cm'],
  ['Seat Height', '43-48 cm'],
  ['Seat Depth', '41-46 cm'],
  ['Weight', '5.8 kg'],
]

// Shipping regions shown in the top-bar dropdown. Prices are stored in USD and converted for display
// with these fixed demo rates; checkout is charged in the selected currency.
export const regions = [
  { code: 'US', country: 'United States', currency: 'USD', rate: 1, locale: 'en-US' },
  { code: 'NL', country: 'Netherlands', currency: 'EUR', rate: 0.92, locale: 'nl-NL' },
  { code: 'DE', country: 'Germany', currency: 'EUR', rate: 0.92, locale: 'de-DE' },
  { code: 'FR', country: 'France', currency: 'EUR', rate: 0.92, locale: 'fr-FR' },
  { code: 'GB', country: 'United Kingdom', currency: 'GBP', rate: 0.79, locale: 'en-GB' },
  { code: 'CA', country: 'Canada', currency: 'CAD', rate: 1.37, locale: 'en-CA' },
  { code: 'AU', country: 'Australia', currency: 'AUD', rate: 1.52, locale: 'en-AU' },
  { code: 'BD', country: 'Bangladesh', currency: 'BDT', rate: 120, locale: 'en-BD' },
]

export const languages = [
  { code: 'en', label: 'English', short: 'En', flag: '/assets/flag-en.png', ready: true },
  { code: 'nl', label: 'Nederlands', short: 'Nl' },
  { code: 'fr', label: 'Français', short: 'Fr' },
  { code: 'de', label: 'Deutsch', short: 'De' },
  { code: 'bn', label: 'বাংলা', short: 'Bn' },
]

// The store sets this whenever the visitor picks a region, so every price re-renders in that currency
let activeRegion = regions[0]
const formatters = new Map()
export const setActiveRegion = (code) => (activeRegion = regions.find((r) => r.code === code) ?? regions[0])
export const getActiveRegion = () => activeRegion

export const formatPrice = (usd, decimals = 2) => {
  const { locale, currency, rate } = activeRegion
  const key = `${locale}-${currency}-${decimals}`
  if (!formatters.has(key)) {
    formatters.set(key, new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: decimals, maximumFractionDigits: decimals }))
  }
  return formatters.get(key).format(usd * rate)
}

// Converts USD amounts written inside copy ("free shipping over $230") to the active currency
export const localize = (text) => text.replace(/\$(\d+(?:\.\d+)?)/g, (_, n) => formatPrice(Number(n), n.includes('.') ? 2 : 0))

// Checkout rules — matches the "Free shipping over $230" and "SPRING70" messages in the design
export const FREE_SHIPPING_OVER = 230
export const shippingMethods = [
  { id: 'standard', name: 'Standard delivery', eta: '5–7 business days', price: 25 },
  { id: 'express', name: 'Express delivery', eta: '2–3 business days', price: 45 },
  { id: 'white-glove', name: 'White-glove delivery & assembly', eta: '7–10 business days', price: 89 },
]
export const discountCodes = {
  SPRING70: { label: '$70 off orders over $300', min: 300, amount: 70 },
  WELCOME10: { label: '10% off your first order', percent: 10 },
}
