import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

// Services & Hooks
import { halaqahService, type Halaqah } from "@/services/halaqahService";
import { santriService, type Santri } from "@/services/santriService";
import { useSantri } from "@/hooks/useSantri";

// Components
import { BuatHalaqah } from "./BuatHalaqah";
import { EditHalaqah } from "./EditHalaqah";
import { DeleteHalaqah } from "./DeleteHalaqah";
import { DaftarHalaqah } from "./DaftarHalaqah";
import { SantriModal } from "../../muhafidz/KelolaSantri/SantriModal";
import { PindahSantri } from "@/components/forms/PindahSantri";
import { HalaqahManagement } from "@/components/ui/TypedText";

// UI Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function KelolaHalaqah() {
  // State Halaqah
  const [halaqahs, setHalaqahs] = useState<Halaqah[]>([]);
  const [isLoadingHalaqah, setIsLoadingHalaqah] = useState(true);
  const [selectedHalaqah, setSelectedHalaqah] = useState<Halaqah | null>(null);
  const [isEditHalaqahOpen, setIsEditHalaqahOpen] = useState(false);
  const [isDeleteHalaqahOpen, setIsDeleteHalaqahOpen] = useState(false);

  // State Santri
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);
  const [isEditSantriOpen, setIsEditSantriOpen] = useState(false);
  const [isDeleteSantriOpen, setIsDeleteSantriOpen] = useState(false);
  const [isMoveSantriOpen, setIsMoveSantriOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { santriList, loadSantri } = useSantri();

  // Load Data
  const fetchData = useCallback(async () => {
    setIsLoadingHalaqah(true);
    try {
      const res = await halaqahService.getAllHalaqah();
      setHalaqahs(res.data);
      // Load santri di background agar UI Halaqah tidak terhambat
      loadSantri();
    } catch (error) {
      toast.error("Gagal mengambil data halaqah");
    } finally {
      setIsLoadingHalaqah(false);
    }
  }, [loadSantri]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // OPTIMASI: Map santri ke ID Halaqah
  const santriMap = useMemo(() => {
    return santriList.reduce((acc, s) => {
      const key = s.halaqah_id;
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    }, {} as Record<number, Santri[]>);
  }, [santriList]);

  // --- HANDLER ACTIONS ---

  // Edit Santri Submit
  const handleEditSantriSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSantri) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      nama_santri: formData.get("nama_santri") as string,
      nomor_telepon: formData.get("nomor_telepon") as string,
      target: formData.get("target") as any,
      halaqah_id: Number(formData.get("halaqah_id")),
    };

    try {
      await santriService.update(selectedSantri.id_santri, payload);
      toast.success("Profil santri diperbarui");
      setIsEditSantriOpen(false);
      fetchData(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui santri");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Santri Confirm
  const handleDeleteSantriConfirm = async () => {
    if (!selectedSantri) return;
    try {
      await santriService.delete(selectedSantri.id_santri);
      toast.success("Santri berhasil dihapus");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus santri");
    } finally {
      setIsDeleteSantriOpen(false);
    }
  };

  // Move Santri Confirm
  const handleMoveSantriConfirm = async (santriId: number, targetHalaqahId: number) => {
    try {
      await santriService.update(santriId, { halaqah_id: targetHalaqahId });
      toast.success("Santri berhasil dipindahkan");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Gagal memindahkan santri");
      throw error;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <HalaqahManagement />
          <p className="text-muted-foreground">Kelola kelompok bimbingan santri.</p>
        </div>
        <BuatHalaqah onSuccess={fetchData} />
      </div>

      {/* Content */}
      {!isLoadingHalaqah && halaqahs.length === 0 ? (
        <EmptyState message="Belum ada halaqah yang dibuat." />
      ) : (
        <DaftarHalaqah
          halaqahs={halaqahs}
          santriMap={santriMap}
          isLoading={isLoadingHalaqah}
          onEdit={(h) => { setSelectedHalaqah(h); setIsEditHalaqahOpen(true); }}
          onDelete={(h) => { setSelectedHalaqah(h); setIsDeleteHalaqahOpen(true); }}
          onMoveSantri={(s) => { setSelectedSantri(s); setIsMoveSantriOpen(true); }}
          onEditSantri={(s) => { setSelectedSantri(s); setIsEditSantriOpen(true); }}
          onDeleteSantri={(s) => { setSelectedSantri(s); setIsDeleteSantriOpen(true); }}
        />
      )}

      {/* --- MODALS HALAQAH --- */}
      {selectedHalaqah && (
        <>
          <EditHalaqah
            halaqah={selectedHalaqah}
            isOpen={isEditHalaqahOpen}
            onClose={() => setIsEditHalaqahOpen(false)}
            onSuccess={fetchData}
          />
          <DeleteHalaqah
            halaqah={selectedHalaqah}
            isOpen={isDeleteHalaqahOpen}
            onClose={() => setIsDeleteHalaqahOpen(false)}
            onSuccess={fetchData}
          />
        </>
      )}

      {/* --- MODALS SANTRI --- */}
      
      {/* Edit Santri */}
      <SantriModal
        isOpen={isEditSantriOpen}
        onClose={() => setIsEditSantriOpen(false)}
        selectedSantri={selectedSantri}
        onSave={handleEditSantriSave}
        isAdmin={true}
        halaqahList={halaqahs}
        isSubmitting={isSubmitting}
      />

      {/* Pindah Santri */}
      <PindahSantri
        isOpen={isMoveSantriOpen}
        onClose={() => setIsMoveSantriOpen(false)}
        santri={selectedSantri}
        halaqahs={halaqahs}
        onConfirm={handleMoveSantriConfirm}
      />

      {/* Delete Santri Alert */}
      <AlertDialog open={isDeleteSantriOpen} onOpenChange={setIsDeleteSantriOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Santri?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{selectedSantri?.nama_santri}</strong>? 
              Tindakan ini akan memindahkan data ke tempat sampah.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSantriConfirm} 
              className="bg-destructive hover:bg-destructive/90"
            >
              Hapus Santri
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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