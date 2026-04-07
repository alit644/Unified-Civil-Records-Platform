import z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "يرجى إدخال اسم المستخدم").max(20, "اسم المستخدم يجب أن لا يتجاوز 20 حرف"),
  password: z.string().min(6, "يرجى إدخال كلمة المرور").max(20, "كلمة المرور يجب أن لا تتجاوز 20 حرف"),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const addEmployeeSchema = z.object({
  name: z.string().min(1, "يرجى إدخال اسم الموظف").max(20, "اسم الموظف يجب أن لا يتجاوز 20 حرف"),
  username: z.string().min(1, "يرجى إدخال اسم المستخدم").max(20, "اسم المستخدم يجب أن لا يتجاوز 20 حرف"),
  password: z.string().min(8, "كلمة المرور يجب أن لا تقل عن 8 أحرف").max(20, "كلمة المرور يجب أن لا تتجاوز 20 حرف"),
  role: z.enum(["OFFICER", "AUDITOR", "ADMIN"]),
});
export type AddEmployeeFormData = z.infer<typeof addEmployeeSchema>;

export const editEmployeeSchema = z.object({
  name: z.string().min(1, "يرجى إدخال اسم الموظف").max(20, "اسم الموظف يجب أن لا يتجاوز 20 حرف"),
  username: z.string().min(1, "يرجى إدخال اسم المستخدم").max(20, "اسم المستخدم يجب أن لا يتجاوز 20 حرف"),
  password: z.string().min(8, "كلمة المرور يجب أن لا تقل عن 8 أحرف").max(20, "كلمة المرور يجب أن لا تتجاوز 20 حرف").optional(),
  role: z.enum(["OFFICER", "AUDITOR", "ADMIN"]),
  isActive: z.boolean(),
});

export type EditEmployeeFormData = z.infer<typeof editEmployeeSchema>;