import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Upload Resume",
  description: "Upload your resume for AI ATS analysis.",
}

export default function UploadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
