// monitor/page.tsx
"use client";

import { ActiveCallsSection } from "@/components/active-calls-section";
import { RecentSessionsTable } from "@/components/recent-sessions-table";
import { Spinner } from "@/components/ui/spinner";
import { useRealtimeAnswers } from "@/hooks/use-realtime-answers";
import { useRealtimeSessions } from "@/hooks/use-realtime-sessions";
import { Archive, ArrowLeft, Clock, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Tab = "active" | "today" | "all";

export default function MonitorPage() {
  const { sessions, loading: sessionsLoading } = useRealtimeSessions();
  const { answers } = useRealtimeAnswers();
  const [tab, setTab] = useState<Tab>("active");

  const activeSessions = sessions.filter((s) => s.status === "in_progress");
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todaySessions = sessions.filter(
    (s) => s.status !== "in_progress" && new Date(s.created_at) >= todayStart,
  );
  const allDoneSessions = sessions.filter((s) => s.status !== "in_progress");

  const TABS = [
    {
      key: "active" as Tab,
      label: "Active",
      icon: Phone,
      count: activeSessions.length,
      dot: true,
    },
    {
      key: "today" as Tab,
      label: "Today",
      icon: Clock,
      count: todaySessions.length,
      dot: false,
    },
    {
      key: "all" as Tab,
      label: "All",
      icon: Archive,
      count: allDoneSessions.length,
      dot: false,
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Live Call Monitor
              </h1>
              <p className="text-muted-foreground mt-1">
                Track active calls and review completed sessions
              </p>
            </div>
            {/* Summary chips */}
            <div className="hidden md:flex items-center gap-3 mb-1">
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
                {activeSessions.length} live
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 font-medium">
                {todaySessions.length} today
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground border border-border/50 font-medium">
                {allDoneSessions.length} total
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {TABS.map(({ key, label, icon: Icon, count, dot }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === key
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    tab === key
                      ? "bg-accent-foreground/20 text-accent-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
                {dot && count > 0 && (
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sessionsLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Spinner className="h-8 w-8 mx-auto mb-4" />
              <p className="text-muted-foreground">Loading sessions...</p>
            </div>
          </div>
        ) : (
          <>
            {tab === "active" && (
              <ActiveCallsSection sessions={sessions} answers={answers} />
            )}
            {tab === "today" && (
              <RecentSessionsTable sessions={todaySessions} answers={answers} />
            )}
            {tab === "all" && (
              <RecentSessionsTable
                sessions={allDoneSessions}
                answers={answers}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
