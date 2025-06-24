import { Metadata } from 'next';
import { APP_NAME, APP_DESCRIPTION } from '~/lib/constants';
import { getNeynarUser } from '~/lib/neynar';

export async function generateMetadata({ params }: { params: { fid: string } }): Promise<Metadata> {
  const { fid } = params;
  return {
    title: `${APP_NAME} - Profile ${fid}`,
    openGraph: {
      title: APP_NAME,
      description: APP_DESCRIPTION,
      images: [`${process.env.APP_URL}/api/opengraph-image?fid=${fid}`],
    },
  };
}

export default async function SharePage({ params }: { params: { fid: string } }) {
  const { fid } = params;

  // Fetch user profile
  const user = await getNeynarUser(Number(fid));
  if (!user) {
    return (
      <main className="p-8 text-center">
        <h1 className="text-2xl font-bold">User not found</h1>
      </main>
    );
  }

  // Fetch best friends
  const bestFriendsRes = await fetch(`${process.env.APP_URL}/api/best-friends?fid=${fid}`);
  const { bestFriends } = await bestFriendsRes.json();

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-8 flex flex-col items-center space-y-6">
      <section className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center border border-gray-200 space-y-2">
        <img
          src={user.pfp_url}
          alt={user.username}
          className="w-24 h-24 rounded-full mx-auto border border-gray-200"
        />
        <h1 className="text-2xl font-semibold text-gray-800">{user.display_name}</h1>
        <p className="text-gray-500">@{user.username}</p>
        <p className="text-sm text-gray-400">FID: {user.fid}</p>
      </section>

      <section className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md border border-gray-200">
        <h2 className="text-xl font-medium mb-4">Best Friends</h2>
        <ul className="space-y-2">
          {bestFriends.map((bf: any) => (
            <li key={bf.user.fid} className="flex items-center space-x-3">
              <img src={bf.user.pfp_url} className="w-8 h-8 rounded-full border border-gray-200" />
              <span>{bf.user.username}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
