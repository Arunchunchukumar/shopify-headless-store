import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/shopify';

interface ProductCardProps {
  product: Product;
}

/**
 * Displays a single product in a grid layout.
 * Shows the featured image, title, vendor, and price range.
 * Links to the full product detail page via the product handle.
 */
export default function ProductCard({ product }: ProductCardProps) {
  const { handle, title, vendor, featuredImage, priceRange } = product;
  const price = parseFloat(priceRange.minVariantPrice.amount);
  const comparePrice = priceRange.maxVariantPrice
    ? parseFloat(priceRange.maxVariantPrice.amount)
    : null;
  const currency = priceRange.minVariantPrice.currencyCode;
  const isOnSale = comparePrice !== null && comparePrice > price;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);

  return (
    <Link
      href={`/products/${handle}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
    >
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {featuredImage ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.altText ?? title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No image
          </div>
        )}
        {isOnSale && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
            Sale
          </span>
        )}
      </div>

      {/* Product info */}
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {vendor}
        </p>
        <h3 className="mt-1 text-sm font-semibold text-gray-900 line-clamp-2">
          {title}
        </h3>
        <p className="mt-2 text-sm font-bold text-brand-700">
          {formattedPrice}
        </p>
      </div>
    </Link>
  );
}
