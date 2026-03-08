import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in – tasks.isaaccritchley.uk" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-gray-900">tasks.isaaccritchley.uk</Link>
          <p className="text-gray-500 mt-2">Sign in to manage your tasks</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          <Link href="/" className="hover:text-gray-600">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
