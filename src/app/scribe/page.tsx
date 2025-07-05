// src/app/scribe/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '~/lib/supabase';
import { Header } from '~/components/ui/Header';
import { Footer } from '~/components/ui/Footer';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { ImageUp, Link2 } from 'lucide-react';

export default function ScribePage() {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content && !imageFile) {
      alert('Please write something or attach an image.');
      return;
    }

    setIsSubmitting(true);
    let imageUrl: string | null = null;

    // 1. Upload gambar jika ada
    if (imageFile) {
      setIsUploading(true);
      const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, '_')}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('post-images') // Nama bucket Anda
        .upload(fileName, imageFile);

      setIsUploading(false);

      if (uploadError) {
        alert('Error uploading image: ' + uploadError.message);
        setIsSubmitting(false);
        return;
      }
      
      const { data: urlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(uploadData.path);
        
      imageUrl = urlData.publicUrl;
    }

    // 2. Kirim semua data ke API backend Anda
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: content,
        author_name: author,
        image_url: imageUrl,
        link_url: linkUrl,
      }),
    });

    setIsSubmitting(false);

    if (response.ok) {
      alert('Your note has been posted!');
      setContent('');
      setAuthor('');
      setLinkUrl('');
      setImageFile(null);
      // Reset input file
      const fileInput = document.getElementById('image') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
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
            Share your thoughts, links, and images.
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
              rows={6}
              placeholder="What's on your mind?"
            />
          </div>

          <div>
            <label htmlFor="link" className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              <Link2 className="w-4 h-4 mr-2"/>Attach a Link (Optional)
            </label>
            <Input
              id="link"
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label htmlFor="image" className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              <ImageUp className="w-4 h-4 mr-2"/>Attach an Image (Optional)
            </label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
              className="file:text-purple-700 file:font-semibold"
              disabled={isSubmitting}
            />
            {imageFile && <p className="text-sm text-gray-500 mt-2">Selected: {imageFile.name}</p>}
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
              isLoading={isSubmitting}
              className="w-full text-base py-6"
            >
              {isUploading ? 'Uploading Image...' : (isSubmitting ? 'Posting...' : 'Post Note')}
            </Button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
