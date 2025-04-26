"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "./lib/auth-client";
import { LoaderCircleIcon } from "lucide-react";

export default function AppReady({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      if (pathname === "/auth/signin" || pathname === "/auth/signup") {
        console.log("Already on sign in or sign up page");
      } else {
        router.push("/auth/signin");
      }
    } else if (!isPending && session) {
      if (pathname === "/auth/signin" || pathname === "/auth/signup") {
        router.push("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, session, pathname]);

  if (
    isPending ||
    (!session && pathname !== "/auth/signin" && pathname !== "/auth/signup")
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <LoaderCircleIcon className="animate-spin text-white" size={40} />
        <span className="ml-2 text-gray-300">Loading...</span>
      </div>
    );
  }

  if (session || pathname === "/auth/signin" || pathname === "/auth/signup") {
    return <>{children}</>;
  }

  return null;
}
