"use client";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          throw error;
        }
      }
      router.replace("/invoices");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">
        {mode === "signin" ? "Sign in" : "Create account"}
      </h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid gap-1">
          <label className="text-sm" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="h-10 rounded-md border px-3 bg-background"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="grid gap-1">
          <label className="text-sm" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="h-10 rounded-md border px-3 bg-background"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={
              mode === "signin" ? "current-password" : "new-password"
            }
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
        </Button>
      </form>
      <div className="mt-4 text-sm">
        {mode === "signin" ? (
          <button className="underline" onClick={() => setMode("signup")}>
            Create an account
          </button>
        ) : (
          <button className="underline" onClick={() => setMode("signin")}>
            Have an account? Sign in
          </button>
        )}
      </div>
    </div>
  );
}
