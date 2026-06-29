import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { VideoBackground } from '@/components/VideoBackground';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-transparent">
      <VideoBackground />
      <div className="relative z-10 w-full">
        <Navbar />
      </div>
      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0 relative z-0">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
