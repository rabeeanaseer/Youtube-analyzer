import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Clock, Calendar, Video, Target, Zap, AlertTriangle } from "lucide-react";

interface ChannelAnalytics {
  avgEngagementRate: number;
  avgDurationSeconds: number;
  avgViews: number;
  bestHour: number;
  bestDay: string;
  totalVideos: number;
  durationBuckets: { label: string; avgViews: number; videoCount: number }[];
  medianViews: number;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
}

function formatHour(hour: number): string {
  if (hour === 0) return "12:00 AM";
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return "12:00 PM";
  return `${hour - 12}:00 PM`;
}

interface Suggestion {
  icon: typeof Lightbulb;
  color: string;
  title: string;
  detail: string;
  type: "strength" | "opportunity" | "warning";
}

function computeSuggestions(analytics: ChannelAnalytics): Suggestion[] {
  const suggestions: Suggestion[] = [];

  const bestBucket = analytics.durationBuckets.reduce(
    (best, b) => (b.avgViews > best.avgViews ? b : best),
    analytics.durationBuckets[0]
  );

  if (bestBucket) {
    suggestions.push({
      icon: Video,
      color: "text-blue-400",
      title: `Optimal video length: ${bestBucket.label}`,
      detail: `Videos in the "${bestBucket.label}" range average ${(bestBucket.avgViews / 1000).toFixed(1)}K views — your highest performing duration bucket. Concentrate production effort here.`,
      type: "strength",
    });
  }

  const avgMinutes = Math.floor(analytics.avgDurationSeconds / 60);
  if (avgMinutes < 3) {
    suggestions.push({
      icon: Clock,
      color: "text-amber-400",
      title: "Consider longer-form content",
      detail: `Your average video is ${formatDuration(analytics.avgDurationSeconds)}. YouTube's algorithm tends to reward watch time. Testing 8–15 minute videos with strong hooks could improve session depth and ad revenue.`,
      type: "opportunity",
    });
  } else if (avgMinutes > 30) {
    suggestions.push({
      icon: Clock,
      color: "text-amber-400",
      title: "Experiment with shorter cuts",
      detail: `Your average video runs ${formatDuration(analytics.avgDurationSeconds)}. A parallel Shorts or 5–10 minute series can attract new audiences who haven't committed to long-form yet.`,
      type: "opportunity",
    });
  }

  suggestions.push({
    icon: Calendar,
    color: "text-emerald-400",
    title: `Best posting window: ${analytics.bestDay}s at ${formatHour(analytics.bestHour)}`,
    detail: `Historically, videos published on ${analytics.bestDay} around ${formatHour(analytics.bestHour)} UTC earn the most views on this channel. Schedule your next upload to hit this window and capture peak audience availability.`,
    type: "strength",
  });

  if (analytics.avgEngagementRate < 0.02) {
    suggestions.push({
      icon: AlertTriangle,
      color: "text-red-400",
      title: "Engagement rate is below benchmark",
      detail: `At ${(analytics.avgEngagementRate * 100).toFixed(2)}%, engagement is below the 2% industry benchmark. Try adding a strong CTA in the first 30 seconds, using community posts to prime viewers before a video drops, and replying to early comments to boost the algorithm signal.`,
      type: "warning",
    });
  } else if (analytics.avgEngagementRate > 0.05) {
    suggestions.push({
      icon: TrendingUp,
      color: "text-emerald-400",
      title: "Strong engagement — leverage it",
      detail: `${(analytics.avgEngagementRate * 100).toFixed(2)}% engagement is well above average. This audience is highly loyal. Introduce a Membership or Patreon, and cross-promote videos in pinned comments to compound that loyalty into growth.`,
      type: "strength",
    });
  } else {
    suggestions.push({
      icon: Target,
      color: "text-blue-400",
      title: "Engagement is healthy — push it higher",
      detail: `${(analytics.avgEngagementRate * 100).toFixed(2)}% is solid. To push past 5%, ask a specific question in every video description and pin your own comment as a reply prompt. Engagement pods in the first hour after posting can also signal momentum to the algorithm.`,
      type: "opportunity",
    });
  }

  if (analytics.totalVideos < 20) {
    suggestions.push({
      icon: Zap,
      color: "text-purple-400",
      title: "Increase upload frequency",
      detail: `With fewer than 20 videos analyzed, the channel may not have enough data for YouTube's recommendation engine to build a pattern. A consistent 1–2 uploads per week for the next 3 months will significantly increase discoverability.`,
      type: "opportunity",
    });
  }

  const viewDelta = analytics.avgViews - analytics.medianViews;
  if (viewDelta > analytics.medianViews * 2) {
    suggestions.push({
      icon: TrendingUp,
      color: "text-amber-400",
      title: "A few outlier hits are skewing your average",
      detail: `Your average (${(analytics.avgViews / 1000).toFixed(1)}K) is much higher than your median (${(analytics.medianViews / 1000).toFixed(1)}K), meaning a small number of viral videos carry the channel. Study what those top videos have in common — thumbnail style, topic, first 30 seconds — and replicate those elements deliberately.`,
      type: "opportunity",
    });
  }

  return suggestions;
}

const TYPE_BADGE: Record<Suggestion["type"], string> = {
  strength: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  opportunity: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  warning: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const TYPE_LABEL: Record<Suggestion["type"], string> = {
  strength: "Strength",
  opportunity: "Opportunity",
  warning: "Watch Out",
};

interface SuggestionBoxProps {
  analytics: ChannelAnalytics;
}

export function SuggestionBox({ analytics }: SuggestionBoxProps) {
  const suggestions = computeSuggestions(analytics);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Growth Recommendations</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              Actionable strategies derived from this channel's performance data
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex gap-4 p-4 rounded-lg bg-background border border-border hover:border-border/80 transition-colors">
                <div className={`mt-0.5 flex-shrink-0 ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-foreground">{s.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_BADGE[s.type]}`}>
                      {TYPE_LABEL[s.type]}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
