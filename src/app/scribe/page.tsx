// src/app/scribe/page.tsx
'use client';

import { Header } from '~/components/ui/Header';
import { Footer } from '~/components/ui/Footer';

// Versi halaman Scribe yang disederhanakan untuk debugging
export default function ScribePage() {
  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-8 pb-24">
        <Header />
        <div className="text-center my-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Scribe a Note</h1>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Share your thoughts, links, and images.
          </p>
        </div>
        
        <div className="text-center bg-orange-50 dark:bg-orange-900/20 p-4 rounded-md">
          <p className="text-orange-800 dark:text-orange-300 font-semibold">Feature Temporarily Disabled</p>
          <p className="mt-1 text-sm text-orange-700 dark:text-orange-400">
            This feature is currently under maintenance for debugging.
          </p>
        </div>

      </div>
      <Footer />
    </div>
  );
}
