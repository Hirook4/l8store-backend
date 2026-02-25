import z from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "name is too short"),
  email: z.email("invalid email address"),
  password: z.string().min(6, "password must be at least 6 characters long"),
});
