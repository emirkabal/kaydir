"use client";

import { useState } from "react";
import { authClient } from "../../lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [pending, setPending] = useState(false);

  const signInProvider = async () => {
    setPending(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
    if (error) {
      alert(error.message);
    }
    setPending(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    const { data, error } = await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/",
      },
      {
        onRequest: (ctx) => {
          // display loading state
          console.log("Request started", ctx);
        },
        onSuccess: (ctx) => {
          // redirect to the dashboard or sign in page
          console.log("Request successful", ctx);
          router.push("/");
        },
        onError: (ctx) => {
          // display the error message
          alert(ctx.error.message);
        },
      }
    );
    setPending(false);

    console.log("Sign in data", data);
    console.log("Sign in error", error);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold text-center mb-4">Sign In</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border border-gray-300 rounded p-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border border-gray-300 rounded p-2"
        />
        <button
          type="submit"
          disabled={pending}
          className={`cursor-pointer bg-purple-500 text-white rounded p-2 ${pending ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Sign In
        </button>
        <hr />
        <button
          type="button"
          className="cursor-pointer bg-gray-100 text-black hover:bg-blue-200 rounded p-2 mt-2"
          onClick={signInProvider}
        >
          Sign In with Google
        </button>
      </form>
      <p className="mt-4">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
