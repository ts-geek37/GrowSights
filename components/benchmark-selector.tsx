"use client";
"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

function formatInsight(content: string): {
  bullets: string[];
  closing?: string;
} {
  if (!content) return { bullets: [] };

  // Split into sentences (handles ".", "?")
  const sentences = content
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Heuristic: last sentence = closing (CTA / brand line)
  const closing =
    sentences.length > 1 ? sentences[sentences.length - 1] : undefined;

  const bullets = sentences.length > 1 ? sentences.slice(0, -1) : sentences;

  return { bullets, closing };
}

export interface BenchmarkFilters {
  industry: string;
  turnover: string;
  location: string;
  hq: string;
  teamSize: string;
}

interface InsightRow {
  content: string;
}

interface AggregateRow {
  metric_name: string;
  avg_value: number | null;
  top20_value: number | null;
  unit: string | null;
  insight_text: string | null;
  opportunity_text: string | null;
}

const INDUSTRIES = [
  { slug: "retail", display_name: "Retail & Ecommerce" },
  { slug: "telecommunication", display_name: "Telecom & Communications" },
  { slug: "fintech", display_name: "Fintech & Digital Platforms" },
  { slug: "enterprise_tech", display_name: "Enterprise & B2B" },
  { slug: "healthcare", display_name: "Healthcare" },
  { slug: "fmcg", display_name: "FMCG" },
  { slug: "engineering_manufacturing", display_name: "Manufacturing" },
  { slug: "transport_logistics", display_name: "Transport & Logistics" },
];

const TURNOVER_BANDS = [
  { value: "T1", label: "Micro" },
  { value: "T2", label: "Small" },
  { value: "T3", label: "Mid" },
  { value: "T4", label: "Large" },
];

const LOCATION_BANDS = [
  { value: "L1", label: "Regional / Local" },
  { value: "L2", label: "Single City" },
  { value: "L3", label: "Multi-City / Interstate" },
  { value: "L4", label: "Pan India / Global" },
];

const HQ_TIERS = [
  { value: "H1", label: "Tier 1 – Metro" },
  { value: "H2", label: "Tier 2 – City" },
  { value: "H3", label: "Tier 3 – Town" },
  { value: "H4", label: "Tier 4 – Regional Hub" },
];

const TEAM_SIZES = [
  { value: "S1", label: "Micro" },
  { value: "S2", label: "Small" },
  { value: "S3", label: "Mid" },
  { value: "S4", label: "Large" },
];

type View = "selector" | "results";

