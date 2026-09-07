import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Check } from "lucide-react";
import type { TerminologyConfigItem } from "../types";

interface TerminologyItemCardProps {
  config: TerminologyConfigItem;
  value: string;
  isSaving: boolean;
  disabled: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
  onReset: () => void;
}

export function TerminologyItemCard({
  config,
  value,
  isSaving,
  disabled,
  onChange,
  onSave,
  onReset,
}: TerminologyItemCardProps) {
  const hasCustom = Boolean(value.trim());

  return (
    <div className="rounded-xl border p-4.5 bg-card/60 hover:bg-card transition-colors space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{config.defaultLabel}</span>
          <Badge
            variant={hasCustom ? "default" : "secondary"}
            className="text-[10px] uppercase font-bold"
          >
            {config.code}
          </Badge>
        </div>

        {hasCustom && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={onReset}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive gap-1"
            title="Kembalikan ke default"
          >
            <RefreshCw className="h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">{config.description}</p>

      <div className="space-y-1.5 pt-1">
        <Label
          htmlFor={`term-${config.code}`}
          className="text-xs font-medium text-foreground"
        >
          Label Kustom
        </Label>
        <div className="flex gap-2">
          <Input
            id={`term-${config.code}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={config.placeholder}
            className="h-9 text-sm"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={disabled}
            onClick={onSave}
            className="h-9 px-3 shrink-0"
            title="Simpan label ini"
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5 text-primary" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
