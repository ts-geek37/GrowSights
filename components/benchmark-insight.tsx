import { Lightbulb } from 'lucide-react'

interface BenchmarkInsightProps {
  content: string
}

export function BenchmarkInsight({ content }: BenchmarkInsightProps) {
  return (
    <div className="rounded-lg border border-accent/30 bg-gradient-to-br from-accent/5 to-transparent p-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <Lightbulb className="w-5 h-5 text-accent mt-0.5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-2">Segment Insight</h3>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
            {content}
          </p>
        </div>
      </div>
    </div>
  )
}
