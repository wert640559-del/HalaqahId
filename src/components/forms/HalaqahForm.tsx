import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { halaqahService, type CreateHalaqahData, type UpdateHalaqahData } from "@/services/halaqahService";
import { akunService } from "@/services/akunService"; // Import service muhafiz

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Import Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faPlus, faCheck, faExclamationTriangle, faUserTie } from "@fortawesome/free-solid-svg-icons";

// Sesuai dengan dokumentasi API: hanya name_halaqah dan muhafiz_id
const halaqahSchema = z.object({
  name_halaqah: z.string().min(3, "Nama halaqah minimal 3 karakter"),
  muhafiz_id: z.number().min(1, "Pilih muhafiz"), // Field yang benar dari API
});

type HalaqahFormValues = z.infer<typeof halaqahSchema>;

interface HalaqahFormProps {
  onSuccess?: () => void;
  initialData?: {
    id_halaqah?: number;
    name_halaqah?: string;
    muhafiz_id?: number; // Field yang benar dari API
  };
}

export function HalaqahForm({ onSuccess, initialData }: HalaqahFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMuhafiz, setLoadingMuhafiz] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [allMuhafiz, setAllMuhafiz] = useState<Array<{ id_user: number; username: string; email: string }>>([]);
  const [halaqahList, setHalaqahList] = useState<any[]>([]);

  const form = useForm<HalaqahFormValues>({
    resolver: zodResolver(halaqahSchema),
    defaultValues: {
      name_halaqah: initialData?.name_halaqah || "",
      muhafiz_id: initialData?.muhafiz_id || 0, // Field yang benar
    },
  });

  useEffect(() => {
    loadMuhafizAndHalaqah();
  }, []);

  const loadMuhafizAndHalaqah = async () => {
    setLoadingMuhafiz(true);
    try {
      // 1. Ambil semua muhafiz
      const muhafizResponse = await akunService.getAllMuhafiz();
      const muhafizList = muhafizResponse.data.map(m => ({
        id_user: m.id_user,
        username: m.username,
        email: m.email
      }));
      setAllMuhafiz(muhafizList);

      // 2. Ambil semua halaqah untuk mengecek yang sudah punya halaqah
      const halaqahResponse = await halaqahService.getAllHalaqah();
      setHalaqahList(halaqahResponse.data);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Gagal memuat data");
    } finally {
      setLoadingMuhafiz(false);
    }
  };

  // Filter muhafiz yang belum memiliki halaqah
  const getAvailableMuhafiz = () => {
    const muhafizWithHalaqah = new Set(halaqahList.map(h => h.muhafiz_id));
    
    // Jika sedang edit, tambahkan muhafiz yang sedang mengampu halaqah ini
    if (initialData?.muhafiz_id) {
      return allMuhafiz.filter(m => 
        !muhafizWithHalaqah.has(m.id_user) || m.id_user === initialData.muhafiz_id
      );
    }
    
    return allMuhafiz.filter(m => !muhafizWithHalaqah.has(m.id_user));
  };

  const availableMuhafiz = getAvailableMuhafiz();

  async function onSubmit(values: HalaqahFormValues) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Data yang sesuai dengan dokumentasi API
      const data: CreateHalaqahData = {
        name_halaqah: values.name_halaqah,
        muhafiz_id: values.muhafiz_id,
        // Tidak ada field 'jenis' dalam dokumentasi API
      };

      if (initialData?.id_halaqah) {
        // Untuk update, gunakan UpdateHalaqahData
        const updateData: UpdateHalaqahData = {
          name_halaqah: values.name_halaqah,
          muhafiz_id: values.muhafiz_id,
        };
        await halaqahService.updateHalaqah(initialData.id_halaqah, updateData);
        toast.success("Halaqah berhasil diperbarui");
      } else {
        await halaqahService.createHalaqah(data);
        toast.success("Halaqah baru berhasil dibuat");
      }

      form.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.message || "Terjadi kesalahan saat menyimpan data";
      setErrorMessage(message);
      
      // Handle error spesifik dari API
      if (error.response?.data?.message?.includes("muhafiz_id sudah digunakan")) {
        toast.error("Muhafiz ini sudah memiliki halaqah");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 text-left">
      {availableMuhafiz.length === 0 && !loadingMuhafiz && (
        <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive">
          <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4" />
          <AlertTitle>Muhafiz Tidak Tersedia</AlertTitle>
          <AlertDescription className="text-xs">
            Semua muhafiz sudah memiliki halaqah. Silahkan buat akun muhafiz baru terlebih dahulu sebelum membuat halaqah.
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          
          <FormField
            control={form.control}
            name="name_halaqah"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Nama Halaqah</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <FontAwesomeIcon icon={faBook} />
                    </span>
                    <Input
                      {...field}
                      placeholder="Contoh: Halaqah Abu Bakar"
                      disabled={isLoading}
                      className="pl-10 h-11"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hapus field 'jenis' karena tidak ada dalam dokumentasi API */}
          
          <FormField
            control={form.control}
            name="muhafiz_id"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Muhafiz</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  defaultValue={field.value ? field.value.toString() : undefined}
                  disabled={loadingMuhafiz || availableMuhafiz.length === 0}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      {loadingMuhafiz ? (
                        <span className="flex items-center gap-2">
                          <Spinner className="h-4 w-4" /> Memuat...
                        </span>
                      ) : (
                        <SelectValue placeholder="Pilih muhafiz" />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableMuhafiz.map((muhafiz) => (
                      <SelectItem key={muhafiz.id_user} value={muhafiz.id_user.toString()}>
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faUserTie} className="text-sm" />
                          <div>
                            <div className="font-medium">{muhafiz.username}</div>
                            <div className="text-xs text-muted-foreground">{muhafiz.email}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
                {availableMuhafiz.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {availableMuhafiz.length} muhafiz tersedia
                  </p>
                )}
              </FormItem>
            )}
          />

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Perhatian:</strong> Setiap muhafiz hanya dapat memiliki satu halaqah.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || loadingMuhafiz || availableMuhafiz.length === 0}
            className="w-full h-11 mt-2"
          >
            {isLoading ? (
              <><Spinner className="mr-2 h-4 w-4" /> Menyimpan...</>
            ) : (
              <><FontAwesomeIcon icon={initialData?.id_halaqah ? faCheck : faPlus} className="mr-2" /> 
                {initialData?.id_halaqah ? "Simpan Perubahan" : "Buat Halaqah Baru"}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}