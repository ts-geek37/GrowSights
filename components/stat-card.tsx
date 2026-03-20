import { TrendingUp } from 'lucide-react'

interface StatCardProps {
  metricName: string
  avgValue: number
  unit: string
  top20Value: number
  insightText: string
  opportunityText: string
}

export function StatCard({
  metricName,
  avgValue,
  unit,
  top20Value,
  insightText,
  opportunityText,
}: StatCardProps) {
  const difference = top20Value - avgValue
  const percentageDiff = avgValue !== 0 ? ((difference / avgValue) * 100).toFixed(1) : '0'

  return (
    <div className="rounded-lg border border-border/50 bg-card p-6 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">{metricName}</h3>
        {difference > 0 && (
          <div className="flex items-center gap-1 text-accent text-xs font-medium">
            <TrendingUp className="w-3 h-3" />
            +{percentageDiff}%
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-accent">
            {avgValue.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Industry Average</p>
      </div>

      <div className="mb-4 p-3 bg-accent/5 rounded border border-accent/20">
        <p className="text-xs text-foreground leading-relaxed">{insightText}</p>
      </div>

      <div className="p-3 bg-secondary/30 rounded border border-border/50">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">Opportunity: </span>
          {opportunityText}
        </p>
      </div>

      {difference > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground">Top 20% Target:</span>
            <span className="text-lg font-bold text-accent">{top20Value.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">{unit}</span>
          </div>
        </div>
      )}
    </div>
  )
}
