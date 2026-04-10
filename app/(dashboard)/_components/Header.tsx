import { 
  Search, 
  Bell, 
  HelpCircle, 
  ChevronDown, 
  Menu, 
  X,
  User,
  ArrowRight
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { quickSearchCitizens } from "@/actions/citizens";
import { Loader2 } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/": "الرئيسية",
  "/citizens": "بحث المواطنين",
  "/events": "الواقعات المدنية",
  "/documents": "إصدار الوثائق",
  "/archive": "الأرشيف الرقمي",
  "/employees": "إدارة الموظفين",
  "/audit": "سجل التدقيق الكامل",
};

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: any;
}

export default function Header({ sidebarOpen, setSidebarOpen, user }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const pageTitle = pageTitles[pathname] || "السجل المدني";
  const userName = user?.name;
  const splitName = userName?.split(" ")[0]?.charAt(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Clear search on pathname change
  useEffect(() => {
    setSearchQuery("");
    setShowResults(false);
  }, [pathname]);

  // Debounced Search Effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsLoading(true);
        const data = await quickSearchCitizens(searchQuery);
        setResults(data);
        setIsLoading(false);
        setShowResults(true);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-card border-b flex items-center justify-between px-4 md:px-6 gap-4 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-secondary/50 transition-colors"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
        <h2 className="text-lg font-bold text-foreground truncate max-w-[150px] sm:max-w-none">
          {pageTitle}
        </h2>
      </div>

      {/* Global Quick Search - Specialized for Citizens */}
      <div className="flex-1 max-w-xl mx-auto hidden sm:block relative" ref={searchRef}>
        <div className="relative group">
          <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors z-10 ${showResults ? 'text-primary' : 'text-muted-foreground/70'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => {
              if (searchQuery.length > 0) setShowResults(true);
            }}
            placeholder="بحث سريع عن مواطن..."
            className="w-full h-9 pr-9 pl-12 rounded-lg border border-transparent bg-secondary/30 text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:bg-background focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
          />
          
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
            ) : searchQuery.length > 0 ? (
              <button 
                onClick={() => { setSearchQuery(""); setShowResults(false); }}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 border rounded bg-background text-[9px] font-medium text-muted-foreground/50 select-none">
                <span className="text-[10px]">Ctrl</span>
                <span>K</span>
              </div>
            )}
          </div>
        </div>

        {/* Search Results Dropdown */}
        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/60 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 z-50">
            <div className="p-2.5 border-b bg-muted/20 flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-muted-foreground/50 tracking-widest px-1">نتائج البحث</span>
              <span className="text-[9px] text-muted-foreground/40 font-medium">إجمالي الحالات: {results.length}</span>
            </div>
            
            <div className="max-h-[320px] overflow-y-auto no-scrollbar">
              {results.length > 0 ? (
                <div className="p-1.5 space-y-0.5">
                  {results.map((citizen) => (
                    <button
                      key={citizen.id}
                      onClick={() => {
                        router.push(`/citizens/${citizen.id}`);
                        setShowResults(false);
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-secondary/40 transition-all text-right group"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                        <User className="w-4 h-4 text-primary/70" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {citizen.firstName} {citizen.lastName}
                          </p>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                            citizen.status === "نشط" ? "bg-green-500/10 text-green-600" : "bg-orange-500/10 text-orange-600"
                          }`}>
                            {citizen.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground/70 mt-0.5 font-mono">
                          {citizen.nationalId}
                        </p>
                      </div>
                      <ArrowRight className="w-3 h-3 text-muted-foreground/30 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Search className="w-5 h-5 text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-[11px] text-muted-foreground/60 font-medium">لم يتم العثور على نتائج</p>
                </div>
              )}
            </div>

            {results.length > 0 && (
              <button 
                onClick={() => {
                   router.push(`/citizens?q=${searchQuery}`);
                   setShowResults(false);
                }}
                className="w-full p-2.5 bg-muted/10 border-t border-border/40 hover:bg-muted/30 transition-colors text-[10px] font-bold text-primary/80 flex items-center justify-center gap-1.5"
              >
                المزيد من النتائج
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center border-2 border-card">
              ٣
            </span>
          </button>
          <button className="hidden sm:flex p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 pr-2 sm:pr-4 border-r border-border/50">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-black shrink-0">
            {splitName}
          </div>
          <div className="hidden lg:flex flex-col items-start -space-y-1">
            <span className="text-xs font-bold text-foreground truncate max-w-[100px]">{userName}</span>
          </div>
          <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
        </div>
      </div>
    </header>
  );
}
