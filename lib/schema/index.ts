import z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "يرجى إدخال اسم المستخدم").max(20, "اسم المستخدم يجب أن لا يتجاوز 20 حرف"),
  password: z.string().min(6, "يرجى إدخال كلمة المرور").max(20, "كلمة المرور يجب أن لا تتجاوز 20 حرف"),
});
export type LoginFormData = z.infer<typeof loginSchema>;
