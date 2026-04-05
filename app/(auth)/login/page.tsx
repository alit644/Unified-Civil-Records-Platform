"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, User, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

const Login = () => {
  const nav = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      nav.push("/");
    }, 800);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background: "linear-gradient(135deg, hsl(160 90% 16%) 0%, hsl(162 90% 20%) 50%, hsl(160 70% 22%) 100%)",
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
            <p className="text-sm text-white/70 mt-1">دائرة الأحوال المدنية والجوازات</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-2xl">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-foreground">تسجيل دخول الموظفين</h2>
              <p className="text-sm text-muted-foreground mt-1">أدخل بيانات الاعتماد الخاصة بك</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">
                  اسم المستخدم
                </Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="أدخل اسم المستخدم"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pr-10 h-11 text-sm"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 h-11 text-sm"
                    autoComplete="current-password"
                  />
                </div>
              </div>

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
          © ٢٠٢٤ دائرة الأحوال المدنية والجوازات — جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  );
};

export default Login;
