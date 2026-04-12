import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useEffect } from "react";
import { EventType } from "@/lib/generated/prisma/enums";
import BirthFields from "./BirthFields";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import MarriageRegistrationFilds from "./MarriageRegistrationFilds";
import DivorceFields from "./DivorceFields";
import DeathFields from "./DeathFields";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedType: EventType | null;
  setSelectedType: (type: EventType | null) => void;
  eventTypes: { label: string; value: EventType; icon: LucideIcon }[];
}

const EventDrawer = ({
  isOpen,
  onClose,
  selectedType,
  setSelectedType,
  eventTypes,
}: DrawerProps) => {
  // Reset UI state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedType(null);
    }
  }, [isOpen, setSelectedType]);



  const renderFields = (type: EventType) => {
    switch (type) {
      case EventType.BIRTH:
        return <BirthFields onSuccess={onClose} />;
      case EventType.MARRIAGE:
        return <MarriageRegistrationFilds onSuccess={onClose} />;
      case EventType.DIVORCE:
        return <DivorceFields onSuccess={onClose} />;
      case EventType.DEATH:
        return <DeathFields onSuccess={onClose} />;
      default:
        return (
          <div className="p-4 bg-muted/50 rounded-lg text-center text-sm text-muted-foreground">
            هذا النوع من الوقائع قيد التطوير حالياً في الـ Schema.
          </div>
        );
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={(v) => !v && onClose()} direction="right" >
      <DrawerContent className="w-full md:!w-[60%] !max-w-none h-full">
        <DrawerHeader className="border-b bg-muted/30">
          <DrawerTitle className="text-xl font-bold text-right">تسجيل واقعة جديدة</DrawerTitle>
          <DrawerDescription className="text-right">
            أدخل بيانات الواقعة المدنية للتدقيق
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Event Type Selection */}
            <section>
              <Label className="text-sm font-semibold mb-3 block">نوع الواقعة</Label>
              <div className="grid grid-cols-2 gap-3">
                {eventTypes.map((et) => (
                  <button
                    key={et.value}
                    type="button"
                    onClick={() => setSelectedType(et.value)}
                    className={`p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-2 ${selectedType === et.value
                      ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
                      }`}
                  >
                    <et.icon
                      className={`w-8 h-8 ${selectedType === et.value ? "text-primary" : "text-muted-foreground"
                        }`}
                    />
                    <span
                      className={`text-sm font-bold ${selectedType === et.value ? "text-primary" : "text-foreground"
                        }`}
                    >
                      {et.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {selectedType && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Specific Fields */}
                <section className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 bg-primary rounded-full" />
                    <h4 className="font-semibold text-sm">تفاصيل الواقعة</h4>
                  </div>
                  {renderFields(selectedType)}
                </section>
              </div>
            )}
          </div>

          <DrawerFooter className="p-6 border-t bg-muted/30 flex-row gap-3">
            <Button
              type="submit"
              form={`${selectedType?.toLowerCase()}-event-form`}
              className="flex-1 shadow-lg shadow-primary/20"
              disabled={selectedType === null}
            >
              إرسال للتدقيق
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              إلغاء
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EventDrawer;
