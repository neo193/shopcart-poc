# Shopcart — Next.js E-Commerce Storefront (POC)

A Next.js 14 (App Router + Tailwind CSS) proof-of-concept e-commerce storefront built for client design review.

## Key Features & Interactions
- **Header & Navigation**: Dark forest green announcement bar (`#003D29`), `Categories` floating popover, live `Search Product` autocomplete dropdown, and reactive `Cart` counter.
- **Homepage (`/`)**: Hero banner with golden 3D-style product pedestals, Top Categories grid, Today's Best Deals, Weekly Popular Products, and Services cards.
- **Category Listing (`/headphones`)**: Shimmer skeleton loading transition, 50% Off promo banner, interactive filter pills (`Headphone Type`, `Sort by`), wishlist heart toggles, and pagination.
- **Product Detail (`/product/[slug]`)**: Shimmer skeleton transition, interactive color swatches that switch the product preview, quantity stepper, full specifications cards, and `Buy Now` / `Add to Cart` actions.
- **Checkout (`/checkout`)**: `Returning Customer?` auto-fill toggle, coupon code calculation, payment method selector, and animated `Order Accepted` modal.

## Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
