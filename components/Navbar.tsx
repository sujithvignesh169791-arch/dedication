"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Menu, Bell, User, LayoutDashboard, Mic, History, Star, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "./ThemeToggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Interviews", href: "/interview", icon: Mic },
    { name: "History", href: "/history", icon: History },
    { name: "Premium", href: "/premium", icon: Star },
  ]

  const user = session?.user

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 max-w-7xl">
        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center mr-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="h-11 w-11" />}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] flex flex-col p-0">
              <SheetHeader className="p-6 border-b text-left">
                <SheetTitle className="text-xl font-bold flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-md">
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                  </div>
                  AI Resume Pro
                </SheetTitle>
              </SheetHeader>
              
              {user && (
                <div className="px-6 py-4 border-b bg-muted/20">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.image || ''} />
                      <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col py-4 flex-1 overflow-y-auto">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-6 py-3 min-h-[44px] text-sm font-medium transition-colors hover:bg-muted/50 ${pathname.startsWith(link.href) ? 'text-primary border-l-2 border-primary bg-primary/5' : 'text-muted-foreground'}`}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.name}
                  </Link>
                ))}
              </div>
              
              {user && (
                <div className="p-4 border-t mt-auto">
                  <Button variant="outline" className="w-full justify-start min-h-[44px]" onClick={() => signOut()}>
                    <LogOut className="h-5 w-5 mr-2" /> Sign Out
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Logo */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-80 min-h-[44px]">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg hidden sm:inline-block">AI Resume Pro</span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center mx-6 gap-1 flex-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 min-h-[44px] text-sm font-medium transition-colors hover:text-primary relative flex items-center ${pathname.startsWith(link.href) ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {link.name}
              {pathname.startsWith(link.href) && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center ml-auto gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="h-11 w-11 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-destructive rounded-full" />
                <span className="sr-only">Notifications</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-11 w-11 rounded-full p-0" />}>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.image || ''} alt={user.name || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary">{user.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none flex items-center gap-2">
                        {user.name}
                        {user.isPremium && <span className="text-[10px] uppercase bg-amber-500 text-white px-1.5 py-0.5 rounded-sm font-bold">Pro</span>}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-destructive cursor-pointer min-h-[44px]">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:inline-flex">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
