import { Mail, PhoneIncoming } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const c = await getTranslations("Contact");

  const fullName = "Stéphane Maire";
  const email = "stephane@un-bourguignon.com";
  const phone = "+33 6 62 46 16 43";

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex space-x-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full">
          <Image
            src="https://github.com/stephane71.png"
            alt={c("imageAlt")}
            width={64}
            height={64}
            className="rounded-full"
          />
        </div>
        <div className="space-y-2">
          <p className="text-md mb-0 font-medium">{fullName}</p>
          <p className="text-muted-foreground mb-0 flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4" aria-hidden="true" />
            <Link
              href={`mailto:${email}`}
              className="text-blue-600 hover:underline"
            >
              {email}
            </Link>
          </p>
          <p className="text-muted-foreground mb-0 flex items-center gap-2 text-sm">
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
        <p className="text-muted-foreground text-sm leading-6">
          {c.rich("about.body", {
            br: () => <br />,
          })}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">{c("ambition.title")}</h2>
        <p className="text-muted-foreground text-sm leading-6">
          {c.rich("ambition.body", {
            br: () => <br />,
          })}
        </p>
      </section>
    </div>
  );
}
