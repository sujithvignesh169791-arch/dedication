"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSession } from 'next-auth/react';

export default function PremiumSuccessPage() {
  const router = useRouter();
  const { update } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
    }, 250);

    // Refresh session to grab new isPremium status
    update().then(() => {
      setLoading(false);
    });

    return () => clearInterval(interval);
  }, [update]);

  return (
    <div className="container mx-auto py-24 px-4 flex justify-center items-center min-h-[80vh]">
      <Card className="max-w-md w-full border-primary/20 shadow-xl text-center">
        <CardHeader className="pt-8">
          <div className="mx-auto bg-green-100 dark:bg-green-900/30 w-20 h-20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-extrabold flex items-center justify-center gap-2">
            You're a Pro! <Sparkles className="h-6 w-6 text-amber-500" />
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Thank you for upgrading. Your account has been successfully upgraded to Pro.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 pb-8 space-y-4">
          <p className="font-medium text-muted-foreground text-sm">You now have access to:</p>
          <ul className="text-sm space-y-2 text-left bg-muted/30 p-4 rounded-lg inline-block text-foreground mx-auto">
            <li className="flex items-center gap-2">✨ Unlimited Resume Uploads</li>
            <li className="flex items-center gap-2">✨ AI Resume Rebuilder with Templates</li>
            <li className="flex items-center gap-2">✨ Interactive Voice Interviews</li>
            <li className="flex items-center gap-2">✨ Detailed Score Progress Tracking</li>
          </ul>
        </CardContent>
        <CardFooter className="pb-8">
          <Button className="w-full" size="lg" onClick={() => router.push('/dashboard')} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />} 
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
