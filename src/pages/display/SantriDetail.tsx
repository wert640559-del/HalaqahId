import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { displayService } from "@/services/displayService";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDate, 
  parseISO 
} from "date-fns";
import { id as localeId } from "date-fns/locale";

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Recharts
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Icons
import { ArrowLeft, BookOpen, GraduationCap, Calendar, PieChart as ChartIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const SantriDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data States
  const [loading, setLoading] = useState(true);
  const [santri, setSantri] = useState<any>(null);
  const [muhafidz, setMuhafidz] = useState<any>(null);
  const [allSetoran, setAllSetoran] = useState<any[]>([]);
  
  // Absensi States
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [monthlyAbsensi, setMonthlyAbsensi] = useState<any[]>([]);
  const [isLoadingAbsensi, setIsLoadingAbsensi] = useState(false);

  const daysInMonth = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(viewDate),
      end: endOfMonth(viewDate)
    });
  }, [viewDate]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [resSantri, resSetoran, resHalaqah] = await Promise.all([
        displayService.getSantriList(),
        displayService.getSetoranAll(),
        displayService.getHalaqahList()
      ]);

      const currentSantri = resSantri.find((s: any) => s.id_santri === Number(id));
      if (!currentSantri) return;

      setSantri(currentSantri);
      setAllSetoran(resSetoran.filter((set: any) => set.santri_id === Number(id)));
      
      const halaqah = resHalaqah.find((h: any) => h.id_halaqah === currentSantri.halaqah_id);
      setMuhafidz(halaqah?.muhafiz);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchMonthlyAbsensi = useCallback(async () => {
    if (!santri?.halaqah_id) return;
    setIsLoadingAbsensi(true);
    try {
      const requests = daysInMonth.map(date => {
        const dateStr = format(date, "yyyy-MM-dd");
        return displayService.getAbsensiByHalaqah(santri.halaqah_id, dateStr)
          .then(res => ({ tanggal: dateStr, data: res }))
          .catch(() => ({ tanggal: dateStr, data: [] }));
      });
      const results = await Promise.all(requests);
      setMonthlyAbsensi(results);
    } finally {
      setIsLoadingAbsensi(false);
    }
  }, [santri, daysInMonth]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { fetchMonthlyAbsensi(); }, [fetchMonthlyAbsensi]);

  const chartData = useMemo(() => {
    const stats = { HADIR: 0, IZIN: 0, SAKIT: 0, ALFA: 0 };
    monthlyAbsensi.forEach(day => {
      const record = day.data?.find((item: any) => item.santri_id === Number(id));
      if (record?.status) stats[record.status as keyof typeof stats]++;
    });
    return [
      { name: "Hadir", value: stats.HADIR, fill: "var(--primary)" },
      { name: "Izin/Sakit", value: stats.IZIN + stats.SAKIT, fill: "var(--secondary)" },
      { name: "Alfa", value: stats.ALFA, fill: "var(--destructive)" },
    ].filter(d => d.value > 0);
  }, [monthlyAbsensi, id]);

  if (loading) return <div className="flex h-screen items-center justify-center bg-background"><Skeleton className="h-12 w-12 rounded-full" /></div>;
  if (!santri) return <div className="p-20 text-center">Data tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        
        <Button variant="ghost" onClick={() => navigate("/display")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Button>

        {/* Profil Section */}
        <Card className="overflow-hidden border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/10">
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xl">
                    {santri.nama_santri.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight uppercase">{santri.nama_santri}</h1>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge variant="secondary">{santri.target} TARGET</Badge>
                    <Badge variant="outline" className="border-primary text-primary">{santri.halaqah?.name_halaqah}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" /> 
                  <span>Muhafidz: {muhafidz?.username || "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> 
                  <span>Halaqah ID: {santri.halaqah_id}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Chart Card */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider">
                <ChartIcon className="h-4 w-4" /> Statistik Kehadiran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                        {chartData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: "var(--radius)", border: "none" }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground italic">Tidak ada data</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rekap Absensi Table Card */}
          <Card className="border-none shadow-sm lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider">
                  <Calendar className="h-4 w-4" /> Rekap Harian
                </CardTitle>
                <CardDescription className="text-xs">{format(viewDate, "MMMM yyyy", { locale: localeId })}</CardDescription>
              </div>
              <Select value={format(viewDate, "yyyy-MM")} onValueChange={(v) => setViewDate(new Date(v))}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3].map((i) => {
                    const d = new Date(); d.setMonth(d.getMonth() - i);
                    return <SelectItem key={i} value={format(d, "yyyy-MM")} className="text-xs">{format(d, "MMMM yyyy", { locale: localeId })}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      {daysInMonth.map((date) => (
                        <TableHead key={date.toString()} className="h-8 border-r p-0 text-center text-[9px] font-bold">
                          {getDate(date)}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      {isLoadingAbsensi ? (
                        daysInMonth.map((d) => <TableCell key={d.toString()} className="border-r p-1"><Skeleton className="h-6 w-full" /></TableCell>)
                      ) : (
                        daysInMonth.map((date) => {
                          const dateStr = format(date, "yyyy-MM-dd");
                          const record = monthlyAbsensi.find(m => m.tanggal === dateStr)?.data?.find((s: any) => s.santri_id === Number(id));
                          const status = record?.status;
                          
                          return (
                            <TableCell key={date.toString()} className={cn(
                              "h-10 border-r p-0 text-center text-[10px] font-bold border-b",
                              status === "HADIR" && "bg-primary text-primary-foreground",
                              status === "IZIN" && "bg-blue-500 text-white",
                              status === "SAKIT" && "bg-yellow-500 text-white",
                              status === "ALFA" && "bg-destructive text-destructive-foreground",
                              !status && "text-muted/20"
                            )}>
                              {status ? status.charAt(0) : "-"}
                            </TableCell>
                          );
                        })
                      )}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Setoran Section */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider">
              <BookOpen className="h-4 w-4" /> Riwayat Setoran Hafalan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-xs font-bold">TANGGAL</TableHead>
                  <TableHead className="text-xs font-bold">MATERI</TableHead>
                  <TableHead className="text-xs font-bold">KATEGORI</TableHead>
                  <TableHead className="text-right text-xs font-bold">PREDIKAT</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allSetoran.length > 0 ? (
                  allSetoran.map((s) => (
                    <TableRow key={s.id_setoran}>
                      <TableCell className="text-xs text-muted-foreground">{format(parseISO(s.tanggal_setoran), "dd/MM/yy")}</TableCell>
                      <TableCell>
                        <div className="font-bold text-sm uppercase">{s.surat}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">Juz {s.juz} • Ayat {s.ayat}</div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px] uppercase">{s.kategori}</Badge></TableCell>
                      <TableCell className="text-right font-bold text-primary italic uppercase">{s.taqwim}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground italic">Belum ada data setoran</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default SantriDetail;