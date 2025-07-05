// src/app/scribe/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useMiniApp } from '@neynar/react'; // Kita tetap butuh ini
import { supabase } from '~/lib/supabase';
import { Header } from '~/components/ui/Header';
import { Footer } from '~/components/ui/Footer';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { ImageUp, Link2, Loader2 } from 'lucide-react';

export default function ScribePage() {
  // Ambil konteks dan status SDK
  const { context, isSDKLoaded } = useMiniApp();
  const user = context?.user;

  // State untuk form
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Efek untuk mengisi nama secara otomatis
  useEffect(() => {
    if (user?.displayName) {
      setAuthor(user.displayName);
    }
  }, [user]);

  // Fungsi untuk handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Farcaster user not found. Please open in a Farcaster client.");
      return;
    }
    // ... (sisa logika submit sama seperti sebelumnya) ...
    setIsSubmitting(true);
    let imageUrl: string | null = null;
    if (imageFile) {
        // ... logika upload
    }
    const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content,
            author_name: author || user.displayName || 'Anonymous',
            image_url: imageUrl,
            link_url: linkUrl,
            author_fid: user.fid,
        }),
    });
    setIsSubmitting(false);
    if (response.ok) {
        alert('Posted!');
        // ... reset form
    } else {
        alert('Failed to post.');
    }
  };

  // ======================================================================
  // INI ADALAH KUNCI PERBAIKANNYA
  // ======================================================================
  // Jika SDK belum siap, tampilkan layar loading. Ini mencegah crash.
  if (!isSDKLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        <p className="mt-4">Initializing...</p>
      </div>
    );
  }

  // Jika SDK sudah siap, baru render halaman utama.
  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-8 pb-24">
        <Header />
        <div className="text-center my-8">
          <h1 className="text-3xl font-bold">Scribe a Note</h1>
          <p className="mt-2 text-lg text-gray-600">Share your thoughts.</p>
        </div>
        
        {/* Tampilkan pesan jika user tidak ditemukan, bahkan setelah SDK siap */}
        {!user && (
          <div className="text-center p-4 bg-yellow-100 rounded-md">
            <p className="text-yellow-800">Please open this in a Farcaster client to post.</p>
          </div>
        )}

        {/* Hanya tampilkan form jika user ADA */}
        {user && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ... (semua elemen form: Textarea, Input, Button) ... */}
            <div>
              <label>Your Note</label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <div>
              <label>Link (Optional)</label>
              <Input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
            </div>
            <div>
              <label>Image (Optional)</label>
              <Input type="file" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} />
            </div>
            <div>
              <label>Your Name</label>
              <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <Button type="submit" isLoading={isSubmitting}>Post Note</Button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
            }
