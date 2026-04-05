import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getProducts, type Product } from '@/lib/shopify';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { useState } from 'react';

interface HomeProps {
  products: Product[];
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const products = await getProducts(24);
  return {
    props: { products },
    revalidate: 60, // ISR: regenerate every 60 seconds
  };
};

/**
 * Homepage - displays a searchable grid of products fetched at build time
 * with Incremental Static Regeneration for near-real-time updates.
 */
export default function Home({ products }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [search, setSearch] = useState('');

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.vendor.toLowerCase().includes(search.toLowerCase()) ||
      p.productType.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Layout title="Shop All Products | HeadlessStore">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Discover Our Collection
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
            Curated products delivered at lightning speed. Powered by Shopify and Next.js.
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-8 max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-gray-400">No products found.</p>
        )}
      </section>
    </Layout>
  );
}
