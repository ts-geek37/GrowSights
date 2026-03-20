"use client";

import { Answer, Session } from "@/lib/types";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";

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
          <p className="text-xs text-muted-foreground">Ongoing Call</p>
        </div>

        <div className="text-right">
          <p className="text-lg font-mono font-semibold text-accent">
            {formatDuration(duration)}
          </p>
        </div>
      </div>
    </div>
  );
}
