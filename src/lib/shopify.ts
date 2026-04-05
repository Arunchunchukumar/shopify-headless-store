/**
 * Shopify Storefront API client.
 *
 * Provides a type-safe wrapper around the Storefront API GraphQL endpoint.
 * All product queries use cursor-based pagination and return strongly typed results.
 */

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const API_VERSION = '2024-01';
const ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: MoneyV2;
  compareAtPrice: MoneyV2 | null;
  selectedOptions: { name: string; value: string }[];
  image: ShopifyImage | null;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  featuredImage: ShopifyImage | null;
  images: { edges: { node: ShopifyImage }[] };
  variants: { edges: { node: ProductVariant }[] };
  priceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
}

interface GraphQLResponse<T> {
  data: T;
  errors?: { message: string }[];
}

// ---------------------------------------------------------------------------
// Fetch helper
// ---------------------------------------------------------------------------

async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const json: GraphQLResponse<T> = await response.json();

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('\n'));
  }

  return json.data;
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

const PRODUCT_FIELDS = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    featuredImage { url altText width height }
    images(first: 10) {
      edges { node { url altText width height } }
    }
    variants(first: 50) {
      edges {
        node {
          id
          title
          availableForSale
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          selectedOptions { name value }
          image { url altText width height }
        }
      }
    }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
  }
`;

/** Fetch all products (first page). */
export async function getProducts(first = 20): Promise<Product[]> {
  const query = `
    ${PRODUCT_FIELDS}
    query Products($first: Int!) {
      products(first: $first, sortKey: BEST_SELLING) {
        edges { node { ...ProductFields } }
      }
    }
  `;

  const data = await shopifyFetch<{ products: { edges: { node: Product }[] } }>(query, { first });
  return data.products.edges.map((e) => e.node);
}

/** Fetch a single product by handle (URL slug). */
export async function getProductByHandle(handle: string): Promise<Product | null> {
  const query = `
    ${PRODUCT_FIELDS}
    query ProductByHandle($handle: String!) {
      productByHandle(handle: $handle) { ...ProductFields }
    }
  `;

  const data = await shopifyFetch<{ productByHandle: Product | null }>(query, { handle });
  return data.productByHandle;
}

/** Fetch all product handles for static generation. */
export async function getAllProductHandles(): Promise<string[]> {
  const query = `
    query AllHandles {
      products(first: 250) {
        edges { node { handle } }
      }
    }
  `;

  const data = await shopifyFetch<{ products: { edges: { node: { handle: string } }[] } }>(query);
  return data.products.edges.map((e) => e.node.handle);
}
