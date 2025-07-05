// src/app/ledger/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Header } from '~/components/ui/Header';
import { Footer } from '~/components/ui/Footer';

// Definisikan tipe data untuk setiap post, termasuk kolom baru
interface Post {
  id: number;
  created_at: string;
  content: string | null;
  author_name: string;
  image_url: string | null;
  link_url: string | null;
}

// Komponen untuk satu kartu post
const PostCard = ({ post }: { post: Post }) => (
  <div className="bg-white dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700/50 transition-shadow hover:shadow-lg">
    
    {/* Tampilkan gambar jika ada */}
    {post.image_url && (
      <img
        src={post.image_url}
        alt="User uploaded content"
        className="w-full h-auto object-cover rounded-lg mb-4 border border-gray-200 dark:border-gray-700"
      />
    )}
    
    {/* Tampilkan konten teks jika ada */}
    {post.content && (
       <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-base leading-relaxed">
         {post.content}
       </p>
    )}

    {/* Tampilkan link jika ada */}
    {post.link_url && (
      <a 
        href={post.link_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-4 block bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <p className="font-semibold text-purple-600 dark:text-purple-400">🔗 Link</p>
        <p className="text-sm text-gray-500 truncate">{post.link_url}</p>
      </a>
    )}

    {/* Footer Kartu (Author dan Tanggal) */}
    <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
      <div className="text-right">
        <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">
          {post.author_name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  </div>
);

// Komponen Skeleton untuk efek loading
const PostCardSkeleton = () => (
    // ... (kode skeleton bisa tetap sama seperti sebelumnya)
    <div className="bg-white dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700/50 animate-pulse">
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
        <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
        <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
    </div>
);

export default function LedgerPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-8 pb-24">
        <Header />
        <div className="text-center my-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">The Ledger</h1>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Recent notes from the community.
          </p>
        </div>

        {error && <p className="text-center text-red-500">Error: {error}</p>}
        
        <div className="space-y-6">
          {isLoading ? (
            <>
              <PostCardSkeleton />
              <PostCardSkeleton />
            </>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="animate-fade-in">
                 <PostCard post={post} />
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
