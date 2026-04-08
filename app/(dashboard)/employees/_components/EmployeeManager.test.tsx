import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Role } from "@/lib/generated/prisma/enums";
import EmployeeManager from "./EmployeeManager";

vi.mock("./AddEmployeeDrawer", () => ({
  default: ({
    open,
    onAdded,
    onClose,
  }: {
    open: boolean;
    onAdded?: (employee: {
      id: string;
      name: string;
      email: string;
      role: Role;
      isActive: boolean;
      _count: { documents: number; civilEvents: number };
    }) => void;
    onClose: () => void;
  }) =>
    open ? (
      <div data-testid="add-employee-drawer">
        <button
          onClick={() => {
            onAdded?.({
              id: "employee-2",
              name: "سارة علي",
              email: "sara@civil.gov.sd",
              role: Role.AUDITOR,
              isActive: true,
              _count: {
                documents: 0,
                civilEvents: 0,
              },
            });
            onClose();
          }}
          type="button"
        >
          تأكيد الإضافة
        </button>
      </div>
    ) : null,
}));

vi.mock("./EditEmployeeDrawer", () => ({
  default: () => null,
}));

vi.mock("@/hooks/useToggleEmployeeStatus", () => ({
  useToggleEmployeeStatus: () => ({
    toggleStatus: vi.fn(),
    isPending: false,
  }),
}));

describe("EmployeeManager", () => {
  it("opens the add employee drawer and prepends the new employee", async () => {
    const user = userEvent.setup();

    render(
      <EmployeeManager
        initialEmployees={[
          {
            id: "employee-1",
            name: "أحمد محمد",
            email: "ahmed@civil.gov.sd",
            role: Role.OFFICER,
            isActive: true,
            _count: {
              documents: 2,
              civilEvents: 1,
            },
          },
        ]}
      />
    );

    expect(screen.queryByTestId("add-employee-drawer")).toBeNull();

    await user.click(screen.getByRole("button", { name: "إضافة موظف جديد" }));

    expect(screen.queryByTestId("add-employee-drawer")).not.toBeNull();

    await user.click(screen.getByRole("button", { name: "تأكيد الإضافة" }));

    const employeeNames = screen
      .getAllByText(/أحمد محمد|سارة علي/)
      .map((element) => element.textContent);

    expect(employeeNames[0]).toBe("سارة علي");
    expect(employeeNames).toContain("أحمد محمد");
  });
});
