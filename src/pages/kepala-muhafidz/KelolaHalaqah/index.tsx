import { useEffect, useState, useCallback } from "react";
import { halaqahService, type Halaqah } from "@/services/halaqahService";
import { useSantri } from "@/hooks/useSantri";
import { toast } from "sonner";

import { BuatHalaqah } from "./BuatHalaqah";
import { EditHalaqah } from "./EditHalaqah";
import { DeleteHalaqah } from "./DeleteHalaqah";
import { DaftarHalaqah } from "./DaftarHalaqah";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { HalaqahManagement } from "@/components/ui/TypedText";

export default function KelolaHalaqah() {
  const [halaqahs, setHalaqahs] = useState<Halaqah[]>([]);  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHalaqah, setSelectedHalaqah] = useState<Halaqah | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { santriList, loadSantri } = useSantri();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeRes = await halaqahService.getAllHalaqah();
      await loadSantri(); 
      
      setHalaqahs(activeRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal sinkronisasi data dari server");
    } finally {
      setIsLoading(false);
    }
  }, [loadSantri]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = (h: Halaqah) => {
    setSelectedHalaqah(h);
    setIsEditOpen(true);
  };

  const handleDelete = (h: Halaqah) => {
    setSelectedHalaqah(h);
    setIsDeleteOpen(true);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <HalaqahManagement/>
          <p className="text-muted-foreground">Kelola kelompok bimbingan dan pantau santri di dalamnya.</p>
        </div>
        <div className="flex items-center gap-2">
          <BuatHalaqah onSuccess={fetchData} />
        </div>
      </div>

      {!isLoading && halaqahs.length === 0 ? (
        <EmptyState message="Belum ada halaqah yang dibuat." />
      ) : (
        <DaftarHalaqah 
          halaqahs={halaqahs} 
          santriList={santriList} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
          isLoading={isLoading} 
        />
      )}

      {/* Modals */}
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
    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl opacity-60">
      <FontAwesomeIcon icon={faUsers} size="3x" className="mb-4 text-muted-foreground" />
      <p className="font-medium">{message}</p>
    </div>
  );
}