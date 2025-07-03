// src/app/degen-checker/page.tsx

"use client";

import { useState } from 'react';
import { Header } from '~/components/ui/Header';
import { Footer } from '~/components/ui/Footer';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/Button';
import { type DegenPointsData, DegenPointsResult } from '~/components/ui/DegenPointsResult';
import { useMiniApp } from '@neynar/react'; // Impor hook

export default function DegenCheckerPage() {
  const { context } = useMiniApp(); // Gunakan hook untuk mendapatkan info pengguna
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<DegenPointsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState('');

  const handleCheckPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setSubmittedQuery(query);

    try {
      const response = await fetch('/api/degen-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mx-auto py-2 px-4 pb-20">
        <Header />
        <div className="text-center mt-8">
          <h1 className="text-3xl font-bold">Degen Point Checker</h1>
          <p className="mt-2 text-gray-500">Enter a Farcaster username or ETH address.</p>
        </div>

        <form onSubmit={handleCheckPoints} className="w-full max-w-md mx-auto mt-8 flex items-center space-x-2">
          <Input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="@dwr or 0x..."
            className="flex-grow"
          />
          <Button type="submit" isLoading={isLoading} disabled={isLoading || !query}>
            Check
          </Button>
        </form>
        
        {/* Tombol untuk memeriksa poin sendiri */}
        {context?.user?.username && (
          <div className="text-center mt-4">
             <Button 
                variant="link"
                onClick={() => setQuery(context.user!.username)}
                className="text-purple-500"
              >
                Check my own points (@{context.user.username})
             </Button>
          </div>
        )}

        <div className="mt-6">
          {isLoading && <p className="text-center">Loading...</p>}
          {/* Tampilkan komponen hasil dengan data atau error */}
          {!isLoading && (result || error) && (
            <DegenPointsResult data={result || undefined} error={error || undefined} query={submittedQuery} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
