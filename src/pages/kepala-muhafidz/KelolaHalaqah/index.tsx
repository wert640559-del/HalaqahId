import { useEffect, useState, useCallback, useMemo } from "react";
import { halaqahService, type Halaqah } from "@/services/halaqahService";
import { useSantri } from "@/hooks/useSantri";
import { toast } from "sonner";

import { BuatHalaqah } from "./BuatHalaqah";
import { EditHalaqah } from "./EditHalaqah";
import { DeleteHalaqah } from "./DeleteHalaqah";
import { DaftarHalaqah } from "./DaftarHalaqah";
import { HalaqahManagement } from "@/components/ui/TypedText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

export default function KelolaHalaqah() {
  const [halaqahs, setHalaqahs] = useState<Halaqah[]>([]);  
  const [isLoadingHalaqah, setIsLoadingHalaqah] = useState(true);
  const [selectedHalaqah, setSelectedHalaqah] = useState<Halaqah | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { santriList, loadSantri } = useSantri();

  const fetchData = useCallback(async () => {
    // Tahap 1: Ambil data halaqah saja dulu (Ringan)
    setIsLoadingHalaqah(true);
    try {
      const res = await halaqahService.getAllHalaqah();
      setHalaqahs(res.data);
      setIsLoadingHalaqah(false); // UI Langsung muncul di sini

      // Tahap 2: Ambil data santri (Berat) di background
      // Tidak perlu await karena tidak menghalangi render halaqah
      loadSantri(); 
    } catch (error) {
      toast.error("Gagal mengambil data halaqah");
      setIsLoadingHalaqah(false);
    }
  }, [loadSantri]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // OPTIMASI: Kelompokkan santri berdasarkan ID halaqah satu kali saja (O(n))
  // Ini mencegah fungsi .filter() yang lambat di dalam loop render
  const santriMap = useMemo(() => {
    return santriList.reduce((acc, s) => {
      const key = s.halaqah_id;
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    }, {} as Record<number, any[]>);
  }, [santriList]);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <HalaqahManagement/>
          <p className="text-muted-foreground">Kelola kelompok bimbingan santri.</p>
        </div>
        <BuatHalaqah onSuccess={fetchData} />
      </div>

      {!isLoadingHalaqah && halaqahs.length === 0 ? (
        <EmptyState message="Belum ada halaqah yang dibuat." />
      ) : (
        <DaftarHalaqah 
          halaqahs={halaqahs} 
          santriMap={santriMap}
          isLoading={isLoadingHalaqah}
          onEdit={(h) => { setSelectedHalaqah(h); setIsEditOpen(true); }}
          onDelete={(h) => { setSelectedHalaqah(h); setIsDeleteOpen(true); }}
        />
      )}

      {selectedHalaqah && (
        <>
          <EditHalaqah 
            halaqah={selectedHalaqah} 
            isOpen={isEditOpen} 
            onClose={() => setIsEditOpen(false)} 
            onSuccess={fetchData} 
          />
          <DeleteHalaqah 
            halaqah={selectedHalaqah} 
            isOpen={isDeleteOpen} 
            onClose={() => setIsDeleteOpen(false)} 
            onSuccess={fetchData} 
          />
        </>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl opacity-50">
      <FontAwesomeIcon icon={faUsers} size="3x" className="mb-4" />
      <p>{message}</p>
    </div>
  );
}