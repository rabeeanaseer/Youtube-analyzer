import { useState } from "react";
import { Link } from "wouter";
import { useFindChannels, getFindChannelsQueryKey } from "@workspace/api-client-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search, Users, Video, Eye, ArrowRight, BarChart2,
  TrendingUp, Clock, Flame, Zap, Target, ChevronRight
} from "lucide-react";

function formatNumber(num: number) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

const FEATURED_QUERIES = ["MrBeast", "Veritasium", "MKBHD", "Kurzgesagt", "Linus Tech Tips"];

const FEATURES = [
  {
    icon: BarChart2,
    color: "from-primary/20 to-rose-500/10",
    iconColor: "text-primary",
    title: "Deep Analytics",
    desc: "Views over time, engagement scatter, posting heatmaps — every chart you need to understand what's actually working.",
  },
  {
    icon: Clock,
    color: "from-blue-500/20 to-blue-400/10",
    iconColor: "text-blue-400",
    title: "Best Upload Times",
    desc: "A 7×24 heatmap reveals the exact day and hour combos that generate the most views for any channel.",
  },
  {
    icon: Target,
    color: "from-emerald-500/20 to-emerald-400/10",
    iconColor: "text-emerald-400",
    title: "Duration Sweet Spot",
    desc: "Find the precise video length bracket that the algorithm already rewards on each channel.",
  },
  {
    icon: Zap,
    color: "from-amber-500/20 to-yellow-400/10",
    iconColor: "text-amber-400",
    title: "Growth Suggestions",
    desc: "AI-powered recommendations tell you exactly what to change to grow faster based on real channel data.",
  },
  {
    icon: Flame,
    color: "from-orange-500/20 to-red-400/10",
    iconColor: "text-orange-400",
    title: "Top Videos",
    desc: "See the 10 best-performing videos ranked by views — reverse-engineer their thumbnails, titles, and length.",
  },
  {
    icon: TrendingUp,
    color: "from-purple-500/20 to-violet-400/10",
    iconColor: "text-purple-400",
    title: "Channel Compare",
    desc: "Stack up to 5 channels in a radar chart — instantly see who leads in engagement, views, and output.",
  },
];

