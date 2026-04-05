# shopify-headless-store

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Shopify](https://img.shields.io/badge/Shopify-Storefront_API-96bf48?logo=shopify)](https://shopify.dev/docs/api/storefront)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A blazing-fast headless Shopify storefront built with **Next.js 15**, **Tailwind CSS**, and the **Shopify Storefront API**. Designed for speed, SEO, and full creative control over the shopping experience.

## Architecture

```
+------------------+     GraphQL      +-------------------+
|   Next.js 15     | <--------------> | Shopify Storefront|
|   (App Router)   |   Storefront API |       API         |
+------------------+                  +-------------------+
|  - SSR / ISR     |
|  - Edge Runtime  |
|  - React Server  |
|    Components    |
+------------------+
        |
  Tailwind CSS + Framer Motion
```

## Features

- **Server-Side Rendering & ISR** - Pages are rendered on the server for instant load times and revalidated every 60s
- **Type-Safe Shopify Client** - Fully typed GraphQL client for the Storefront API with error handling
- **Product Catalog** - Grid layout with search, filtering, and dynamic product detail pages
- **Variant Selection** - Color/size pickers that update price and availability in real time
- **SEO Optimized** - Dynamic meta tags, Open Graph images, structured data
- **Edge-Ready** - Deployable to Vercel Edge Functions for global low-latency

## Quick Start

```bash
# Clone the repo
git clone https://github.com/Arunchunchukumar/shopify-headless-store.git
cd shopify-headless-store

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Shopify credentials

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the storefront.

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | Your Shopify store domain (e.g., `my-store.myshopify.com`) |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API access token |
| `NEXT_PUBLIC_SITE_URL` | Your deployed site URL |

## Project Structure

```
src/
  components/
    ProductCard.tsx    # Product card with image, price, hover effects
    Layout.tsx         # App shell with header, footer, navigation
  lib/
    shopify.ts         # Shopify Storefront API client & GraphQL queries
  pages/
    index.tsx          # Homepage with featured products grid
    products/
      [handle].tsx     # Dynamic product detail page with variants
  styles/
    globals.css        # Tailwind base styles
```

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript 5.3** - Type safety throughout
- **Tailwind CSS 3.4** - Utility-first styling
- **Shopify Storefront API** - Headless commerce backend

## Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel (recommended)
vercel --prod
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](./LICENSE) for details.
