import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { type AbsensiStatus } from "@/services/absensiService";

interface Props {
  santriList: any[];
  attendanceMap: Record<number, AbsensiStatus>;
  onStatusChange: (id: number, status: AbsensiStatus) => void;
}

export const InputAbsensi = ({ santriList, attendanceMap, onStatusChange }: Props) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Nama Santri</TableHead>
            <TableHead className="w-[200px]">Status Kehadiran</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {santriList.map((s) => (
            <TableRow key={s.id_santri}>
              <TableCell className="font-medium">{s.nama_santri}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-between">
                      {attendanceMap[s.id_santri] || "Pilih Status"}
                      <span className="ml-2 text-[10px]">▼</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[180px]">
                    {(["HADIR", "IZIN", "SAKIT", "TERLAMBAT", "ALFA"] as AbsensiStatus[]).map((st) => (
                      <DropdownMenuItem key={st} onClick={() => onStatusChange(s.id_santri, st)}>
                        {st}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};