import { Badge } from "@/components/ui/badge";

export type AbsensiStatus = "HADIR" | "IZIN" | "SAKIT" | "ALFA" | "TERLAMBAT";

export const getStatusConfig = (status: AbsensiStatus) => {
  switch (status) {
    case "HADIR": return { color: "bg-green-500", style: "bg-green-100 text-green-800 border-green-200" };
    case "IZIN": return { color: "bg-blue-500", style: "bg-blue-100 text-blue-800 border-blue-200" };
    case "SAKIT": return { color: "bg-yellow-500", style: "bg-yellow-100 text-yellow-800 border-yellow-200" };
    case "TERLAMBAT": return { color: "bg-orange-500", style: "bg-orange-100 text-orange-800 border-orange-200" };
    case "ALFA": return { color: "bg-red-500", style: "bg-red-100 text-red-800 border-red-200" };
    default: return { color: "bg-gray-500", style: "bg-gray-100 text-gray-800 border-gray-200" };
  }
};

export function StatusBadge({ status }: { status: AbsensiStatus }) {
  const config = getStatusConfig(status);
  return (
    <Badge variant="outline" className={`${config.style} border`}>
      <div className="flex items-center gap-1.5">
        <div className={`h-1.5 w-1.5 rounded-full ${config.color}`} />
        {status}
      </div>
    </Badge>
  );
}