import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Languages } from "lucide-react";
import { useTerminologySettings } from "../hooks/useTerminologySettings";
import { TerminologyItemCard } from "./TerminologyItemCard";

export function TerminologySettingsCard() {
  const {
    tenant,
    entityConfigs,
    customLabels,
    savingKey,
    isSavingAll,
    handleLabelChange,
    handleSaveItem,
    handleResetItem,
    handleSaveAll,
  } = useTerminologySettings();

  return (
    <Card className="shadow-sm border-primary/5">
      <CardHeader className="py-5 px-6 border-b">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              Kustomisasi Istilah & Label Entitas
            </CardTitle>
            <CardDescription className="text-xs">
              Sesuaikan istilah sebutan di sistem dengan kultur dan identitas
              lembaga Anda (contoh: Santri menjadi Siswa atau Murid).
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-normal">
            {tenant?.nama_tenant || "Platform Default"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSaveAll} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {entityConfigs.map((item) => {
              const currentVal = customLabels[item.code] || "";
              const isSaving = savingKey === item.code;

              return (
                <TerminologyItemCard
                  key={item.code}
                  config={item}
                  value={currentVal}
                  isSaving={isSaving}
                  disabled={isSaving || isSavingAll}
                  onChange={(val) => handleLabelChange(item.code, val)}
                  onSave={() => handleSaveItem(item.code)}
                  onReset={() => handleResetItem(item.code)}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>
                Perubahan akan langsung diterapkan pada seluruh halaman dan
                formulir.
              </span>
            </div>
            <Button
              type="submit"
              disabled={isSavingAll || Boolean(savingKey)}
              className="gap-2 font-semibold"
            >
              {isSavingAll && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSavingAll ? "Menyimpan Semua..." : "Simpan Semua Istilah"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
