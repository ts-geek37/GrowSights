"use client";

import { Answer, Session } from "@/lib/types";
import { useEffect, useState } from "react";
import { Phone, TrendingUp } from "lucide-react";

interface CallCardProps {
  session: Session;
  answers: Answer[];
  benchmark?: any;
  industry?: any;
}

export function CallCard({
  session,
  answers,
  benchmark,
  industry,
}: CallCardProps) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (session.status !== "in_progress") return;

    const startTime = new Date(session.created_at).getTime();

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setDuration(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getLabel = (value?: string) => {
    if (!industry || !value) return value;
    return industry[`${value?.toLowerCase()}_label`] || value;
  };

  const latestAnswer = answers[answers.length - 1];

  return (
    <div className="group relative rounded-xl border border-border/50 bg-card p-5 hover:border-accent/40 transition-all hover:shadow-lg">
 

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold flex items-center gap-2">
            <Phone className="w-4 h-4 text-accent" />
            {session.caller_number.replace("sip_", "")}
          </p>
          <p className="text-xs text-muted-foreground">
            Ongoing Call
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-mono font-semibold text-accent">
            {formatDuration(duration)}
          </p>
        </div>
      </div>

      {/* Segments */}
      {benchmark && industry && (
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            benchmark.turnover_band,
            benchmark.location_band,
            benchmark.hq_tier,
            benchmark.team_size,
          ]
            .filter(Boolean)
            .map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs rounded-md bg-accent/10 text-accent border border-accent/20"
              >
                {getLabel(item)}
              </span>
            ))}
        </div>
      )}

      {/* Latest Insight */}
      <div className="border-t pt-3 space-y-2">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Latest Response
        </p>

        {latestAnswer ? (
          <p className="text-sm text-foreground leading-relaxed line-clamp-3">
            {latestAnswer.answer}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Waiting for input...
          </p>
        )}
      </div>
    </div>
  );
}