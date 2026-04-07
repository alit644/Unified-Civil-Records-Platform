
"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, User, Mail, Shield, Building } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldContent,
  FieldGroup,
} from "@/components/ui/field";
import { z } from "zod";
import { signUp } from "@/lib/auth-client";

const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setError("");
      setLoading(true);

      const result = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        setError(result.error.message || "فشل إنشاء الحساب");
        console.log("Registration error:", result.error);
        return;
      }

      // Registration successful
      console.log("Registration successful:", result);
      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "حدث خطأ ما");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
          <div className="text-center space-y-3">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30 flex items-center justify-center">
              <Shield className="w-10 h-10 text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white font-cairo">
                تم إنشاء الحساب بنجاح
              </h1>
              <p className="text-sm text-white/70 mt-1">
                حسابك تم إنشاؤه وينتظر موافقة مسؤول النظام
              </p>
            </div>
          </div>

          <Card className="border-0 shadow-2xl">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  تم إنشاء حسابك بنجاح في النظام. سيقوم مسؤول النظام بمراجعة طلبك وتفعيل حسابك قريباً.
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full"
                >
                  العودة لتسجيل الدخول
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            <Building className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-cairo">
              طلب إنشاء حساب موظف
            </h1>
            <p className="text-sm text-white/70 mt-1">
              دائرة الأحوال المدنية والجوازات
            </p>
          </div>
        </div>

        {/* Register Card */}
        <Card className="border-0 shadow-2xl">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                إنشاء حساب جديد
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                أدخل بياناتك لإنشاء حساب موظف
              </p>
            </div>

            <form
              onSubmit={form.handleSubmit(handleRegister)}
              className="space-y-5"
            >
              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="name">الاسم الكامل</FieldLabel>
                      <FieldContent>
                        <div className="relative">
                          <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            {...field}
                            id="name"
                            placeholder="أدخل الاسم الكامل"
                            className="pr-10 h-11 text-sm"
                            autoComplete="name"
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
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
                      <FieldContent>
                        <div className="relative">
                          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            {...field}
                            id="email"
                            type="email"
                            placeholder="أدخل البريد الإلكتروني"
                            className="pr-10 h-11 text-sm"
                            autoComplete="email"
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
                            autoComplete="new-password"
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
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="confirmPassword">
                        تأكيد كلمة المرور
                      </FieldLabel>
                      <FieldContent>
                        <div className="relative">
                          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            {...field}
                            id="confirmPassword"
                            type="password"
                            placeholder="أعد إدخال كلمة المرور"
                            className="pr-10 h-11 text-sm"
                            autoComplete="new-password"
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
                {loading ? "جارٍ إنشاء الحساب..." : "إنشاء حساب"}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                لديك حساب بالفعل؟{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="text-primary hover:underline"
                >
                  تسجيل الدخول
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-white/50">
          © ٢٠٢٤ دائرة الأحوال المدنية والجوازات — جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  );
};

export default Register;
