# Wodcumer — Furniture & Living

A furniture e-commerce storefront built from the Wodcumer Figma design, with smooth Framer Motion animations and a complete demo purchase flow.

**Stack:** React 19 · Vite 6 · Tailwind CSS 4 · Framer Motion 12 · React Router 7
**Fonts:** Tiro Gurmukhi (headings) and Cabin (body), from Google Fonts

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build the production site into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run optimize` | Convert large PNGs in `public/assets` to WebP and update references |

## Pages

- **Shop:** Home, Category / Offers / New In (with filters and sorting), Product details, Search
- **Purchase:** Cart drawer, Cart, 3-step Checkout (Information → Shipping → Payment), Order confirmation
- **Account:** Log in, Register, My account (orders, wishlist, details), Wishlist
- **Company:** About, Contact, Help centre (FAQ, Shipping, Returns, Care), Privacy, Terms, 404

## Demo store notes

- **No real payments.** Checkout accepts the test card `4242 4242 4242 4242` with any future expiry and any 3-digit code.
- **Discount codes:** `SPRING70` ($70 off orders over $300) and `WELCOME10` (10% off).
- **No backend.** Cart, wishlist, account and orders are saved in the browser's `localStorage`. Passwords are never stored.
- About, help and legal text are placeholders — replace them with your own content before launch.

## Project structure

```
src/
  data.js          Products, categories, copy and checkout rules
  store.jsx        Cart, wishlist, account and orders (React context + localStorage)
  components/      Header, Footer, CartDrawer, ProductCard, Carousel, Video player, motion helpers
  pages/           One file per page
public/
  assets/          Images exported from Figma (WebP)
  videos/          Product and customer videos (made with Gemini) — see video-prompts.md
```
