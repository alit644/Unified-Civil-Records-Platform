import { Badge } from "@/components/ui/badge";
import { AUDIT_ACTION_MAP, DOCUMENT_TYPE_MAP, EVENT_STATUS_MAP, EVENT_TYPE_MAP, MARITAL_STATUS_MAP, ROLE_MAP, STATUS_CITIZEN_MAP, STATUS_MAP } from "@/lib/mappings";
import { cn } from "@/lib/utils";

// تحديد الأنواع المدعومة
type BadgeCategory = "audit" | "role" | "status" | "marital" | "status_citizen" | "event_type" | "event_status" | "document_type";

interface StatusBadgeProps {
  value: string | boolean; 
  category: BadgeCategory;
  className?: string; 
}

export function StatusBadge({ value, category, className }: StatusBadgeProps) {
  // تحويل القيمة المنطقية (Boolean) لنص إذا كان نوعها status (لحالة الموظف)
  const stringValue = typeof value === "boolean" 
    ? (value ? "ACTIVE" : "INACTIVE") 
    : String(value).toUpperCase();

  // اختيار القاموس المناسب بناءً على الفئة
  let mapData;
  switch (category) {
    case "audit":
      mapData = AUDIT_ACTION_MAP[stringValue];
      break;
    case "role":
      mapData = ROLE_MAP[stringValue];
      break;
    case "status":
      mapData = STATUS_MAP[stringValue];
      break;
    case "marital":
      mapData = MARITAL_STATUS_MAP[stringValue];
      break;
    case "status_citizen":
      mapData = STATUS_CITIZEN_MAP[stringValue];
      break;
    case "event_type":
      mapData = EVENT_TYPE_MAP[stringValue];
      break;
    case "event_status":
      mapData = EVENT_STATUS_MAP[stringValue];
      break;
    case "document_type":
      mapData = DOCUMENT_TYPE_MAP[stringValue];
      break;
  }

  // إذا لم يجد القيمة في القاموس، يعرض القيمة الأصلية بتنسيق افتراضي (Fallback)
  if (!mapData) {
    return (
      <Badge variant="outline" className={cn("font-medium ", className)}>
        {stringValue}
      </Badge>
    );
  }

  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium border shadow-sm py-3" , mapData.color, className)}
    >
      {mapData.label}
    </Badge>
  );
}