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
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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
  if (!santri) return <div className="p-20 text-center bg-background text-foreground">Data tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 transition-colors duration-300">
      <div className="mx-auto max-w-5xl space-y-6">
        
        {/* Top Action Bar */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/display")} className="gap-2 hover:bg-card">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Button>
          <ThemeToggle />
        </div>

        {/* Profil Section */}
        <Card className="overflow-hidden border-none shadow-md bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-background shadow-sm">
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-2xl">
                    {santri.nama_santri.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">{santri.nama_santri}</h1>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground">{santri.target} TARGET</Badge>
                    <Badge variant="outline" className="border-primary/50 text-primary">{santri.halaqah?.name_halaqah}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground bg-background/50 p-3 rounded-lg border border-border/50">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" /> 
                  <span>Muhafidz: <b className="text-foreground">{muhafidz?.username || "-"}</b></span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" /> 
                  <span>Halaqah ID: <b className="text-foreground">{santri.halaqah_id}</b></span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Chart Card */}
          <Card className="border-none shadow-md bg-card overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
                <ChartIcon className="h-4 w-4 text-primary" /> Statistik Kehadiran
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[220px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} innerRadius={60} outerRadius={80} dataKey="value" stroke="none" paddingAngle={5}>
                        {chartData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "var(--popover)", 
                          borderRadius: "var(--radius)", 
                          border: "1px solid var(--border)",
                          fontSize: "12px"
                        }} 
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground italic">Tidak ada data kehadiran</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rekap Absensi Table Card */}
          <Card className="border-none shadow-md lg:col-span-2 bg-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20 space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
                  <Calendar className="h-4 w-4 text-primary" /> Rekap Harian
                </CardTitle>
                <CardDescription className="text-[10px] font-medium opacity-70">{format(viewDate, "MMMM yyyy", { locale: localeId })}</CardDescription>
              </div>
              <Select value={format(viewDate, "yyyy-MM")} onValueChange={(v) => setViewDate(new Date(v))}>
                <SelectTrigger className="w-[140px] h-8 text-[11px] bg-background">
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
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                      {daysInMonth.map((date) => (
                        <TableHead key={date.toString()} className="h-9 border-r border-border/50 p-0 text-center text-[10px] font-bold min-w-[30px]">
                          {getDate(date)}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-transparent">
                      {isLoadingAbsensi ? (
                        daysInMonth.map((d) => <TableCell key={d.toString()} className="border-r border-border/50 p-1"><Skeleton className="h-8 w-full" /></TableCell>)
                      ) : (
                        daysInMonth.map((date) => {
                          const dateStr = format(date, "yyyy-MM-dd");
                          const record = monthlyAbsensi.find(m => m.tanggal === dateStr)?.data?.find((s: any) => s.santri_id === Number(id));
                          const status = record?.status;
                          
                          return (
                            <TableCell key={date.toString()} className={cn(
                              "h-12 border-r border-border/50 p-0 text-center text-[11px] font-bold transition-colors",
                              status === "HADIR" && "bg-primary/20 text-primary border-b-2 border-b-primary",
                              status === "IZIN" && "bg-blue-500/20 text-blue-500 border-b-2 border-b-blue-500",
                              status === "SAKIT" && "bg-yellow-500/20 text-yellow-600 border-b-2 border-b-yellow-500",
                              status === "ALFA" && "bg-destructive/20 text-destructive border-b-2 border-b-destructive",
                              !status && "text-muted-foreground/20"
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
              <div className="p-3 flex gap-4 text-[9px] uppercase font-bold tracking-tighter opacity-60">
                 <div className="flex items-center gap-1"><div className="w-2 h-2 bg-primary rounded-full"/> Hadir</div>
                 <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"/> Izin</div>
                 <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-500 rounded-full"/> Sakit</div>
                 <div className="flex items-center gap-1"><div className="w-2 h-2 bg-destructive rounded-full"/> Alfa</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Setoran Section */}
        <Card className="border-none shadow-md bg-card overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <CardTitle className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
              <BookOpen className="h-4 w-4 text-primary" /> Riwayat Setoran Hafalan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow className="hover:bg-transparent border-b border-border/50">
                    <TableHead className="text-[10px] font-bold uppercase py-4 pl-6">Tanggal</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase py-4">Materi Hafalan</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase py-4">Kategori</TableHead>
                    <TableHead className="text-right text-[10px] font-bold uppercase py-4 pr-6">Predikat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allSetoran.length > 0 ? (
                    allSetoran.map((s) => (
                      <TableRow key={s.id_setoran} className="border-b border-border/50 hover:bg-muted/5">
                        <TableCell className="text-xs text-muted-foreground pl-6 whitespace-nowrap">
                           {format(parseISO(s.tanggal_setoran), "dd MMM yyyy", { locale: localeId })}
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-sm uppercase text-foreground">{s.surat}</div>
                          <div className="text-[10px] text-muted-foreground uppercase mt-0.5">Juz {s.juz} • Ayat {s.ayat}</div>
                        </TableCell>
                        <TableCell>
                           <Badge variant="outline" className="text-[9px] uppercase border-border/50 bg-background/50">
                              {s.kategori}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-right font-black text-primary italic uppercase pr-6">
                           {s.taqwim}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                       <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                          Belum ada riwayat setoran hafalan.
                       </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default SantriDetail;