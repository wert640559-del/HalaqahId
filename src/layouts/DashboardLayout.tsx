import { AppSidebar } from "@/components/shared/Sidebar";
import { MobileDock } from "@/components/shared/MobileDock";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { Outlet, useNavigate } from "react-router-dom"; 
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faSignOutAlt, faUser, faArrowLeft, faBookOpen } from "@fortawesome/free-solid-svg-icons";

export default function DashboardLayout() {
  const { user, logout, stopImpersonating, isImpersonating } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleBackToSuperadmin = async () => {
    await stopImpersonating();
    navigate("/kepala-muhafidz");
  };

  return (
    <SidebarProvider>
      {!isMobile && <AppSidebar />}
      
      <SidebarInset className={isMobile ? "pb-20" : ""}>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 lg:px-6 sticky top-0 bg-background/95 backdrop-blur z-40">
          <div className="flex items-center gap-4">
            {!isMobile && <SidebarTrigger />}
            {isMobile && (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
                <FontAwesomeIcon icon={faBookOpen} className="text-sm" />
              </div>
            )}
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <div className="flex flex-col text-left">
              <h1 className="text-sm md:text-lg font-semibold leading-tight">
                {isMobile ? user?.username : `Halo, ${user?.username}`}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-8 w-8 border hover:opacity-80 transition-opacity">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback className={isImpersonating ? "bg-yellow-500/10 text-yellow-600" : "bg-primary/10 text-primary"}>
                    {user?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                <div className="sm:hidden px-2 py-1.5 flex items-center justify-between text-sm">
                  <span className="ml-1">Mode Tampilan</span>
                  <ThemeToggle />
                </div>

                {isImpersonating && (
                  <DropdownMenuItem onClick={handleBackToSuperadmin} className="text-yellow-600 focus:text-yellow-600 focus:bg-yellow-500/10">
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-4 w-4" />
                    Kembali ke Admin
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <FontAwesomeIcon icon={faUser} className="mr-2 h-4 w-4" />
                  Profil Saya
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <FontAwesomeIcon icon={faGear} className="mr-2 h-4 w-4" />
                  Pengaturan
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={logout} 
                  className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 lg:p-8 max-w-7xl">
            <Outlet /> 
          </div>
        </main>

        {isMobile && <MobileDock />}
      </SidebarInset>
    </SidebarProvider>
  );
}