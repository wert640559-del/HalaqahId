import { useEffect, useMemo, useState } from "react";
import { useSetoran } from "@/hooks/useSetoran";
import { transformSetoranData } from "@/lib/dataTransformer";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icons & Local Components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faUserGraduate, faUsers } from "@fortawesome/free-solid-svg-icons";
import LaporanHeader from "@/components/ui/TypedText";
import { SantriAccordion } from "./SantriAccordion";

const MONTHS = [
  { label: "Semua Bulan", value: "all" },
  { label: "Januari", value: "0" },
  { label: "Februari", value: "1" },
  { label: "Maret", value: "2" },
  { label: "April", value: "3" },
  { label: "Mei", value: "4" },
  { label: "Juni", value: "5" },
  { label: "Juli", value: "6" },
  { label: "Agustus", value: "7" },
  { label: "September", value: "8" },
  { label: "Oktober", value: "9" },
  { label: "November", value: "10" },
  { label: "Desember", value: "11" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function LaporanSetoranPage() {
  const { allSetoran, fetchAllSetoran, loading } = useSetoran();
  
  // State Filter
  const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number | null>(new Date().getFullYear());
  const [activeHalaqah, setActiveHalaqah] = useState<string>("");

  useEffect(() => {
    fetchAllSetoran();
  }, [fetchAllSetoran]);

  // Transformasi Data berdasarkan Filter
  const groupedData = useMemo(() => {
    const filterDate = (selectedMonth !== null && selectedYear !== null) 
      ? new Date(selectedYear, selectedMonth) 
      : undefined;
      
    return transformSetoranData(allSetoran, filterDate);
  }, [allSetoran, selectedMonth, selectedYear]);

  const halaqahNames = Object.keys(groupedData);

  // Sync Halaqah: Memastikan halaqah yang dipilih tersedia di periode tersebut
  useEffect(() => {
    if (halaqahNames.length > 0) {
      if (!activeHalaqah || !halaqahNames.includes(activeHalaqah)) {
        setActiveHalaqah(halaqahNames[0]);
      }
    } else {
      setActiveHalaqah("");
    }
  }, [halaqahNames, activeHalaqah]);

  // Label Periode untuk Trigger Button
  const periodLabel = (selectedMonth === null || selectedYear === null)
    ? "Semua Periode"
    : format(new Date(selectedYear, selectedMonth), "MMMM yyyy", { locale: id });

  if (loading) return <LaporanLoadingSkeleton />;

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <LaporanHeader />
          <p className="text-sm text-muted-foreground">Monitoring progres hafalan santri per halaqah.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Select Halaqah */}
          {halaqahNames.length > 0 && (
            <Select value={activeHalaqah} onValueChange={setActiveHalaqah}>
              <SelectTrigger className="w-full sm:w-[200px] bg-background">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} className="h-3.5 w-3.5 opacity-50" />
                  <SelectValue placeholder="Pilih Halaqah" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {halaqahNames.map((name) => (
                  <SelectItem key={name} value={name} className="capitalize font-medium">
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Date Picker Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-[220px] justify-start text-left font-normal">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 h-4 w-4 opacity-50" />
                {periodLabel}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-semibold text-sm">Filter Periode</h4>
                  <Button 
                    variant="ghost" 
                    className="h-auto p-0 text-xs text-primary hover:bg-transparent"
                    onClick={() => { setSelectedMonth(null); setSelectedYear(null); }}
                  >
                    Reset Semua
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-muted-foreground font-bold">Bulan</label>
                    <Select 
                      value={selectedMonth?.toString() ?? "all"} 
                      onValueChange={(v) => setSelectedMonth(v === "all" ? null : parseInt(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((m) => (
                          <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-muted-foreground font-bold">Tahun</label>
                    <Select 
                      value={selectedYear?.toString() ?? "all"} 
                      onValueChange={(v) => setSelectedYear(v === "all" ? null : parseInt(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Tahun</SelectItem>
                        {years.map((y) => (
                          <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Content Section */}
      {halaqahNames.length === 0 ? (
        <EmptyState isFilterActive={selectedMonth !== null} />
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
          {activeHalaqah && groupedData[activeHalaqah] && (
            <>
              <div className="flex items-center gap-2 px-1 border-b pb-2">
                <FontAwesomeIcon icon={faUserGraduate} className="text-primary h-4 w-4" />
                <h3 className="font-bold text-lg capitalize">
                  Daftar Progres: <span className="text-primary">{activeHalaqah}</span>
                </h3>
              </div>
              
              <SantriAccordion santriGroup={groupedData[activeHalaqah].santriGroup} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

// --- Local Helpers ---

function EmptyState({ isFilterActive }: { isFilterActive: boolean }) {
  return (
    <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <FontAwesomeIcon icon={faCalendarAlt} className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <h3 className="text-lg font-semibold">Tidak ada data setoran</h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        {isFilterActive 
          ? "Tidak ditemukan data untuk periode ini. Silakan pilih bulan lain atau reset filter."
          : "Database setoran masih kosong."}
      </p>
    </Card>
  );
}

function LaporanLoadingSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
      </div>
    </div>
  );
}