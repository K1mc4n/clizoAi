// src/app/degen-checker/page.tsx

"use client";

import { useState } from 'react';
import { Header } from '~/components/ui/Header';
import { Footer } from '~/components/ui/Footer';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/Button';
import { type DegenPointsData, DegenPointsResult } from '~/components/ui/DegenPointsResult';

export default function DegenCheckerPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<DegenPointsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

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
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            Check
          </Button>
        </form>

        <div className="mt-6">
          {isLoading && <p className="text-center">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {result && <DegenPointsResult data={result} query={query} />}
        </div>
      </div>
      <Footer />
    </div>
  );
}
