/**
 * Query keys for React Query
 * Consistent query keys for cache invalidation and management
 */

export const queryKeys = {
  // Clients
  clients: ["clients"] as const,
  client: (id: string) => ["clients", id] as const,

  // Invoices
  invoices: ["invoices"] as const,
  invoice: (id: string) => ["invoices", id] as const,

  // Products
  products: ["products"] as const,
  product: (id: string) => ["products", id] as const,

  // Profile
  profile: ["profile"] as const,
  profileValidation: ["profile", "validation"] as const,
};
