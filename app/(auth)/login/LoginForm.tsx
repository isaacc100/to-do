"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/my-tasks";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    startTransition(async () => {
      try {
        const res = await signIn("resend", {
          email,
          callbackUrl,
          redirect: false,
        });
        if (res?.error) {
          setError("Failed to send magic link. Please try again.");
        } else {
          setSent(true);
        }
      } catch {
        setError("An error occurred. Please try again.");
      }
    });
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">Check your email</h3>
        <p className="text-sm text-gray-500">
          We sent a magic link to <strong>{email}</strong>. Click the link to sign in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Sign in</h2>
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
      )}
      <Input
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        autoFocus
      />
      <Button type="submit" loading={isPending} className="w-full">
        Send magic link
      </Button>
    </form>
  );
}
