import { NextRequest, NextResponse } from "next/server";
import { generate } from "@pdfme/generator";
import { getClient, getInvoice, updateClient } from "@/lib/db";
import { uploadInvoicePdf } from "@/lib/storage";
import InvoiceTemplate from "./pdfme-invoice-template.json";
import { Template } from "@pdfme/common";
import {
  image,
  line,
  multiVariableText,
  svg,
  table,
  text,
} from "@pdfme/schemas";
import path from "node:path";
import * as fs from "node:fs";

export async function POST(
  req: NextRequest,
  { params }: RouteContext<"/api/invoices/[id]/pdf">,
) {
  try {
    const { id } = await params;
    const invoice = await getInvoice(id);
    const client = await getClient(invoice.client_id);

    const plugins = {
      text,
      svg,
      table,
      line,
      multiVariableText,
      image,
    };

    // Préparer les données pour le template
    const itemsData = invoice.items.map((item) => [
      item.name,
      item.quantity.toString(),
      item.price.toFixed(2),
      item.total.toFixed(2),
    ]);

    const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
    const taxRate = 10; // ou récupérer depuis les données
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    // Read the logo file and convert to base64
    const logoPath = path.join(
      process.cwd(),
      "src/app/api/invoices/[id]/pdf/logo-les-douceurs-de-pau.png",
    );
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

    const inputs = [
      {
        logo: logoBase64,
        billedToInput: `${client.name}\n${client.email || ""}\n${client.address || ""}`,
        info: JSON.stringify({
          InvoiceNo: invoice.number || invoice.id,
          Date: invoice.issue_date,
        }),
        orders: JSON.stringify(itemsData),
        taxInput: JSON.stringify({ rate: taxRate.toString() }),
        subtotal: subtotal.toFixed(2),
        tax: taxAmount.toFixed(2),
        total: `$${total.toFixed(2)}`,
      },
    ];

    const pdf = await generate({
      template: InvoiceTemplate as unknown as Template,
      inputs,
      plugins,
    });

    const pdfBytes = pdf as Uint8Array;
    const pdfUrl = await uploadInvoicePdf(
      invoice.id,
      pdfBytes.buffer as ArrayBuffer,
    );

    const updated = await updateClient(invoice.id, {
      pdf_url: pdfUrl,
    });

    return NextResponse.json(updated);
  } catch (e: unknown) {
    console.log(e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
