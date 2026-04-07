"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, X, User, Lock, Shield } from "lucide-react";
import { Column, DataTable } from "@/components/DataTable";
import { Employee } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FieldGroup,
} from "@/components/ui/field";
import RHFField from "@/components/FormFieldWrapper";
import { AddEmployeeFormData, addEmployeeSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { addEmployee } from "@/actions/employee";
import { notify } from "@/lib/notify";
import { Role } from "@/lib/generated/prisma/enums";

const roleBadge = (r: Role) => {
  if (r === Role.ADMIN) return "badge-blue";
  if (r === Role.OFFICER) return "badge-orange";
  if (r === Role.AUDITOR) return "badge-purple";
  return "badge-gray";
};

interface EmployeeManagerProps {
  initialEmployees: Employee[];
}

export default function EmployeeManager({
  initialEmployees,
}: EmployeeManagerProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [employees, setEmployees] = useState(initialEmployees);
  const form = useForm<AddEmployeeFormData>({
    resolver: zodResolver(addEmployeeSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      role: "OFFICER",
    },
  });

  const toggleStatus = (index: number) => {
    const updated = [...employees];
    updated[index].isActive = updated[index].isActive === true ? false : true;
    setEmployees(updated);
  };
  const closeDrawer = () => {
    setDrawerOpen(false)
    form.reset()
  }
  const columns: Column<Employee>[] = [
    {
      key: "name",
      header: "اسم الموظف",
      render: (e) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
            {e.name.charAt(0)}
          </div>
          <span className="font-medium">{e.name}</span>
        </div>
      ),
    },
    {
      key: "username",
      header: "اسم المستخدم",
      render: (e) => (
        <span className="font-mono text-xs text-muted-foreground">
          {e.email.split('@')[0]}
        </span>
      ),
    },
    {
      key: "role",
      header: "الدور",
      render: (e) => <span className={roleBadge(e.role)}>{e.role}</span>,
    },
    {
      key: "status",
      header: "الحالة",
      render: (e) => (
        <span className={e.isActive === true ? "badge-active" : "badge-danger"}>
          {e.isActive ? "نشط" : "موقوف"}
        </span>
      ),
    },
    {
      key: "events",
      header: "المعاملات",
      render: (e) => <span className="text-muted-foreground">{e._count.civilEvents}</span>,
    },
    {
      key: "docs",
      header: "الوثائق",
      render: (e) => <span className="text-muted-foreground">{e._count.documents}</span>,
    },
    {
      key: "actions",
      header: "الإجراءات",
      render: (e) => (
        <div className="flex gap-1">
          <button className="px-2 py-1 rounded border text-xs hover:bg-secondary/50 transition-colors">
            تعديل الدور
          </button>
          <button
            onClick={() => toggleStatus(Number(e.id))}
            className={`px-2 py-1 rounded border text-xs hover:bg-secondary/50 transition-colors ${e.isActive === true ? "text-[hsl(var(--status-red-text))]" : "text-primary"}`}
          >
            {e.isActive === true ? "تعطيل" : "تفعيل"}
          </button>
        </div>
      ),
    },
  ];


  // handle submit
  const onSubmit = async (data: AddEmployeeFormData) => {
    const result = await addEmployee(data);
    if (!result.success) {
      notify(result.message, "error");
    } else {
      notify(result.message, "success");
      closeDrawer()
    }
  };

  return (
    <div className="space-y-6">
      {/* Table Section */}
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-5 border-b flex items-center justify-between">
          <h4 className="font-bold">الموظفون</h4>
          <button
            onClick={() => setDrawerOpen(true)}
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> إضافة موظف جديد
          </button>
        </div>
        <DataTable columns={columns} data={employees} />
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
          <div
            className="flex-1 bg-foreground/30 backdrop-blur-[2px]"
            onClick={closeDrawer}
          />
          <div className="w-full max-w-md bg-card shadow-xl px-6 py-4 border-r overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b flex mb-4 items-center justify-between">
              <h3 className="text-lg font-bold">إضافة موظف جديد</h3>
              <button
                onClick={closeDrawer}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
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
                  render={({ field, fieldState }) => (
                    <div className="relative">
                      <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full pr-10 h-11">
                          <SelectValue placeholder="اختر الدور" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OFFICER">
                            مدخل بيانات
                          </SelectItem>
                          <SelectItem value="AUDITOR">مدقق</SelectItem>
                          <SelectItem value="ADMIN">مشرف</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />


                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full h-11 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 mt-4 transition-opacity shadow-lg shadow-primary/20"
                >
                  {
                    form.formState.isSubmitting ? "جاري الإضافة..." : "إنشاء الحساب"
                  }
                </Button>
              </FieldGroup>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
