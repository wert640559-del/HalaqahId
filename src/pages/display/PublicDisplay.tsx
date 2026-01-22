import { useState } from "react";
import { useDisplay } from "@/context/DisplayContext";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PublicDisplay = () => {
  const { santriList, isLoading } = useDisplay();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Filter santri berdasarkan nama saat mengetik
  const filteredSantri = (santriList || []).filter((s) =>
    s?.nama_santri?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Portal Informasi Santri</h1>
          <p className="text-muted-foreground">Cari nama santri untuk melihat detail progres dan absensi.</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Ketik nama santri..."
            className="pl-10 h-12 text-lg shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* List Santri */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSantri.length > 0 ? (
            filteredSantri.map((santri) => (
              <Card 
                key={santri.id_santri} 
                className="hover:border-primary cursor-pointer transition-all active:scale-95 shadow-sm"
                onClick={() => navigate(`/display/santri/${santri.id_santri}`)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-12 w-12 border">
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="font-semibold truncate">{santri.nama_santri}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {santri.halaqah?.name_halaqah || "Belum ada halaqah"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              Santri tidak ditemukan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicDisplay;