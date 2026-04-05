import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchBar = () => {
  return (
    <div className="bg-card rounded-lg border p-5 shadow-sm">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-70">
          <Label className="block text-xs text-muted-foreground mb-1.5">بحث</Label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <Input
              placeholder="ابحث بالاسم الكامل أو الرقم الوطني أو رقم دفتر العائلة..."
              className="pr-10"
            />
          </div>
        </div>
        
        <div className="">
          <Label className="block text-xs text-muted-foreground mb-1.5">الحي</Label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="اختر الحي" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="jubeilha">الجبيهة</SelectItem>
              <SelectItem value="rabieh">الرابية</SelectItem>
              <SelectItem value="sweileh">صويلح</SelectItem>
              <SelectItem value="jandawil">الجندويل</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="">
          <Label className="block text-xs text-muted-foreground mb-1.5">الحالة</Label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="اختر الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="pending">بانتظار التدقيق</SelectItem>
              <SelectItem value="deceased">متوفى</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button className="px-5">بحث</Button>
          <Button variant="outline" className="text-muted-foreground">إعادة تعيين</Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;