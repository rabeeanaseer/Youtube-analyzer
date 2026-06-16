import { useParams } from "wouter";
import {
  useGetChannel, useFetchChannelVideos, useFetchChannelAnalytics,
  getGetChannelQueryKey, getFetchChannelVideosQueryKey, getFetchChannelAnalyticsQueryKey
} from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Video, Eye, Calendar, Globe, Activity, ThumbsUp, Flame } from "lucide-react";
import {
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis,
  CartesianGrid, Tooltip as RechartsTooltip, AreaChart, Area, BarChart, Bar, Cell
} from "recharts";
import { SuggestionBox } from "@/components/suggestions";
import { GraphNote } from "@/components/graph-notes";

function formatNumber(num: number) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatHour(h: number) {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--card))",
  borderColor: "hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
};

export default function Channel() {
  const params = useParams();
  const id = params.channelId as string;

  const { data: channel, isLoading: isLoadingChannel } = useGetChannel(id, {
    query: { enabled: !!id, queryKey: getGetChannelQueryKey(id) }
  });

  const { data: videos } = useFetchChannelVideos(id, {
    query: { enabled: !!id, queryKey: getFetchChannelVideosQueryKey(id) }
  });

  const { data: analytics, isLoading: isLoadingAnalytics } = useFetchChannelAnalytics(id, {
    query: { enabled: !!id, queryKey: getFetchChannelAnalyticsQueryKey(id) }
  });

  if (isLoadingChannel || !channel) {
    return (
      <div className="space-y-8 animate-pulse max-w-6xl mx-auto">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="flex gap-6 items-end">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="space-y-2 mb-4 flex-1">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const maxHeatmapViews = analytics ? Math.max(...analytics.heatmapData.map((c) => c.avgViews), 1) : 1;

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Channel header */}
      <div className="relative">
        {channel.bannerUrl ? (
          <div className="h-44 md:h-56 w-full rounded-xl overflow-hidden bg-muted">
            <img src={channel.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-75" />
          </div>
        ) : (
          <div className="h-44 md:h-56 w-full bg-gradient-to-r from-primary/20 via-blue-500/10 to-purple-500/20 rounded-xl" />
        )}

        <div className="-mt-14 relative z-10 px-4">
          <div className="flex flex-col md:flex-row gap-5 items-start md:items-end">
            <img src={channel.thumbnailUrl} alt={channel.title}
              className="w-28 h-28 rounded-full border-4 border-background bg-card shadow-xl" />
            <div className="flex-1 pb-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{channel.title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-muted-foreground">
                {channel.handle && <span className="text-primary font-medium">{channel.handle}</span>}
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Joined {formatDate(channel.publishedAt)}</span>
                {channel.country && <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {channel.country}</span>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              { icon: Users, color: "text-primary bg-primary/10", label: "Subscribers", value: formatNumber(channel.subscriberCount) },
              { icon: Eye, color: "text-blue-400 bg-blue-500/10", label: "Total Views", value: formatNumber(channel.viewCount) },
              { icon: Video, color: "text-emerald-400 bg-emerald-500/10", label: "Videos", value: formatNumber(channel.videoCount) },
              {
                icon: Activity, color: "text-purple-400 bg-purple-500/10", label: "Avg Engagement",
                value: analytics ? `${analytics.avgEngagementRate.toFixed(2)}%` : "—"
              },
            ].map((stat) => (
              <Card key={stat.label} className="bg-card border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg flex-shrink-0 ${stat.color}`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-lg font-bold font-mono">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Channel description */}
      {channel.description && (
        <div className="px-4 bg-card border border-border rounded-xl p-5">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{channel.description}</p>
        </div>
      )}

      {/* Suggestions */}
      {analytics && !isLoadingAnalytics && (
        <SuggestionBox analytics={analytics} />
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-card border border-border w-full justify-start rounded-lg p-1 h-auto mb-6 flex-wrap gap-1">
          {["overview", "heatmap", "duration", "videos"].map((tab) => (
            <TabsTrigger key={tab} value={tab}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-5 capitalize text-sm">
              {tab === "heatmap" ? "Posting Heatmap" : tab === "overview" ? "Overview" : tab === "duration" ? "Duration Analysis" : "Top Videos"}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {isLoadingAnalytics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-80 rounded-xl" />
              <Skeleton className="h-80 rounded-xl" />
            </div>
          ) : analytics ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Engagement vs Views */}
                <Card className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Engagement vs Views</CardTitle>
                    <CardDescription className="text-xs">Each dot is one video — position shows views, height shows engagement rate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis type="number" dataKey="viewCount" name="Views" tickFormatter={formatNumber}
                            stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                          <YAxis type="number" dataKey="engagementRate" name="Engagement"
                            tickFormatter={(v) => `${v.toFixed(1)}%`}
                            stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                          <ZAxis type="number" range={[40, 200]} />
                          <RechartsTooltip contentStyle={CHART_TOOLTIP_STYLE}
                            formatter={(value: number, name: string) => {
                              if (name === "Engagement") return [`${value.toFixed(2)}%`, name];
                              return [formatNumber(value), name];
                            }} />
                          <Scatter data={analytics.engagementVsViews} fill="hsl(var(--primary))" fillOpacity={0.65} />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                    <GraphNote
                      explanation="This scatter plot maps each video by its total view count (X axis) against its engagement rate (Y axis — likes + comments ÷ views). Videos in the upper-right are both widely viewed and highly engaging — the ideal quadrant. Videos in the upper-left have strong engagement despite lower reach, suggesting loyal niche audiences."
                      strengths={[
                        analytics.avgEngagementRate > 3
                          ? `Strong average engagement of ${analytics.avgEngagementRate.toFixed(2)}% — above industry benchmark`
                          : `Consistent engagement distribution across view ranges`,
                        `${analytics.engagementVsViews.filter(v => v.viewCount > analytics.avgViews).length} videos outperform the channel's average view count`,
                      ]}
                      watch={[
                        analytics.avgEngagementRate < 1
                          ? "Engagement rate below 1% — audience may not be converting viewers into active fans"
                          : "Watch for videos with high views but low engagement — may indicate clickbait titles",
                        "Outlier dots far from the cluster signal viral hits that skew overall averages",
                      ]}
                    />
                  </CardContent>
                </Card>

                {/* Views Over Time */}
                <Card className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Views Over Time</CardTitle>
                    <CardDescription className="text-xs">Monthly average views based on upload date of analyzed videos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.viewsOverTime} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.7} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
                            tickFormatter={(d) => { const dt = new Date(d); return `${dt.getMonth() + 1}/${String(dt.getFullYear()).slice(2)}`; }} />
                          <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={formatNumber} tick={{ fontSize: 11 }} />
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                          <RechartsTooltip contentStyle={CHART_TOOLTIP_STYLE}
                            labelFormatter={(l) => new Date(l as string).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            formatter={(v: number) => [formatNumber(v), "Avg Views"]} />
                          <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <GraphNote
                      explanation="This area chart shows the average view count per video, grouped by the month each video was uploaded. Rising lines suggest the channel is growing — newer videos earn more views. Flat or declining trends may indicate declining algorithm favor, audience fatigue, or a shift away from the channel's original niche."
                      strengths={[
                        analytics.viewsOverTime.length > 3 ? "Sufficient upload history to identify performance trends" : "Analyzing available data points",
                        `${analytics.totalVideos} videos analyzed across the channel's lifetime`,
                      ]}
                      watch={[
                        "Peaks followed by sharp drops may indicate viral one-offs rather than sustainable growth",
                        "Very old videos may have compounded views over time — compare recent-only data for a fairer trend line",
                      ]}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Avg Views / Video", value: formatNumber(analytics.avgViews) },
                  { label: "Median Views", value: formatNumber(analytics.medianViews) },
                  { label: "Avg Likes / Video", value: formatNumber(analytics.avgLikes) },
                  { label: "Avg Comments / Video", value: formatNumber(analytics.avgComments) },
                ].map((s) => (
                  <div key={s.label} className="bg-card border border-border rounded-xl p-4 space-y-1">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-xl font-bold font-mono">{s.value}</p>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </TabsContent>

        {/* HEATMAP TAB */}
        <TabsContent value="heatmap" className="space-y-6">
          {isLoadingAnalytics ? (
            <Skeleton className="h-96 rounded-xl" />
          ) : analytics ? (
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Publishing Heatmap</CardTitle>
                <CardDescription className="text-xs">
                  Average views by day and hour of upload (UTC) — darker red = higher avg views.
                  Best window: <span className="text-primary font-medium">{analytics.bestDay}s at {formatHour(analytics.bestHour)} UTC</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-[700px]">
                    <div className="flex ml-14 mb-1.5">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="flex-1 text-center text-xs text-muted-foreground font-mono">
                          {i % 4 === 0 ? `${i}h` : ""}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, dayIdx) => (
                        <div key={day} className="flex items-center">
                          <div className="w-14 text-xs font-medium text-muted-foreground">{day}</div>
                          <div className="flex flex-1 gap-0.5">
                            {Array.from({ length: 24 }).map((_, hourIdx) => {
                              const cell = analytics.heatmapData.find(
                                (c) => c.dayOfWeek === dayIdx && c.hour === hourIdx
                              );
                              const intensity = cell ? cell.avgViews / maxHeatmapViews : 0;
                              return (
                                <div
                                  key={hourIdx}
                                  className="flex-1 aspect-square rounded-sm border border-border/30 relative group cursor-default"
                                  style={{ backgroundColor: intensity > 0 ? `rgba(255,45,85,${Math.max(0.08, intensity)})` : "transparent" }}
                                >
                                  <div className="opacity-0 group-hover:opacity-100 absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1.5 p-2 bg-popover text-popover-foreground text-xs rounded shadow-xl whitespace-nowrap pointer-events-none transition-opacity border border-border">
                                    <p className="font-bold">{day} {hourIdx}:00 UTC</p>
                                    {cell?.videoCount ? (
                                      <>
                                        <p>Avg Views: {formatNumber(cell.avgViews)}</p>
                                        <p>{cell.videoCount} video{cell.videoCount !== 1 ? "s" : ""}</p>
                                      </>
                                    ) : <p className="text-muted-foreground">No uploads</p>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-3 ml-14">
                      <span className="text-xs text-muted-foreground">Fewer views</span>
                      {[0.1, 0.3, 0.5, 0.7, 0.9, 1.0].map((v) => (
                        <div key={v} className="w-5 h-3 rounded-sm" style={{ backgroundColor: `rgba(255,45,85,${v})` }} />
                      ))}
                      <span className="text-xs text-muted-foreground">More views</span>
                    </div>
                  </div>
                </div>
                <GraphNote
                  explanation="Each cell represents a combination of upload day (row) and upload hour in UTC (column). The color intensity reflects the average view count of videos published at that time — not when viewers watch, but when the video was uploaded. Early algorithmic promotion often happens in the hours immediately after upload, so uploading when your audience is awake and active tends to generate stronger early signals."
                  strengths={[
                    `Best performing slot: ${analytics.bestDay} at ${formatHour(analytics.bestHour)} UTC — schedule future uploads here`,
                    `Heatmap covers ${analytics.totalVideos} videos, giving statistically reliable signal`,
                  ]}
                  watch={[
                    "Cells with very few videos (hover to check count) may not be statistically meaningful",
                    "UTC times must be converted to your local timezone — a 14:00 UTC peak is 10 AM EST or 7 AM PST",
                    "YouTube's algorithm has changed over time — recent posting patterns may differ from older ones",
                  ]}
                />
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        {/* DURATION TAB */}
        <TabsContent value="duration" className="space-y-6">
          {isLoadingAnalytics ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-96 rounded-xl" />
              <Skeleton className="h-96 rounded-xl" />
            </div>
          ) : analytics ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Performance by Video Length</CardTitle>
                  <CardDescription className="text-xs">Average views grouped by video duration bucket</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.durationBuckets} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" />
                        <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={formatNumber} tick={{ fontSize: 11 }} />
                        <RechartsTooltip contentStyle={CHART_TOOLTIP_STYLE}
                          formatter={(v: number, name: string) => [
                            name === "avgViews" ? formatNumber(v) : `${v.toFixed(2)}%`,
                            name === "avgViews" ? "Avg Views" : "Avg Engagement"
                          ]} />
                        <Bar dataKey="avgViews" radius={[4, 4, 0, 0]} name="avgViews">
                          {analytics.durationBuckets.map((entry, index) => {
                            const maxBucket = analytics.durationBuckets.reduce((m, b) => b.avgViews > m.avgViews ? b : m, analytics.durationBuckets[0]);
                            return (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.label === maxBucket.label ? "hsl(var(--primary))" : "hsl(var(--chart-2))"}
                                fillOpacity={0.85}
                              />
                            );
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <GraphNote
                    explanation="Each bar represents a duration bucket (e.g., '7–15 min') and shows the average views for all videos in that range. The highlighted bar (red) is the best-performing duration bracket for this channel. This is one of the most actionable insights — matching your video length to what the algorithm already rewards on this channel can significantly improve performance."
                    strengths={[
                      analytics.durationBuckets.length > 0
                        ? `Strongest length bracket: "${analytics.durationBuckets.reduce((m, b) => b.avgViews > m.avgViews ? b : m, analytics.durationBuckets[0]).label}" — focus production effort here`
                        : "Duration data available for analysis",
                      `${analytics.durationBuckets.length} distinct duration ranges analyzed`,
                    ]}
                    watch={[
                      "Buckets with very few videos may show misleadingly high or low averages — hover for count",
                      "A top-performing bucket driven by one viral video can misrepresent the typical result",
                    ]}
                  />
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Duration vs Views (Individual Videos)</CardTitle>
                  <CardDescription className="text-xs">Each dot = one video. Dot size reflects engagement rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" dataKey="durationSeconds" name="Duration"
                          tickFormatter={formatDuration} stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                        <YAxis type="number" dataKey="viewCount" name="Views"
                          tickFormatter={formatNumber} stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                        <ZAxis type="number" dataKey="engagementRate" range={[30, 250]} name="Engagement" />
                        <RechartsTooltip contentStyle={CHART_TOOLTIP_STYLE}
                          formatter={(v: number, name: string) => {
                            if (name === "Duration") return [formatDuration(v), name];
                            if (name === "Engagement") return [`${v.toFixed(2)}%`, name];
                            return [formatNumber(v), name];
                          }} />
                        <Scatter data={analytics.engagementVsViews} fill="#3b82f6" fillOpacity={0.6} />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                  <GraphNote
                    explanation="This scatter plot shows each individual video's duration (X axis) vs its total views (Y axis). Dot size represents engagement rate — larger dots had more likes and comments relative to views. Look for clusters of large dots in the view-dense area: that's the sweet spot of duration, views, AND engagement for this specific channel."
                    strengths={[
                      `Average video length: ${formatDuration(analytics.avgDurationSeconds)} — benchmark for future uploads`,
                      "Larger dots reveal which specific lengths drive both views AND interaction simultaneously",
                    ]}
                    watch={[
                      "High-view but tiny-dot videos drew crowds without converting them — reconsider CTAs",
                      "Very long videos (>30 min) may accumulate views slowly over months — don't judge them too early",
                    ]}
                  />
                </CardContent>
              </Card>
            </div>
          ) : null}
        </TabsContent>

        {/* TOP VIDEOS TAB */}
        <TabsContent value="videos">
          {isLoadingAnalytics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-video rounded-xl" />
              ))}
            </div>
          ) : analytics ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-bold">
                <Flame className="w-5 h-5 text-primary" /> Top Performing Videos
                <span className="text-sm font-normal text-muted-foreground ml-1">by view count</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {analytics.topVideos.map((video, rank) => (
                  <a
                    key={video.id}
                    href={`https://youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`card-video-${video.id}`}
                    className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all block"
                  >
                    <div className="relative aspect-video">
                      <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-bold">
                        #{rank + 1}
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-mono">
                        {video.durationFormatted}
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <h4 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors" title={video.title}>
                        {video.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">{formatDate(video.publishedAt)}</p>
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground"><Eye className="w-3 h-3" /></div>
                          <p className="font-mono text-xs font-bold">{formatNumber(video.viewCount)}</p>
                          <p className="text-xs text-muted-foreground">views</p>
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground"><ThumbsUp className="w-3 h-3" /></div>
                          <p className="font-mono text-xs font-bold">{formatNumber(video.likeCount)}</p>
                          <p className="text-xs text-muted-foreground">likes</p>
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground"><Activity className="w-3 h-3" /></div>
                          <p className="font-mono text-xs font-bold text-primary">{video.engagementRate.toFixed(1)}%</p>
                          <p className="text-xs text-muted-foreground">eng.</p>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {videos && (
                <GraphNote
                  explanation="These are the top 10 videos by total view count from the last 50 analyzed. Click any thumbnail to open the video directly on YouTube. Use this list to reverse-engineer what works: study thumbnail composition, title phrasing, topic selection, and video length of these winners."
                  strengths={[
                    `Top video has ${formatNumber(analytics.topVideos[0]?.viewCount ?? 0)} views — ${Math.round((analytics.topVideos[0]?.viewCount ?? 0) / analytics.avgViews)}x the channel average`,
                    "Top videos reveal the content formula the algorithm already rewards on this channel",
                  ]}
                  watch={[
                    "A top video from years ago may reflect a different algorithm era — weight recent winners more heavily",
                    "High views ≠ high engagement — check the engagement rate column to find videos that actually built fans",
                  ]}
                />
              )}
            </div>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
