import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="mx-auto max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg px-4 py-3">
      <nav className="sticky top-0 z-10 -mx-4 mb-3 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-2 flex items-center gap-3 overflow-x-auto">
        <Link href="/invoices" className="text-sm font-medium">
          Invoices
        </Link>
        <Link href="/clients" className="text-sm font-medium">
          Clients
        </Link>
        <Link href="/products" className="text-sm font-medium">
          Products
        </Link>
      </nav>
      {children}
    </div>
  );
}
