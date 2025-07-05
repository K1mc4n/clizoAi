// src/app/scribe/page.tsx
'use client';

import { useState, type FormEvent } from 'react';
import { Header } from '~/components/ui/Header';
import { Footer } from '~/components/ui/Footer';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';

export default function ScribePage() {
  // State untuk menyimpan input dari form
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  
  // State untuk loading dan pesan feedback
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validasi sederhana: harus ada konten teks atau URL gambar
    if (!content.trim() && !imageUrl.trim()) {
      setMessage({ type: 'error', text: 'Please write a note or provide an image URL.' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          author_name: authorName || 'Anonymous', // Default ke 'Anonymous' jika kosong
          image_url: imageUrl || null, // Kirim null jika kosong
          link_url: linkUrl || null,   // Kirim null jika kosong
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      // Jika berhasil
      setMessage({ type: 'success', text: 'Note posted successfully!' });
      // Reset form
      setContent('');
      setAuthorName('');
      setImageUrl('');
      setLinkUrl('');
      
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-8 pb-24">
        <Header />
        <div className="text-center my-8">
          <h1 className="text-3xl font-bold">Scribe a Note</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Share something with the community.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          {/* Menampilkan pesan sukses atau error */}
          {message && (
            <div className={`p-3 rounded-md text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">Your Note</label>
            <Textarea
              id="content"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">Image URL (Optional)</label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="linkUrl" className="block text-sm font-medium mb-1">Link URL (Optional)</label>
            <Input
              id="linkUrl"
              type="url"
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium mb-1">Your Name (Optional)</label>
            <Input
              id="author"
              placeholder="e.g., vitalik.eth"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
          </div>

          <div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Post Note
            </Button>
          </div>
        </form>

      </div>
      <Footer />
    </div>
  );
}
