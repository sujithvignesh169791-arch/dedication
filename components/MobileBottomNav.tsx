"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Mic, User } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();
  
  const links = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Upload", href: "/resume/upload", icon: FileText },
    { name: "Interview", href: "/interview", icon: Mic },
    { name: "Profile", href: "/history", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t flex justify-around items-center px-2 pb-safe">
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center w-full h-full min-h-[44px] ${
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <link.icon className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-medium">{link.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
