import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { docTypes } from "./constants";

interface QuickIssueProps {
  selectedDoc: string;
  setSelectedDoc: (doc: string) => void;
  citizenFound: boolean;
  setCitizenFound: (found: boolean) => void;
  onIssue: () => void;
}

export const QuickIssue = ({
  selectedDoc,
  setSelectedDoc,
  citizenFound,
  setCitizenFound,
  onIssue,
}: QuickIssueProps) => {
  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">
      <h4 className="font-bold mb-4">إصدار وثيقة سريعة</h4>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <Input
            placeholder="ابحث عن المواطن بالاسم أو الرقم الوطني..."
            className="h-11 pr-10"
            onFocus={() => setCitizenFound(true)}
          />
        </div>

        {citizenFound && (
          <div className="p-3 rounded-md bg-secondary/50 border flex items-center gap-4 animate-in fade-in duration-300">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              م.ش
            </div>
            <div>
              <p className="font-medium text-sm">محمد سامر الشمري</p>
              <p className="text-xs text-muted-foreground font-mono">٩٩٨١٢٣٤٥٦٧ — الجبيهة</p>
            </div>
            <span className="badge-active mr-auto text-[10px] px-2 py-0.5">نشط</span>
          </div>
        )}

        <div>
          <p className="text-xs text-muted-foreground mb-2">نوع الوثيقة</p>
          <div className="flex flex-wrap gap-2">
            {docTypes.map((d) => (
              <Button
                key={d}
                variant={selectedDoc === d ? "default" : "secondary"}
                size="sm"
                className="rounded-full px-4"
                onClick={() => setSelectedDoc(d)}
              >
                {d}
              </Button>
            ))}
          </div>
        </div>

        <Button onClick={onIssue} className="h-11 px-8 font-bold w-full sm:w-auto">
          إصدار الوثيقة
        </Button>
      </div>
    </div>
  );
};
