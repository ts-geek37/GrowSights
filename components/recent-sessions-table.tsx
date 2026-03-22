"use client";

import { Button } from "@/components/ui/button";
import { Empty } from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { Answer, Session } from "@/lib/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

function formatInsight(content: string): {
  bullets: string[];
  closing?: string;
} {
  if (!content) return { bullets: [] };

  const sentences = content.includes("\n")
    ? content.split("\n")
    : content.split(/(?<=[.?!])\s+|,\s+(?=[A-Z])/);

  const cleaned = sentences.map((s) => s.trim()).filter(Boolean);

  const closing = cleaned.length > 1 ? cleaned[cleaned.length - 1] : undefined;

  const bullets = cleaned.length > 1 ? cleaned.slice(0, -1) : cleaned;

  return { bullets, closing };
}

interface InsightMap {
  [key: string]: string;
}

interface BenchmarkMap {
  [sessionId: string]: {
    industry: string;
    turnover_band: string;
    location_band: string;
    hq_tier: string;
    team_size: string;
  };
}

interface IndustryMap {
  [slug: string]: any;
}

interface RecentSessionsTableProps {
  sessions: Session[];
  answers: Answer[];
}

const getSegmentKey = (r: {
  industry: string;
  turnover_band: string;
  location_band: string;
  hq_tier: string;
  team_size: string;
}) =>
  `${r.industry}-${r.turnover_band}-${r.location_band}-${r.hq_tier}-${r.team_size}`;

