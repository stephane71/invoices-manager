import { ZodError, ZodIssue } from "zod";

/**
 * Field-specific error mapping for validation errors
 */
export type FieldErrors = {
  [field: string]: string;
};

/**
 * Standardized API error response
 */
export type ApiErrorResponse = {
  error: string;
  fields?: FieldErrors;
};

/**
 * Get a user-friendly error message from a Zod validation error
 * Returns a simple string for backwards compatibility
 */
export function getReadableErrorMessage(
  field: string,
  issue: ZodIssue,
): string {
  const code = issue.code;

  switch (code) {
    case "too_small":
      if (field === "name") {
        return "Name is required";
      }
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;

    case "invalid_format":
      // Check if it's an email format validation
      if ("format" in issue && issue.format === "email") {
        return "Please enter a valid email address";
      }
      return `Invalid ${field} format`;

    case "invalid_type":
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is invalid`;

    default:
      return `Invalid ${field}`;
  }
}

/**
 * Transform a Zod error into a user-friendly API error response
 * Supports both simple error string and field-level errors
 */
export function formatZodError(error: ZodError): ApiErrorResponse {
  const issues = error.issues;

  // If no issues, return generic error
  if (issues.length === 0) {
    return { error: "Validation failed" };
  }

  // Create field-level errors map
  const fieldErrors: FieldErrors = {};
  issues.forEach((issue) => {
    const field = issue.path[0]?.toString() || "unknown";
    fieldErrors[field] = getReadableErrorMessage(field, issue);
  });

  // Return the first error as the main error message for backwards compatibility
  const firstIssue = issues[0];
  const firstField = firstIssue.path[0]?.toString() || "unknown";
  const mainError = getReadableErrorMessage(firstField, firstIssue);

  return {
    error: mainError,
    fields: fieldErrors,
  };
}

/**
 * Handle API errors and return a properly formatted response
 * Detects ZodError and formats it appropriately
 */
export function handleApiError(e: unknown): ApiErrorResponse {
  if (e instanceof ZodError) {
    return formatZodError(e);
  }

  if (e instanceof Error) {
    return { error: e.message };
  }

  return { error: "Unknown error" };
}
