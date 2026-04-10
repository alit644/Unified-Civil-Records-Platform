import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import NewCitizenForm from "./NewCitizenForm";
import { Button } from "@/components/ui/button";
interface EditCitizenDrawerProps {
  open?: boolean;
  onClose?: () => void;
  initialData: any;
}
export default function EditCitizenDrawer({open, onClose, initialData}: EditCitizenDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} direction="right">
      <DrawerContent className="max-w-md overflow-y-auto px-6 py-4">
        <DrawerHeader className="mb-4 border-b px-0">
          <DrawerTitle className="text-lg font-bold">
            تعديل بيانات المواطن
          </DrawerTitle>
          <DrawerDescription className="pb-4 text-sm text-muted-foreground">
            حدّث معلومات المواطن من هنا قبل حفظ التغييرات.
          </DrawerDescription>
        </DrawerHeader>
      <NewCitizenForm initialData={initialData} onSuccess={onClose} />
         <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DrawerClose>
          </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}