export function RecentSessionsTable({
  sessions,
  answers,
}: RecentSessionsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [benchmarkMap, setBenchmarkMap] = useState<BenchmarkMap>({});
  const [insightMap, setInsightMap] = useState<InsightMap>({});
  const [industryMap, setIndustryMap] = useState<IndustryMap>({});
  const recentSessions = useMemo(
    () => sessions.filter((s) => s.status !== "in_progress").slice(0, 20),
    [sessions],
  );
  
  const answersMap = useMemo(() => {
    const map: Record<string, Answer[]> = {};
    for (const a of answers) {
      if (!map[a.session_id]) map[a.session_id] = [];
      map[a.session_id].push(a);
    }
    return map;
  }, [answers]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!recentSessions.length) return;
      
      setLoading(true);
      
      try {
        const sessionIds = recentSessions.map((s) => s.id);
        
        // 1. benchmarks
        const { data: benchmarks } = await supabase
        .from("benchmark_results")
        .select("*")
        .in("session_id", sessionIds);
        
        const bmMap: BenchmarkMap = {};
        const segmentKeys = new Set<string>();
        
        (benchmarks as any)?.forEach((b: any) => {
          bmMap[b.session_id] = b;
          segmentKeys.add(getSegmentKey(b));
        });
        
        setBenchmarkMap(bmMap);
        
        // 2. insights
        const { data: insights } = await supabase.from("insights").select("*");
        
        const iMap: InsightMap = {};
        (insights as any)?.forEach((i: any) => {
          const key = getSegmentKey(i);
          if (segmentKeys.has(key)) {
            iMap[key] = i.content;
          }
        });
        
        setInsightMap(iMap);
        
        // 3. industries
        const { data: industries } = await supabase
        .from("industries")
        .select("*");
        
        const indMap: IndustryMap = {};
        (industries as any)?.forEach((i: any) => {
          indMap[i.slug] = i;
        });
        
        setIndustryMap(indMap);
      } catch (err) {
        console.error("Batch fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [recentSessions]);
  
  const handleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };
  
  const getStatusBadge = (status: string) => {
    return status === "completed" ? (
      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
        Completed
      </span>
    ) : (
      <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30">
        Abandoned
      </span>
    );
  };
  
  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${d}d ago`;
  };
  
  // ✅ FIXED mapping (explicit type)
  const getLabel = (
    industry: any,
    type: "turnover" | "location" | "hq" | "size",
    value?: string,
  ) => {
    if (!industry || !value) return value;
    
    const keyMap = {
      turnover: `${value.toLowerCase()}_label`,
      location: `${value.toLowerCase()}_label`,
      hq: `${value.toLowerCase()}_label`,
      size: `${value.toLowerCase()}_label`,
    };
    
    return industry[keyMap[type]] || value;
  };
  
  if (!recentSessions.length) {
    return (
      <div className="rounded-lg border border-border/50 bg-card p-8">
        <Empty title="No Recent Sessions" />
      </div>
    );
  }
  
  return (
    <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
      <div className="p-6 border-b border-border/50">
        <h2 className="text-xl font-bold">
          Recent Sessions
          <span className="text-base text-muted-foreground ml-2">Last 20</span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              <TableHead>Caller</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {recentSessions.map((session) => {
              const sessionAnswers = answersMap[session.id] || [];
              const benchmark = benchmarkMap[session.id];
              const industry = industryMap[benchmark?.industry];
              
              const segmentKey = benchmark ? getSegmentKey(benchmark) : null;
              const insight = segmentKey ? insightMap[segmentKey] : null;
              
              const durationSeconds = Math.floor(
                (new Date(session.updated_at).getTime() -
                new Date(session.created_at).getTime()) /
                1000,
              );
              
              const mins = Math.floor(durationSeconds / 60);
              const secs = durationSeconds % 60;
              const { bullets, closing } = formatInsight(insight || "");
              
              return (
                <React.Fragment key={session.id}>
                  <TableRow
                    className="cursor-pointer hover:bg-secondary/50"
                    onClick={() => handleExpand(session.id)}
                    >
                    <TableCell className="w-10">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExpand(session.id);
                        }}
                        >
                        {expandedId === session.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>

                    <TableCell>
                      {session.caller_number.replace("sip_", "")}
                    </TableCell>
                    <TableCell>{getStatusBadge(session.status)}</TableCell>
                    <TableCell>
                      {mins}:{secs.toString().padStart(2, "0")}
                    </TableCell>
                    <TableCell>{formatTime(session.updated_at)}</TableCell>
                  </TableRow>

                  {expandedId === session.id && (
                    <TableRow>
                      <TableCell colSpan={5} className="p-6">
                        <div className="space-y-4">
                          {/* ✅ Segment (only render when ready) */}
                          {benchmark && industry ? (
                            <div>
                              <h4 className="text-sm font-semibold mb-2">
                                Segment
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                <div className="p-2 bg-muted rounded">
                                  {getLabel(
                                    industry,
                                    "turnover",
                                    benchmark.turnover_band,
                                  )}
                                </div>
                                <div className="p-2 bg-muted rounded">
                                  {getLabel(
                                    industry,
                                    "location",
                                    benchmark.location_band,
                                  )}
                                </div>
                                <div className="p-2 bg-muted rounded">
                                  {getLabel(industry, "hq", benchmark.hq_tier)}
                                </div>
                                <div className="p-2 bg-muted rounded">
                                  {getLabel(
                                    industry,
                                    "size",
                                    benchmark.team_size,
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            benchmark && (
                              <p className="text-xs text-muted-foreground">
                                Loading segment...
                              </p>
                            )
                          )}

                          {/* Answers */}
                          {!!sessionAnswers.length && (
                            <div>
                              <h4 className="text-sm font-semibold mb-2">
                                Answers
                              </h4>
                              <div className="grid md:grid-cols-2 gap-2">
                                {sessionAnswers.map((a) => (
                                  <div
                                  key={a.id}
                                  className="p-3 border rounded"
                                  >
                                    <p className="text-xs text-muted-foreground">
                                      {a.question}
                                    </p>
                                    <p className="text-sm break-words whitespace-pre-wrap">
                                      {a.answer}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Insight */}
                          {loading ? (
                            <p className="text-sm text-muted-foreground">
                              Loading insights...
                            </p>
                          ) : insight ? (
                            <div className="border-t pt-4">
                              <h4 className="text-sm font-semibold mb-2">
                                Benchmark Insight
                              </h4>
                              <div className="p-3 border rounded bg-accent/5 max-h-48 overflow-y-auto space-y-3">
                                {/* Bullets */}
                                <ul className="space-y-1 text-sm leading-relaxed break-words">
                                  {bullets.map((point, i) => (
                                    <li key={i} className="flex gap-2">
                                      <span className="text-accent mt-1">
                                        •
                                      </span>
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>

                                {/* Closing */}
                                {closing && (
                                  <div className="pt-2 border-t border-accent/20">
                                    <p className="text-sm font-medium break-words">
                                      {closing}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
