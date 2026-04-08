import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AddEmployeeDrawer from "./AddEmployeeDrawer";

const addEmployeeMock = vi.fn();
const notifyMock = vi.fn();

vi.mock("@/actions/employee", () => ({
  addEmployee: (...args: unknown[]) => addEmployeeMock(...args),
}));

vi.mock("@/lib/notify", () => ({
  notify: (...args: unknown[]) => notifyMock(...args),
}));

vi.mock("@/components/ui/drawer", () => ({
  Drawer: ({ open, children }: { open: boolean; children: ReactNode }) =>
    open ? <div data-testid="drawer-root">{children}</div> : null,
  DrawerContent: ({ children, ...props }: ComponentProps<"div">) => <div {...props}>{children}</div>,
  DrawerHeader: ({ children, ...props }: ComponentProps<"div">) => <div {...props}>{children}</div>,
  DrawerTitle: ({ children, ...props }: ComponentProps<"h2">) => <h2 {...props}>{children}</h2>,
  DrawerFooter: ({ children, ...props }: ComponentProps<"div">) => <div {...props}>{children}</div>,
  DrawerClose: ({ children }: { children: ReactElement }) => children,
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({
    value,
    onValueChange,
    children,
  }: {
    value: string;
    onValueChange: (value: string) => void;
    children: ReactNode;
  }) => (
    <select
      aria-label="الدور"
      onChange={(event) => onValueChange(event.target.value)}
      value={value}
    >
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
  SelectValue: ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>,
  SelectContent: ({ children }: { children: ReactNode }) => <>{children}</>,
  SelectItem: ({ value, children }: { value: string; children: ReactNode }) => (
    <option value={value}>{children}</option>
  ),
}));

describe("AddEmployeeDrawer", () => {
  beforeEach(() => {
    addEmployeeMock.mockReset();
    notifyMock.mockReset();
  });

  it("submits the add employee form successfully", async () => {
    const user = userEvent.setup();
    const onAdded = vi.fn();
    const onClose = vi.fn();
    const createdEmployee = {
      id: "employee-2",
      name: "مها أحمد",
      email: "maha@civil.gov.sd",
      role: "OFFICER",
      isActive: true,
      _count: {
        documents: 0,
        civilEvents: 0,
      },
    };

    addEmployeeMock.mockResolvedValue({
      success: true,
      message: "تمت إضافة الموظف بنجاح",
      employee: createdEmployee,
    });

    render(<AddEmployeeDrawer open onAdded={onAdded} onClose={onClose} />);

    await user.type(screen.getByLabelText("الاسم الكامل"), "مها أحمد");
    await user.type(screen.getByLabelText("اسم المستخدم"), "maha");
    await user.type(screen.getByLabelText("كلمة المرور"), "Secret123");
    await user.click(screen.getByRole("button", { name: "إنشاء الحساب" }));

    await waitFor(() => {
      expect(addEmployeeMock).toHaveBeenCalledWith({
        name: "مها أحمد",
        username: "maha",
        password: "Secret123",
        role: "OFFICER",
      });
    });

    expect(onAdded).toHaveBeenCalledWith(createdEmployee);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(notifyMock).toHaveBeenCalledWith("تمت إضافة الموظف بنجاح", "success");
  });
});
