import { useMemo, useState } from "react";
import { useGenerateInvoicePdf } from "@/hooks/mutations/useGenerateInvoicePdf";
import { useInvoice } from "@/hooks/queries/useInvoice";
import { useProfileValidation } from "@/hooks/queries/useProfileValidation";

export type UseInvoiceFormProps = {
  id: string;
};

export const useInvoiceForm = ({ id }: UseInvoiceFormProps) => {
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  const {
    data: invoice,
    error: invoiceError,
    refetch: refetchInvoice,
  } = useInvoice(id, {
    enabled: !!id,
  });

  const { data: profileValidation } = useProfileValidation({
    enabled: !!id,
  });

  const generatePdf = useGenerateInvoicePdf(id);

  const error = invoiceError?.message || null;

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
      const result = await generatePdf.mutateAsync();
      const url = result?.pdf_url;
      if (url) {
        // Refetch invoice to get updated pdf_url
        await refetchInvoice();
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
