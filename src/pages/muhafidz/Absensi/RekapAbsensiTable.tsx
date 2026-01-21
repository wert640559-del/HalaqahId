import { useState, useEffect, useMemo } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSantri } from "@/hooks/useSantri";
import { absensiService, type AbsensiStatus } from "@/services/absensiService";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDate, 
  isSameDay 
} from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

export const RekapAbsensiTable = () => {
  const { santriList, isLoading: loadingSantri, loadSantri } = useSantri();
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // 1. Hitung daftar tanggal dalam bulan yang dipilih
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(viewDate);
    const end = endOfMonth(viewDate);
    return eachDayOfInterval({ start, end });
  }, [viewDate]);

  // 2. Load data santri jika belum ada
  useEffect(() => {
    if (santriList.length === 0) loadSantri();
  }, [loadSantri, santriList.length]);

  // 3. Fetch data absensi bulanan dari service
  useEffect(() => {
    const fetchData = async () => {
      if (santriList.length === 0) return;
      
      setIsLoadingData(true);
      try {
        const halaqahId = santriList[0].halaqah_id;
        const month = format(viewDate, "MM");
        const year = format(viewDate, "yyyy");
        
        const response = await absensiService.getRekapHalaqah(halaqahId, undefined, month, year);
        setAttendanceData(response.data);
      } catch (error) {
        console.error("Gagal mengambil rekap:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [viewDate, santriList]);

  // Helper: Mapping status ke Inisial dan Warna
  const getCellContent = (santriId: number, date: Date) => {
    const record = attendanceData.find(a => 
      a.santri_id === santriId && isSameDay(new Date(a.tanggal), date)
    );
    
    const status = record?.status as AbsensiStatus;
    
    const config: Record<string, { label: string; color: string }> = {
      HADIR: { label: "H", color: "bg-green-500 text-white" },
      IZIN: { label: "I", color: "bg-blue-500 text-white" },
      SAKIT: { label: "S", color: "bg-yellow-500 text-white" },
      TERLAMBAT: { label: "T", color: "bg-orange-500 text-white" },
      ALFA: { label: "A", color: "bg-red-500 text-white" },
    };

    return status ? config[status] : { label: "-", color: "text-muted-foreground opacity-20" };
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Matriks Kehadiran</CardTitle>
            <CardDescription>Periode {format(viewDate, "MMMM yyyy", { locale: id })}</CardDescription>
          </div>
          
          <Select 
            value={format(viewDate, "yyyy-MM")} 
            onValueChange={(val) => setViewDate(new Date(val))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }).map((_, i) => {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                return (
                  <SelectItem key={i} value={format(d, "yyyy-MM")}>
                    {format(d, "MMMM yyyy", { locale: id })}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="px-0">
        <div className="rounded-md border overflow-x-auto relative">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {/* Kolom Nama Sticky */}
                <TableHead className="min-w-[160px] sticky left-0 z-30 bg-muted font-bold border-r">
                  Nama Santri
                </TableHead>
                {daysInMonth.map((date) => (
                  <TableHead key={date.toString()} className="text-center min-w-[35px] p-1 text-[10px] font-bold border-r">
                    {getDate(date)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingSantri || isLoadingData ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="sticky left-0 bg-background border-r"><Skeleton className="h-4 w-24" /></TableCell>
                    {daysInMonth.map((d) => (
                      <TableCell key={d.toString()} className="p-1"><Skeleton className="h-6 w-6 rounded-sm" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                santriList.map((s) => (
                  <TableRow key={s.id_santri} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium sticky left-0 bg-background z-20 border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] py-2">
                      <span className="truncate block w-32 md:w-40">{s.nama_santri}</span>
                    </TableCell>
                    {daysInMonth.map((date) => {
                      const { label, color } = getCellContent(s.id_santri, date);
                      return (
                        <TableCell 
                          key={date.toString()} 
                          className={cn(
                            "text-center p-0 border-r h-9 min-w-[35px] text-[10px] font-bold transition-all",
                            color
                          )}
                        >
                          {label}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Legend / Keterangan Warna */}
        <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-muted-foreground px-1">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-green-500 rounded-sm" /> Hadir (H)</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-blue-500 rounded-sm" /> Izin (I)</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-yellow-500 rounded-sm" /> Sakit (S)</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-orange-500 rounded-sm" /> Terlambat (T)</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-red-500 rounded-sm" /> Alfa (A)</div>
        </div>
      </CardContent>
    </Card>
  );
};