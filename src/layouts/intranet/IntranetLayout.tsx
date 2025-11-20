import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ClipboardList, LogOut, Menu, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ROUTES_PATHS } from "@/constants";
import { useAuthIntranetStore } from "@/modules/intranet/auth/store";
import { Loader } from "@/shared";

export default function IntranetLayout() {
  //   const router = useRouteError()
  const pathname = useLocation().pathname;
  const router = useNavigate();
  const [activeItem, setActiveItem] = useState(pathname);
  const user = useAuthIntranetStore((state) => state.user);
  const authStatus = useAuthIntranetStore((state) => state.status);
  const checkAuthStatus = useAuthIntranetStore((state) => state.getUserByToken);
  const logout = useAuthIntranetStore((state) => state.logout);

  const hasHydrated = useAuthIntranetStore((state) => state._hasHydrated);

  if (!hasHydrated) {
    return <Loader />;
  }

  if (authStatus === "pending") {
    checkAuthStatus();
    return <Loader />;
  }

  if (authStatus === "unauthorized") {
    router(ROUTES_PATHS.LOGIN);
  }

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    {
      name: "Technical Papers  ",
      icon: <ClipboardList className="mr-2 h-5 w-5" />,
      href: ROUTES_PATHS.TECHNICAL_WORK_TRAY,
      id: ROUTES_PATHS.TECHNICAL_WORK_TRAY,
    },
    {
      name: "Profile",
      icon: <User className="mr-2 h-5 w-5" />,
      href: ROUTES_PATHS.PROFILE,
      id: ROUTES_PATHS.PROFILE,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f1f1f1]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-[#004d58] text-white">
                <div className="flex flex-col gap-6 pt-6">
                  <div className="flex items-center gap-2">
                    <img src="/logo-wmc.png" alt="" />
                  </div>
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.id}
                        to={item.href}
                        className={cn(
                          "flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-[#003540] hover:text-white",
                          activeItem === item.id
                            ? "bg-[#003540] text-white"
                            : "text-gray-200"
                        )}
                        onClick={() => setActiveItem(item.id)}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <div className="hidden items-center gap-2 md:flex">
              <img src="/logo-wmc.png" className="w-44" alt="" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-[#004d58]">
                    <AvatarImage src={"userAvatar"} alt={user?.name} />
                    <AvatarFallback className="bg-[#004d58] text-white">
                      {user?.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:inline-block">
                    {user?.name}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to={ROUTES_PATHS.PROFILE}
                    className="flex cursor-pointer items-center"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center text-[#c2082c]"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar - desktop only */}
        {/* <aside className="hidden w-64 flex-col border-r bg-[#004d58] text-white md:flex"> */}
   <aside className="hidden w-64 flex-col border-r bg-gradient-to-b from-[#00b3dc] via-[#0124e0] to-[#00023f] md:flex">
          <div className="flex flex-col gap-6 p-6">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-[#0124e0] hover:text-white",
                    activeItem === item.id
                      ? "bg-[#00023f] text-white"
                      : "text-gray-200"
                  )}
                  onClick={() => setActiveItem(item.id)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
