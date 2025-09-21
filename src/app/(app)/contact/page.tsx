import { getTranslations } from "next-intl/server";
import { Mail, PhoneIncoming } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function ContactPage() {
  const c = await getTranslations("Contact");

  const fullName = "Stéphane Maire";
  const email = "stephane@un-bourguignon.com";
  const phone = "+33 6 62 46 16 43";

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex space-x-2">
        <div className="h-16 w-16 rounded-full flex items-center justify-center">
          <Image
            src="https://github.com/stephane71.png"
            alt={c("imageAlt")}
            width={64}
            height={64}
            className="rounded-full"
          />
        </div>
        <div className="space-y-2">
          <p className="text-md font-medium mb-0">{fullName}</p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground mb-0">
            <Mail className="h-4 w-4" aria-hidden="true" />
            <Link
              href={`mailto:${email}`}
              className="text-blue-600 hover:underline"
            >
              {email}
            </Link>
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground mb-0">
            <PhoneIncoming className="h-4 w-4" aria-hidden="true" />
            <Link
              href={`tel:${phone}`}
              className="text-blue-600 hover:underline"
            >
              {phone}
            </Link>
          </p>
        </div>
      </div>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">{c("about.title")}</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {c.rich("about.body", {
            br: () => <br />,
          })}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">{c("ambition.title")}</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {c.rich("ambition.body", {
            br: () => <br />,
          })}
        </p>
      </section>
    </div>
  );
}
