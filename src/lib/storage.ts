import { getSupabaseServiceRoleClient } from "@/lib/supabase/server";

const BUCKET_URL = process.env.SUPABASE_INVOICES_BUCKET || "invoices";

export async function uploadInvoicePdf(invoiceId: string, file: ArrayBuffer) {
  const supabase = getSupabaseServiceRoleClient();
  const path = `${invoiceId}.pdf`;

  const { error } = await supabase.storage.from(BUCKET_URL).upload(path, file, {
    contentType: "application/pdf",
    upsert: true,
  });

  if (error) {
    throw error;
  }

  const { data: pub } = supabase.storage.from(BUCKET_URL).getPublicUrl(path);
  return pub.publicUrl;
}
