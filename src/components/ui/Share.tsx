// src/components/ui/Share.tsx

'use client';

import { useCallback, useState } from 'react';
import { Button } from './Button';
import { useMiniApp } from '@neynar/react';
import { type ComposeCast } from "@farcaster/frame-sdk";

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
    try {
      setIsProcessing(true);

      const processedEmbeds = (cast.embeds || []).map(embed => 
        typeof embed === 'string' ? embed : embed.url
      );

      // PERBAIKAN: Argumen kedua telah dihapus dari pemanggilan fungsi ini,
      // sesuai dengan versi SDK yang lebih baru.
      await actions.composeCast({
        text: cast.text,
        embeds: processedEmbeds as [string] | [string, string] | undefined,
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
