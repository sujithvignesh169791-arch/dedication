import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Premium Plans",
  description: "Upgrade to Pro to unlock advanced AI features.",
}

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
