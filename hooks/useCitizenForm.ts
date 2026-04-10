import { createCitizen } from "@/actions/citizens";
import { notify } from "@/lib/notify";
import { CitizenFormValues, citizenSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export function useCitizenForm() {
  const router = useRouter();
    const form = useForm<CitizenFormValues>({
      resolver: zodResolver(citizenSchema),
      defaultValues: {
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
      },
    });
  
    const {
      control,
      handleSubmit,
      reset,
      formState: { isSubmitting },
    } = form;
  
   const onSubmit = async (data: CitizenFormValues) => {
    try {
      const res = await createCitizen(data);
      if (res.success) {
        notify(res.message ,"success");
        reset();
        router.push("/citizens");
      } else {
        notify(res.message ,"error");
      }
    } catch (error) {
      console.error("Error creating citizen:", error);
      notify("حدث خطأ أثناء الحفظ","error");
    }
  };
  return {
    control,
    handleSubmit,
    reset,
    isSubmitting,
    onSubmit
  };

}