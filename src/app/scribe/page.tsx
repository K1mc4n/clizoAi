// src/app/scribe/page.tsx
'use client';

import { useState } from 'react';
import { Header } from '~/components/ui/Header';
import { Footer } from '~/components/ui/Footer';
import { Button } from '~/components/ui/Button'; // Gunakan Button dari shadcn
import { Input } from '~/components/ui/input'; // Gunakan Input dari shadcn
import { Textarea } from '~/components/ui/textarea'; // Gunakan Textarea dari shadcn

export default function ScribePage() {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) {
      alert('Please write something!');
      return;
    }

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content, author_name: author }),
    });

    if (response.ok) {
      alert('Your note has been posted!');
      setContent('');
      setAuthor('');
    } else {
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-8 pb-24">
        <Header />
        <div className="text-center my-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Scribe a Note</h1>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Share your thoughts with the world.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Your Note
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder="What's on your mind?"
              required
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Your Name (Optional)
            </label>
            <Input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Anonymous"
            />
          </div>
          <div>
            <Button
              type="submit"
              className="w-full text-base py-6" // Buat tombol lebih besar
            >
              Post Note
            </Button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
