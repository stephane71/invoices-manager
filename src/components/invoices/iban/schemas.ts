import { z } from "zod";

export const ibanBicSchema = z.object({
  paymentIban: z.string().optional().or(z.literal("")),
  paymentBic: z.string().optional().or(z.literal("")),
});

export type IbanBicForm = z.infer<typeof ibanBicSchema>;
