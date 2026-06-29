import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Instrument_Serif, Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta-sans" });
const instrumentSerif = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-instrument-serif" });

export const metadata: Metadata = {
  title: {
    template: "%s | AI Resume Pro Coach",
    default: "AI Resume Pro Coach - Ace your ATS and Interviews",
  },
  description: "AI-powered resume optimization and mock interviews to land your dream job.",
  openGraph: {
    title: "AI Resume Pro Coach",
    description: "AI-powered resume optimization and mock interviews to land your dream job.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable, inter.variable, plusJakartaSans.variable, instrumentSerif.variable)}>
      <body className={cn(inter.className, "antialiased")} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
