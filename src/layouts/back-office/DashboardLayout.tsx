import { PanelLeft, Pyramid, Search, User } from "lucide-react"

import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
  Input,
  Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger
} from "@/components"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Link, Navigate, Outlet } from "react-router-dom"
import { ToggleTheme, Breadcrumbs, Sidebar, } from "./components"
import { ROUTES_PATHS } from "@/constants"
import { useSessionBoundStore } from "@/modules/back-office/auth/store/session.store"
import { Loader } from "@/shared"


export function DashboardLayout() {
  const logout = useSessionBoundStore(state => state.logout)
  const authStatus = useSessionBoundStore(state => state.status)
  const checkAuthStatus = useSessionBoundStore(state => state.checkAuthStatus)
  const isTokenValid = useSessionBoundStore(state => state.isTokenValid)
  const ROUTES = useSessionBoundStore(state => state.groups)

  const [isExpand, setIsExpand] = useState(false)

  const handleLogout = () => {
    logout()
  }

  if (authStatus === 'pending') {
    checkAuthStatus();
    return <Loader />
  }

  if (authStatus === 'unauthorized' || !isTokenValid()) {
    return <Navigate to={ROUTES_PATHS.LOGIN_ADMIN} />
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/90">
      <Sidebar isExpand={isExpand} setIsExpand={setIsExpand} />
      <div className={cn(
        "grid min-h-dvh grid-rows-[auto,1fr] sm:gap-2 sm:py-4  transition-all duration-300",
        isExpand ? "sm:pl-80" : "sm:pl-14"
      )}>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs" aria-describedby="sidebar">
              <SheetTitle />
              <SheetDescription />
              <nav className="grid gap-6 text-lg font-medium">
                <a
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Pyramid className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Prisma.com</span>
                </a>
                {/* <Link
                  to="/dashboard"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  to="/usuarios"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <User className="h-5 w-5" />
                  Usuarios
                </Link> */}
                {ROUTES.map((group, index) => (
                  <div key={index}>
                    <h3 className="text-muted-foreground text-sm uppercase font-semibold flex flex-row gap-1 items-center">
                      {group.icon && <group.icon className="h-5 w-5" />} {group.name}
                    </h3>
                    {group.menus.map((menu, index) => (
                      <div key={index}>
                        <Link
                          to={menu.url!}
                          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground ml-6 text-sm"
                        >
                          {/* {menu.icon && <menu.icon className="h-5 w-5" />} */}
                          {menu.name}
                        </Link>
                        {menu.items && (
                          <div className="ml-9">
                            {menu.items.map((item, index) => (
                              <Link
                                key={index}
                                to={item.url!}
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground text-sm"
                              >
                                {/* {item.icon && <item.icon className="h-5 w-5" />} */}
                                {item.name}
                                {item.badge && (
                                  <span className="text-sm bg-primary text-primary-foreground rounded-full px-1.5">
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Breadcrumbs />
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Búsqueda..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <div className="flex gap-1">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <User className="h-6 w-6 text-white dark:text-primary-dark" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>Settings</DropdownMenuItem>
                <DropdownMenuItem disabled>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ToggleTheme />
          </div>
        </header>
        <main className="m-4 bg-background-container rounded-3xl p-2">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
