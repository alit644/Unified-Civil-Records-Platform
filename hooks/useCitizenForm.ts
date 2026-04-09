import { CitizenFormValues, citizenSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function useCitizenForm() {
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
  
   const onSubmit = (data: CitizenFormValues) => {
    console.log("بيانات المواطن:", data);
    // TODO: استدعاء server action
  };
  return {
    control,
    handleSubmit,
    reset,
    isSubmitting,
    onSubmit
  };

}