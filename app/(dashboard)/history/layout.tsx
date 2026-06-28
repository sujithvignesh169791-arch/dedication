import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Activity History",
  description: "View your past AI analyses and mock interviews.",
}

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
