import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { docTypes } from "./constants";
import { useState, useEffect } from "react";
import { quickSearchCitizens } from "@/actions/citizens";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useDebounce } from "use-debounce";

export interface CitizenSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  status: string;
}

interface QuickIssueProps {
  selectedDoc: string;
  setSelectedDoc: (doc: string) => void;
  selectedCitizen: CitizenSearchResult | null;
  setSelectedCitizen: (citizen: CitizenSearchResult | null) => void;
  onIssue: () => void;
  isIssuing?: boolean;
}

export const QuickIssue = ({
  selectedDoc,
  setSelectedDoc,
  selectedCitizen,
  setSelectedCitizen,
  onIssue,
  isIssuing = false,
}: QuickIssueProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 400);
  const [results, setResults] = useState<CitizenSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    async function search() {
      if (debouncedSearch.length >= 2) {
        setLoading(true);
        const res = await quickSearchCitizens(debouncedSearch);
        setResults(res as CitizenSearchResult[]);
        setLoading(false);
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }
    search();
  }, [debouncedSearch]);

  const handleSelect = (citizen: CitizenSearchResult) => {
    setSelectedCitizen(citizen);
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">
      <h4 className="font-bold mb-4">إصدار وثيقة سريعة</h4>
      <div className="space-y-4">
        <div className="relative">
          {loading ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 animate-spin" />
          ) : (
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          )}
          <Input
            placeholder="ابحث عن المواطن بالاسم أو الرقم الوطني..."
            className="h-11 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
          />

          {showDropdown && results.length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-background border rounded-md shadow-lg z-50 p-2 space-y-1 max-h-60 overflow-y-auto">
              {results.map((citizen) => (
                <div
                  key={citizen.id}
                  className="p-2 hover:bg-secondary/50 cursor-pointer rounded-md flex justify-between items-center transition-colors"
                  onClick={() => handleSelect(citizen)}
                >
                  <div>
                    <p className="text-sm font-medium">{citizen.firstName} {citizen.lastName}</p>
                    <p className="text-xs text-muted-foreground">{citizen.nationalId}</p>
                  </div>
                  <StatusBadge value={citizen.status} category="status_citizen" className="text-[10px] scale-90 origin-left" />
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedCitizen && (
          <div className="p-3 rounded-md bg-secondary/50 border flex items-center gap-4 animate-in fade-in duration-300 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 left-1 w-6 h-6 text-muted-foreground hover:text-destructive"
              onClick={() => setSelectedCitizen(null)}
            >
              ✕
            </Button>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              {`${selectedCitizen.firstName.charAt(0)}.${selectedCitizen.lastName.charAt(0)}`}
            </div>
            <div>
              <p className="font-medium text-sm">{selectedCitizen.firstName} {selectedCitizen.lastName}</p>
              <p className="text-xs text-muted-foreground font-mono">{selectedCitizen.nationalId}</p>
            </div>
            <StatusBadge value={selectedCitizen.status} category="status_citizen" className="mr-auto text-[10px]" />
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

        <Button
          onClick={onIssue}
          className="h-11 px-8 font-bold w-full sm:w-auto"
          disabled={!selectedCitizen || isIssuing}
        >
          {isIssuing ? (
            <>
               <Loader2 className="w-4 h-4 ml-2 animate-spin inline-block" />
               جاري الإصدار...
            </>
          ) : (
            "إصدار الوثيقة"
          )}
        </Button>
      </div>
    </div>
  );
};
