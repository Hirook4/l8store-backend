import z from "zod";

export const addAddressSchema = z.object({
  country: z.string(),
  state: z.string(),
  city: z.string(),
  zipCode: z.string(),
  street: z.string(),
  number: z.string(),
  complement: z.string().optional(),
});
