import { Metadata } from "next";
import { APP_NAME, APP_DESCRIPTION, APP_OG_IMAGE_URL } from "@/lib/constants";
import { getMiniAppEmbedMetadata } from "@/lib/utils";

export const metadata: Metadata = {
  title: APP_NAME,
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [APP_OG_IMAGE_URL],
  },
  other: {
    "fc:frame": JSON.stringify(getMiniAppEmbedMetadata()),
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-indigo-600">{APP_NAME}</h1>
        <p className="text-gray-600">{APP_DESCRIPTION}</p>
      </div>
    </main>
  );
}
