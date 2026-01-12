import { useState, useEffect } from "react";
import { halaqahService, type Halaqah, type UpdateHalaqahData } from "@/services/halaqahService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface EditHalaqahProps {
  halaqah: Halaqah | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditHalaqah({ halaqah, isOpen, onClose, onSuccess }: EditHalaqahProps) {
  const [formData, setFormData] = useState<UpdateHalaqahData>({
    name_halaqah: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Inisialisasi form data saat halaqah berubah
  useEffect(() => {
    if (halaqah) {
      setFormData({
        name_halaqah: halaqah.name_halaqah || "",
        muhafiz_id: halaqah.muhafiz_id
      });
    }
  }, [halaqah]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!halaqah) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await halaqahService.updateHalaqah(halaqah.id_halaqah, formData);
      
      if (response.success) {
        setSuccess("Data halaqah berhasil diperbarui!");
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Gagal memperbarui data halaqah";
      setError(message);
      console.error("Edit halaqah error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name_halaqah: "" });
    setError("");
    setSuccess("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faEdit} />
            Edit Data Halaqah
          </DialogTitle>
          <DialogDescription>
            Edit informasi halaqah #{halaqah?.id_halaqah}
          </DialogDescription>
        </DialogHeader>

        {/* Success Alert */}
        {success && (
          <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <FontAwesomeIcon icon={faXmark} className="mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name_halaqah">name Halaqah</Label>
            <Input
              id="name_halaqah"
              value={formData.name_halaqah}
              onChange={(e) => setFormData({...formData, name_halaqah: e.target.value})}
              placeholder="Masukkan name halaqah"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Muhafidz:</strong> {halaqah?.muhafiz.username} ({halaqah?.muhafiz.email})
            </p>
            <p className="text-xs text-blue-600 mt-1">
              ID Muhafidz: #{halaqah?.muhafiz_id}
            </p>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name_halaqah?.trim()}
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}