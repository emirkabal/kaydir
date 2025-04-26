"use client";

import { useRouter } from "next/navigation";
import { authClient } from "./lib/auth-client";
import PostSwiper from "./components/PostSwiper";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  return (
    <div>
      <div className="fixed  bottom-0 right-0 p-4 text-white z-50">
        {session?.user.image && (
          <Image
            src={session.user.image}
            alt="User Avatar"
            width={50}
            height={50}
            className="rounded-full"
          />
        )}
        <p>{session?.user.name}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
          onClick={async () => {
            const { error } = await authClient.signOut();
            if (error) {
              alert(error.message);
            } else {
              router.push("/auth/signin");
            }
          }}
        >
          Sign Out
        </button>
      </div>

      <PostSwiper />
    </div>
  );
}
