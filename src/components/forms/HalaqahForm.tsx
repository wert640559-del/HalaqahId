import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { halaqahSchema, type HalaqahFormValues } from "@/utils/zodSchema";
import { halaqahService } from "@/services/halaqahService";
import axiosClient from "@/api/axiosClient"; // Untuk fetch muhafidz
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Muhafidz {
  id_user: number;
  username: string;
}

interface HalaqahFormProps {
  initialData?: {
    id_halaqah: number;
    name_halaqah: string;
    muhafiz_id: number;
  };
  onSuccess: () => void;
}

export function HalaqahForm({ initialData, onSuccess }: HalaqahFormProps) {
  const [muhafidzs, setMuhafidzs] = useState<Muhafidz[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HalaqahFormValues>({
    resolver: zodResolver(halaqahSchema) as any,
    defaultValues: {
      name_halaqah: initialData?.name_halaqah || "",
      muhafiz_id: initialData?.muhafiz_id || 0,
    },
  });

  // Ambil daftar muhafidz untuk dropdown
  useEffect(() => {
    const fetchMuhafidz = async () => {
      try {
        const response = await axiosClient.get("/halaqah/auth/muhafiz");
        // Sesuaikan path response.data jika strukturnya berbeda
        setMuhafidzs(response.data.data || response.data);
      } catch (error) {
        toast.error("Gagal mengambil daftar Muhafidz");
      }
    };
    fetchMuhafidz();
  }, []);

  const onSubmit = async (values: HalaqahFormValues) => {
    setIsSubmitting(true);
    try {
      if (initialData) {
        await halaqahService.updateHalaqah(initialData.id_halaqah, values);
        toast.success("Halaqah berhasil diperbarui");
      } else {
        await halaqahService.createHalaqah(values);
        toast.success("Halaqah baru berhasil dibuat");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name_halaqah"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Halaqah</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Abu Bakar Ash-Shiddiq" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="muhafiz_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Muhafidz Pengampu</FormLabel>
              <Select 
                onValueChange={(val) => field.onChange(Number(val))} 
                defaultValue={field.value ? field.value.toString() : undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Muhafidz" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {muhafidzs.map((m) => (
                    <SelectItem key={m.id_user} value={m.id_user.toString()}>
                      {m.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Simpan Perubahan" : "Buat Halaqah"}
        </Button>
      </form>
    </Form>
  );
}