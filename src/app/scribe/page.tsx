// src/app/scribe/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useMiniApp, type MiniAppUser } from '@neynar/react'; // Impor tipe MiniAppUser
import { supabase } from '~/lib/supabase';
import { Header } from '~/components/ui/Header';
import { Footer } from '~/components/ui/Footer';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { ImageUp, Link2, Loader2 } from 'lucide-react';

// =========================================================================
// KOMPONEN INTI: Hanya di-render jika 'user' sudah pasti ada
// =========================================================================
function ScribeForm({ user }: { user: MiniAppUser }) {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(user.displayName || '');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Selalu update nama jika profil pengguna berubah
    if (user.displayName && author !== user.displayName) {
      setAuthor(user.displayName);
    }
  }, [user.displayName, author]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content && !imageFile) {
      alert('Please write something or attach an image.');
      return;
    }

    setIsSubmitting(true);
    let imageUrl: string | null = null;

    if (imageFile) {
      setIsUploading(true);
      const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('post-images').upload(fileName, imageFile);
      setIsUploading(false);
      if (uploadError) {
        alert('Error uploading image: ' + uploadError.message);
        setIsSubmitting(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(uploadData.path);
      imageUrl = urlData.publicUrl;
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
      alert('Your note has been posted!');
      setContent('');
      setLinkUrl('');
      setImageFile(null);
      const fileInput = document.getElementById('image') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } else {
      const errorData = await response.json();
      alert(`Something went wrong: ${errorData.error || 'Please try again.'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Your Note</label>
        <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={6} placeholder="What's on your mind?" />
      </div>
      <div>
        <label htmlFor="link" className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"><Link2 className="w-4 h-4 mr-2"/>Attach a Link (Optional)</label>
        <Input id="link" type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" />
      </div>
      <div>
        <label htmlFor="image" className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"><ImageUp className="w-4 h-4 mr-2"/>Attach an Image (Optional)</label>
        <Input id="image" type="file" accept="image/*" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} className="file:text-purple-700 file:font-semibold" disabled={isSubmitting} />
        {imageFile && <p className="text-sm text-gray-500 mt-2">Selected: {imageFile.name}</p>}
      </div>
      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Your Name</label>
        <Input id="author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Anonymous" />
      </div>
      <div>
        <Button type="submit" isLoading={isSubmitting} className="w-full text-base py-6">
          {isUploading ? 'Uploading...' : (isSubmitting ? 'Posting...' : 'Post Note')}
        </Button>
      </div>
    </form>
  );
}


// =========================================================================
// KOMPONEN "WRAPPER": Menangani logika loading dan pengecekan data
// =========================================================================
export default function ScribePage() {
  const { context, isSDKLoaded } = useMiniApp();
  const user = context?.user;

  // Tampilan utama
  const renderContent = () => {
    // 1. Jika SDK masih loading
    if (!isSDKLoaded) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Initializing Farcaster connection...</p>
        </div>
      );
    }
    
    // 2. Jika SDK sudah siap, TAPI tidak ada user (dibuka di browser biasa)
    if (isSDKLoaded && !user) {
      return (
         <div className="text-center bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
           <p className="text-yellow-800 dark:text-yellow-300 font-semibold">Authentication Required</p>
           <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
             Please open this app inside a Farcaster client like Warpcast to use this feature.
           </p>
         </div>
      );
    }
    
    // 3. Jika SDK siap DAN user ada, tampilkan form
    if (isSDKLoaded && user) {
      return <ScribeForm user={user} />;
    }

    // Fallback (seharusnya tidak pernah tercapai)
    return null;
  };

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
        {renderContent()}
      </div>
      <Footer />
    </div>
  );
}
