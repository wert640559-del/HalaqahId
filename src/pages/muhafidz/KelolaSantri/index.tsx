import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlus, 
  faSearch, 
  faCheck, 
  faTimes, 
  faEdit,
  faTrash,
  faUndo,
  faEllipsisH,
  faUser,
  faBullseye,
  faPhone,
  faUsers
} from "@fortawesome/free-solid-svg-icons";

interface Santri {
  id_santri: number;
  nama_santri: string;
  nomor_telepon: string;
  target: "RINGAN" | "SEDANG" | "INTENSE";
  halaqah_id: number;
  is_active: boolean;
  halaqah_nama?: string;
}

interface Halaqah {
  id_halaqah: number;
  nama_halaqah: string;
  muhafidz_id: number;
}

export default function KelolaSantriPage() {
  // --- States ---
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [halaqahList, setHalaqahList] = useState<Halaqah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  
  // State untuk Modal (Tambah/Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - dalam implementasi real, ini akan dari API
  const mockHalaqah = [
    { id_halaqah: 1, nama_halaqah: "Halaqah Al-Fatihah", muhafidz_id: 1 },
    { id_halaqah: 2, nama_halaqah: "Halaqah Al-Baqarah", muhafidz_id: 2 },
  ];

  // Mock user role (dalam real app, ini dari auth context)
  const currentUser = {
    id: 1,
    role: "MUHAFIZ" as "ADMIN" | "MUHAFIZ",
    halaqah_id: 1
  };

  // --- Load Data ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulasi API call untuk halaqah
        setHalaqahList(mockHalaqah);
        
        // Simulasi API call untuk santri
        setTimeout(() => {
          const mockData: Santri[] = [
            { 
              id_santri: 1, 
              nama_santri: "Ahmad Farhan", 
              nomor_telepon: "081299001122", 
              target: "SEDANG", 
              halaqah_id: 1,
              is_active: true,
              halaqah_nama: "Halaqah Al-Fatihah"
            },
            { 
              id_santri: 2, 
              nama_santri: "Zaid Ramadhan", 
              nomor_telepon: "081299001133", 
              target: "INTENSE", 
              halaqah_id: 1,
              is_active: true,
              halaqah_nama: "Halaqah Al-Fatihah"
            },
            { 
              id_santri: 3, 
              nama_santri: "Umar Mukhtar", 
              nomor_telepon: "081299001144", 
              target: "RINGAN", 
              halaqah_id: 1,
              is_active: true,
              halaqah_nama: "Halaqah Al-Fatihah"
            },
          ];
          // Filter untuk Muhafiz (hanya santri di halaqahnya)
          const filteredData = currentUser.role === "ADMIN" 
            ? mockData 
            : mockData.filter(s => s.halaqah_id === currentUser.halaqah_id);
          
          setSantriList(filteredData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading data:", error);
        showFeedback('error', "Gagal memuat data santri");
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // --- Helper Functions ---
  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredSantri = useMemo(() => 
    santriList.filter(s => 
      s.nama_santri.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nomor_telepon.includes(searchTerm)
    ),
  [santriList, searchTerm]);

  const getTargetColor = (target: string) => {
    switch (target) {
      case "RINGAN": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "SEDANG": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "INTENSE": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  // --- Handlers ---
  const handleOpenAddModal = () => {
    setSelectedSantri(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (santri: Santri) => {
    setSelectedSantri(santri);
    setIsModalOpen(true);
  };

  const handleSaveSantri = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const data = {
        nama_santri: formData.get("nama_santri") as string,
        nomor_telepon: formData.get("nomor_telepon") as string,
        target: formData.get("target") as "RINGAN" | "SEDANG" | "INTENSE",
        halaqah_id: currentUser.role === "ADMIN" 
          ? parseInt(formData.get("halaqah_id") as string)
          : currentUser.halaqah_id
      };

      // Simulasi API call
      if (selectedSantri) {
        // Update
        const updated = await mockUpdateSantri(selectedSantri.id_santri, data);
        setSantriList(prev => prev.map(s => 
          s.id_santri === selectedSantri.id_santri ? { ...s, ...updated } : s
        ));
        showFeedback('success', `Berhasil memperbarui data ${data.nama_santri}`);
      } else {
        // Create
        const newSantri = await mockCreateSantri(data);
        setSantriList(prev => [...prev, newSantri]);
        showFeedback('success', `Berhasil menambah santri ${data.nama_santri}`);
      }
      setIsModalOpen(false);
    } catch (error: any) {
      showFeedback('error', error.message || "Gagal menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSantri = async (santri: Santri) => {
    if (confirm(`Hapus santri ${santri.nama_santri}?`)) {
      try {
        await mockDeleteSantri(santri.id_santri);
        setSantriList(prev => prev.filter(s => s.id_santri !== santri.id_santri));
        showFeedback('success', "Santri berhasil dihapus (soft delete)");
      } catch (error) {
        showFeedback('error', "Gagal menghapus santri");
      }
    }
  };

  const handleRestoreSantri = async (santri: Santri) => {
    try {
      await mockRestoreSantri(santri.id_santri);
      setSantriList(prev => prev.map(s => 
        s.id_santri === santri.id_santri ? { ...s, is_active: true } : s
      ));
      showFeedback('success', "Santri berhasil dipulihkan");
    } catch (error) {
      showFeedback('error', "Gagal memulihkan santri");
    }
  };

  // Mock API functions
  const mockCreateSantri = async (data: any): Promise<Santri> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id_santri: Date.now(),
          nama_santri: data.nama_santri,
          nomor_telepon: data.nomor_telepon,
          target: data.target,
          halaqah_id: data.halaqah_id,
          is_active: true,
          halaqah_nama: halaqahList.find(h => h.id_halaqah === data.halaqah_id)?.nama_halaqah
        });
      }, 500);
    });
  };

  const mockUpdateSantri = async (id: number, data: any): Promise<Santri> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id_santri: id,
          nama_santri: data.nama_santri,
          nomor_telepon: data.nomor_telepon,
          target: data.target,
          halaqah_id: data.halaqah_id,
          is_active: true,
          halaqah_nama: halaqahList.find(h => h.id_halaqah === data.halaqah_id)?.nama_halaqah
        });
      }, 500);
    });
  };

  const mockDeleteSantri = async (id: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  };

  const mockRestoreSantri = async (id: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  };

  // --- Stats Calculation ---
  const stats = {
    total: santriList.length,
    active: santriList.filter(s => s.is_active).length,
    inactive: santriList.filter(s => !s.is_active).length,
    ringan: santriList.filter(s => s.target === "RINGAN").length,
    sedang: santriList.filter(s => s.target === "SEDANG").length,
    intense: santriList.filter(s => s.target === "INTENSE").length,
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="space-y-6 container mx-auto py-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto py-6 animate-in fade-in duration-500">
      
      {/* 1. Header & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Kelola Santri</h2>
          <p className="text-muted-foreground text-sm">
            {currentUser.role === "ADMIN" 
              ? "Kelola semua santri dari semua halaqah" 
              : `Kelola santri di halaqah Anda (${halaqahList.find(h => h.id_halaqah === currentUser.halaqah_id)?.nama_halaqah || '-'})`
            }
          </p>
        </div>
        <Button onClick={handleOpenAddModal} className="gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Tambah Santri
        </Button>
      </div>

      {/* 2. Feedback Alert */}
      {feedback && (
        <Alert variant={feedback.type === 'success' ? "default" : "destructive"}>
          <FontAwesomeIcon icon={feedback.type === 'success' ? faCheck : faTimes} className="mr-2" />
          <AlertDescription>{feedback.msg}</AlertDescription>
        </Alert>
      )}

      {/* 3. Search Bar */}
      <div className="relative">
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Cari nama santri atau nomor telepon..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="pl-10 h-12" 
        />
      </div>

      {/* 4. Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <FontAwesomeIcon icon={faUsers} className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl md:text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aktif</p>
                <p className="text-xl md:text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <FontAwesomeIcon icon={faBullseye} className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Intense</p>
                <p className="text-xl md:text-2xl font-bold">{stats.intense}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900/30">
                <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nonaktif</p>
                <p className="text-xl md:text-2xl font-bold">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 5. Main Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Santri</CardTitle>
              <CardDescription>
                {filteredSantri.length} santri ditemukan {searchTerm && `untuk "${searchTerm}"`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">ID</TableHead>
                  <TableHead className="font-bold">Nama Santri</TableHead>
                  <TableHead className="font-bold">Nomor Telepon</TableHead>
                  <TableHead className="font-bold">Target</TableHead>
                  {currentUser.role === "ADMIN" && <TableHead className="font-bold">Halaqah</TableHead>}
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSantri.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "Tidak ada santri yang sesuai dengan pencarian" : "Belum ada data santri"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSantri.map((santri) => (
                    <TableRow key={santri.id_santri}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          #{santri.id_santri}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {santri.nama_santri}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faPhone} className="text-xs text-muted-foreground" />
                          <span>{santri.nomor_telepon}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getTargetColor(santri.target)} border`}>
                          {santri.target}
                        </Badge>
                      </TableCell>
                      {currentUser.role === "ADMIN" && (
                        <TableCell>
                          <span className="text-sm">{santri.halaqah_nama || `Halaqah ${santri.halaqah_id}`}</span>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div className={`h-2 w-2 rounded-full ${santri.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className="text-xs">{santri.is_active ? 'Aktif' : 'Nonaktif'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FontAwesomeIcon icon={faEllipsisH} className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {!santri.is_active && currentUser.role === "ADMIN" && (
                              <>
                                <DropdownMenuItem onClick={() => handleRestoreSantri(santri)}>
                                  <FontAwesomeIcon icon={faUndo} className="mr-2 h-3 w-3" />
                                  <span>Pulihkan</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            <DropdownMenuItem onClick={() => handleOpenEditModal(santri)}>
                              <FontAwesomeIcon icon={faEdit} className="mr-2 h-3 w-3" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            {santri.is_active && (
                              <DropdownMenuItem 
                                onClick={() => handleDeleteSantri(santri)}
                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              >
                                <FontAwesomeIcon icon={faTrash} className="mr-2 h-3 w-3" />
                                <span>Hapus</span>
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
        </CardContent>
      </Card>

      {/* 6. Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                RINGAN
              </Badge>
              <span className="text-muted-foreground">- 1-2 juz per bulan</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                SEDANG
              </Badge>
              <span className="text-muted-foreground">- 3-4 juz per bulan</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                INTENSE
              </Badge>
              <span className="text-muted-foreground">- 5+ juz per bulan</span>
            </div>
            <div className="pt-2 text-xs text-muted-foreground">
              * Hanya Admin yang dapat memulihkan santri yang telah dihapus
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7. Dialog Form */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSaveSantri(new FormData(e.currentTarget));
          }}>
            <DialogHeader>
              <DialogTitle>
                {selectedSantri ? "Edit Santri" : "Tambah Santri Baru"}
              </DialogTitle>
              <DialogDescription>
                {selectedSantri 
                  ? "Perbarui data santri di bawah ini."
                  : "Isi data santri baru di bawah ini."
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nama_santri">Nama Santri</Label>
                <Input 
                  id="nama_santri" 
                  name="nama_santri" 
                  defaultValue={selectedSantri?.nama_santri} 
                  required 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="nomor_telepon">Nomor Telepon</Label>
                <Input 
                  id="nomor_telepon" 
                  name="nomor_telepon" 
                  defaultValue={selectedSantri?.nomor_telepon} 
                  required 
                  placeholder="0812XXXXXX"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="target">Target Hafalan</Label>
                <Select name="target" defaultValue={selectedSantri?.target || "SEDANG"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RINGAN">Ringan (1-2 juz/bulan)</SelectItem>
                    <SelectItem value="SEDANG">Sedang (3-4 juz/bulan)</SelectItem>
                    <SelectItem value="INTENSE">Intense (5+ juz/bulan)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {currentUser.role === "ADMIN" && (
                <div className="grid gap-2">
                  <Label htmlFor="halaqah_id">Halaqah</Label>
                  <Select name="halaqah_id" defaultValue={selectedSantri?.halaqah_id.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih halaqah" />
                    </SelectTrigger>
                    <SelectContent>
                      {halaqahList.map((halaqah) => (
                        <SelectItem key={halaqah.id_halaqah} value={halaqah.id_halaqah.toString()}>
                          {halaqah.nama_halaqah}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : selectedSantri ? "Perbarui" : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Import tambahan untuk DropdownMenuSeparator
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";