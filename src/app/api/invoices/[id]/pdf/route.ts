import { NextRequest, NextResponse } from "next/server";
import { generate } from "@pdfme/generator";
import { getClient, getInvoice, getProfile, updateInvoice } from "@/lib/db";
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
import { numberToCurrency } from "@/lib/utils";

export async function POST(
  req: NextRequest,
  { params }: RouteContext<"/api/invoices/[id]/pdf">,
) {
  try {
    const { id } = await params;
    const invoice = await getInvoice(id);
    const client = await getClient(invoice.client_id);
    const profile = await getProfile();

    // Get currency from profile, default to EUR
    const currency = profile?.currency || "EUR";

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
      numberToCurrency(item.price, { currency }),
      numberToCurrency(item.total, { currency }),
    ]);

    const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
    const taxRate = 20;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    console.log(
      "subtotal",
      subtotal,
      numberToCurrency(subtotal, { currency }),
    );
    console.log(
      "taxAmount",
      taxAmount,
      numberToCurrency(taxAmount, { currency }),
    );
    console.log("total", total, numberToCurrency(total, { currency }));

    // Read the logo file and convert to base64
    const logoPath = path.join(
      process.cwd(),
      "src/app/api/invoices/[id]/pdf/logo-les-douceurs-de-pau.png",
    );
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

    const shopName = profile?.full_name;
    const [addressStreet, addressCity] = (profile?.address || "").split(",", 2);
    const clientInfo = [client.email, client.phone, client.address]
      .filter(Boolean)
      .join("\n");

    const inputs = [
      {
        logo: logoBase64,
        // New template fields
        client_name: client.name,
        client_information: clientInfo,
        facture_number: invoice.number || invoice.id,
        shopName,
        shopAddress: JSON.stringify({
          address_street: (addressStreet || "").trim(),
          address_city: (addressCity || "").trim(),
        }),
        // Optional description left empty unless available in data model
        // invoice_description: "",
        // Note: field name contains a trailing space in the template
        issue_date: JSON.stringify({ issue_date: invoice.issue_date }),
        // Table rows
        orders: JSON.stringify(itemsData),
        // Tax rate variable for TVA line
        taxInput: JSON.stringify({ rate: taxRate.toString() }),
        // Totals
        subtotal: numberToCurrency(subtotal, { currency }),
        tax: numberToCurrency(taxAmount, { currency }),
        total: numberToCurrency(total, { currency }),
        // Footer expects info.InvoiceNo
        info: JSON.stringify({
          InvoiceNo: invoice.number || invoice.id,
        }),
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

    const updated = await updateInvoice(invoice.id, {
      pdf_url: pdfUrl,
    });

    return NextResponse.json(updated);
  } catch (e: unknown) {
    console.log(e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
