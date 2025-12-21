import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Font, Template } from "@pdfme/common";
import { generate } from "@pdfme/generator";
import { line, multiVariableText, svg, table, text } from "@pdfme/schemas";
import { NextRequest, NextResponse } from "next/server";
import InvoiceTemplate from "./pdfme-invoice-template.json";
import { APP_LOCALE } from "@/lib/constants";
import { getClient, getInvoice, getProfile, updateInvoice } from "@/lib/db";
import { buildPaymentInfo } from "@/lib/invoice-utils";
import { uploadInvoicePdf } from "@/lib/storage";
import {
  centsToCurrencyString,
  formatSiret,
  getClientDisplayName,
} from "@/lib/utils";
import { validateProfileForPdfGeneration } from "@/lib/validation";

export async function POST(
  req: NextRequest,
  { params }: RouteContext<"/api/invoices/[id]/pdf">,
) {
  try {
    const { id } = await params;
    const invoice = await getInvoice(id);
    const client = await getClient(invoice.client_id);
    const profile = await getProfile();

    // Check if profile exists
    if (!profile) {
      return NextResponse.json(
        {
          error: "Profile not found",
          message: "Please create your profile before generating invoices.",
        },
        { status: 400 },
      );
    }

    // Validate profile completeness before PDF generation
    const validation = validateProfileForPdfGeneration(profile);
    if (!validation.isComplete) {
      return NextResponse.json(
        {
          error: "Profile incomplete",
          message:
            "Your profile is missing required information for PDF generation. Please complete your profile before generating invoices.",
          missingFields: validation.missingFields,
          warnings: validation.warnings,
        },
        { status: 400 },
      );
    }

    const plugins = {
      text,
      svg,
      table,
      line,
      multiVariableText,
    };

    // Validate invoice has items
    if (!invoice.items || invoice.items.length === 0) {
      return NextResponse.json(
        {
          error: "Cannot generate PDF: Invoice must have at least one item",
        },
        { status: 400 },
      );
    }

    // Préparer les données pour le template
    // Note: invoice items have prices in cents
    const itemsData = invoice.items.map((item) => [
      item.name || "Unnamed item",
      (item.quantity || 0).toString(),
      centsToCurrencyString(item.price || 0, "EUR", APP_LOCALE),
      centsToCurrencyString(item.total || 0, "EUR", APP_LOCALE),
    ]);

    // Check if VAT-exempt based on vat_exemption_mention
    const isVatExempt =
      invoice.vat_exemption_mention !== null &&
      invoice.vat_exemption_mention !== "";
    const taxRate = isVatExempt ? 0 : 20; // 0% if exempt, 20% otherwise

    const subtotalCents = invoice.items.reduce(
      (sum, item) => sum + item.total,
      0,
    ); // already in cents
    const taxAmountCents = isVatExempt
      ? 0
      : Math.round(subtotalCents * (taxRate / 100)); // calculate tax in cents
    const totalCents = subtotalCents + taxAmountCents; // total in cents

    console.log(
      "subtotal",
      subtotalCents,
      centsToCurrencyString(subtotalCents, "EUR", APP_LOCALE),
    );
    console.log(
      "taxAmount",
      taxAmountCents,
      centsToCurrencyString(taxAmountCents, "EUR", APP_LOCALE),
    );
    console.log(
      "total",
      totalCents,
      centsToCurrencyString(totalCents, "EUR", APP_LOCALE),
    );

    const shopName = profile?.full_name;
    const shopSiret = profile?.siret || null;

    // CLIENT

    // Only companies have SIREN - check client type before accessing
    const clientSiren =
      client.client_type === "company" && client.siren
        ? `SIREN: ${client.siren}`
        : "";
    // Use structured address fields (new format)
    const addressStreet = profile?.address_street || "";
    const addressCity = profile?.address_city
      ? `${profile.address_postal_code || ""} ${profile.address_city}`.trim()
      : "";
    const clientInfo = [client.email, client.phone, client.address, clientSiren]
      .filter(Boolean)
      .join("\n");

    const paymentInfo = buildPaymentInfo({
      payment_iban: invoice.payment_iban,
      payment_bic: invoice.payment_bic,
      payment_link: invoice.payment_link,
      payment_free_text: invoice.payment_free_text,
    });

    const hasPaymentInfo = paymentInfo.length > 0;

    const inputs = [
      {
        // New template fields
        client_name: getClientDisplayName(client),
        client_information: clientInfo,
        facture_number: invoice.number || invoice.id,
        shopName,
        shopSiret: shopSiret ? formatSiret(shopSiret) : "",
        shopAddress: JSON.stringify({
          address_street: (addressStreet || "").trim(),
          address_city: (addressCity || "").trim(),
        }),
        // Operation type (services, goods, mixed)
        operationType: invoice.operation_type || "services",
        // VAT exemption mention (for micro-enterprises)
        vatExemptionMention: invoice.vat_exemption_mention || "",
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
        // Payment information (title and content)
        payment_information_title: hasPaymentInfo
          ? `Mode${paymentInfo.length > 1 ? "s" : ""} de paiement`
          : "",
        payment_information: paymentInfo,
        // Footer expects info.InvoiceNo
        info: JSON.stringify({
          InvoiceNo: invoice.number || invoice.id,
        }),
        terms_and_conditions_title:
          (invoice.vat_exemption_mention || "").length > 0
            ? "Termes et conditions"
            : "",
        terms_and_conditions: invoice.vat_exemption_mention,
      },
    ];

    // Load fonts with error handling
    let font: Font;
    try {
      font = {
        Roboto: {
          data: readFileSync(
            join(
              process.cwd(),
              "node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff",
            ),
          ),
          fallback: true,
        },
        "Roboto-Bold": {
          data: readFileSync(
            join(
              process.cwd(),
              "node_modules/@fontsource/roboto/files/roboto-latin-700-normal.woff",
            ),
          ),
        },
      };
    } catch (fontError) {
      console.error("Font loading error:", fontError);
      return NextResponse.json(
        {
          error:
            "PDF generation failed: Required font files are missing. Please contact support.",
          details:
            fontError instanceof Error
              ? fontError.message
              : "Font loading failed",
        },
        { status: 500 },
      );
    }

    const pdf = await generate({
      template: InvoiceTemplate as unknown as Template,
      inputs,
      plugins,
      options: { font },
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
    // Log detailed error for debugging
    console.error("PDF generation error:", e);

    // Determine error type and provide helpful user message
    let userMessage = "Failed to generate PDF. Please try again.";
    let statusCode = 500;

    if (e instanceof Error) {
      const errorMessage = e.message.toLowerCase();

      // Font loading errors
      if (errorMessage.includes("font") || errorMessage.includes("woff")) {
        userMessage =
          "PDF generation failed: Font files could not be loaded. Please contact support.";
        statusCode = 500;
      }
      // Template/generation errors
      else if (
        errorMessage.includes("template") ||
        errorMessage.includes("generate")
      ) {
        userMessage =
          "PDF generation failed: Invalid template configuration. Please contact support.";
        statusCode = 500;
      }
      // Storage/upload errors
      else if (
        errorMessage.includes("upload") ||
        errorMessage.includes("storage")
      ) {
        userMessage =
          "PDF was generated but could not be saved. Please try again.";
        statusCode = 500;
      }
      // Data validation errors
      else if (
        errorMessage.includes("invalid") ||
        errorMessage.includes("required")
      ) {
        userMessage = `PDF generation failed: ${e.message}`;
        statusCode = 400;
      }
      // Generic error with message
      else {
        userMessage = `Failed to generate PDF: ${e.message}`;
        statusCode = 500;
      }
    }

    return NextResponse.json(
      {
        error: userMessage,
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: statusCode },
    );
  }
}
