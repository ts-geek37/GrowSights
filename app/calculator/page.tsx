"use client";

import { BenchmarkInsight } from "@/components/benchmark-insight";
import {
  BenchmarkFilters,
  BenchmarkSelector,
} from "@/components/benchmark-selector";
import { supabase } from "@/lib/supabase";
import { BenchmarkAggregate, Insight } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CalculatorPage() {
  const [results, setResults] = useState<BenchmarkAggregate[] | null>(null);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (filters: BenchmarkFilters) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setInsight(null);

    try {
      // Query benchmarks and insights in parallel
      const [insightRes] = await Promise.all([
        supabase
          .from("insights")
          .select("*")
          .eq("industry", filters.industry)
          .eq("turnover_band", filters.turnover)
          .eq("location_band", filters.location)
          .eq("hq_tier", filters.hq)
          .eq("team_size", filters.teamSize)
          .single(),
      ]);

      if (insightRes.error && insightRes.status !== 406) throw insightRes.error;

      setInsight(insightRes.data || null);
    } catch (err) {
      console.error("Error fetching benchmarks:", err);
      setError("Failed to load benchmark data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            Benchmark Calculator
          </h1>
          <p className="text-muted-foreground mt-1">
            Analyze your business metrics against your industry segment
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selector */}
        <div className="rounded-lg border border-border/50 bg-card p-8 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Select Your Segment
          </h2>
          <BenchmarkSelector />
        </div>

        {/* Results Section */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 mb-8">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {insight && (
          <div className="mb-8">
            <BenchmarkInsight content={insight.content} />
          </div>
        )}
      </div>
    </main>
  );
}
