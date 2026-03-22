import { Lightbulb } from "lucide-react";

interface BenchmarkInsightProps {
  content: string;
}

function formatInsight(content: string): {
  bullets: string[];
  closing?: string;
} {
  if (!content) return { bullets: [] };

  const sentences = content
    .split(/(?<=[.?!])\s+|,\s+(?=[A-Z])/) // smarter split
    .map((s) => s.trim())
    .filter(Boolean);

  const closing =
    sentences.length > 1 ? sentences[sentences.length - 1] : undefined;

  const bullets =
    sentences.length > 1 ? sentences.slice(0, -1) : sentences;

  return { bullets, closing };
}

export function BenchmarkInsight({ content }: BenchmarkInsightProps) {
  const { bullets, closing } = formatInsight(content);

  return (
    <div className="rounded-lg border border-accent/30 bg-gradient-to-br from-accent/5 to-transparent p-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <Lightbulb className="w-5 h-5 text-accent mt-0.5" />
        </div>

        <div className="w-full">
          <h3 className="font-semibold text-foreground mb-3">
            Segment Insight
          </h3>

          {/* Bullets */}
          <ul className="space-y-2 text-sm text-foreground leading-relaxed">
            {bullets.map((point, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-accent mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {/* Closing line */}
          {closing && (
            <div className="mt-4 pt-3 border-t border-accent/20">
              <p className="text-sm font-medium text-foreground">
                {closing}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}