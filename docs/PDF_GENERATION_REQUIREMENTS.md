# PDF Invoice Generation Requirements

**Last Updated:** 2025-12-09
**Related Issue:** #12, #48
**Status:** Active

This document defines the legal requirements and validation rules for generating compliant PDF invoices in France.

---

## Table of Contents

1. [Legal Context](#legal-context)
2. [Mandatory Fields](#mandatory-fields)
3. [Profile Requirements](#profile-requirements)
4. [Client Requirements](#client-requirements)
5. [Invoice Requirements](#invoice-requirements)
6. [Validation Rules](#validation-rules)
7. [Implementation Checklist](#implementation-checklist)
8. [References](#references)

---

## Legal Context

### French Invoice Regulations (2025)

French law requires specific mandatory information on all invoices (factures) issued by businesses, including auto-entrepreneurs. These requirements are defined by:

- **Code de commerce** (Article L123-22)
- **Code général des impôts** (Article 293 B for VAT exemptions)
- **Service Public** guidelines for business invoicing

### E-Invoicing Transition

- **September 1, 2026**: Mandatory for large and mid-sized businesses
- **September 1, 2027**: Mandatory for all businesses (including micro-enterprises)
- **Retention period**: 10 years from date of issue

### Penalties for Non-Compliance

- **Fiscal fine**: €15 per missing or incorrect element (capped at 1/4 of invoice amount)
- **Criminal penalty**: Up to €75,000 for serious violations

---

## Mandatory Fields

### 1. Seller Information (Profile)

All invoices must include complete information about the business issuing the invoice.

| Field | Description | Example | Required |
|-------|-------------|---------|----------|
| **full_name** | Business name or individual name + "EI" | "Jean Dupont EI" | ✅ Yes |
| **address** | Complete business address | "12 rue de la Paix, 75002 Paris" | ✅ Yes |
| **SIRET** | Company registration number | "123 456 789 00012" | ✅ Yes* |
| **email** | Business contact email | "contact@example.fr" | ⚠️ Recommended |
| **phone** | Business contact phone | "+33612345678" | ⚠️ Recommended |

*Note: SIRET is currently not in the data model but should be added for full legal compliance.

### 2. Client Information

Minimum required information about the invoice recipient.

| Field | Description | Example | Required |
|-------|-------------|---------|----------|
| **name** | Client name (individual or company) | "ACME Corporation" | ✅ Yes |
| **address** | Client address | "1 rue du Commerce, 69001 Lyon" | ⚠️ Recommended |
| **SIREN** | Client SIREN (if B2B) | "987 654 321" | ⚠️ If B2B* |

*Note: SIREN requirement for B2B clients is mandatory as of 2024.

### 3. Invoice Details

Core information about the invoice itself.

| Field | Description | Example | Required |
|-------|-------------|---------|----------|
| **number** | Unique, sequential invoice number | "FACT-2025-001" | ✅ Yes |
| **issue_date** | Date the invoice was issued | "2025-12-09" | ✅ Yes |
| **due_date** | Payment due date | "2026-01-09" | ⚠️ Recommended |

### 4. Line Items

Details of goods or services provided.

| Field | Description | Example | Required |
|-------|-------------|---------|----------|
| **name** | Description of product/service | "Web Development Services" | ✅ Yes |
| **quantity** | Quantity provided | "10" (hours/units) | ✅ Yes |
| **price** | Unit price (in cents) | "5000" (50.00€) | ✅ Yes |
| **total** | Line total (in cents) | "50000" (500.00€) | ✅ Yes |

### 5. Tax Information

VAT/TVA related information.

| Field | Description | Example | Required |
|-------|-------------|---------|----------|
| **tax_rate** | VAT rate applied | "20" (20%) | ✅ Yes |
| **subtotal** | Amount before tax (in cents) | "100000" (1000.00€) | ✅ Yes |
| **tax_amount** | VAT amount (in cents) | "20000" (200.00€) | ✅ Yes |
| **total_amount** | Total including tax (in cents) | "120000" (1200.00€) | ✅ Yes |
| **vat_exemption** | TVA exemption mention | "TVA non applicable, art. 293 B du CGI" | ⚠️ If exempt |

### 6. Operation Type

New requirement as of 2024.

| Field | Description | Example | Required |
|-------|-------------|---------|----------|
| **operation_type** | Nature of transaction | "Services" / "Goods" / "Mixed" | ✅ Yes* |

*Note: Not yet implemented in current data model.

### 7. Payment Information

Payment terms and methods.

| Field | Description | Example | Required |
|-------|-------------|---------|----------|
| **payment_iban** | Bank account IBAN | "FR76 1234 5678 9012 3456 7890 123" | ⚠️ Recommended |
| **payment_bic** | Bank BIC code | "BNPAFRPPXXX" | ⚠️ Optional |
| **payment_link** | Payment link (e.g., PayPal) | "https://paypal.me/..." | ⚠️ Optional |
| **payment_free_text** | Custom payment instructions | "Chèque à l'ordre de..." | ⚠️ Optional |

---

## Profile Requirements

### Minimum Profile Completeness for PDF Generation

To generate a legally compliant invoice PDF, the user's profile **MUST** contain:

#### Critical Fields (PDF Generation Blocked Without These)

1. **full_name** (non-empty string)
   - Used as: Business/seller name on invoice
   - Validation: Minimum 2 characters
   - Example: "Jean Dupont" or "SARL Exemple"

2. **address** (non-empty string with specific format)
   - Used as: Business address on invoice
   - Format: "Street address, Postal code City"
   - Validation: Must contain at least one comma
   - Example: "12 rue de la Paix, 75002 Paris"

#### Recommended Fields

3. **email** (valid email format)
   - Used as: Contact information on invoice
   - Validation: Valid email format
   - Example: "contact@example.fr"

4. **phone** (valid phone number)
   - Used as: Contact information on invoice
   - Validation: International format preferred
   - Example: "+33612345678"

### Current Implementation Gap

The current profile schema (`src/lib/validation.ts:67-75`) makes most fields optional:

```typescript
export const profileSchema = z.object({
  id: z.uuid(),
  full_name: z.string().optional().nullable(),
  email: optionalEmail,
  phone: optionalPhone,
  address: z.string().optional().nullable(),
  payment_iban: z.string().optional().nullable(),
  payment_bic: z.string().optional().nullable(),
});
```

**Issue**: Users can create a profile with all fields empty, then attempt PDF generation, causing a crash at `src/app/api/invoices/[id]/pdf/route.ts:66` when parsing the address.

---

## Client Requirements

### Minimum Client Information for PDF Generation

1. **name** (non-empty string)
   - Used as: Client name on invoice
   - Validation: Minimum 1 character
   - Current: ✅ Already required in schema

2. **address** (recommended, not strictly required)
   - Used as: Client address on invoice
   - Current: ⚠️ Optional in schema

3. **email** or **phone** (at least one recommended)
   - Used as: Client contact information
   - Current: ⚠️ Both optional in schema

---

## Invoice Requirements

### Invoice Data Requirements

All invoice fields in the current schema are properly validated. Key requirements:

1. **number** (non-empty string)
   - Must be unique per account
   - Should follow sequential pattern
   - Current: ✅ Required

2. **issue_date** (valid date string)
   - Must be a valid date
   - Current: ✅ Required

3. **items** (non-empty array)
   - Must contain at least one item
   - Each item must have: name, quantity, price, total
   - Current: ✅ Validated

4. **total_amount** (positive integer in cents)
   - Must match sum of items + tax
   - Current: ✅ Validated

---

## Validation Rules

### Profile Validation Rules

```typescript
// Proposed validation function
type ProfileValidationResult = {
  isComplete: boolean;
  missingFields: string[];
  warnings: string[];
};

const validateProfileForPdfGeneration = (profile: Profile): ProfileValidationResult => {
  const missingFields: string[] = [];
  const warnings: string[] = [];

  // Critical fields
  if (!profile.full_name || profile.full_name.trim().length < 2) {
    missingFields.push("full_name");
  }

  if (!profile.address || !profile.address.includes(",")) {
    missingFields.push("address");
  }

  // Recommended fields
  if (!profile.email) {
    warnings.push("email");
  }

  if (!profile.phone) {
    warnings.push("phone");
  }

  return {
    isComplete: missingFields.length === 0,
    missingFields,
    warnings,
  };
};
```

### Address Validation Rules

Current implementation expects address in format: `"Street, City"`

**Problems:**
- No validation when user enters address
- No structured format (separate fields)
- Brittle parsing logic

**Recommended solution** (See issue #49):
- Split address into separate fields: `street`, `postal_code`, `city`
- Validate each field individually
- Construct formatted address for PDF generation

### Field-Specific Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| full_name | Min 2 chars, non-empty | "Full name is required (minimum 2 characters)" |
| address | Contains comma, min 10 chars | "Address must be in format: Street, Postal Code City" |
| email | Valid email format | "Invalid email format" |
| phone | Valid phone number (international) | "Invalid phone number. Use international format (e.g., +33612345678)" |
| IBAN | Valid IBAN format (if provided) | "Invalid IBAN format" |

---

## Implementation Checklist

### Immediate Actions (Issue #52)

- [ ] Add try-catch around address parsing in PDF generation
- [ ] Return user-friendly error when profile incomplete
- [ ] Log errors for debugging

### Short-term (Issues #49, #50, #51)

- [ ] Create `validateProfileForPdfGeneration()` utility function
- [ ] Add profile completeness check before PDF generation
- [ ] Display profile completion status on invoice page
- [ ] Block PDF generation button when profile incomplete
- [ ] Show helpful error messages with missing fields
- [ ] Provide link to profile page for quick completion

### Medium-term (Future enhancements)

- [ ] Add SIRET field to profile schema
- [ ] Add SIREN field to client schema
- [ ] Add operation_type field to invoice schema
- [ ] Split address into structured fields (street, postal_code, city)
- [ ] Implement full TVA exemption mention logic
- [ ] Add invoice template compliance verification

### Long-term (E-invoicing preparation)

- [ ] Implement UBL/CII/Factur-X format export
- [ ] Add delivery address field (if different from client address)
- [ ] Implement PDP (Partner Dematerialization Platform) integration
- [ ] Add 10-year archiving system
- [ ] Implement electronic signature for invoices

---

## References

### Legal References

1. **Service Public - Mentions obligatoires sur une facture**
   https://entreprendre.service-public.gouv.fr/vosdroits/F31808

2. **Service Public - Annuler ou rectifier une facture**
   https://entreprendre.service-public.gouv.fr/vosdroits/F23208

3. **Code de commerce** - Article L123-22 (10-year retention)

4. **Code général des impôts** - Article 293 B (TVA exemption)

### E-Invoicing Resources

1. **Comarch - Mandatory B2B E-invoicing in France [2025 Requirements]**
   https://www.comarch.com/trade-and-services/data-management/e-invoicing/e-invoicing-in-france/

2. **Qonto - Mandatory electronic invoices in 2025**
   https://qonto.com/en/blog/trend-news/business-finance/mandatory-electronic-invoices-2024

3. **Eurofiscalis - Invoicing in France**
   https://www.eurofiscalis.com/en/invoicing-in-france/

### Internal Documentation

- **CLAUDE.md** - AI assistant guide for InvoEase
- **docs/QUICK_REFERENCE.md** - Quick reference guide
- **supabase/MIGRATIONS.md** - Database migration guide

---

**Document Ownership:** Development Team
**Review Cycle:** Quarterly (or when French law changes)
**Next Review:** 2025-03-09
