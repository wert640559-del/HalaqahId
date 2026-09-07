import { ChevronLeft, Languages, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TerminologySettingsCard } from "../modules";
import { useAuth } from "@/features/auth/components/auth-provider";
import { isKepalaRole, Role } from "@/types/domain/enums";

export default function TerminologySettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isSuperAdmin = user?.role === Role.SUPERADMIN;
  const backPath = isSuperAdmin
    ? "/superadmin/settings"
    : user && isKepalaRole(user.role)
      ? "/kepala-muhafidz/settings"
      : "/muhafidz/settings";

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500 text-left">
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b pb-5">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(backPath)}
            className="rounded-full h-9 w-9 shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              Pengaturan Terminologi Lembaga
            </h1>
            <p className="text-xs text-muted-foreground">
              Atur dan kustomisasi sebutan istilah entitas sesuai kebutuhan lembaga Anda
            </p>
          </div>
        </div>
      </div>

      {/* ── ALERTS / INFO ── */}
      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-4 flex gap-3 text-emerald-800 dark:text-emerald-300">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold">Tentang Sistem Terminologi</p>
          <p className="leading-relaxed">
            Setiap instansi/sekolah dapat menggunakan istilah unik mereka sendiri. Label yang Anda ubah di sini akan langsung tercermin pada <strong>Navigasi Menu</strong>, <strong>Judul Halaman</strong>, <strong>Tabel Data</strong>, dan <strong>Formulir Setoran</strong>.
          </p>
        </div>
      </div>

      {/* ── CARD CONTENT ── */}
      <TerminologySettingsCard />
    </div>
  );
}
