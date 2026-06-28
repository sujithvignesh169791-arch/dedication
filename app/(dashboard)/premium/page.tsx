"use client"

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Loader2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function PremiumPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const isPremium = session?.user?.isPremium;

  const handleCheckout = async () => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/premium');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/premium/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: isAnnual ? 'annual' : 'monthly' })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error);
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Checkout Failed', description: error.message });
      setLoading(false);
    }
  };

  const features = [
    { name: "Resume Uploads", free: "3 / month", pro: "Unlimited" },
    { name: "ATS Analysis", free: "Basic score", pro: "Full analysis + Roadmap" },
    { name: "AI Interviews", free: "5 questions (Text)", pro: "Unlimited (Voice + Text)" },
    { name: "Resume Rebuilder", free: <X className="h-4 w-4 text-muted-foreground mx-auto" />, pro: <Check className="h-4 w-4 text-green-500 mx-auto" /> },
    { name: "Premium Templates", free: "1 template", pro: "3 templates" },
    { name: "Export Formats", free: "TXT only", pro: "PDF & DOCX" },
    { name: "Support", free: "Community", pro: "Priority Support" },
  ];

  return (
    <div className="container mx-auto py-16 px-4 max-w-5xl">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Unlock Your Career Potential</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get the AI tools you need to beat the ATS, ace the interview, and land your dream job faster.
        </p>
      </div>

      <div className="flex justify-center items-center gap-4 mb-12">
        <Label htmlFor="billing-toggle" className={`text-sm ${!isAnnual ? 'font-bold' : 'text-muted-foreground'}`}>Monthly</Label>
        <Switch id="billing-toggle" checked={isAnnual} onCheckedChange={setIsAnnual} />
        <Label htmlFor="billing-toggle" className={`text-sm flex items-center gap-2 ${isAnnual ? 'font-bold' : 'text-muted-foreground'}`}>
          Annual <Badge className="bg-green-500 hover:bg-green-600">Save 35%</Badge>
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
        <Card className="flex flex-col border-muted shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Free Plan</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="mt-4 text-4xl font-bold">$0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-muted-foreground" /> 3 resume uploads/month</li>
              <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-muted-foreground" /> Basic ATS score</li>
              <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-muted-foreground" /> 5 interview questions</li>
              <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-muted-foreground" /> Text mode only</li>
              <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-muted-foreground" /> 1 template</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" disabled>
              {!isPremium ? "Current Plan" : "Downgrade"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col border-primary shadow-lg relative transform md:-translate-y-4 ring-2 ring-primary">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Badge className="bg-primary text-primary-foreground px-3 py-1 uppercase tracking-wider text-xs">Most Popular</Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Pro Plan</CardTitle>
            <CardDescription>Everything you need to land the job</CardDescription>
            <div className="mt-4 text-4xl font-bold">
              ${isAnnual ? '12.42' : '19'}
              <span className="text-lg text-muted-foreground font-normal">/mo</span>
            </div>
            {isAnnual && <p className="text-sm text-muted-foreground">Billed $149 yearly</p>}
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm font-medium"><Check className="h-4 w-4 text-primary" /> Unlimited resume uploads</li>
              <li className="flex items-center gap-2 text-sm font-medium"><Check className="h-4 w-4 text-primary" /> Full ATS analysis with roadmap</li>
              <li className="flex items-center gap-2 text-sm font-medium"><Check className="h-4 w-4 text-primary" /> Unlimited AI interviews</li>
              <li className="flex items-center gap-2 text-sm font-medium"><Check className="h-4 w-4 text-primary" /> Voice interview mode</li>
              <li className="flex items-center gap-2 text-sm font-medium"><Check className="h-4 w-4 text-primary" /> AI resume rebuilder</li>
              <li className="flex items-center gap-2 text-sm font-medium"><Check className="h-4 w-4 text-primary" /> 3 premium templates (PDF + DOCX)</li>
              <li className="flex items-center gap-2 text-sm font-medium"><Check className="h-4 w-4 text-primary" /> Priority support</li>
            </ul>
          </CardContent>
          <CardFooter>
            {isPremium ? (
              <Button className="w-full" variant="default" disabled>Current Plan</Button>
            ) : (
              <Button className="w-full" size="lg" onClick={handleCheckout} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Upgrade to Pro
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="mb-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Compare Features</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="p-4 font-semibold w-1/3">Feature</th>
                <th className="p-4 font-semibold text-center w-1/3">Free</th>
                <th className="p-4 font-semibold text-center text-primary w-1/3">Pro</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="p-4 font-medium">{f.name}</td>
                  <td className="p-4 text-center text-muted-foreground">{f.free}</td>
                  <td className="p-4 text-center font-medium text-primary">{f.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold flex items-center gap-2"><Info className="h-4 w-4 text-muted-foreground" /> Can I cancel my subscription?</h4>
            <p className="text-muted-foreground mt-1 text-sm">Yes, you can cancel at any time from your account settings. Your Pro features will remain active until the end of your billing cycle.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold flex items-center gap-2"><Info className="h-4 w-4 text-muted-foreground" /> What is your refund policy?</h4>
            <p className="text-muted-foreground mt-1 text-sm">We offer a 7-day money-back guarantee. If you're not satisfied, just contact our support team within 7 days of purchase.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold flex items-center gap-2"><Info className="h-4 w-4 text-muted-foreground" /> Are my resumes private?</h4>
            <p className="text-muted-foreground mt-1 text-sm">Yes. We never share your data with third parties. Your data is used exclusively to provide you with insights and feedback.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold flex items-center gap-2"><Info className="h-4 w-4 text-muted-foreground" /> Does the voice interview work on mobile?</h4>
            <p className="text-muted-foreground mt-1 text-sm">Yes, our voice interview mode uses the Web Speech API which is supported on modern iOS and Android browsers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
