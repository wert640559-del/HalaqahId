import { useState, useEffect } from "react"; // Tambah useEffect
import { useHalaqah } from "@/hooks/useHalaqah";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; // Tambah Skeleton
import { 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  Users,
  MoreVertical,
  Calendar,
  MapPin,
  AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DaftarHalaqahProps {
  onEditClick: (id: number) => void;
}

// Type untuk mock data yang lengkap
interface MockHalaqahItem {
  id_halaqah: number;
  kode_halaqah: string;
  nama_halaqah: string;
  deskripsi?: string; // Opsional
  status: "aktif" | "nonaktif" | "penuh";
  muhafidz_nama: string;
  jumlah_santri_aktif: number;
  kapasitas_maks: number;
  hari: "senin" | "selasa" | "rabu" | "kamis" | "jumat" | "sabtu" | "minggu";
  jam_mulai: string;
  jam_selesai: string;
  lokasi: string;
}

export default function DaftarHalaqah({ onEditClick }: DaftarHalaqahProps) {
  const { halaqah, loading, error, fetchHalaqah } = useHalaqah();
  const [search, setSearch] = useState("");
  const [hariFilter, setHariFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch data saat component mount
  useEffect(() => {
    fetchHalaqah();
  }, [fetchHalaqah]);

  // Mock data yang LENGKAP (tambah deskripsi)
  const mockHalaqah: MockHalaqahItem[] = [
    {
      id_halaqah: 1,
      kode_halaqah: "HQA-001",
      nama_halaqah: "Halaqah Al-Fatihah",
      deskripsi: "Halaqah untuk pemula juz 30",
      status: "aktif",
      muhafidz_nama: "Ust. Ahmad Hidayat",
      jumlah_santri_aktif: 15,
      kapasitas_maks: 20,
      hari: "senin",
      jam_mulai: "08:00",
      jam_selesai: "10:00",
      lokasi: "Masjid Al-Ikhlas"
    },
    {
      id_halaqah: 2,
      kode_halaqah: "HQA-002",
      nama_halaqah: "Halaqah Al-Baqarah",
      deskripsi: "Kelas lanjutan untuk juz 1-3",
      status: "aktif",
      muhafidz_nama: "Ust. Bambang Prasetyo",
      jumlah_santri_aktif: 18,
      kapasitas_maks: 20,
      hari: "selasa",
      jam_mulai: "14:00",
      jam_selesai: "16:00",
      lokasi: "Ruang 101"
    },
    {
      id_halaqah: 3,
      kode_halaqah: "HQA-003",
      nama_halaqah: "Halaqah Ali Imran",
      deskripsi: "Halaqah tahfidz khusus wanita",
      status: "penuh",
      muhafidz_nama: "Ust. Cahyo Nugroho",
      jumlah_santri_aktif: 20,
      kapasitas_maks: 20,
      hari: "rabu",
      jam_mulai: "09:00",
      jam_selesai: "11:00",
      lokasi: "Masjid Al-Falah"
    },
    {
      id_halaqah: 4,
      kode_halaqah: "HQA-004",
      nama_halaqah: "Halaqah An-Nisa",
      deskripsi: "Halaqah sore untuk karyawan",
      status: "nonaktif",
      muhafidz_nama: "Ust. Dani Setiawan",
      jumlah_santri_aktif: 12,
      kapasitas_maks: 15,
      hari: "kamis",
      jam_mulai: "10:00",
      jam_selesai: "12:00",
      lokasi: "Ruang 102"
    },
  ];

  // Gunakan data dari hook jika ada, else use mock
  const dataSource = halaqah && halaqah.length > 0 ? halaqah : mockHalaqah;

  const getStatusBadge = (status: string) => {
    const config = {
      aktif: { 
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", 
        label: "Aktif" 
      },
      nonaktif: { 
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300", 
        label: "Nonaktif" 
      },
      penuh: { 
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", 
        label: "Penuh" 
      }
    };
    
    const cfg = config[status as keyof typeof config];
    if (!cfg) {
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
    return <Badge className={cfg.color}>{cfg.label}</Badge>;
  };

  const getHariBadge = (hari: string) => {
    const hariLabels: Record<string, string> = {
      senin: "Senin",
      selasa: "Selasa",
      rabu: "Rabu",
      kamis: "Kamis",
      jumat: "Jumat",
      sabtu: "Sabtu",
      minggu: "Minggu"
    };
    
    const colors: Record<string, string> = {
      senin: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      selasa: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
      rabu: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
      kamis: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
      jumat: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      sabtu: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      minggu: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
    };
    
    const label = hariLabels[hari] || hari;
    const colorClass = colors[hari] || "bg-gray-100 text-gray-800";
    
    return (
      <Badge className={colorClass}>
        {label}
      </Badge>
    );
  };

  const filteredHalaqah = dataSource.filter(item => {
    const matchesSearch = 
      item.nama_halaqah.toLowerCase().includes(search.toLowerCase()) ||
      item.kode_halaqah.toLowerCase().includes(search.toLowerCase()) ||
      item.muhafidz_nama.toLowerCase().includes(search.toLowerCase());
    
    const matchesHari = hariFilter === "all" || item.hari === hariFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesHari && matchesStatus;
  });

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        {/* Skeleton untuk filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        {/* Skeleton untuk table */}
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}. Menggunakan data contoh untuk demo.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari nama, kode, atau muhafidz..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-400 h-4 w-4" />
            <select 
              value={hariFilter}
              onChange={(e) => setHariFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 bg-background dark:bg-surface-dark text-sm"
            >
              <option value="all">Semua Hari</option>
              <option value="senin">Senin</option>
              <option value="selasa">Selasa</option>
              <option value="rabu">Rabu</option>
              <option value="kamis">Kamis</option>
              <option value="jumat">Jumat</option>
              <option value="sabtu">Sabtu</option>
              <option value="minggu">Minggu</option>
            </select>
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-background dark:bg-surface-dark text-sm"
          >
            <option value="all">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
            <option value="penuh">Penuh</option>
          </select>
        </div>
      </div>

      {/* Info jumlah data */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Menampilkan {filteredHalaqah.length} dari {dataSource.length} halaqah
        </p>
        {halaqah.length === 0 && (
          <Badge variant="outline" className="text-amber-600 border-amber-300">
            Menggunakan data contoh
          </Badge>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-accent/30">
            <TableRow>
              <TableHead className="w-24">Kode</TableHead>
              <TableHead>Nama Halaqah</TableHead>
              <TableHead className="w-48">Muhafidz</TableHead>
              <TableHead className="w-32">Santri</TableHead>
              <TableHead className="w-40">Jadwal</TableHead>
              <TableHead className="w-48">Lokasi</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="w-24 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHalaqah.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-gray-300" />
                    <p>Tidak ada data halaqah yang ditemukan</p>
                    <p className="text-sm text-gray-400">
                      Coba ubah filter atau kata kunci pencarian
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredHalaqah.map((h) => (
                <TableRow key={h.id_halaqah} className="hover:bg-accent/10">
                  <TableCell className="font-mono font-semibold">
                    {h.kode_halaqah}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{h.nama_halaqah}</div>
                      {h.deskripsi && (
                        <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                          {h.deskripsi}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                        {h.muhafidz_nama.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <span className="block font-medium truncate">
                          {h.muhafidz_nama}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{h.jumlah_santri_aktif}</span>
                        <span className="text-xs text-gray-500">/ {h.kapasitas_maks}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            h.status === "penuh" 
                              ? "bg-blue-500" 
                              : "bg-primary"
                          }`}
                          style={{ 
                            width: `${Math.min(
                              (h.jumlah_santri_aktif / h.kapasitas_maks) * 100, 
                              100
                            )}%` 
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {getHariBadge(h.hari)}
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {h.jam_mulai} - {h.jam_selesai}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      <span className="line-clamp-2">{h.lokasi}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(h.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Eye className="h-4 w-4" />
                          <span>Lihat Detail</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 cursor-pointer"
                          onClick={() => onEditClick(h.id_halaqah)}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span>Edit Halaqah</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Users className="h-4 w-4" />
                          <span>Kelola Santri</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        {h.status === "aktif" ? (
                          <DropdownMenuItem className="gap-2 text-red-600 cursor-pointer">
                            <span>Nonaktifkan Halaqah</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="gap-2 text-green-600 cursor-pointer">
                            <span>Aktifkan Halaqah</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer info */}
      {filteredHalaqah.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Klik menu aksi untuk mengelola halaqah
        </div>
      )}
    </div>
  );
}

// Import DropdownMenuSeparator yang belum di-import
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";