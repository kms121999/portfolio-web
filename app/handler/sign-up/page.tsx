import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="max-w-md w-full text-center bg-card p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-primary">
          Sign Up Not Allowed
        </h1>
        <p className="mb-6 text-muted-foreground">
          Sorry, creating a new account is not permitted at this time.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 rounded bg-primary text-black font-medium hover:bg-primary/90 transition"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}