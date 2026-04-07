// hooks/useLogin.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { LoginFormData, loginSchema } from "@/lib/schema";
import { signIn } from "@/lib/auth-client";

export const useLogin = () => {
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      const result = await signIn.email({
        email: `${data.username}@civil.gov.sd`,
        password: data.password,
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });

      if (result.error) {
        let errorMessage = "فشل تسجيل الدخول";
        const errorCode = result.error.code || result.error.statusText || "";
        const errorMsg = result.error.message?.toLowerCase() || "";

        if (errorCode === "INVALID_EMAIL_OR_PASSWORD" || errorMsg.includes("invalid email or password") || errorMsg.includes("credential")) {
          errorMessage = "اسم المستخدم أو كلمة المرور غير صحيحة";
        } else if (errorCode === "USER_NOT_FOUND" || errorMsg.includes("user not found")) {
          errorMessage = "هذا الحساب غير موجود";
        } else if (errorCode === "TOO_MANY_REQUESTS" || errorMsg.includes("rate limit")) {
          errorMessage = "محاولات كثيرة جداً، يرجى المحاولة لاحقاً";
        } else if (errorCode === "EMAIL_NOT_VERIFIED" || errorMsg.includes("not verified")) {
          errorMessage = "يرجى تفعيل الحساب من قبل مسؤول النظام أولاً";
        } else if (result.error.message) {
          errorMessage = result.error.message;
        }

        form.setError("root", {
          type: "manual",
          message: errorMessage,
        });
        return;
      }
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "حدث خطأ ما",
      });
      console.log(error);
    }
  };

  return {
    form,
    loading: form.formState.isSubmitting,
    error: form.formState.errors.root?.message,
    handleLogin,
  };
};
