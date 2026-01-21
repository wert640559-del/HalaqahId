import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useSantri } from "@/hooks/useSantri";
import { useAbsensi } from "@/hooks/useAbsensi";
import { InputAbsensi } from "./InputAbsensi";
import { RekapAbsensiTable } from "./RekapAbsensiTable";
import { type AbsensiStatus } from "@/services/absensiService";

export default function AbsensiLayout() {
  const { santriList, loadSantri } = useSantri();
  const { submitAbsensiBulk, isSubmitting } = useAbsensi();
  const [attendanceMap, setAttendanceMap] = useState<Record<number, AbsensiStatus>>({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => { loadSantri(); }, [loadSantri]);

  const handleSave = async () => {
    const payload = Object.entries(attendanceMap).map(([id, status]) => ({
      santri_id: Number(id),
      status,
      tanggal: format(selectedDate, "yyyy-MM-dd")
    }));
    await submitAbsensiBulk(payload);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="input">Input Harian</TabsTrigger>
          <TabsTrigger value="rekap">Rekap Bulanan</TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <Card>
            <CardHeader>
              <CardTitle>Absensi Santri - {format(selectedDate, "dd MMMM yyyy")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InputAbsensi 
                santriList={santriList} 
                attendanceMap={attendanceMap}
                onStatusChange={(id, status) => setAttendanceMap(prev => ({...prev, [id]: status}))}
              />
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Simpan Absensi"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rekap">
          {/* Komponen Tabel Matrix Bulanan yang sudah kita buat tadi */}
          <RekapAbsensiTable /> 
        </TabsContent>
      </Tabs>
    </div>
  );
}