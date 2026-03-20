import { BarChart3, PhoneForwarded } from 'lucide-react'
import { NavigationCard } from '@/components/navigation-card'
import { TTSSelector } from '@/components/tts-selector'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
              <span className="text-accent font-bold text-lg">AG</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">GrowSights</h1>
              <p className="text-xs text-muted-foreground">Business Growth Insights</p>
            </div>
          </div> 
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Know where you stand.
            <br />
            <span className="bg-gradient-to-r from-accent to-emerald-400 bg-clip-text text-transparent">
              Grow faster.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            Premium business benchmarking insights powered by real-time data and industry expertise.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <NavigationCard
            title="Benchmark Calculator"
            description="Analyze your business metrics against industry standards. Compare performance across turnover, location, and team size segments."
            href="/calculator"
            icon={<BarChart3 className="w-8 h-8" />}
          />
          <NavigationCard
            title="Live Call Monitor"
            description="Track active calls in real-time, monitor session duration, and view completed benchmark analyses with live insights."
            href="/monitor"
            icon={<PhoneForwarded className="w-8 h-8" />}
          />
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-lg border border-border/30 bg-card/50 p-6">
            <h3 className="font-semibold text-foreground mb-2">Real-time Data</h3>
            <p className="text-sm text-muted-foreground">
              Live metrics and insights updated continuously from our comprehensive database.
            </p>
          </div>
          <div className="rounded-lg border border-border/30 bg-card/50 p-6">
            <h3 className="font-semibold text-foreground mb-2">Industry Focused</h3>
            <p className="text-sm text-muted-foreground">
              Segment analysis by industry, turnover, location, and organizational structure.
            </p>
          </div>
          <div className="rounded-lg border border-border/30 bg-card/50 p-6">
            <h3 className="font-semibold text-foreground mb-2">Actionable Insights</h3>
            <p className="text-sm text-muted-foreground">
              Get specific opportunities to improve performance and close the gap to top performers.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
