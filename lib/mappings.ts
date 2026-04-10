// 1. قاموس إجراءات سجل النشاطات (Audit Logs)
export const AUDIT_ACTION_MAP: Record<string, { label: string; color: string }> = {
  CREATE: { label: "إضافة", color: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200" },
  UPDATE: { label: "تعديل", color: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200" },
  DELETE: { label: "حذف", color: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200" },
  STATUS_CHANGE: { label: "تغيير حالة", color: "bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200" },
  LOGIN: { label: "تسجيل دخول", color: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200" },
  CREATE_CITIZEN: { label: "إضافة مواطن", color: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200" },
};

// 2. قاموس أدوار الموظفين (Roles)
export const ROLE_MAP: Record<string, { label: string; color: string }> = {
  ADMIN: { label: "مشرف", color: "bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200" },
  OFFICER: { label: "مدخل بيانات", color: "bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200" },
  AUDITOR: { label: "مدقق", color: "bg-teal-100 text-teal-800 hover:bg-teal-100 border-teal-200" },
};

// 3. قاموس حالة الحساب (Status)
export const STATUS_MAP: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "نشط", color: " bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200" },
  INACTIVE: { label: "موقوف", color: " bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200" },
};

export const MARITAL_STATUS_MAP: Record<string, { label: string; color: string }> = {
  SINGLE: { label: "أعزب", color: " bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200" },
  MARRIED: { label: "متزوج", color: " bg-green-100 text-green-800 hover:bg-green-100 border-green-200" },
  DIVORCED: { label: "مطلق", color: " bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200" },
  WIDOWED: { label: "أرمل", color: " bg-red-100 text-red-800 hover:bg-red-100 border-red-200" },
};
export const STATUS_CITIZEN_MAP: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "نشط", color: " bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200" },
  INACTIVE: { label: "موقوف", color: " bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200" },
  PENDING: { label: "بانتظار التدقيق", color: " bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200" },
  DECEASED: { label: "متوفى", color: " bg-red-100 text-red-800 hover:bg-red-100 border-red-200" },
};