import { Metadata } from 'next';
import { APP_NAME, APP_DESCRIPTION } from '~/lib/constants';
import { getNeynarUser } from '~/lib/neynar';

interface SharePageProps {
  params: Promise<{ fid: string }>;
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { fid } = await params;
  return {
    title: `${APP_NAME} - Profile ${fid}`,
    openGraph: {
      title: APP_NAME,
      description: APP_DESCRIPTION,
      images: [`${process.env.APP_URL}/api/opengraph-image?fid=${fid}`],
    },
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { fid } = await params;
  const user = await getNeynarUser(Number(fid));

  if (!user) {
    return (
      <main className="p-8 text-center">
        <h1 className="text-2xl font-bold">User not found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-8 flex flex-col items-center">
      <section className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center space-y-4 border border-gray-200">
        <img
          src={user.pfp_url}
          alt={user.username}
          className="w-24 h-24 rounded-full mx-auto border border-gray-200"
        />
        <h1 className="text-2xl font-semibold text-gray-800">{user.display_name}</h1>
        <p className="text-gray-500">@{user.username}</p>
        <p className="text-sm text-gray-400">FID: {user.fid}</p>
      </section>

      <section className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md mt-6 border border-gray-200">
        <h2 className="text-xl font-medium mb-2">Best Friends</h2>
        <ul className="space-y-2">
          {/* Fetch and list best friends data using API or props */}
          <li className="text-gray-500">Add best friends fetching logic...</li>
        </ul>
      </section>
    </main>
  );
}
