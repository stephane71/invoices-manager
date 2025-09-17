"use client";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
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
          <Button variant="link" onClick={() => setMode("signup")}>
            Create an account
          </Button>
        ) : (
          <Button variant="link" onClick={() => setMode("signin")}>
            Have an account? Sign in
          </Button>
        )}
      </div>
    </div>
  );
}
