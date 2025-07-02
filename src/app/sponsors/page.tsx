// src/app/sponsors/page.tsx

"use client";

import { Header } from "~/components/ui/Header";
import { Footer } from "~/components/ui/Footer";
import { SponsorBanner } from "~/components/ui/SponsorBanner";
import { USE_WALLET } from "~/lib/constants";

export default function SponsorsPage() {
  return (
    <div>
      <div className="mx-auto py-2 px-4 pb-20">
        <Header />
        <h1 className="text-2xl font-bold text-center mb-6">Our Sponsors</h1>
        
        {/* Kita panggil komponen SponsorBanner di sini */}
        <SponsorBanner />

      </div>
      <Footer showWallet={USE_WALLET} />
    </div>
  );
}
