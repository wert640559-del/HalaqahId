import { useState } from "react";
type Status = "hadir" | "absen" | "izin";

interface AbsensiRow {
  santriId: number;
  namaSantri: string;
  status: Status;
  keterangan?: string;
}

export default function AbsensiPage() {
  const [rows, setRows] = useState<AbsensiRow[]>([
    { santriId: 1, namaSantri: "Ahmad", status: "hadir" },
    { santriId: 2, namaSantri: "Fahri", status: "absen" },
    { santriId: 3, namaSantri: "Zaid", status: "izin", keterangan: "Sakit" },
  ]);

  const handleStatusChange = (index: number, status: Status) => {
    const updated = [...rows];
    updated[index].status = status;
    if (status !== "izin") updated[index].keterangan = undefined;
    setRows(updated);
  };

  const handleKeteranganChange = (index: number, value: string) => {
    const updated = [...rows];
    updated[index].keterangan = value;
    setRows(updated);
  };

  const handleSubmit = () => {
    const invalidIzin = rows.find(
      (row) => row.status === "izin" && (!row.keterangan || row.keterangan.trim() === "")
    );

    if (invalidIzin) {
      alert("Gagal menyimpan!\nSantri dengan status IZIN wajib mengisi keterangan.");
      return;
    }

    console.log("Saving absensi...", rows);
    alert("Absensi hari ini berhasil disimpan");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col text-left">
        <h2 className="text-2xl font-bold text-foreground dark:text-foreground-dark">
          Absensi Hari Ini
        </h2>
        <p className="text-muted-foreground dark:text-text-secondary-dark text-sm">
          {new Date().toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border border-border dark:border-border-dark bg-card dark:bg-surface-dark shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-accent/50 dark:bg-background-dark/50 text-foreground dark:text-foreground-dark">
              <tr>
                <th className="px-6 py-4 font-semibold">Nama Santri</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-border-dark">
              {rows.map((row, index) => (
                <tr key={row.santriId} className="hover:bg-accent/5 dark:hover:bg-accent/5 transition-colors">
                  <td className="px-6 py-4 font-medium dark:text-foreground-dark">
                    {row.namaSantri}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={row.status}
                      onChange={(e) => handleStatusChange(index, e.target.value as Status)}
                      className="bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark border border-border dark:border-border-dark rounded-md px-3 py-1.5 focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="hadir">Hadir</option>
                      <option value="absen">Absen</option>
                      <option value="izin">Izin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {row.status === "izin" ? (
                      <input
                        type="text"
                        value={row.keterangan || ""}
                        onChange={(e) => handleKeteranganChange(index, e.target.value)}
                        placeholder="Alasan izin..."
                        className="w-full max-w-xs rounded-md border border-border dark:border-border-dark bg-background dark:bg-background-dark px-3 py-1.5 text-foreground dark:text-foreground-dark placeholder:text-muted focus:ring-2 focus:ring-primary outline-none"
                      />
                    ) : (
                      <span className="text-muted italic text-xs">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-2.5 rounded-lg font-bold transition-all shadow-md active:scale-95"
        >
          Simpan Absensi
        </button>
      </div>
    </div>
  );
}