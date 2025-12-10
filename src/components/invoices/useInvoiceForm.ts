import { useEffect, useMemo, useState } from "react";
import type { ProfileValidationResult } from "@/lib/validation";
import { Client, Invoice } from "@/types/models";

export type UseInvoiceFormProps = {
  id: string;
};

export const useInvoiceForm = ({ id }: UseInvoiceFormProps) => {
  const [invoice, setInvoice] = useState<
    (Invoice & { clients: Pick<Client, "name"> }) | null
  >(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileValidation, setProfileValidation] =
    useState<ProfileValidationResult | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const res = await fetch(`/api/invoices/${id}`);
        const data = await res.json();
        if (!active) {
          return;
        }
        if (!res.ok) {
          throw new Error(data?.error || "Failed to load invoice");
        }
        setInvoice(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load";
        setError(msg);
      }
    };

    if (id) {
      void load();
    }

    return () => {
      active = false;
    };
  }, [id]);

  // Fetch profile validation when invoice is selected
  useEffect(() => {
    let active = true;

    const loadProfileValidation = async () => {
      try {
        const res = await fetch("/api/profile/validate");
        const data = await res.json();
        if (!active) {
          return;
        }
        if (!res.ok) {
          throw new Error(
            data?.error || "Failed to load profile validation"
          );
        }
        setProfileValidation(data);
      } catch (e: unknown) {
        console.error("Profile validation fetch error:", e);
        // Don't set error state - profile validation is non-critical for viewing
      }
    };

    if (id) {
      void loadProfileValidation();
    }

    return () => {
      active = false;
    };
  }, [id]);

  const onDownloadInvoice = async () => {
    if (!invoice) {
      return;
    }

    try {
      setDownloadingInvoice(true);
      // If a PDF already exists, open it directly
      if (invoice.pdf_url) {
        window.open(invoice.pdf_url, "_blank");
        return;
      }
      // Otherwise, generate it then open
      const res = await fetch(`/api/invoices/${invoice.id}/pdf`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate PDF");
      }
      const url = data?.pdf_url as string | undefined;
      if (url) {
        // update local state
        setInvoice({ ...invoice, pdf_url: url });
        window.open(url, "_blank");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Download failed";
      alert(msg);
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const total = useMemo(() => {
    if (!invoice) {
      return 0;
    }
    return invoice.total_amount;
  }, [invoice]);

  return {
    invoice,
    error,
    onDownloadInvoice,
    downloadingInvoice,
    total,
    profileValidation,
  };
};
