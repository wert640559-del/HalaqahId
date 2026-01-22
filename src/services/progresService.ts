// services/progresService.ts
import axiosClient from "@/api/axiosClient";

export interface ProgresSantri {
  id: number;
  nama: string;
  target: string;
  capaian: number;
  status: string;
  terakhirSetor: string;
  totalAyat: number;
}

export const progresService = {
  getAllProgres: async (): Promise<ApiResponse<ProgresSantri[]>> => {
    const response = await axiosClient.get<ApiResponse<any[]>>("/progres-santri");
    
    const mappedData = response.data.data.map((item: any) => ({
      id: item.id_santri || item.id,
      nama: item.nama_santri || item.name || item.nama,
      target: item.target_tipe || item.target,
      capaian: item.persentase || item.capaian || 0,
      status: item.status_label || item.status,
      terakhirSetor: item.terakhir_setoran || item.terakhirSetor || "-",
      totalAyat: item.total_ayat || item.totalAyat || 0
    }));

    return {
      ...response.data,
      data: mappedData
    };
  },
};

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
