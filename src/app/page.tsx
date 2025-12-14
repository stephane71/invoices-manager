import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  Package,
  Globe,
  Shield,
  Zap,
  Check,
} from "lucide-react";

export default function LandingPage() {
  const t = useTranslations("Landing");

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
        <div className="flex flex-col items-center text-center space-y-8">
          <Image
            src="/Lemonora.svg"
            alt="Lemonora"
            width={120}
            height={120}
            className="mb-4"
            priority
          />
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            {t("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/sign-in">{t("hero.getStarted")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link href="/sign-in">{t("hero.signIn")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("features.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-background p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <feature.icon className="w-6 h-6 text-primary" />
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
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("benefits.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
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
                <Check className="w-6 h-6 text-primary mt-1 shrink-0" />
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            {t("cta.subtitle")}
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link href="/sign-in">{t("cta.button")}</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Lemonora. {t("footer.rights")}</p>
        </div>
      </footer>
    </div>
  );
}
