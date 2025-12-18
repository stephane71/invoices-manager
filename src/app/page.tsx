import {
  Check,
  FileText,
  Globe,
  Package,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  // Check if user is already authenticated
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is authenticated, redirect to the app
  if (user) {
    redirect("/app/invoices");
  }

  const t = await getTranslations("Landing");

  const features = [
    {
      icon: FileText,
      title: t("features.invoices.title"),
      description: t("features.invoices.description"),
    },
    {
      icon: Users,
      title: t("features.clients.title"),
      description: t("features.clients.description"),
    },
    {
      icon: Package,
      title: t("features.products.title"),
      description: t("features.products.description"),
    },
    {
      icon: Shield,
      title: t("features.compliance.title"),
      description: t("features.compliance.description"),
    },
    {
      icon: Globe,
      title: t("features.multilingual.title"),
      description: t("features.multilingual.description"),
    },
    {
      icon: Zap,
      title: t("features.modern.title"),
      description: t("features.modern.description"),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col items-center space-y-8 text-center">
          <Image
            src="/Lemonora.svg"
            alt="Lemonora"
            width={120}
            height={120}
            className="mb-4"
            priority
          />
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            {t("hero.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-xl md:text-2xl">
            {t("hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="px-8 text-lg">
              <Link href="/sign-in">{t("hero.getStarted")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="px-8 text-lg"
            >
              <Link href="/sign-in">{t("hero.signIn")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("features.title")}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              {t("features.subtitle")}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-background rounded-lg p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <feature.icon className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("benefits.title")}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("benefits.subtitle")}
            </p>
          </div>
          <div className="space-y-4">
            {[
              t("benefits.list.0"),
              t("benefits.list.1"),
              t("benefits.list.2"),
              t("benefits.list.3"),
              t("benefits.list.4"),
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="text-primary mt-1 h-6 w-6 shrink-0" />
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
            {t("cta.subtitle")}
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="px-8 text-lg"
          >
            <Link href="/sign-in">{t("cta.button")}</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="text-muted-foreground container mx-auto px-4 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Lemonora. {t("footer.rights")}
          </p>
        </div>
      </footer>
    </div>
  );
}
