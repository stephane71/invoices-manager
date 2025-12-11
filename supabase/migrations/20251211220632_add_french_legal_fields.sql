-- Phase 1: Add Database Schema for French Legal Invoice Compliance
-- Related to issue #58 and parent issue #57
--
-- This migration adds mandatory fields for French legal invoice compliance:
-- 1. SIRET for profiles (issuer identification)
-- 2. SIREN for clients (recipient identification for B2B)
-- 3. Operation type for invoices (services/goods/mixed)
-- 4. VAT exemption mention for invoices (micro-enterprises)

-- ============================================================================
-- 1. Add SIRET to profiles table
-- ============================================================================
-- SIRET (Système d'Identification du Répertoire des Établissements) is a 14-digit
-- number that uniquely identifies a business establishment in France.
-- Format: 14 digits, optionally formatted as XXX XXX XXX XXXXX
-- Legal requirement: Code de commerce Article L123-22

ALTER TABLE public.profiles
ADD COLUMN siret TEXT;

-- Add constraint for format validation (14 digits, optional spaces)
ALTER TABLE public.profiles
ADD CONSTRAINT siret_format_check
CHECK (siret IS NULL OR siret ~ '^[0-9]{14}$' OR siret ~ '^[0-9]{3}\s[0-9]{3}\s[0-9]{3}\s[0-9]{5}$');

COMMENT ON COLUMN public.profiles.siret IS 'SIRET number (14 digits) - Mandatory for French invoices per Code de commerce Article L123-22';

-- ============================================================================
-- 2. Add SIREN to clients table
-- ============================================================================
-- SIREN (Système d'Identification du Répertoire des Entreprises) is a 9-digit
-- number that uniquely identifies a company in France.
-- Format: 9 digits, optionally formatted as XXX XXX XXX
-- Legal requirement: Required for B2B invoices as of 2024

ALTER TABLE public.clients
ADD COLUMN siren TEXT;

-- Add constraint for format validation (9 digits, optional spaces)
ALTER TABLE public.clients
ADD CONSTRAINT siren_format_check
CHECK (siren IS NULL OR siren ~ '^[0-9]{9}$' OR siren ~ '^[0-9]{3}\s[0-9]{3}\s[0-9]{3}$');

COMMENT ON COLUMN public.clients.siren IS 'SIREN number (9 digits) - Required for B2B invoices as of 2024';

-- ============================================================================
-- 3. Add operation_type to invoices table
-- ============================================================================
-- Operation type indicates whether the invoice is for services, goods, or mixed.
-- This is mandatory for French invoices as of 2024.
-- Values:
--   - 'services': Prestations de services (service provision)
--   - 'goods': Vente de biens (sale of goods)
--   - 'mixed': Opération mixte (both services and goods)

ALTER TABLE public.invoices
ADD COLUMN operation_type TEXT;

-- Add constraint for allowed values
ALTER TABLE public.invoices
ADD CONSTRAINT operation_type_check
CHECK (operation_type IN ('services', 'goods', 'mixed'));

COMMENT ON COLUMN public.invoices.operation_type IS 'Type of operation: services (prestations), goods (vente), or mixed - Required as of 2024';

-- ============================================================================
-- 4. Add vat_exemption_mention to invoices table
-- ============================================================================
-- For micro-enterprises or businesses with VAT exemption, a specific legal
-- mention must be included on invoices.
-- Common examples:
--   - "TVA non applicable, art. 293 B du CGI" (micro-enterprise)
--   - "Autoliquidation" (reverse charge)
--   - "Exonération de TVA, art. 262 I du CGI" (specific exemptions)

ALTER TABLE public.invoices
ADD COLUMN vat_exemption_mention TEXT;

COMMENT ON COLUMN public.invoices.vat_exemption_mention IS 'VAT exemption legal mention (e.g., "TVA non applicable, art. 293 B du CGI") - Mandatory for micro-enterprises';
