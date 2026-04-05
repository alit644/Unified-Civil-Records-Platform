import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AuditFilters() {
  return (
    <div className="bg-card rounded-lg border p-5 shadow-sm flex flex-wrap gap-4 items-end">
      <div className="grid gap-1.5">
        <Label className="text-xs text-muted-foreground">من تاريخ</Label>
        <Input
          type="text"
          placeholder="يوم/شهر/سنة"
          className="h-9 w-36"
        />
      </div>
      <div className="grid gap-1.5">
        <Label className="text-xs text-muted-foreground">إلى تاريخ</Label>
        <Input
          type="text"
          placeholder="يوم/شهر/سنة"
          className="h-9 w-36"
        />
      </div>
      <div className="grid gap-1.5">
        <Label className="text-xs text-muted-foreground">الموظف</Label>
        <Select>
          <SelectTrigger className="h-9 w-40">
            <SelectValue placeholder="جميع الموظفين" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الموظفين</SelectItem>
            <SelectItem value="ahmed">م. أحمد الخالدي</SelectItem>
            <SelectItem value="sara">سارة الحسن</SelectItem>
            <SelectItem value="nour">نور العلي</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label className="text-xs text-muted-foreground">نوع الإجراء</Label>
        <Select>
          <SelectTrigger className="h-9 w-40">
            <SelectValue placeholder="الكل" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            <SelectItem value="add_citizen">أضاف مواطن</SelectItem>
            <SelectItem value="edit_data">عدّل بيانات</SelectItem>
            <SelectItem value="issue_doc">أصدر وثيقة</SelectItem>
            <SelectItem value="register_event">سجّل واقعة</SelectItem>
            <SelectItem value="approve">وافق</SelectItem>
            <SelectItem value="reject">رفض</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label className="text-xs text-muted-foreground">الجدول المتأثر</Label>
        <Select>
          <SelectTrigger className="h-9 w-40">
            <SelectValue placeholder="الكل" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            <SelectItem value="citizens">citizens</SelectItem>
            <SelectItem value="civil_events">civil_events</SelectItem>
            <SelectItem value="documents">documents</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button size="sm" className="h-9 px-5">تطبيق الفلترة</Button>
    </div>
  );
}
