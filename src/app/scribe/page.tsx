// src/app/scribe/page.tsx
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Impor komponen Scribe secara dinamis, dan matikan Server-Side Rendering (SSR)
const ScribeClient = dynamic(() => import('./ScribeClient'), { 
  ssr: false, // <-- Ini adalah kuncinya
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading Page...</p>
    </div>
  ),
});

export default function ScribePage() {
  return <ScribeClient />;
}
