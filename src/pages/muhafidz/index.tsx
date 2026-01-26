import { Routes, Route, Navigate } from "react-router-dom";
import SetoranPage from "./Setoran";
import AbsensiPage from "./Absensi";
import KelolaSantriPage from "./KelolaSantri"; 
import ProgresSantriPage from "./ProgresSantri";
import SettingsPage from "../settings";
import InfoSection from "../settings/InfoSection";

export default function MuhafidzPage() {
  return (
    <Routes>
      {/* Default redirect ke absensi atau setoran */}
      <Route index element={<AbsensiPage />} />
      
      <Route path="/setoran" element={<SetoranPage />} />
      
      <Route path="santri" element={<KelolaSantriPage />} />

      <Route path="progres" element={<ProgresSantriPage />} />
      
      <Route path="settings">
        <Route index element={<SettingsPage />} /> {/* Menu Utama Settings */}
        {/* <Route path="account" element={<AccountSettings />} /> Page Akun */}
        <Route path="info" element={<InfoSection />} /> {/* Page Informasi SOP */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}