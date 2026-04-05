import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import {
  getProductByHandle,
  getAllProductHandles,
  type Product,
  type ProductVariant,
} from '@/lib/shopify';
import Layout from '@/components/Layout';

interface ProductPageProps {
  product: Product;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const handles = await getAllProductHandles();
  return {
    paths: handles.map((handle) => ({ params: { handle } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<ProductPageProps> = async ({ params }) => {
  const handle = params?.handle as string;
  const product = await getProductByHandle(handle);

  if (!product) return { notFound: true };

  return {
    props: { product },
    revalidate: 60,
  };
};

/**
 * Product detail page.
 *
 * - Displays a gallery of product images
 * - Allows variant selection (size, color, etc.)
 * - Shows price, availability, and an Add to Cart button
 * - Renders the product description as HTML
 */
export default function ProductPage({ product }: InferGetStaticPropsType<typeof getStaticProps>) {
  const variants = product.variants.edges.map((e) => e.node);
  const images = product.images.edges.map((e) => e.node);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(variants[0]);
  const [activeImage, setActiveImage] = useState(images[0] ?? product.featuredImage);

  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: selectedVariant.price.currencyCode,
  }).format(parseFloat(selectedVariant.price.amount));

  // Group options by name (e.g., "Size", "Color")
  const optionGroups = variants.reduce<Record<string, string[]>>((acc, v) => {
    v.selectedOptions.forEach(({ name, value }) => {
      if (!acc[name]) acc[name] = [];
      if (!acc[name].includes(value)) acc[name].push(value);
    });
    return acc;
  }, {});

  return (
    <Layout title={`${product.title} | HeadlessStore`} description={product.description}>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
              {activeImage && (
                <Image
                  src={activeImage.url}
                  alt={activeImage.altText ?? product.title}
                  fill
                  priority
                  className="object-cover"
                />
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                      activeImage?.url === img.url ? 'border-brand-600' : 'border-transparent'
                    }`}
                  >
                    <Image src={img.url} alt={img.altText ?? ''} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
              {product.vendor}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.title}</h1>
            <p className="mt-4 text-2xl font-bold text-brand-700">{price}</p>

            {!selectedVariant.availableForSale && (
              <p className="mt-2 text-sm font-medium text-red-600">Out of stock</p>
            )}

            {/* Variant selectors */}
            <div className="mt-8 space-y-6">
              {Object.entries(optionGroups).map(([name, values]) => (
                <div key={name}>
                  <label className="text-sm font-semibold text-gray-700">{name}</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {values.map((value) => {
                      const isActive = selectedVariant.selectedOptions.some(
                        (o) => o.name === name && o.value === value,
                      );
                      return (
                        <button
                          key={value}
                          onClick={() => {
                            const match = variants.find((v) =>
                              v.selectedOptions.some((o) => o.name === name && o.value === value),
                            );
                            if (match) {
                              setSelectedVariant(match);
                              if (match.image) setActiveImage(match.image);
                            }
                          }}
                          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                            isActive
                              ? 'border-brand-600 bg-brand-50 text-brand-700'
                              : 'border-gray-200 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Add to Cart */}
            <button
              disabled={!selectedVariant.availableForSale}
              className="btn-primary mt-8 w-full"
            >
              {selectedVariant.availableForSale ? 'Add to Cart' : 'Sold Out'}
            </button>

            {/* Description */}
            <div
              className="prose prose-sm mt-10 max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
