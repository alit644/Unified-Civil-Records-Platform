"use client";

import { User, Lock, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldGroup } from "@/components/ui/field";
import RHFField from "@/components/FormFieldWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { AddEmployeeFormData, addEmployeeSchema } from "@/lib/schema";
import { addEmployee } from "@/actions/employee";
import { notify } from "@/lib/notify";
import { Employee } from "@/types";

interface AddEmployeeDrawerProps {
  open: boolean;
  onClose: () => void;
  onAdded?: (employee: Employee) => void;
}

export default function AddEmployeeDrawer({
  open,
  onClose,
  onAdded,
}: AddEmployeeDrawerProps) {
  const form = useForm<AddEmployeeFormData>({
    resolver: zodResolver(addEmployeeSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      role: "OFFICER",
    },
  });

  const onSubmit = async (data: AddEmployeeFormData) => {
    const result = await addEmployee(data);
    if (!result.success) {
      notify(result.message, "error");
    } else {
      notify(result.message, "success");
      if (result.employee) {
        onAdded?.(result.employee);
      }
      form.reset();
      onClose();
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Drawer open={open} onClose={handleClose} direction="right">
      <DrawerContent className="max-w-md px-6 py-4 overflow-y-auto">
        <DrawerHeader className="px-0 border-b mb-4">
             <DrawerTitle className="text-lg font-bold">إضافة موظف جديد</DrawerTitle>
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
              render={({ field, fieldState }) => (
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...field}
                    id="password"
                    type="password"
                     placeholder="أدخل كلمة مرور مؤقتة"
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
          </FieldGroup>

          <DrawerFooter className="px-0 pt-4">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full h-11 shadow-lg shadow-primary/20"
            >
              {form.formState.isSubmitting ? "جاري الإضافة..." : "إنشاء الحساب"}
            </Button>
            <DrawerClose asChild>
              <Button disabled={form.formState.isSubmitting} type="button" variant="outline" className="w-full h-11" onClick={handleClose}>
                إلغاء
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
