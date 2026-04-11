import z from "zod";
import { EventType } from "../generated/prisma/enums";

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
  password: z.string().min(8, "كلمة المرور يجب أن لا تقل عن 8 أحرف").max(20, "كلمة المرور يجب أن لا تتجاوز 20 حرف").optional().or(z.literal("")),
  role: z.enum(["OFFICER", "AUDITOR", "ADMIN"]),
  isActive: z.boolean(),
});

export type EditEmployeeFormData = z.infer<typeof editEmployeeSchema>;

export const citizenSchema = z.object({
  // هوية
  nationalId: z
    .string()
    .min(10, "الرقم الوطني يجب أن يكون 10 أرقام على الأقل")
    .max(20, "الرقم الوطني طويل جداً")
    .regex(/^\d+$/, "الرقم الوطني يجب أن يحتوي على أرقام فقط").optional().or(z.literal("")),

  // البيانات الشخصية
  firstName: z.string().min(2, "الاسم الأول مطلوب (حرفان على الأقل)"),
  lastName: z.string().min(2, "الكنية / العائلة مطلوبة"),
  fatherName: z.string().min(2, "اسم الأب مطلوب"),
  motherName: z.string().min(2, "اسم الأم مطلوب"),

  // تفاصيل الولادة
  placeOfBirth: z.string().min(2, "مكان الولادة مطلوب"),
  dateOfBirth: z.string().min(1, "تاريخ الولادة مطلوب"),

  // تفاصيل القيد
  registryPlace: z.string().min(2, "مكان القيد مطلوب"),
  registryNumber: z.string().min(1, "رقم القيد مطلوب"),
  familyBookId: z.string().optional(),

  // الحالة الشخصية
  gender: z.enum(["MALE", "FEMALE"]),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]),
  status: z.enum(["ACTIVE", "PENDING", "DECEASED", "INACTIVE"]),
  religion: z.string().optional(),
  currentAddress: z.string().optional(),
});

export type CitizenFormValues = z.infer<typeof citizenSchema>;

export const eventSchema = z.object({
  eventType: z.enum(EventType),
  documentNumber: z.string().min(3, "رقم الوثيقة مطلوب"),
  location: z.string().min(3 , "اسم المستفشى مطلوب"),
  notes: z.string().optional(),
  
  // Birth specific fields (Main Focus)
  babyFirstName: z.string().min(1, "اسم المولود مطلوب"),
  babyGender: z.enum(["MALE", "FEMALE"], { error: "يجب اختيار الجنس" }),
  birthDate: z.string().min(1, "تاريخ الولادة مطلوب"),
  placeOfBirth: z.string().min(1, "مكان الولادة مطلوب"),

  fatherNationalId: z.string().length(11, "يجب أن يكون الرقم الوطني للأب 11 رقم"),
  motherNationalId: z.string().length(11, "يجب أن يكون الرقم الوطني للأم 11 رقم"),

});

export type FormValues = z.infer<typeof eventSchema>;