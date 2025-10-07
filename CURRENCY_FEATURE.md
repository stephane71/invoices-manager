# Currency Feature Implementation

## Overview
This implementation adds currency support to user accounts in the invoices manager application.

## Changes Made

### 1. Database Schema
- Added `currency` field to the `profiles` table (default: 'EUR')
- Migration SQL provided in `MIGRATION_CURRENCY.sql`

### 2. Type Definitions
- Updated `Profile` type in `src/types/models.ts` to include optional `currency` field

### 3. API Routes
- Updated `PUT /api/profile` to accept and store the `currency` field

### 4. User Interface
- Added currency select dropdown in the profile page (`src/app/(app)/profil/page.tsx`)
- Currently supports EUR (Euro) only, as per requirements
- Select is styled consistently with other form fields

### 5. Currency Display Throughout App
- **Invoice List Page**: Uses profile currency for displaying invoice totals
- **Invoice Detail Page**: Uses profile currency for displaying all prices (total, item prices, item totals)
- **New Invoice Page**: Uses profile currency in the total display and ArticlesBlock component
- **PDF Generation**: Uses profile currency when formatting prices in generated invoices

### 6. Translations
- Added currency-related labels in both English and French translation files
  - `Profile.form.currency`: "Currency" / "Devise"
  - `Profile.form.currencyPlaceholder`: "Select currency" / "Sélectionner la devise"

## Migration Instructions

1. Run the SQL migration in your Supabase dashboard:
   ```bash
   # Copy and paste the contents of MIGRATION_CURRENCY.sql into your Supabase SQL editor
   ```

2. The migration adds a `currency` column to the `profiles` table with a default value of 'EUR'

3. Existing users will automatically get 'EUR' as their default currency

## Usage

### For Users
1. Navigate to the Profile page (Mon profil / My profile)
2. Select your preferred currency from the "Currency" dropdown
3. Currently, only Euro (EUR) is available
4. Click "Save" to update your profile
5. All invoices and prices throughout the app will now display in your selected currency

### For Developers
To add support for additional currencies in the future:

1. Update the currency select in `src/app/(app)/profil/page.tsx`:
   ```tsx
   <SelectContent>
     <SelectItem value="EUR">Euro (EUR)</SelectItem>
     <SelectItem value="USD">US Dollar (USD)</SelectItem>
     <SelectItem value="GBP">British Pound (GBP)</SelectItem>
     <!-- Add more currencies as needed -->
   </SelectContent>
   ```

2. The `numberToCurrency` utility function in `src/lib/utils.ts` already supports any ISO 4217 currency code

3. No other code changes are required - the currency is automatically used throughout the app

## Technical Details

### Currency Formatting
The app uses the `numberToCurrency` helper function which leverages JavaScript's `Intl.NumberFormat` API. This ensures:
- Proper currency symbols
- Correct decimal places
- Locale-appropriate formatting

### Default Behavior
- If a user has not set a currency, 'EUR' is used as the default
- If the profile fetch fails, 'EUR' is used as the fallback
- This ensures the app always has a valid currency to display

## Testing Recommendations

1. **Profile Page**:
   - Verify currency dropdown is visible
   - Verify EUR is pre-selected for existing users
   - Verify changes are saved correctly

2. **Invoice Pages**:
   - Create a new invoice and verify currency is displayed correctly
   - View existing invoices and verify currency is displayed correctly
   - Generate PDF and verify currency is used in the document

3. **Currency Symbol**:
   - Verify the correct currency symbol (€) is displayed in all locations
   - Test with other currencies if added in the future

## Files Modified

- `src/types/models.ts` - Added currency field to Profile type
- `src/app/api/profile/route.ts` - Accept currency in PUT request
- `src/app/(app)/profil/page.tsx` - Added currency select UI
- `src/app/(app)/invoices/page.tsx` - Use profile currency for list display
- `src/app/(app)/invoices/[id]/page.tsx` - Use profile currency for detail display
- `src/app/(app)/invoices/new/page.tsx` - Use profile currency for new invoice
- `src/components/invoices/ArticlesBlock.tsx` - Accept and display currency
- `src/app/api/invoices/[id]/pdf/route.ts` - Use profile currency in PDF generation
- `messages/en.json` - Added English translations
- `messages/fr.json` - Added French translations

## New Files

- `MIGRATION_CURRENCY.sql` - Database migration script
- `CURRENCY_FEATURE.md` - This documentation file
