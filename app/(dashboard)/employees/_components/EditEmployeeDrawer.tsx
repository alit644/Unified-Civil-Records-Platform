"use client";
import { Lock, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Employee } from "@/types";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import RHFField from "@/components/FormFieldWrapper";
import { EditEmployeeFormData, editEmployeeSchema } from "@/lib/schema";
import { notify } from "@/lib/notify";
import { editEmployeeDetails } from "@/actions/employee";

interface EditEmployeeDrawerProps {
  open?: boolean;
  onClose?: () => void;
  selectedEmployee: Employee;
}

export default function EditEmployeeDrawer({
  open = false,
  onClose,
  selectedEmployee,
}: EditEmployeeDrawerProps) {
  const form = useForm<EditEmployeeFormData>({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: {
      name: selectedEmployee?.name,
      username: selectedEmployee?.email.split("@")[0],
      password: "",
      role: selectedEmployee?.role,
      isActive: selectedEmployee?.isActive,
    },
  });

    const onSubmit = async (data: EditEmployeeFormData) => {
      const result = await editEmployeeDetails(selectedEmployee.id, data);
        if (!result.success) {
          notify(result.message, "error");
        } else {
          notify(result.message, "success");
          form.reset();
          // onClose();
        }
    
    };

  return (
    <Drawer open={open} onClose={onClose} direction="right">
      <DrawerContent className="max-w-md overflow-y-auto px-6 py-4">
        <DrawerHeader className="mb-4 border-b px-0">
          <DrawerTitle className="text-lg font-bold">
            تعديل بيانات الموظف
          </DrawerTitle>
          <DrawerDescription className="pb-4 text-sm text-muted-foreground">
            حدّث معلومات الحساب والصلاحيات من هنا قبل حفظ التغييرات.
          </DrawerDescription>
        </DrawerHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <RHFField
              control={form.control}
              name="name"
              label="الاسم الكامل"
              render={({ field, fieldState }) => (
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    placeholder="أدخل اسم الموظف"
                    className="pr-10 h-11 text-sm"
                    aria-invalid={fieldState.invalid}
                  />
                </div>
              )}
            />
            <RHFField
              control={form.control}
              name="username"
              label="اسم المستخدم"
              render={({ field, fieldState }) => (
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...field}
                    id="username"
                    type="text"
                    placeholder="أدخل اسم المستخدم"
                    className="pr-10 h-11 text-sm"
                    autoComplete="username"
                    aria-invalid={fieldState.invalid}
                  />
                </div>
              )}
            />
            <RHFField
              control={form.control}
              name="password"
              label="كلمة المرور"
              description="  ستُستخدم كلمة المرور الحالية إذا لم يتم إدخال واحدة جديدة."
              render={({ field, fieldState }) => (
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="أدخل كلمة مرور الجديد (اختياري)"
                    className="pr-10 h-11 text-sm"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                  />
                </div>
              )}
            />
            <RHFField
              control={form.control}
              name="role"
              label="الدور"
              render={({ field }) => (
                <div className="relative">
                  <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full pr-10 h-11">
                      <SelectValue placeholder="اختر الدور" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OFFICER">مدخل بيانات</SelectItem>
                      <SelectItem value="AUDITOR">مدقق</SelectItem>
                      <SelectItem value="ADMIN">مشرف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
              <RHFField
              control={form.control}
              name="isActive"
              label="حالة الحساب"
              render={({ field }) => (
                <div className="relative">
                  <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Select value={String(field.value)} onValueChange={(value) => field.onChange(value === "true")} disabled={selectedEmployee.role === "ADMIN"}>
                    <SelectTrigger className="w-full pr-10 h-11">
                      <SelectValue placeholder="حالة الحساب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">نشط</SelectItem>
                      <SelectItem value="false">موقوف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </FieldGroup>

          <div className="rounded-xl border bg-muted/30 p-4 my-4">
            <h4 className="mb-1 text-sm font-semibold">ملخص سريع</h4>
            <p className="text-sm leading-6 text-muted-foreground">
              راجع الاسم واسم المستخدم والدور قبل الحفظ، لأن هذه البيانات تظهر
              في سجلات النظام وشاشات المتابعة.
            </p>
          </div>

          <DrawerFooter className="px-0 pt-0">
            <Button
              type="submit"
              className="h-11 w-full shadow-lg shadow-primary/20"
            >
              حفظ التعديلات
            </Button>
            <DrawerClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full"
                onClick={onClose}
              >
                إلغاء
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
