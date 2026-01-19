import { Button } from "@/components/ui/button";
import { Save, RotateCcw, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface AbsensiActionsProps {
  selectedDate: Date;
  onReset: () => void;
  onBackToToday: () => void;
  onSubmit: () => void;
  loading?: boolean;
}

export function AbsensiActions({
  selectedDate,
  onReset,
  onBackToToday,
  onSubmit,
  loading
}: AbsensiActionsProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t">
      <div className="text-sm text-muted-foreground">
        Menampilkan data untuk: <span className="font-semibold text-foreground">
          {format(selectedDate, "dd MMMM yyyy", { locale: id })}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onReset}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Semua
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBackToToday}
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          Hari Ini
        </Button>

        <Button 
          onClick={onSubmit} 
          disabled={loading}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </div>
  );
}