import { getSupabaseServiceRoleClient } from "@/lib/supabase/server";

export async function uploadInvoicePdf(invoiceId: string, file: ArrayBuffer) {
  const supabase = getSupabaseServiceRoleClient();
  const bucket = process.env.SUPABASE_INVOICES_BUCKET || "invoices";
  const path = `${invoiceId}.pdf`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: "application/pdf",
      upsert: true,
    });
  if (error) throw error;

  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
  return pub.publicUrl;
}
