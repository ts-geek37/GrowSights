"use client";

import { Empty } from "@/components/ui/empty";
import { supabase } from "@/lib/supabase";
import { Answer, Session } from "@/lib/types";
import { Phone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CallCard } from "./call-card";

interface ActiveCallsSectionProps {
  sessions: Session[];
  answers: Answer[];
}

export function ActiveCallsSection({
  sessions,
  answers,
}: ActiveCallsSectionProps) {
  const activeSessions = sessions.filter((s) => s.status === "in_progress");

  const [industryMap, setIndustryMap] = useState<Record<string, any>>({});
  const [benchmarkMap, setBenchmarkMap] = useState<Record<string, any>>({});

  // ✅ Answers map (perf)
  const answersMap = useMemo(() => {
    const map: Record<string, Answer[]> = {};
    for (const a of answers) {
      if (!map[a.session_id]) map[a.session_id] = [];
      map[a.session_id].push(a);
    }
    return map;
  }, [answers]);

  // 🚀 Fetch industries + benchmarks once
  useEffect(() => {
    const fetchData = async () => {
      if (!activeSessions.length) return;

      const sessionIds = activeSessions.map((s) => s.id);

      // 1. benchmarks
      const { data: benchmarks } = await supabase
        .from("benchmark_results")
        .select("*")
        .in("session_id", sessionIds);

      const bmMap: Record<string, any> = {};
      benchmarks?.forEach((b: any) => {
        bmMap[b.session_id] = b;
      });
      setBenchmarkMap(bmMap);

      // 2. industries
      const { data: industries } = await supabase
        .from("industries")
        .select("*");

      const iMap: Record<string, any> = {};
      industries?.forEach((i: any) => {
        iMap[i.slug] = i;
      });
      setIndustryMap(iMap);
    };

    fetchData();
  }, [activeSessions]);

  if (activeSessions.length === 0) {
    return (
      <div className="rounded-lg border border-border/50 bg-card p-8">
        <Empty title="No Active Calls" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Phone className="w-5 h-5 text-accent" />
        <h2 className="text-xl font-bold text-foreground">
          Active Calls
          <span className="text-base text-accent font-normal ml-2">
            {activeSessions.length}
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeSessions.map((session) => (
          <CallCard
            key={session.id}
            session={session}
            answers={answersMap[session.id] || []}
            benchmark={benchmarkMap[session.id]}
            industry={industryMap[benchmarkMap[session.id]?.industry]}
          />
        ))}
      </div>
    </div>
  );
}
