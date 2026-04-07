import { useTransition } from "react";
import { Employee } from "@/types";
import { toggleEmployeeStatus } from "@/actions/employee";
import { notify } from "@/lib/notify";

export function useToggleEmployeeStatus(
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>
) {
  const [isPending, startTransition] = useTransition();

  const rollback = (id: string, status: boolean) =>
    setEmployees(prev =>
      prev.map(emp => (emp.id === id ? { ...emp, isActive: status } : emp))
    );

  const toggleStatus = (id: string, currentStatus: boolean) => {
    // Optimistic Update
    setEmployees(prev =>
      prev.map(emp => (emp.id === id ? { ...emp, isActive: !currentStatus } : emp))
    );

    startTransition(() => {
      toggleEmployeeStatus(id)
        .then(result => {
          if (result.success) {
            notify(result.message, "success");
          } else {
            rollback(id, currentStatus);
            notify(result.message, "error");
          }
        })
        .catch(() => rollback(id, currentStatus));
    });
  };

  return { toggleStatus, isPending };
}
