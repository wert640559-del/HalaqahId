import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setoranSchema, type SetoranFormValues } from "@/utils/zodSchema";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// UI Components (Shadcn)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Mock Data
const MOCK_SANTRI = [
  { id: 1, nama: "Ahmad" },
  { id: 2, nama: "Zaid Ramadhan" },
  { id: 3, nama: "Umar Mukhtar" },
  { id: 4, nama: "Burhan" },
  { id: 5, nama: "Cahya" },
];

interface SetoranHistory {
  id: number;
  santri_id: number;
  nama: string;
  surah: string;
  ayat_mulai: number;
  ayat_selesai: number;
  ayat: string;
  nilai: number;
  catatan: string;
  tanggal: Date;
}

export default function InputSetoranPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [setoranHistory, setSetoranHistory] = useState<SetoranHistory[]>([
    { 
      id: 101, 
      santri_id: 1,
      nama: "Ahmad", 
      surah: "Al-Baqarah", 
      ayat_mulai: 1,
      ayat_selesai: 10,
      ayat: "1-10", 
      nilai: 90, 
      catatan: "Tajwid bagus",
      tanggal: new Date(2026, 0, 14)
    },
    { 
      id: 102, 
      santri_id: 2,
      nama: "Zaid Ramadhan", 
      surah: "An-Naba", 
      ayat_mulai: 1,
      ayat_selesai: 40,
      ayat: "1-40", 
      nilai: 85, 
      catatan: "Perlu perbaikan makhraj",
      tanggal: new Date(2026, 0, 14)
    },
    { 
      id: 103, 
      santri_id: 1,
      nama: "Ahmad", 
      surah: "Al-Baqarah", 
      ayat_mulai: 11,
      ayat_selesai: 15,
      ayat: "11-15", 
      nilai: 88, 
      catatan: "Hafalan lancar",
      tanggal: new Date(2026, 0, 14)
    },
    { 
      id: 104, 
      santri_id: 3,
      nama: "Umar Mukhtar", 
      surah: "Al-Fatihah", 
      ayat_mulai: 1,
      ayat_selesai: 7,
      ayat: "1-7", 
      nilai: 95, 
      catatan: "Sangat baik",
      tanggal: new Date(2026, 0, 13)
    },
  ]);

  const form = useForm<SetoranFormValues>({
    resolver: zodResolver(setoranSchema) as any,
    defaultValues: {
      santri_id: 0,
      surah: "",
      ayat_mulai: 1,
      ayat_selesai: 1,
      nilai: 80,
      catatan: "",
      tanggal: new Date(),
    },
  });

  function onSubmit(data: SetoranFormValues) {
    const newSetoran: SetoranHistory = {
      id: Date.now(),
      santri_id: data.santri_id,
      nama: MOCK_SANTRI.find(s => s.id === data.santri_id)?.nama || "",
      surah: data.surah,
      ayat_mulai: data.ayat_mulai,
      ayat_selesai: data.ayat_selesai,
      ayat: `${data.ayat_mulai}-${data.ayat_selesai}`,
      nilai: data.nilai,
      catatan: data.catatan || "",
      tanggal: selectedDate,
    };

    console.log("Submit Data:", newSetoran);
    
    // Tambahkan ke history
    setSetoranHistory(prev => [newSetoran, ...prev]);
    
    // Reset form
    form.reset({
      santri_id: 0,
      surah: "",
      ayat_mulai: 1,
      ayat_selesai: 1,
      nilai: 80,
      catatan: "",
      tanggal: selectedDate,
    });

    alert(`Setoran untuk ${newSetoran.nama} berhasil disimpan!`);
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      form.setValue("tanggal", date);
    }
  };

  // Filter history berdasarkan tanggal yang dipilih
  const filteredHistory = setoranHistory.filter(setoran => 
    setoran.tanggal.toDateString() === selectedDate.toDateString()
  );

  // Summary data
  const summary = {
    totalSetoran: filteredHistory.length,
    santriBerbeda: new Set(filteredHistory.map(s => s.santri_id)).size,
    rataRataNilai: filteredHistory.length > 0 
      ? (filteredHistory.reduce((sum, s) => sum + s.nilai, 0) / filteredHistory.length).toFixed(1)
      : "0",
  };

  // Fungsi untuk mendapatkan warna badge berdasarkan nilai
  const getNilaiColor = (nilai: number): string => {
    if (nilai >= 90) return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
    if (nilai >= 80) return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
    if (nilai >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
    return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Input Setoran Hafalan</CardTitle>
              <div className="flex items-center gap-3 mt-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <svg 
                        className="mr-2 h-4 w-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                      </svg>
                      {selectedDate ? (
                        format(selectedDate, "EEEE, dd MMMM yyyy", { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateChange}
                      initialFocus
                      className="pointer-events-auto"
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <CardDescription>
                  Pilih tanggal untuk mengisi atau melihat setoran
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {[
              { 
                label: "Total Setoran", 
                value: summary.totalSetoran, 
                color: "text-blue-600 dark:text-blue-400",
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              },
              { 
                label: "Santri", 
                value: summary.santriBerbeda, 
                color: "text-emerald-600 dark:text-emerald-400",
                icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              },
              { 
                label: "Rata-rata Nilai", 
                value: summary.rataRataNilai, 
                color: "text-amber-600 dark:text-amber-400",
                icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              },
            ].map((item) => (
              <Card key={item.label} className="text-center">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <svg 
                        className="h-5 w-5 text-muted-foreground" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                      <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Form Input Setoran */}
          <div className="rounded-xl border p-6 mb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pilih Santri */}
                  <FormField
                    control={form.control}
                    name="santri_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Santri</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih santri" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MOCK_SANTRI.map((s) => (
                              <SelectItem key={s.id} value={s.id.toString()}>
                                {s.nama}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Surah */}
                  <FormField
                    control={form.control}
                    name="surah"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surah</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Contoh: Al-Baqarah" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ayat Mulai */}
                  <FormField
                    control={form.control}
                    name="ayat_mulai"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ayat Mulai</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ayat Selesai */}
                  <FormField
                    control={form.control}
                    name="ayat_selesai"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ayat Selesai</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={form.watch("ayat_mulai") || 1}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Nilai */}
                  <FormField
                    control={form.control}
                    name="nilai"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nilai</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-3">
                            <Input 
                              type="number" 
                              min="0"
                              max="100"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              className="w-24"
                            />
                            <div className="flex-1">
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary transition-all"
                                  style={{ width: `${field.value}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>0</span>
                                <span>100</span>
                              </div>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Catatan */}
                  <FormField
                    control={form.control}
                    name="catatan"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Catatan</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Tambahkan catatan jika ada (opsional)" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    className="gap-2"
                    disabled={form.formState.isSubmitting}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Simpan Setoran
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Tabel Riwayat Setoran */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Riwayat Setoran</h3>
                <p className="text-sm text-muted-foreground">
                  Menampilkan setoran untuk {format(selectedDate, "dd MMMM yyyy", { locale: id })}
                </p>
              </div>
              <Badge variant="outline" className="font-normal">
                {filteredHistory.length} setoran
              </Badge>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold">Nama Santri</TableHead>
                    <TableHead className="font-bold">Surah</TableHead>
                    <TableHead className="font-bold text-center">Ayat</TableHead>
                    <TableHead className="font-bold text-center">Nilai</TableHead>
                    <TableHead className="font-bold">Catatan</TableHead>
                    <TableHead className="font-bold text-right">Waktu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.nama}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{item.surah}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm text-muted-foreground">
                          {item.ayat}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant="outline" 
                          className={`${getNilaiColor(item.nilai)} border font-medium`}
                        >
                          {item.nilai}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.catatan ? (
                          <span className="text-sm">{item.catatan}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">Tidak ada catatan</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {format(item.tanggal, "HH:mm", { locale: id })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredHistory.length === 0 && (
                <div className="py-10 text-center text-muted-foreground">
                  <svg 
                    className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                  <p>Belum ada setoran untuk tanggal ini.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}