import axiosClient from "@/api/axiosClient";
import type { AbsensiStatus } from "@/pages/muhafidz/Absensi/StatusBadge";

export interface AbsensiRecord {
  id_absensi?: number;
  id_santri: number;
  status: AbsensiStatus;
  tanggal: string; // Format: YYYY-MM-DD
  keterangan?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AbsensiResponse {
  message: string;
  data: AbsensiRecord[];
}

export const absensiService = {
  // 1. Get Absensi by Date (Mengambil data absensi pada tanggal tertentu)
  async getByDate(date: string): Promise<AbsensiRecord[]> {
    try {
      const response = await axiosClient.get(`/absensi?tanggal=${date}`);
      return response.data.data;
    } catch (error: any) {
      // Jika data tidak ditemukan (misal 404), kita kembalikan array kosong
      if (error.response?.status === 404) return [];
      throw new Error(error.response?.data?.message || "Gagal mengambil data absensi");
    }
  },

  // 2. Upsert/Bulk Create Absensi (Menyimpan banyak data sekaligus)
  async saveBulk(data: AbsensiRecord[]): Promise<AbsensiRecord[]> {
    try {
      const response = await axiosClient.post("/absensi", { data });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Gagal menyimpan data absensi");
    }
  }
};