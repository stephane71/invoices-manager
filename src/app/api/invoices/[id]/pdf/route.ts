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
import { centsToCurrencyString } from "@/lib/utils";
import { APP_LOCALE } from "@/lib/constants";
import { fetchLogoAsBase64 } from "@/lib/logo";

export async function POST(
  req: NextRequest,
  { params }: RouteContext<"/api/invoices/[id]/pdf">,
) {
  try {
    const { id } = await params;
    const invoice = await getInvoice(id);
    const client = await getClient(invoice.client_id);
    const profile = await getProfile();

    const plugins = {
      text,
      svg,
      table,
      line,
      multiVariableText,
      image,
    };

    // Préparer les données pour le template
    // Note: invoice items have prices in cents
    const itemsData = invoice.items.map((item) => [
      item.name,
      item.quantity.toString(),
      centsToCurrencyString(item.price, "EUR", APP_LOCALE),
      centsToCurrencyString(item.total, "EUR", APP_LOCALE),
    ]);

    const subtotalCents = invoice.items.reduce(
      (sum, item) => sum + item.total,
      0,
    ); // already in cents
    const taxRate = 20;
    const taxAmountCents = Math.round(subtotalCents * (taxRate / 100)); // calculate tax in cents
    const totalCents = subtotalCents + taxAmountCents; // total in cents

    console.log("subtotal", subtotalCents, centsToCurrencyString(subtotalCents, "EUR", APP_LOCALE));
    console.log("taxAmount", taxAmountCents, centsToCurrencyString(taxAmountCents, "EUR", APP_LOCALE));
    console.log("total", totalCents, centsToCurrencyString(totalCents, "EUR", APP_LOCALE));

    // Fetch logo from profile if available
    const logoBase64 = profile?.logo_url
      ? await fetchLogoAsBase64(profile.logo_url)
      : undefined;

    const shopName = profile?.full_name;
    const [addressStreet, addressCity] = (profile?.address || "").split(",", 2);
    const clientInfo = [client.email, client.phone, client.address]
      .filter(Boolean)
      .join("\n");

    const inputs = [
      {
        ...(logoBase64 && { logo: logoBase64 }),
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
        subtotal: centsToCurrencyString(subtotalCents, "EUR", APP_LOCALE),
        tax: centsToCurrencyString(taxAmountCents, "EUR", APP_LOCALE),
        total: centsToCurrencyString(totalCents, "EUR", APP_LOCALE),
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
