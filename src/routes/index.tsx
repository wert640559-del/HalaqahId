import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import KepalaMuhafidzPage from "@/pages/kepala-muhafidz"; 
import MuhafidzPage from "@/pages/muhafidz"; 
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useEffect } from "react";

//Memanggil refreshUser (/me) setiap pindah halaman.
const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: ("superadmin" | "muhafidz")[] }) => {
  const { user, isLoading, refreshUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Selalu validasi token ke backend setiap kali pindah URL
    const checkTokenRealtime = async () => {
      if (localStorage.getItem("user")) {
        await refreshUser();
      }
    };
    checkTokenRealtime();
  }, [location.pathname, refreshUser]);

  if (isLoading) {
    // Bisa diganti dengan Spinner Component yang lebih bagus
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Jika tidak ada user (atau token habis setelah refreshUser gagal), tendang ke login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika role tidak diizinkan, kembalikan ke root (yang nanti akan me-redirect ke dashboard masing-masing)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; 
  }

  return <Outlet />;
};

export const AppRouter = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* 🔓 Public Route: Login */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <LoginPage />} 
      />

      {/* 🔒 Protected Routes: Membutuhkan Login */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          
          {/* 1. Entry Point: Redirect berdasarkan role */}
          <Route
            path="/"
            element={
              user?.role === "superadmin" ? (
                <Navigate to="/kepala-muhafidz" replace />
              ) : (
                <Navigate to="/muhafidz" replace />
              )
            }
          />

          {/* 2. Rute Khusus Superadmin (Kepala Muhafidz) */}
          <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
            <Route path="/kepala-muhafidz/*" element={<KepalaMuhafidzPage />} />
          </Route>

          {/* 3. Rute Khusus Muhafidz */}
          <Route element={<ProtectedRoute allowedRoles={["muhafidz"]} />}>
            <Route path="/muhafidz/*" element={<MuhafidzPage />} />
          </Route>

        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};