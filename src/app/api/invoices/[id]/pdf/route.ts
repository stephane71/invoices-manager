import { NextRequest, NextResponse } from "next/server";
import { generate } from "@pdfme/generator";
import { getInvoice, upsertInvoice, getClient } from "@/lib/db";
import { uploadInvoicePdf } from "@/lib/storage";

async function loadFont() {
  const url = process.env.PDFME_FONT_URL;
  if (!url) throw new Error("Missing PDFME_FONT_URL");
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to download font");
  const buffer = await res.arrayBuffer();
  return new Uint8Array(buffer);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoice = await getInvoice(params.id);
    const client = await getClient(invoice.client_id);
    const body = await req.json().catch(() => ({}));
    const notes: string | undefined = body?.notes;

    const fontData = await loadFont();

    const template = {
      basePdf: null as unknown as string,
      schemas: [
        {
          invoice_id: { type: "text", position: { x: 10, y: 10 }, width: 190, height: 10 },
          client_name: { type: "text", position: { x: 10, y: 20 }, width: 190, height: 10 },
          issue_date: { type: "text", position: { x: 10, y: 30 }, width: 190, height: 10 },
          due_date: { type: "text", position: { x: 10, y: 40 }, width: 190, height: 10 },
          items: { type: "text", position: { x: 10, y: 60 }, width: 190, height: 90 },
          total: { type: "text", position: { x: 10, y: 155 }, width: 190, height: 10 },
          notes: { type: "text", position: { x: 10, y: 170 }, width: 190, height: 20 },
        },
      ],
      fonts: [{ name: "custom", data: fontData }],
    } as const;

    const itemsText = invoice.items
      .map((it) => `${it.name} x${it.quantity} @ ${it.price.toFixed(2)} = ${it.total.toFixed(2)}`)
      .join("\n");

    const inputs = [
      {
        invoice_id: `Invoice: ${invoice.id}`,
        client_name: `Client: ${client.name}`,
        issue_date: `Issue: ${invoice.issue_date}`,
        due_date: `Due: ${invoice.due_date}`,
        items: itemsText,
        total: `Total: ${invoice.total_amount.toFixed(2)}`,
        notes: notes ? `Notes: ${notes}` : "",
      },
    ];

    const pdf = await generate({ template: template as unknown as Parameters<typeof generate>[0]["template"], inputs });
    const pdfBytes = pdf as unknown as Uint8Array; // generator returns Uint8Array
    const pdfUrl = await uploadInvoicePdf(invoice.id, pdfBytes.buffer);

    const updated = await upsertInvoice({ id: invoice.id, pdf_url: pdfUrl });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
