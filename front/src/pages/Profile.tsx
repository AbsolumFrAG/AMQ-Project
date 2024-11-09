import { useEffect, useState } from "react";

interface Profile {
  username: string;
  anilistId?: string;
  stats: {
    gamesPlayed: number;
    totalScore: number;
    averageScore: number;
    winRate: number;
  };
}

export function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-4">
          Please log in to view your profile
        </h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
          Login with AniList
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{profile.username}</h1>
        {profile.anilistId && (
          <a
            href={`https://anilist.co/user/${profile.anilistId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            View AniList Profile
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg text-center">
          <div className="text-2xl font-bold">{profile.stats.gamesPlayed}</div>
          <div className="text-sm">Games Played</div>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <div className="text-2xl font-bold">{profile.stats.totalScore}</div>
          <div className="text-sm">Total Score</div>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <div className="text-2xl font-bold">{profile.stats.averageScore}</div>
          <div className="text-sm">Average Score</div>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <div className="text-2xl font-bold">{profile.stats.winRate}%</div>
          <div className="text-sm">Win Rate</div>
        </div>
      </div>

      {!profile.anilistId && (
        <div className="mt-8 p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">Connect with AniList</h2>
          <p className="mb-4">
            Connect your AniList account to play with songs from your watched
            anime list!
          </p>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
            Connect AniList Account
          </button>
        </div>
      )}
    </div>
  );
}
