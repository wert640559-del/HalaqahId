import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { halaqahSchema, type HalaqahFormData } from "@/components/forms/HalaqahForm/validation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Calendar, Clock, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BuatHalaqahProps {
  onSuccess?: () => void;
}

export default function BuatHalaqah({ onSuccess }: BuatHalaqahProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Mock muhafidz untuk dropdown
  const mockMuhafidz = [
    { id: 1, nama: "Ust. Ahmad Hidayat", halaqah_count: 2 },
    { id: 2, nama: "Ust. Bambang Prasetyo", halaqah_count: 1 },
    { id: 3, nama: "Ust. Cahyo Nugroho", halaqah_count: 0 },
    { id: 4, nama: "Ust. Dani Setiawan", halaqah_count: 1 },
  ];

    const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
    } = useForm<HalaqahFormData>({
        
    resolver: zodResolver(halaqahSchema) as any, // ← TAMBAHKAN 'as any'
    defaultValues: {
        nama_halaqah: "",
        kode_halaqah: "HQA-001",
        deskripsi: "",
        id_muhafidz: 0,
        hari: "senin",
        jam_mulai: "08:00",
        jam_selesai: "10:00",
        lokasi: "",
        kapasitas_maks: 20,
        status: "aktif"
    }
    });

  // Watch form values untuk validasi real-time
  const jamMulai = watch("jam_mulai");
  const jamSelesai = watch("jam_selesai");

  const handleGenerateKode = () => {
    // Generate kode otomatis (simple version)
    const randomNum = Math.floor(Math.random() * 900) + 100;
    setValue("kode_halaqah", `HQA-${randomNum}`, { shouldValidate: true });
  };

  // Validasi manual: jam selesai harus setelah jam mulai
  const validateTime = (): boolean => {
    if (jamMulai && jamSelesai) {
      const [startHour, startMinute] = jamMulai.split(":").map(Number);
      const [endHour, endMinute] = jamSelesai.split(":").map(Number);
      
      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;
      
      if (endTotal <= startTotal) {
        alert("Jam selesai harus setelah jam mulai");
        return false;
      }
    }
    return true;
  };

  const onSubmit = async (data: HalaqahFormData) => {
    // Validasi waktu sebelum submit
    if (!validateTime()) {
      return;
    }

    setLoading(true);
    try {
      console.log("Submitting halaqah data:", data);
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Halaqah berhasil dibuat!");
      if (onSuccess) onSuccess();
    } catch (error) {
      alert("Gagal membuat halaqah");
    } finally {
      setLoading(false);
    }
  };

  const selectedMuhafidz = watch("id_muhafidz");
  const selectedMuhafidzData = mockMuhafidz.find(m => m.id === selectedMuhafidz);

  return (
    <div className="max-w-4xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Daftar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5" />
            Buat Halaqah Baru
          </CardTitle>
          <p className="text-sm text-gray-500">
            Isi data lengkap untuk membuat kelompok halaqah baru
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Section 1: Identitas Halaqah */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Users className="h-4 w-4" />
                Identitas Halaqah
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama_halaqah">Nama Halaqah *</Label>
                  <Input
                    id="nama_halaqah"
                    placeholder="Contoh: Halaqah Al-Fatihah"
                    {...register("nama_halaqah")}
                    className={errors.nama_halaqah ? "border-red-500" : ""}
                  />
                  {errors.nama_halaqah && (
                    <p className="text-sm text-red-500">{errors.nama_halaqah.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="kode_halaqah">Kode Halaqah *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateKode}
                    >
                      Generate Kode
                    </Button>
                  </div>
                  <Input
                    id="kode_halaqah"
                    placeholder="Contoh: HQA-001"
                    {...register("kode_halaqah")}
                    className={errors.kode_halaqah ? "border-red-500" : ""}
                  />
                  {errors.kode_halaqah && (
                    <p className="text-sm text-red-500">{errors.kode_halaqah.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi Halaqah</Label>
                <Textarea
                  id="deskripsi"
                  {...register("deskripsi")}
                  rows={3}
                  placeholder="Deskripsi singkat tentang halaqah, target pembelajaran, atau informasi tambahan..."
                  className="resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Opsional</span>
                  <span>{watch("deskripsi")?.length || 0}/500 karakter</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_muhafidz">Muhafidz Pengampu *</Label>
                <select
                  id="id_muhafidz"
                  {...register("id_muhafidz", { 
                    valueAsNumber: true,
                    required: "Pilih muhafidz pengampu"
                  })}
                  className={`w-full border rounded-lg px-3 py-2 bg-background dark:bg-surface-dark ${
                    errors.id_muhafidz ? "border-red-500" : ""
                  }`}
                >
                  <option value={0}>-- Pilih Muhafidz --</option>
                  {mockMuhafidz.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama} {m.halaqah_count > 0 ? `(${m.halaqah_count} halaqah)` : "(Tersedia)"}
                    </option>
                  ))}
                </select>
                {errors.id_muhafidz && (
                  <p className="text-sm text-red-500">{errors.id_muhafidz.message}</p>
                )}
                
                {selectedMuhafidzData && selectedMuhafidz > 0 && (
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Info:</strong> {selectedMuhafidzData.nama} 
                      {selectedMuhafidzData.halaqah_count > 0 
                        ? ` sedang mengampu ${selectedMuhafidzData.halaqah_count} halaqah lain`
                        : " belum mengampu halaqah lain"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Jadwal & Lokasi */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Jadwal & Lokasi
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hari">Hari Pertemuan *</Label>
                  <select
                    id="hari"
                    {...register("hari")}
                    className="w-full border rounded-lg px-3 py-2 bg-background dark:bg-surface-dark"
                  >
                    <option value="senin">Senin</option>
                    <option value="selasa">Selasa</option>
                    <option value="rabu">Rabu</option>
                    <option value="kamis">Kamis</option>
                    <option value="jumat">Jumat</option>
                    <option value="sabtu">Sabtu</option>
                    <option value="minggu">Minggu</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jam_mulai" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Jam Mulai *
                  </Label>
                  <Input
                    id="jam_mulai"
                    type="time"
                    {...register("jam_mulai")}
                    className={errors.jam_mulai ? "border-red-500" : ""}
                  />
                  {errors.jam_mulai && (
                    <p className="text-sm text-red-500">{errors.jam_mulai.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jam_selesai" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Jam Selesai *
                  </Label>
                  <Input
                    id="jam_selesai"
                    type="time"
                    {...register("jam_selesai")}
                    className={errors.jam_selesai ? "border-red-500" : ""}
                  />
                  {errors.jam_selesai && (
                    <p className="text-sm text-red-500">{errors.jam_selesai.message}</p>
                  )}
                </div>
              </div>

              {/* Validasi waktu */}
              {jamMulai && jamSelesai && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-amber-700 dark:text-amber-300">
                      Durasi: {calculateDuration(jamMulai, jamSelesai)}
                    </span>
                    {!validateTime() && (
                      <span className="text-sm text-red-600 font-medium">
                        ⚠️ Jam selesai harus setelah jam mulai
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lokasi" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Lokasi *
                  </Label>
                  <Input
                    id="lokasi"
                    placeholder="Contoh: Masjid Al-Ikhlas, Ruang 101"
                    {...register("lokasi")}
                    className={errors.lokasi ? "border-red-500" : ""}
                  />
                  {errors.lokasi && (
                    <p className="text-sm text-red-500">{errors.lokasi.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kapasitas_maks">Kapasitas Maksimal *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="kapasitas_maks"
                      type="number"
                      min="1"
                      max="50"
                      {...register("kapasitas_maks", { 
                        valueAsNumber: true,
                        min: { value: 1, message: "Kapasitas minimal 1" },
                        max: { value: 50, message: "Kapasitas maksimal 50" }
                      })}
                      className={`flex-1 ${errors.kapasitas_maks ? "border-red-500" : ""}`}
                    />
                    <span className="text-gray-500">santri</span>
                  </div>
                  {errors.kapasitas_maks && (
                    <p className="text-sm text-red-500">{errors.kapasitas_maks.message}</p>
                  )}
                  <p className="text-xs text-gray-500">Rekomendasi: 15-20 santri per halaqah</p>
                </div>
              </div>
            </div>

            {/* Section 3: Status - FIXED */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="font-semibold text-lg">Status Halaqah</h3>
              <div className="space-y-2">
                <Label>Status Awal *</Label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="aktif"
                      {...register("status")}
                      className="text-primary cursor-pointer"
                    />
                    <span className="select-none">Aktif</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="nonaktif"
                      {...register("status")}
                      className="text-primary cursor-pointer"
                    />
                    <span className="select-none">Nonaktif</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="penuh"
                      {...register("status")}
                      className="text-primary cursor-pointer"
                    />
                    <span className="select-none">Penuh</span>
                  </label>
                </div>
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status.message}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <Button 
                type="submit" 
                disabled={loading || !validateTime()}
                className="gap-2 bg-primary hover:bg-primary-dark"
              >
                <Save className="h-4 w-4" />
                {loading ? "Menyimpan..." : "Simpan Halaqah"}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Informasi Tambahan */}
      <Card className="mt-6 bg-green-50 dark:bg-green-900/20 border-green-200">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">
            Tips Membuat Halaqah yang Efektif:
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-green-600 dark:text-green-400">
            <li>Pastikan jadwal tidak bentrok dengan halaqah lain di lokasi yang sama</li>
            <li>Pilih muhafidz yang sesuai dengan jumlah halaqah yang sedang diampu</li>
            <li>Sesuaikan kapasitas dengan ukuran ruangan dan kemampuan pengajar</li>
            <li>Gunakan kode halaqah yang unik dan mudah diingat</li>
            <li>Beri deskripsi yang jelas untuk memudahkan santri memahami tujuan halaqah</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function untuk menghitung durasi
function calculateDuration(start: string, end: string): string {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  
  const startTotal = startHour * 60 + startMinute;
  const endTotal = endHour * 60 + endMinute;
  
  const durationMinutes = endTotal - startTotal;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  if (hours > 0) {
    return `${hours} jam ${minutes > 0 ? `${minutes} menit` : ""}`;
  }
  return `${minutes} menit`;
}