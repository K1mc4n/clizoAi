// src/components/ui/Share.tsx

'use client';

import { useCallback, useState } from 'react';
import { Button } from './Button';
import { useMiniApp } from '@neynar/react';
// Tipe ComposeCast diimpor langsung
import { type ComposeCast } from "@farcaster/frame-sdk";

// Definisikan tipe cast config yang lebih fleksibel
interface CastConfig extends Omit<ComposeCast.Options, 'embeds'> {
  embeds?: (string | { url: string })[];
}

interface ShareButtonProps {
  buttonText: string;
  cast: CastConfig;
  className?: string;
  isLoading?: boolean;
}

export function ShareButton({ buttonText, cast, className = '', isLoading = false }: ShareButtonProps) {
  const { actions } = useMiniApp();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleShare = useCallback(async () => {
    // Pastikan 'actions' dan 'composeCast' tersedia sebelum digunakan
    if (!actions?.composeCast) {
      console.error('Compose Cast action is not available.');
      // Mungkin beri tahu pengguna
      alert('Share feature is not available in this client.');
      return;
    }

    try {
      setIsProcessing(true);

      // Memproses embed agar selalu menjadi array of strings
      const processedEmbeds = (cast.embeds || []).map(embed => 
        typeof embed === 'string' ? { url: embed } : embed
      );

      // Memanggil fungsi composeCast dari hook useMiniApp
      await actions.composeCast({
        text: cast.text,
        // Pastikan tipe embeds sesuai dengan yang diharapkan oleh SDK
        embeds: processedEmbeds as [{ url: string }] | [{ url: string }, { url: string }] | undefined,
        parent: cast.parent,
        channelKey: cast.channelKey,
        close: cast.close,
      });

    } catch (error) {
      console.error('Failed to share:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [cast, actions]);

  return (
    <Button
      onClick={handleShare}
      className={className}
      isLoading={isLoading || isProcessing}
    >
      {buttonText}
    </Button>
  );
}
