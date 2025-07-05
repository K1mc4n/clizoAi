// src/app/scribe/ScribeClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useMiniApp } from '@neynar/react';
import { supabase } from '~/lib/supabase';
import { Header } from '~/components/ui/Header';
import { Footer } from '~/components/ui/Footer';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Loader2 } from 'lucide-react';

export default function ScribeClient() {
  const { context, isSDKLoaded } = useMiniApp();
  const user = context?.user;

  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  // ... state lainnya ...
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.displayName && !author) {
      setAuthor(user.displayName);
    }
  }, [user, author]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { return; }
    setIsSubmitting(true);
    const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content,
            author_name: author || user.displayName || 'Anonymous',
            author_fid: user.fid,
        }),
    });
    setIsSubmitting(false);
    if (response.ok) { alert('Posted!'); setContent(''); }
    else { alert('Failed to post.'); }
  };

  if (!isSDKLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Initializing...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-8 pb-24">
        <Header />
        <div className="text-center my-8">
          <h1 className="text-3xl font-bold">Scribe a Note</h1>
        </div>
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label>Your Note</label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <div>
              <label>Your Name</label>
              <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <Button type="submit" isLoading={isSubmitting} className="w-full">Post Note</Button>
          </form>
        ) : (
          <div className="text-center p-4 bg-yellow-100 rounded-md">
            <p className="text-yellow-800">Please open this in a Farcaster client to use this feature.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
