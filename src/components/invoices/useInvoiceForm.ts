import { useEffect, useMemo, useState } from "react";
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

    void load();

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
  };
};
