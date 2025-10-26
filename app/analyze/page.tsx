import type { Metadata } from "next"
import { AnalyzeContent } from "@/components/analyze/analyze-content"

export const metadata: Metadata = {
  title: "Sports Analysis | Sports Fixtures",
  description: "Analyze sports statistics, performance data, and historical records.",
}

export default function AnalyzePage() {
  return <AnalyzeContent />
}