export function BenchmarkSelector() {
  const [filters, setFilters] = useState<BenchmarkFilters>({
    industry: "",
    turnover: "",
    location: "",
    hq: "",
    teamSize: "",
  });
  const [view, setView] = useState<View>("selector");
  const [submitting, setSubmitting] = useState(false);
  const [insight, setInsight] = useState<InsightRow | null>(null);
  const [aggregates, setAggregates] = useState<AggregateRow[]>([]);
  const [resultsError, setResultsError] = useState<string | null>(null);

  const handleChange = (field: keyof BenchmarkFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const isComplete = Object.values(filters).every((v) => v !== "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;

    setSubmitting(true);
    setResultsError(null);
    setInsight(null);
    setAggregates([]);

    const segment = {
      industry: filters.industry,
      turnover_band: filters.turnover,
      location_band: filters.location,
      hq_tier: filters.hq,
      team_size: filters.teamSize,
    };

    const [insightRes] = await Promise.allSettled([
      supabase
        .from("insights")
        .select("content")
        .match(segment)
        .limit(1)
        .single(),
    ]);

    if (insightRes.status === "fulfilled" && !insightRes.value.error) {
      setInsight(insightRes.value.data);
    }

    if (insightRes.status === "rejected") {
      setResultsError("No benchmark data found for this segment.");
    }

    setSubmitting(false);
    setView("results");
  };

  const handleReset = () => {
    setView("selector");
    setInsight(null);
    setAggregates([]);
    setResultsError(null);
  };

  // ─── RESULTS VIEW ─────────────────────────────────────────────────────────
  if (view === "results") {
    const labelMap: Record<string, string> = {
      ...Object.fromEntries(INDUSTRIES.map((i) => [i.slug, i.display_name])),
      ...Object.fromEntries(TURNOVER_BANDS.map((b) => [b.value, b.label])),
      ...Object.fromEntries(LOCATION_BANDS.map((b) => [b.value, b.label])),
      ...Object.fromEntries(HQ_TIERS.map((b) => [b.value, b.label])),
      ...Object.fromEntries(TEAM_SIZES.map((b) => [b.value, b.label])),
    };

    return (
      <div className="space-y-8">
        {/* Segment badges — show human-readable labels */}
        <div className="flex flex-wrap gap-2">
          {[
            filters.industry,
            filters.turnover,
            filters.location,
            filters.hq,
            filters.teamSize,
          ].map((val) => (
            <span
              key={val}
              className="text-xs font-medium px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20"
            >
              {labelMap[val] ?? val}
            </span>
          ))}
        </div>

        {resultsError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <p className="text-sm text-muted-foreground">{resultsError}</p>
            <Button variant="outline" onClick={handleReset}>
              Try Different Filters
            </Button>
          </div>
        ) : (
          <>
            {insight?.content &&
              (() => {
                const { bullets, closing } = formatInsight(insight.content);

                return (
                  <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                      Segment Insight
                    </h3>

                    {/* Bullet Points */}
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {bullets.map((point, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-1 text-accent">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Closing Line (CTA / branding) */}
                    {closing && (
                      <div className="pt-3 border-t border-border/50">
                        <p className="text-sm font-medium text-foreground">
                          {closing}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            {aggregates.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  Benchmark Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aggregates.map((row) => (
                    <div
                      key={row.metric_name}
                      className="rounded-xl border border-border/50 bg-card p-5 space-y-3"
                    >
                      <p className="text-sm font-medium text-foreground">
                        {row.metric_name}
                      </p>

                      <div className="flex gap-6">
                        {row.avg_value != null && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Industry Avg
                            </p>
                            <p className="text-xl font-semibold text-foreground">
                              {row.avg_value}
                              {row.unit && (
                                <span className="text-sm font-normal text-muted-foreground ml-1">
                                  {row.unit}
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                        {row.top20_value != null && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Top 20%
                            </p>
                            <p className="text-xl font-semibold text-accent">
                              {row.top20_value}
                              {row.unit && (
                                <span className="text-sm font-normal text-muted-foreground ml-1">
                                  {row.unit}
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                      </div>

                      {row.insight_text && (
                        <p className="text-xs text-muted-foreground border-t border-border/50 pt-3">
                          {row.insight_text}
                        </p>
                      )}
                      {row.opportunity_text && (
                        <p className="text-xs text-accent/80 font-medium">
                          ↗ {row.opportunity_text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-border/50 hover:border-accent/50"
              >
                ← Change Filters
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ─── SELECTOR VIEW ────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Industry
          </label>
          <Select
            value={filters.industry}
            onValueChange={(val) => handleChange("industry", val)}
          >
            <SelectTrigger className="w-full border-border/50 bg-card hover:border-accent/50">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry.slug} value={industry.slug}>
                  {industry.display_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Turnover
          </label>
          <Select
            value={filters.turnover}
            onValueChange={(val) => handleChange("turnover", val)}
          >
            <SelectTrigger className="border-border/50 bg-card hover:border-accent/50">
              <SelectValue placeholder="Select turnover" />
            </SelectTrigger>
            <SelectContent>
              {TURNOVER_BANDS.map((band) => (
                <SelectItem key={band.value} value={band.value}>
                  {band.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Location
          </label>
          <Select
            value={filters.location}
            onValueChange={(val) => handleChange("location", val)}
          >
            <SelectTrigger className="border-border/50 bg-card hover:border-accent/50">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {LOCATION_BANDS.map((band) => (
                <SelectItem key={band.value} value={band.value}>
                  {band.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            HQ Type
          </label>
          <Select
            value={filters.hq}
            onValueChange={(val) => handleChange("hq", val)}
          >
            <SelectTrigger className="border-border/50 bg-card hover:border-accent/50">
              <SelectValue placeholder="Select HQ type" />
            </SelectTrigger>
            <SelectContent>
              {HQ_TIERS.map((tier) => (
                <SelectItem key={tier.value} value={tier.value}>
                  {tier.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Team Size
          </label>
          <Select
            value={filters.teamSize}
            onValueChange={(val) => handleChange("teamSize", val)}
          >
            <SelectTrigger className="border-border/50 bg-card hover:border-accent/50">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {TEAM_SIZES.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!isComplete || submitting}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        {submitting ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Analyzing...
          </>
        ) : (
          "Get Benchmarks"
        )}
      </Button>
    </form>
  );
}
