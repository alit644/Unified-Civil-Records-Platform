import { createCitizen, updateCitizen } from "@/actions/citizens";
import { notify } from "@/lib/notify";
import { CitizenFormValues, citizenSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
interface UseCitizenFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function useCitizenForm({ initialData, onSuccess }: UseCitizenFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const formatDateForInput = (date: any) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // يرجع "YYYY-MM-DD"
  };

  const defaultFormValues = initialData ? {
      ...initialData,
      dateOfBirth: formatDateForInput(initialData.dateOfBirth),
      familyBookId: initialData.familyBookId || "",
      religion: initialData.religion || "",
      currentAddress: initialData.currentAddress || "",
      nationalId: initialData.nationalId || "",
    } : {
      nationalId: "",
      firstName: "",
      lastName: "",
      fatherName: "",
      motherName: "",
      placeOfBirth: "",
      dateOfBirth: "",
      registryPlace: "",
      registryNumber: "",
      familyBookId: "",
      gender: "MALE",
      maritalStatus: "SINGLE",
      status: "ACTIVE",
      religion: "",
      currentAddress: "",
    };

  const form = useForm<CitizenFormValues>({
    resolver: zodResolver(citizenSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    form.reset(defaultFormValues);
  }, [initialData, form]);


  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: CitizenFormValues) => {
    try {
      let res;

      // 4. توجيه الطلب حسب الوضع
      if (isEditMode) {
        res = await updateCitizen(data, initialData.id);
      } else {
        res = await createCitizen(data);
      }

      if (res.success) {
        notify(res.message, "success");
        
        if (onSuccess) {
          onSuccess();
          router.refresh(); 
        } else {
          if (!isEditMode) reset();
          router.push("/citizens");
        }
      } else {
        notify(res.message, "error");
      }
    } catch (error) {
      console.error("Error creating citizen:", error);
      notify("حدث خطأ أثناء الحفظ", "error");
    }
  };
  return {
    control,
    handleSubmit,
    reset,
    isSubmitting,
    onSubmit,
    isEditMode
    
  };

}