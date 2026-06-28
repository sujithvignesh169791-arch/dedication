"use client"

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';

interface PremiumGateProps {
  feature: string;
  children: React.ReactNode;
}

export function PremiumGate({ feature, children }: PremiumGateProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className="animate-pulse bg-muted h-96 w-full rounded-xl"></div>;
  }

  const isPremium = session?.user?.isPremium;

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred background content */}
      <div className="blur-md opacity-40 pointer-events-none select-none">
        {children}
      </div>

      {/* Overlay modal */}
      <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-primary/20">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-amber-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-amber-500" />
            </div>
            <CardTitle className="text-2xl">{feature} is a Pro Feature</CardTitle>
            <CardDescription>Upgrade to unlock this feature and supercharge your job search.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 text-center">
             <div className="inline-flex items-center justify-center p-3 bg-muted/50 rounded-full mb-2">
               <Star className="h-5 w-5 text-amber-500 mr-2" />
               <span className="text-sm font-medium">Join 10,000+ successful job seekers</span>
             </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pt-6">
            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white" size="lg" onClick={() => router.push('/premium')}>
              Upgrade to Pro
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
