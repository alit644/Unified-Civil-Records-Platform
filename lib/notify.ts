import type { CSSProperties } from "react";
import { toast } from "sonner";

type NotifyType = "success" | "error";

type NotifyOptions = {
  description?: string;
  descriptionClassName?: string;
  duration?: number;
  style?: CSSProperties;
};

const STYLES: Record<NotifyType, CSSProperties> = {
  success: {
    border: "1px solid #10b98133",
    background: "rgba(240, 253, 244, 0.95)",
    color: "#065f46",
    boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -4px rgba(16, 185, 129, 0.1)",
    borderRadius: "12px",
    fontFamily: "var(--font-cairo)",
    padding: "12px 20px",
    backdropFilter: "blur(8px)",
  },

  error: {
    border: "1px solid #ef444433",
    background: "rgba(254, 242, 242, 0.95)",
    boxShadow: "0 10px 15px -3px rgba(239, 68, 68, 0.1), 0 4px 6px -4px rgba(239, 68, 68, 0.1)",
    borderRadius: "12px",
    fontFamily: "var(--font-cairo)",
    padding: "12px 20px",
    backdropFilter: "blur(8px)",
  },
};
export const notify = (
  message: string,
  type: NotifyType = "success",
  options: NotifyOptions = {}
) => {
  const { style, ...rest } = options;
  const base = { style: { ...STYLES[type], ...style }, ...rest } as const;

  if (type === "success") {
    toast.success(message, base);
  } else {
    toast.error(message, base);
  }
};
