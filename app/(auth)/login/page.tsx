"use client";
import { Controller } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, User, Shield } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldContent,
  FieldGroup,
} from "@/components/ui/field";
import { useLogin } from "@/hooks/useLogin";

const Login = () => {
  const { form, loading, error, handleLogin } = useLogin();
  const year = new Date().getFullYear();
  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background:
          "linear-gradient(135deg, hsl(160 90% 16%) 0%, hsl(162 90% 20%) 50%, hsl(160 70% 22%) 100%)",
      }}
    >
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-cairo">
              السجل المدني الرقمي الموحد
            </h1>
            <p className="text-sm text-white/70 mt-1">
              دائرة الأحوال المدنية والجوازات
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-2xl">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                تسجيل دخول الموظفين
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                أدخل بيانات الاعتماد الخاصة بك
              </p>
            </div>

            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-5"
            >
              <FieldGroup>
                <Controller
                  name="username"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="username">اسم المستخدم</FieldLabel>
                      <FieldContent>
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
                      </FieldContent>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password">كلمة المرور</FieldLabel>
                      <FieldContent>
                        <div className="relative">
                          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            {...field}
                            id="password"
                            type="password"
                            placeholder="أدخل كلمة المرور"
                            className="pr-10 h-11 text-sm"
                            autoComplete="current-password"
                            aria-invalid={fieldState.invalid}
                          />
                        </div>
                      </FieldContent>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 rounded-md p-3 text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="default"
                className="w-full h-11 text-sm font-semibold"
                disabled={loading}
              >
                {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                في حال نسيان كلمة المرور، يرجى التواصل مع مسؤول النظام
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-white/50">
          السحل المدني الرقمي الموحد - {year} جميع الحقوق محفوظة ©
        </p>
      </div>
    </div>
  );
};

export default Login;