const STEPS = [
  { num: "01", title: "Search any channel", desc: "Enter a name, @handle, or keyword. We search YouTube's live API in real time." },
  { num: "02", title: "View the dashboard", desc: "Instantly see analytics, heatmaps, duration analysis, and top videos." },
  { num: "03", title: "Act on the insights", desc: "Use growth suggestions and chart notes to make smarter content decisions." },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const debouncedQuery = useDebounce(query, 600);
  const activeQuery = submitted || debouncedQuery;

  const { data: channels, isLoading, isFetching } = useFindChannels(
    { q: activeQuery, maxResults: 25 },
    {
      query: {
        enabled: activeQuery.length > 1,
        queryKey: getFindChannelsQueryKey({ q: activeQuery, maxResults: 25 }),
        staleTime: 1000 * 60 * 5,
      }
    }
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length > 0) setSubmitted(query.trim());
  }

  function handleExampleClick(q: string) {
    setQuery(q);
    setSubmitted(q);
  }

  const showLoading = isLoading || isFetching;
  const hasResults = channels && channels.length > 0;
  const isSearching = activeQuery.length > 1;

  return (
    <div className="max-w-6xl mx-auto">

      {/* ── Hero Section ──────────────────────────────────────────── */}
      <div className="relative min-h-[580px] flex flex-col items-center justify-center text-center py-20 overflow-hidden">

        {/* Animated background orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="animate-float absolute -top-16 -left-16 w-72 h-72 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
          />
          <div
            className="animate-float-reverse absolute top-10 right-0 w-96 h-96 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)", animationDelay: "2s" }}
          />
          <div
            className="animate-float-slow absolute bottom-0 left-1/3 w-64 h-64 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)", animationDelay: "4s" }}
          />
          <div
            className="animate-float absolute bottom-10 right-1/4 w-48 h-48 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)", animationDelay: "1s" }}
          />

          {/* Spinning decorative rings */}
          <div
            className="animate-spin-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/5"
          />
          <div
            className="animate-spin-reverse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-blue-500/5"
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "60px 60px"
            }}
          />
        </div>

        {/* Badge */}
        <div
          className="opacity-0-init animate-fade-in-down relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold tracking-wider uppercase mb-8"
          style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Powered by YouTube Data API v3
        </div>

        {/* Headline */}
        <h1
          className="opacity-0-init animate-fade-in-up relative z-10 text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6"
          style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
        >
          Reverse-engineer{" "}
          <span className="animate-shimmer-text">viral content.</span>
        </h1>

        {/* Subheading */}
        <p
          className="opacity-0-init animate-fade-in-up relative z-10 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Deep analytics and performance intelligence for YouTube creators and strategists.
          Search any channel to see exactly what's working — and what isn't.
        </p>

        {/* Search bar */}
        <div
          className="opacity-0-init animate-scale-in relative z-10 w-full max-w-2xl mx-auto"
          style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
        >
          <form onSubmit={handleSubmit} className="relative group">
            <div className="animate-glow-pulse rounded-2xl">
              <div className="relative flex items-center bg-card border-2 border-border rounded-2xl overflow-hidden transition-colors group-focus-within:border-primary shadow-2xl">
                <Search className="absolute left-5 w-5 h-5 text-muted-foreground pointer-events-none flex-shrink-0" />
                <Input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSubmitted(""); }}
                  placeholder="Search by channel name, @handle, or keyword..."
                  className="h-16 pl-14 pr-36 border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                  data-testid="input-search"
                />
                <button
                  type="submit"
                  className="absolute right-2 h-12 px-6 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-2"
                  data-testid="button-search"
                >
                  Search <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Example pills */}
          <div
            className="opacity-0-init animate-fade-in-up flex flex-wrap justify-center gap-2 mt-5"
            style={{ animationDelay: "0.65s", animationFillMode: "forwards" }}
          >
            <span className="text-sm text-muted-foreground self-center">Try:</span>
            {FEATURED_QUERIES.map((q, i) => (
              <button
                key={q}
                onClick={() => handleExampleClick(q)}
                className="px-4 py-1.5 bg-card border border-border rounded-full text-sm text-muted-foreground hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all active:scale-95"
                style={{ animationDelay: `${0.7 + i * 0.07}s` }}
                data-testid={`button-example-${q}`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search Results ─────────────────────────────────────────── */}
      {isSearching && (
        <div className="space-y-6 mb-20">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-lg font-semibold tracking-tight">
              Results for <span className="text-primary">"{activeQuery}"</span>
              {hasResults && !showLoading && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">({channels.length} channels)</span>
              )}
            </h2>
            {showLoading && (
              <span className="text-xs text-muted-foreground animate-pulse flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                Fetching from YouTube...
              </span>
            )}
          </div>

          {showLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                    <Skeleton className="h-10 rounded-lg" />
                    <Skeleton className="h-10 rounded-lg" />
                    <Skeleton className="h-10 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : hasResults ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {channels.map((channel, i) => (
                <Link
                  key={channel.id}
                  href={`/channel/${channel.id}`}
                  data-testid={`card-channel-${channel.id}`}
                  className="opacity-0-init animate-fade-in-up block group"
                  style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "forwards" }}
                >
                  <div className="h-full bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-200 flex flex-col">
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start gap-3 mb-3">
                        {channel.thumbnailUrl ? (
                          <img
                            src={channel.thumbnailUrl}
                            alt={channel.title}
                            className="w-14 h-14 rounded-full object-cover border-2 border-border flex-shrink-0 group-hover:border-primary/50 transition-colors"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 text-primary font-bold text-xl">
                            {channel.title[0]}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm leading-snug truncate group-hover:text-primary transition-colors">{channel.title}</h3>
                          {channel.handle && <p className="text-xs text-muted-foreground truncate mt-0.5">{channel.handle}</p>}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1 leading-relaxed">
                        {channel.description || "No description available."}
                      </p>
                      <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-border mt-auto">
                        {[
                          { icon: Users, val: formatNumber(channel.subscriberCount), label: "subs" },
                          { icon: Video, val: formatNumber(channel.videoCount), label: "videos" },
                          { icon: Eye, val: formatNumber(channel.viewCount), label: "views" },
                        ].map((stat) => (
                          <div key={stat.label} className="text-center space-y-0.5">
                            <stat.icon className="w-3 h-3 text-muted-foreground mx-auto" />
                            <p className="font-mono text-xs font-bold">{stat.val}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="px-5 pb-4">
                      <div className="flex items-center justify-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        View Analytics <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card/50 rounded-2xl border border-border border-dashed">
              <Search className="w-10 h-10 mx-auto text-muted-foreground mb-4 opacity-30" />
              <h3 className="text-lg font-medium">No channels found for "{activeQuery}"</h3>
              <p className="text-muted-foreground mt-2 text-sm">Try a different name, handle (@username), or keyword.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Features Grid (shown when not searching) ──────────────── */}
      {!isSearching && (
        <>
          {/* Features */}
          <div className="mb-24">
            <div
              className="opacity-0-init animate-fade-in-up text-center mb-12"
              style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
            >
              <h2 className="text-3xl font-bold mb-3">Everything you need to grow</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Six powerful analytics tools in one dashboard — no spreadsheets, no guesswork.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((feat, i) => (
                <div
                  key={feat.title}
                  className="opacity-0-init animate-fade-in-up group p-6 bg-card border border-border rounded-2xl hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 cursor-default"
                  style={{ animationDelay: `${0.85 + i * 0.08}s`, animationFillMode: "forwards" }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feat.icon className={`w-5 h-5 ${feat.iconColor}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="mb-24">
            <div
              className="opacity-0-init animate-fade-in-up text-center mb-12"
              style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}
            >
              <h2 className="text-3xl font-bold mb-3">How it works</h2>
              <p className="text-muted-foreground">Get from search to insights in under 10 seconds.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((step, i) => (
                <div
                  key={step.num}
                  className="opacity-0-init animate-fade-in-up relative flex flex-col items-center text-center p-8 bg-card border border-border rounded-2xl"
                  style={{ animationDelay: `${1.0 + i * 0.1}s`, animationFillMode: "forwards" }}
                >
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                      <ChevronRight className="w-5 h-5 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                    <span className="text-2xl font-black text-primary">{step.num}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats strip */}
          <div
            className="opacity-0-init animate-fade-in-up mb-24 rounded-2xl overflow-hidden border border-border"
            style={{ animationDelay: "1.1s", animationFillMode: "forwards" }}
          >
            <div
              className="p-10"
              style={{
                background: "linear-gradient(135deg, hsl(var(--card)) 0%, rgba(255,45,85,0.05) 50%, hsl(var(--card)) 100%)"
              }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { value: "50+", label: "Videos analyzed per channel", icon: Video },
                  { value: "7×24", label: "Heatmap grid resolution", icon: Clock },
                  { value: "5", label: "Channels compared at once", icon: BarChart2 },
                  { value: "Live", label: "Real-time YouTube API data", icon: Zap },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className="opacity-0-init animate-fade-in-up space-y-2"
                    style={{ animationDelay: `${1.2 + i * 0.1}s`, animationFillMode: "forwards" }}
                  >
                    <stat.icon className="w-5 h-5 text-primary mx-auto mb-2 opacity-70" />
                    <div className="text-4xl font-black text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA strip */}
          <div
            className="opacity-0-init animate-fade-in-up text-center pb-8 mb-4"
            style={{ animationDelay: "1.3s", animationFillMode: "forwards" }}
          >
            <p className="text-muted-foreground text-sm mb-4">Ready to dig into any channel?</p>
            <button
              onClick={() => document.querySelector<HTMLInputElement>("[data-testid='input-search']")?.focus()}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-base hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/25"
            >
              <Search className="w-5 h-5" /> Start Analyzing Free
            </button>
          </div>
        </>
      )}
    </div>
  );
}
