/**
 * Build payment information sections for invoice PDF generation
 * @param paymentData - Payment information from invoice
 * @returns String with payment information, separated by newlines
 */
export function buildPaymentInfo(paymentData: {
  payment_iban?: string | null;
  payment_bic?: string | null;
  payment_link?: string | null;
  payment_free_text?: string | null;
}) {
  const paymentInfoParts: string[] = [];

  if (paymentData.payment_iban || paymentData.payment_bic) {
    const bankTransferLines = ["Par virement bancaire"];
    if (paymentData.payment_iban) {
      bankTransferLines.push(`IBAN:  ${paymentData.payment_iban}`);
    }
    if (paymentData.payment_bic) {
      bankTransferLines.push(`BIC:     ${paymentData.payment_bic}`);
    }
    paymentInfoParts.push(bankTransferLines.join("\n"));
  }

  if (paymentData.payment_link) {
    paymentInfoParts.push(`Via le lien suivant\n${paymentData.payment_link}`);
  }

  if (paymentData.payment_free_text) {
    paymentInfoParts.push(paymentData.payment_free_text);
  }

  return paymentInfoParts.join("\n\n");
}
