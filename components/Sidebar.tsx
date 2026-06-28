"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Mic, History, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Resumes", href: "/resume/upload", icon: FileText },
    { name: "Interviews", href: "/interview", icon: Mic },
    { name: "History", href: "/history", icon: History },
    { name: "Premium", href: "/premium", icon: Star },
  ];

  return (
    <aside className={`hidden md:flex flex-col border-r bg-muted/10 transition-all duration-300 relative ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col flex-1 py-6 px-3 gap-2">
        <TooltipProvider>
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
            
            const content = (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center ${collapsed ? 'justify-center px-0' : 'px-4'} py-3 min-h-[44px] rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <link.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
                {!collapsed && <span>{link.name}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={link.href}>
                  <TooltipTrigger render={content} />
                  <TooltipContent side="right" className="font-semibold">{link.name}</TooltipContent>
                </Tooltip>
              );
            }
            return content;
          })}
        </TooltipProvider>
      </div>

      <div className="p-4 border-t flex justify-end">
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 text-muted-foreground">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
