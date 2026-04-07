import { Loader2, LogOut as LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const LogOut = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogOut = async () => {
    try {
      setIsLoggingOut(true);
      
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.refresh(); 
            router.push("/login");
          },
        },
      });
    } catch (error) {
      console.error("خطأ أثناء تسجيل الخروج:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
  <Button 
      variant="ghost" 
      size="icon" 
      className="text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-destructive/10 transition-colors"
      onClick={handleLogOut}
      disabled={isLoggingOut}
      title="تسجيل الخروج"
    >
      {isLoggingOut ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOutIcon className="w-4 h-4" />
      )}
    </Button>
  );
};

export default LogOut;
