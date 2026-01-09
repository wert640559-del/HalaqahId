import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DaftarHalaqah from "./DaftarHalaqah";
import BuatHalaqah from "./BuatHalaqah";
import JadwalHalaqah from "./JadwalHalaqah";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, List } from "lucide-react";

export default function KelolaHalaqahPage() {
  const [activeTab, setActiveTab] = useState("daftar");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-bold dark:text-white">Kelola Halaqah</h1>
          <p className="text-text-secondary dark:text-text-secondary-dark">
            Manajemen kelompok belajar tahfidz Al-Qur'an
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setActiveTab("jadwal")}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            Jadwal
          </Button>
          <Button
            onClick={() => setActiveTab("buat")}
            className="gap-2 bg-primary hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" />
            Halaqah Baru
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface dark:bg-surface-dark p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Total Halaqah</p>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-surface dark:bg-surface-dark p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Aktif</p>
          <p className="text-2xl font-bold text-green-600">10</p>
        </div>
        <div className="bg-surface dark:bg-surface-dark p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Kapasitas Terisi</p>
          <p className="text-2xl font-bold text-primary">78%</p>
        </div>
        <div className="bg-surface dark:bg-surface-dark p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Muhafidz</p>
          <p className="text-2xl font-bold">8</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="daftar" className="gap-2">
            <List className="h-4 w-4" />
            Daftar Halaqah
          </TabsTrigger>
          <TabsTrigger value="jadwal" className="gap-2">
            <Calendar className="h-4 w-4" />
            Jadwal
          </TabsTrigger>
          <TabsTrigger value="buat" className="gap-2">
            <Plus className="h-4 w-4" />
            Buat Baru
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="daftar" className="space-y-4 mt-6">
          <DaftarHalaqah onEditClick={(id) => console.log("Edit:", id)} />
        </TabsContent>
        
        <TabsContent value="jadwal" className="space-y-4 mt-6">
          <JadwalHalaqah />
        </TabsContent>
        
        <TabsContent value="buat" className="space-y-4 mt-6">
          <BuatHalaqah onSuccess={() => setActiveTab("daftar")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}