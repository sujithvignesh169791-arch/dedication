import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mock Interview",
  description: "Practice your interview skills with AI.",
}

export default function InterviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
