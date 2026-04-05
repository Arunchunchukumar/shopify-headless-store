import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

/**
 * Application shell with header navigation and footer.
 * Wraps every page to provide consistent branding and SEO meta tags.
 */
export default function Layout({
  children,
  title = 'Headless Store',
  description = 'A modern headless Shopify storefront',
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col">
        {/* ---- Header ---- */}
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md">
          <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
              Headless<span className="text-brand-600">Store</span>
            </Link>

            <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link href="/" className="transition-colors hover:text-gray-900">
                Shop
              </Link>
              <Link href="/collections" className="transition-colors hover:text-gray-900">
                Collections
              </Link>
              <button
                className="relative rounded-full p-2 transition-colors hover:bg-gray-100"
                aria-label="Shopping cart"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                  0
                </span>
              </button>
            </div>
          </nav>
        </header>

        {/* ---- Main content ---- */}
        <main className="flex-1">{children}</main>

        {/* ---- Footer ---- */}
        <footer className="border-t border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
            &copy; {new Date().getFullYear()} HeadlessStore. Powered by Shopify &amp; Next.js.
          </div>
        </footer>
      </div>
    </>
  );
}
