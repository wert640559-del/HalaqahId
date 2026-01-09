import axiosClient from "@/api/axiosClient";

export interface HalaqahData {
  id_halaqah: number;
  kode_halaqah: string;
  nama_halaqah: string;
  deskripsi: string;
  status: "aktif" | "nonaktif" | "penuh";
  
  id_muhafidz: number;
  muhafidz_nama: string;
  muhafidz_email?: string;
  
  hari: "senin" | "selasa" | "rabu" | "kamis" | "jumat" | "sabtu" | "minggu";
  jam_mulai: string;
  jam_selesai: string;
  lokasi: string;
  
  kapasitas_maks: number;
  jumlah_santri_aktif: number;
  
  created_at: string;
  updated_at: string;
}

export interface CreateHalaqahPayload {
  kode_halaqah: string;
  nama_halaqah: string;
  deskripsi?: string;
  id_muhafidz: number;
  hari: "senin" | "selasa" | "rabu" | "kamis" | "jumat" | "sabtu" | "minggu";
  jam_mulai: string;
  jam_selesai: string;
  lokasi: string;
  kapasitas_maks: number;
  status?: "aktif" | "nonaktif" | "penuh";
}

export interface SantriHalaqah {
  id_santri_halaqah: number;
  id_santri: number;
  id_halaqah: number;
  nama_santri: string;
  nis?: string;
  tanggal_bergabung: string;
  tanggal_keluar?: string;
  status: "aktif" | "keluar" | "pindah";
  catatan?: string;
}

export interface AddSantriPayload {
  id_santri: number;
  id_halaqah: number;
  tanggal_bergabung?: string;
  catatan?: string;
}

export const halaqahService = {
  // Get semua halaqah
  getAll: async (): Promise<{ success: boolean; data: HalaqahData[] }> => {
    const response = await axiosClient.get("/halaqah");
    return response.data;
  },

  // Get halaqah by ID
  getById: async (id: number): Promise<{ success: boolean; data: HalaqahData }> => {
    const response = await axiosClient.get(`/halaqah/${id}`);
    return response.data;
  },

  // Buat halaqah baru
  create: async (payload: CreateHalaqahPayload): Promise<{ success: boolean; data: HalaqahData }> => {
    const response = await axiosClient.post("/halaqah", payload);
    return response.data;
  },

  // Update halaqah
  update: async (id: number, payload: Partial<CreateHalaqahPayload>): Promise<{ success: boolean; data: HalaqahData }> => {
    const response = await axiosClient.put(`/halaqah/${id}`, payload);
    return response.data;
  },

  // Hapus halaqah (soft delete)
  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await axiosClient.delete(`/halaqah/${id}`);
    return response.data;
  },

  // Nonaktifkan halaqah
  deactivate: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await axiosClient.post(`/halaqah/${id}/deactivate`);
    return response.data;
  },

  // Aktifkan halaqah
  activate: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await axiosClient.post(`/halaqah/${id}/activate`);
    return response.data;
  },

  // Get santri dalam halaqah
  getSantri: async (idHalaqah: number): Promise<{ success: boolean; data: SantriHalaqah[] }> => {
    const response = await axiosClient.get(`/halaqah/${idHalaqah}/santri`);
    return response.data;
  },

  // Tambah santri ke halaqah
  addSantri: async (payload: AddSantriPayload): Promise<{ success: boolean; data: SantriHalaqah }> => {
    const response = await axiosClient.post("/halaqah/santri", payload);
    return response.data;
  },

  // Keluarkan santri dari halaqah
  removeSantri: async (idSantriHalaqah: number, catatan?: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosClient.delete(`/halaqah/santri/${idSantriHalaqah}`, {
      data: { catatan }
    });
    return response.data;
  },

  // Transfer santri antar halaqah
  transferSantri: async (idSantriHalaqah: number, idHalaqahBaru: number): Promise<{ success: boolean; message: string }> => {
    const response = await axiosClient.post(`/halaqah/santri/${idSantriHalaqah}/transfer`, {
      id_halaqah_baru: idHalaqahBaru
    });
    return response.data;
  },

  // Get statistik halaqah
  getStats: async (): Promise<{ 
    success: boolean; 
    data: {
      total_halaqah: number;
      halaqah_aktif: number;
      total_santri: number;
      kapasitas_terisi: number;
      per_hari: Record<string, number>;
    } 
  }> => {
    const response = await axiosClient.get("/halaqah/stats");
    return response.data;
  }
};