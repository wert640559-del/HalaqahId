// src/services/displayService.ts
import { displayApi } from "@/api/axiosClient";

export const displayService = {
  getSantriList: async () => {
    const response = await displayApi.get("/santri");
    return response.data.data; 
  },
  getSetoranAll: async () => {
    const response = await displayApi.get("/setoran/all");
    return response.data.data;
  },
  getHalaqahList: async () => {
    const response = await displayApi.get("/halaqah");
    return response.data.data;
  },

  getAbsensiByHalaqah: async (halaqahId: number, date: string) => {
    // date format: YYYY-MM-DD
    const response = await displayApi.get(`/absensi/halaqah/${halaqahId}?date=${date}`);
    return response.data.data;
    }
};