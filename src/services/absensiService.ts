import axiosClient from "@/api/axiosClient";
import { type ApiResponse } from "./halaqahService";

export type AbsensiStatus = "HADIR" | "IZIN" | "SAKIT" | "ALFA" | "TERLAMBAT";

export interface AbsensiPayload {
  santri_id: number;
  status: AbsensiStatus;
  keterangan?: string;
  tanggal?: string; // YYYY-MM-DD
}

export const absensiService = {
  // POST /api/absensi
  catatAbsensi: async (payload: AbsensiPayload) => {
    const res = await axiosClient.post<ApiResponse<any>>("/absensi", payload);
    return res.data;
  },

  // GET /api/absensi/halaqah/:id
  getRekapHalaqah: async (halaqahId: number, date?: string, month?: string, year?: string) => {
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    if (month) params.append("month", month);
    if (year) params.append("year", year);

    const res = await axiosClient.get<ApiResponse<any[]>>(
      `/absensi/halaqah/${halaqahId}?${params.toString()}`
    );
    return res.data;
  }
};