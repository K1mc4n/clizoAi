// Lokasi: src/app/ledger/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Header } from '~/components/ui/Header';
import { Footer } from '~/components/ui/Footer';

// Definisikan tipe data untuk setiap post
interface Post {
  id: number;
  created_at: string;
  content: string;
  author_name: string;
}

export default function LedgerPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
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
      <div className="mx-auto py-2 px-4 pb-20 max-w-2xl">
        <Header />
        <h1 className="text-2xl font-bold text-center my-4">The Ledger</h1>
        <p className="text-center text-gray-500 mb-6">Recent notes from the community.</p>

        {isLoading && <p className="text-center">Loading notes...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        
        <div className="space-y-4">
          {!isLoading && !error && posts.map((post) => (
            <div key={post.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
              <div className="text-right text-sm text-gray-500 mt-2">
                - {post.author_name} on {new Date(post.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
