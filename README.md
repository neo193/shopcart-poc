# Shopcart — Next.js E-Commerce Storefront (POC)

A Next.js 16 (App Router + Tailwind CSS) proof-of-concept e-commerce storefront built for client design review.

## Key Features & Interactions
- **Header & Navigation**: Dark forest green announcement bar (`#003D29`), `Categories` floating popover, live `Search Product` autocomplete dropdown, and reactive `Cart` counter.
- **Homepage (`/`)**: Hero banner with golden 3D-style product pedestals, Top Categories grid, Today's Best Deals, Weekly Popular Products, and Services cards.
- **Categories (`/categories`, `/category/[slug]`)**: 7 browsable categories (`/headphones` redirects to `/category/headphones`). Non-electronics items use placeholder emoji art and fictional brands until the client's catalogue arrives.
- **Filters, sort & pagination**: Headphone type, price, rating, colour, material and offer filters with live counts, removable chips, an "All Filters" drawer (the only filter control on phones), six sort orders and 8-per-page pagination. All state lives in the URL, so filtered views can be shared or refreshed.
- **Search (`/search?q=`)**: Live suggestions with keyboard navigation in the header; Enter opens a full results page with the same filters.
- **Deals (`/deals`) & What's New (`/new`)**: Products with a % offer (shown with a struck-through "was" price) and recent arrivals.
- **Delivery & Returns (`/delivery`)**, a custom 404 page, and a mobile menu.
- **Product Detail (`/product/[slug]`)**: Shimmer skeleton transition, interactive color swatches that switch the product preview, quantity stepper, full specifications cards, `Buy Now` / `Add to Cart`, PIN-code delivery check, ratings & reviews (rating breakdown, sort, filter by stars, helpful votes, and a "Write a Review" form), similar items and recently viewed.
- **Cart (drawer + `/cart`)**: Slide-out cart from the header, full cart page, quantity steppers capped at stock, remove, save for later, free-shipping progress bar. Persists in `localStorage`.
- **Promo codes**: Real rules in `src/data/coupons.ts` (percentage, flat, min order, max discount, category-only, first-order-only, expiry, free shipping) with clear error messages and an "Available offers" list.
- **Checkout (`/checkout`)**: Uses the cart (or a single Buy Now item), field validation, Standard/Express delivery with dates, Card / UPI / Net Banking / COD.
- **Mock payment**: Processing animation, optional simulated failure with retry, then an order confirmation page (`/order/[id]`) with simulated tracking that advances every few minutes. No real payment or server.
- **Accounts (`/login`, `/signup`, `/account`)**: Mock sign-in/sign-up (any password; "Continue with demo account" signs in a sample Bengaluru customer), profile editing, saved addresses with a default, order history, and a `/wishlist` page. Checkout preselects the default address and can save new ones.
- **India-ready pricing**: Prices in ₹ and GST-inclusive (totals show "Includes GST (18%)"), 6-digit PIN codes, Indian states and mobile numbers, free delivery over ₹999.
- **Content pages**: About, Help Center/FAQ, Contact (form with ticket number), Careers, Terms, Privacy, Delivery & Returns. Copy is placeholder for the client to replace.
- **Polish**: Cookie consent banner, newsletter signup, back-to-top button, skip-to-content link, visible keyboard focus, per-page titles and a favicon.

### Demo coupon codes
`SAVE10`, `FLAT500` (min ₹4,999), `AUDIO15` (headphones only), `WELCOME20` (first order), `FREESHIP`, `SUMMER25` (expired, to show the error).

### Where the backend will plug in
- `src/context/StoreContext.tsx`: cart, wishlist, orders (localStorage now → Supabase later)
- `src/context/AuthContext.tsx`: accounts, profile, addresses (→ Supabase Auth + tables)
- `src/lib/reviews.ts`: generated reviews + reviews written in the browser (→ reviews table)
- `src/lib/orders.ts`: `orderProgress` simulates tracking (→ courier status updates)
- `src/data/coupons.ts`: coupon table (→ Supabase table)
- `src/components/checkout/PaymentModal.tsx`: mock gateway (→ Razorpay checkout)
- `src/lib/pricing.ts` and `src/lib/money.ts`: all price maths, GST rate, shipping fees and currency formatting

## Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Cloudflare Workers
The repo is set up with the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare) (`wrangler.jsonc`, `open-next.config.ts`).
- Worker name is `shopcart-poc` in `wrangler.jsonc`. It must match the Worker name in the Cloudflare dashboard, including the `WORKER_SELF_REFERENCE` service binding.
- Cloudflare build settings: build command `npx opennextjs-cloudflare build`, deploy command `npx opennextjs-cloudflare deploy`.
- From your machine: `npm run preview` (local Worker) or `npm run deploy`.
