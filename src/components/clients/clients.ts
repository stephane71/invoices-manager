import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const clientFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email").or(z.literal("")),
  phone: z.string().refine((val) => !val || isValidPhoneNumber(val), {
    message: "Invalid phone number format",
  }),
  address: z.string(),
});

export type ClientForm = z.infer<typeof clientFormSchema>;
