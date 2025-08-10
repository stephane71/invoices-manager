import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getInvoice } from "@/lib/db";

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const original = await getInvoice(params.id);
    const supabase = getSupabaseServerClient();
    const payload = {
      client_id: original.client_id,
      items: original.items,
      total_amount: original.total_amount,
      status: "draft" as const,
      issue_date: new Date().toISOString().slice(0, 10),
      due_date: original.due_date,
    };
    const { data, error } = await supabase.from("invoices").insert(payload).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
