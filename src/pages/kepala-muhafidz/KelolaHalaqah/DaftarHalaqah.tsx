import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Halaqah } from "@/services/halaqahService";
import { Skeleton } from "@/components/ui/skeleton";

interface DaftarHalaqahProps {
  halaqahs: Halaqah[];
  santriMap: Record<number, any[]>;
  onEdit: (h: Halaqah) => void;
  onDelete: (h: Halaqah) => void;
  isLoading?: boolean; 
}

export function DaftarHalaqah({ halaqahs, onEdit, onDelete, isLoading, santriMap }: DaftarHalaqahProps) {
  
  if (isLoading) return <HalaqahLoadingSkeleton />;

  return (
    <Accordion type="single" collapsible className="w-full space-y-3">
      {halaqahs.map((h) => {
      
      const daftarSantri = santriMap[h.id_halaqah] || [];

      return (
        <AccordionItem 
          key={h.id_halaqah} 
          value={h.id_halaqah.toString()} 
          className="border rounded-xl bg-card px-4 shadow-sm"
        >
          <AccordionTrigger className="hover:no-underline py-5">
            <div className="flex flex-1 items-center justify-between pr-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {h.name_halaqah.charAt(0)}
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg leading-tight">{h.name_halaqah}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faUserTie} className="text-[10px]" />
                      {h.muhafiz?.username || "Tanpa Muhafiz"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faUsers} className="text-[10px]" />
                      {h._count?.santri || 0} Santri
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-0 pb-6">
            <div className="flex justify-between items-center py-4 border-t border-dashed mb-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Daftar Anggota
              </h4>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuLabel>Aksi Halaqah</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onEdit(h)} className="cursor-pointer">
                    <Edit2 className="mr-2 h-4 w-4" />
                    <span>Edit Data</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(h)} 
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Hapus Halaqah</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead>Nama Santri</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead className="text-right">Target</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {daftarSantri.length > 0 ? (
                      daftarSantri.map((s) => (
                        <TableRow key={s.id_santri}>
                          <TableCell>{s.nama_santri}</TableCell>
                          <TableCell>{s.nomor_telepon}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={s.target === "INTENSE" ? "default" : "outline"}>
                              {s.target}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 italic opacity-50">
                          Tidak ada santri di kelompok ini.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      )})}
    </Accordion>
  );
}

function HalaqahLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 w-full rounded-xl" />
      ))}
    </div>
  );
}