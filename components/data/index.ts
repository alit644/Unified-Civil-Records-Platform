import { FolderOpen, FileText, Download, Users, ClipboardList, AlertCircle, Baby, Heart, Scale, Skull, UserCheck } from "lucide-react";

export const statsData = [
  {
    icon: FolderOpen,
    label: "إجمالي الملفات المؤرشفة",
    value: "٤٥٬٢٣١",
  },
  {
    icon: FileText,
    label: "ملفات هذا الشهر",
    value: "٣٤٧",
  },
  {
    icon: Download,
    label: "عمليات تحميل اليوم",
    value: "٢٣",
  },
]

export const metricsData = [
  { icon: Users, label: "إجمالي المواطنين المسجلين", value: "١٢٤٬٨٥٦", sub: "٢٣٤ جديد هذا الشهر", arrow: true },
  { icon: ClipboardList, label: "واقعات مسجلة اليوم", value: "١٢", sub: "٣ ولادات، ٢ زيجات، ١ وفاة" },
  { icon: FileText, label: "وثائق صادرة اليوم", value: "١٨٧", sub: "" },
  { icon: AlertCircle, label: "معاملات بانتظار التدقيق", value: "٢٣", sub: "تتطلب مراجعة", amber: true },
]
export const EventStatsData = [
  { label: "ولادات هذا الشهر", value: "٨٩", icon: Baby },
  { label: "زيجات هذا الشهر", value: "٤٣", icon: Heart },
  { label: "طلاق هذا الشهر", value: "١٢", icon: Scale },
  { label: "وفيات هذا الشهر", value: "٢٨", icon: Skull },
];

