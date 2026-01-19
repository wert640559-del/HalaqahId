"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";

// Import Components
import { AbsensiTable } from "./AbsensiTable";
import { AbsensiActions } from "./AbsensiActions";
import { AbsensiHeader } from "./AbsensiHeader";

// Import Hooks & Services
import { useSantri } from "@/hooks/useSantri";
import { useAbsensi } from "@/hooks/useAbsensi";

export default function AbsensiPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 1. Inisialisasi Hooks
  const { santriList, loadSantri, isLoading: isLoadingSantri } = useSantri();
  const { 
    absensiMap, 
    loadAbsensiByDate, 
    submitAbsensi, 
    updateLocalStatus, 
    resetLocalAbsensi,
    isLoading: isSaving 
  } = useAbsensi();

  // 2. Load Data (Dijalankan setiap kali tanggal berubah)
  useEffect(() => {
    const fetchData = async () => {
      await loadSantri(); // Ambil daftar santri aktif
      await loadAbsensiByDate(selectedDate); // Ambil data absensi yang sudah ada (jika ada)
    };
    fetchData();
  }, [selectedDate, loadSantri, loadAbsensiByDate]);

  // 3. Handlers
  const handleSubmit = async () => {
    try {
      // Mengirim list santri agar hook bisa memetakan status dari absensiMap
      await submitAbsensi(selectedDate, santriList);
      alert("Data absensi berhasil disimpan!");
    } catch (error: any) {
      alert("Gagal menyimpan: " + error.message);
    }
  };

  const handleReset = () => {
    if (confirm("Reset semua status di tampilan ini ke HADIR?")) {
      resetLocalAbsensi();
    }
  };

  // 4. Transformasi data untuk Tabel
  const rows = santriList.map((s) => ({
    santri_id: s.id_santri,
    namaSantri: s.nama_santri,
    status: absensiMap[s.id_santri] || "HADIR",
    setoranTerakhir: null, // Bisa dikembangkan nanti
  }));

  // 5. State Loading Gabungan
  const isGlobalLoading = isLoadingSantri;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <AbsensiHeader 
            selectedDate={selectedDate} 
            onDateChange={(d) => d && setSelectedDate(d)} 
          />
          
          <Button 
            onClick={handleSubmit} 
            disabled={isSaving || isGlobalLoading}
            className="bg-green-600 hover:bg-green-700 text-white shadow-sm min-w-[140px]"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSaving ? "Menyimpan..." : "Simpan Absensi"}
          </Button>
        </CardHeader>

        <CardContent>
          {isGlobalLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Memuat data santri...</p>
            </div>
          ) : (
            <>
              <AbsensiTable 
                rows={rows} 
                onStatusChange={updateLocalStatus} 
              />
              
              <AbsensiActions 
                selectedDate={selectedDate}
                onReset={handleReset}
                onBackToToday={() => setSelectedDate(new Date())}
                onSubmit={handleSubmit}
                loading={isSaving}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}