import { useState, useCallback } from "react";
import { absensiService, type AbsensiRecord } from "@/services/absensiService";
import { format } from "date-fns";
import type { AbsensiStatus } from "@/pages/muhafidz/Absensi/StatusBadge";

export const useAbsensi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [absensiMap, setAbsensiMap] = useState<Record<number, AbsensiStatus>>({});

  // 1. Load Absensi
  const loadAbsensiByDate = useCallback(async (date: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const data = await absensiService.getByDate(formattedDate);
      
      const newMap: Record<number, AbsensiStatus> = {};
      data.forEach((item) => {
        // SESUAIKAN: Gunakan item.id_santri sesuai interface baru
        newMap[item.id_santri] = item.status;
      });
      
      setAbsensiMap(newMap);
      return data;
    } catch (err: any) {
      setError(err.message);
      setAbsensiMap({});
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Simpan Absensi 
  const submitAbsensi = useCallback(async (
    date: Date, 
    santriList: { id_santri: number }[]
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      
      const payload: AbsensiRecord[] = santriList.map((s) => ({
        // UBAH: Gunakan id_santri dan pastikan tipenya Number
        id_santri: Number(s.id_santri), 
        status: absensiMap[s.id_santri] || "HADIR",
        tanggal: formattedDate,
      }));

      const result = await absensiService.saveBulk(payload);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [absensiMap]);

  // 3. Update status lokal (di UI)
  const updateLocalStatus = useCallback((santriId: number, status: AbsensiStatus) => {
    setAbsensiMap((prev) => ({ ...prev, [santriId]: status }));
  }, []);

  // 4. Reset status lokal
  const resetLocalAbsensi = useCallback(() => {
    setAbsensiMap({});
  }, []);

  return {
    // State
    absensiMap,
    isLoading,
    error,
    
    // Actions
    loadAbsensiByDate,
    submitAbsensi,
    updateLocalStatus,
    resetLocalAbsensi,
    resetError: () => setError(null),
  };
};