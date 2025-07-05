// src/app/scribe/page.tsx
'use client';

import { Header } from '~/components/ui/Header';
import { Footer } from '~/components/ui/Footer';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';

export default function ScribePage() {
  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-8 pb-24">
        <Header />
        <div className="text-center my-8">
          <h1 className="text-3xl font-bold">Scribe a Note</h1>
          <p className="mt-2 text-lg text-gray-600">This feature is under construction.</p>
        </div>
        
        <div className="space-y-6 bg-white dark:bg-gray-800/50 p-6 rounded-xl">
          <div>
            <label htmlFor="content">Your Note</label>
            <Textarea id="content" placeholder="Feature coming soon..." disabled />
          </div>
          <div>
            <label htmlFor="author">Your Name</label>
            <Input id="author" placeholder="Feature coming soon..." disabled />
          </div>
          <div>
            <Button className="w-full" disabled>
              Post Note
            </Button>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
