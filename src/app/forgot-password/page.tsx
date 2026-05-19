import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Reset your password</h1>
        <p className="text-text-secondary mb-6">
          Enter your email address and we&apos;ll send you a reset link.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-sm text-amber-800">
          Email reset is not yet configured. Please contact an administrator to reset your password.
        </div>
        <Link href="/login" className="mt-6 inline-block text-primary hover:underline text-sm">
          ← Back to login
        </Link>
      </div>
    </div>
  );
}
