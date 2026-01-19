import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CardDescription, CardTitle } from "@/components/ui/card";

interface AbsensiHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
}

export function AbsensiHeader({ selectedDate, onDateChange }: AbsensiHeaderProps) {
  const isPastDate = new Date(selectedDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <CardTitle className="text-2xl flex items-center gap-3">
          Absensi Santri
          {isPastDate && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Riwayat Tanggal Lalu
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-3 mt-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[260px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "EEEE, dd MMMM yyyy", { locale: id })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onDateChange}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <CardDescription className="hidden md:block">
            Pilih tanggal untuk manajemen kehadiran
          </CardDescription>
        </div>
      </div>
    </div>
  );
}