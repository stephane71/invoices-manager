import { z } from "zod";
import { isValidPhoneNumber } from "@/lib/utils";

export const clientFormSchema = z.object({
  name: z.string().min(1, "new.error.name"),
  email: z.email("new.error.email").or(z.literal("")),
  phone: z.string().refine((val) => isValidPhoneNumber(val), {
    message: "new.error.phone",
  }),
  address: z.string(),
});

export type ClientForm = z.infer<typeof clientFormSchema>;
