import { logger } from "./logger";

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

if (!API_KEY) {
  logger.warn("YOUTUBE_API_KEY is not set");
}

async function ytFetch(endpoint: string, params: Record<string, string | number>): Promise<unknown> {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.set("key", API_KEY ?? "");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube API error ${res.status}: ${body}`);
  }
  return res.json();
}

function parseISO8601Duration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] ?? "0", 10);
  const minutes = parseInt(match[2] ?? "0", 10);
  const seconds = parseInt(match[3] ?? "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export interface ChannelSummary {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  handle: string | null;
}

export interface ChannelDetail extends ChannelSummary {
  bannerUrl: string | null;
  publishedAt: string;
  country: string | null;
}

export interface VideoStats {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  durationSeconds: number;
  durationFormatted: string;
  engagementRate: number;
  hourOfDay: number;
  dayOfWeek: number;
  dayOfWeekName: string;
  tags: string[];
  categoryId: string | null;
}

export interface HourlyHeatmapCell {
  hour: number;
  dayOfWeek: number;
  dayName: string;
  avgViews: number;
  videoCount: number;
}

export interface DurationBucket {
  label: string;
  minSeconds: number;
  maxSeconds: number;
  avgViews: number;
  avgEngagement: number;
  videoCount: number;
}

export interface TopVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  engagementRate: number;
  publishedAt: string;
  durationFormatted: string;
}

export interface ViewsDataPoint {
  date: string;
  views: number;
  videoCount: number;
}

export interface EngagementPoint {
  videoId: string;
  title: string;
  viewCount: number;
  engagementRate: number;
  durationSeconds: number;
}

export interface ChannelAnalytics {
  channelId: string;
  totalVideos: number;
  avgViews: number;
  avgLikes: number;
  avgComments: number;
  avgEngagementRate: number;
  avgDurationSeconds: number;
  medianViews: number;
  topVideos: TopVideo[];
  heatmapData: HourlyHeatmapCell[];
  durationBuckets: DurationBucket[];
  viewsOverTime: ViewsDataPoint[];
  bestHour: number;
  bestDay: string;
  engagementVsViews: EngagementPoint[];
}

export interface ChannelComparison {
  channelId: string;
  title: string;
  thumbnailUrl: string;
  subscriberCount: number;
  avgViews: number;
  avgEngagementRate: number;
  avgDurationSeconds: number;
  videoCount: number;
  totalViews: number;
}

type YtAny = Record<string, unknown>;

export async function searchChannels(q: string, maxResults = 10): Promise<ChannelSummary[]> {
  const searchRes = await ytFetch("search", {
    part: "snippet",
    type: "channel",
    q,
    maxResults,
  }) as YtAny;

  const items = (searchRes.items as YtAny[]) ?? [];
  if (items.length === 0) return [];

  const channelIds = items
    .map((i) => ((i.id as YtAny).channelId as string))
    .filter(Boolean)
    .join(",");

  const channelsRes = await ytFetch("channels", {
    part: "snippet,statistics",
    id: channelIds,
    maxResults: 50,
  }) as YtAny;

  return ((channelsRes.items as YtAny[]) ?? []).map((ch) => {
    const snippet = ch.snippet as YtAny;
    const stats = ch.statistics as YtAny;
    const thumbs = snippet.thumbnails as YtAny;
    const thumb = ((thumbs.high ?? thumbs.medium ?? thumbs.default) as YtAny | undefined)?.url as string ?? "";
    return {
      id: ch.id as string,
      title: snippet.title as string,
      description: (snippet.description as string) ?? "",
      thumbnailUrl: thumb,
      subscriberCount: parseInt((stats.subscriberCount as string) ?? "0", 10),
      videoCount: parseInt((stats.videoCount as string) ?? "0", 10),
      viewCount: parseInt((stats.viewCount as string) ?? "0", 10),
      handle: (snippet.customUrl as string | null) ?? null,
    };
  });
}

export async function getChannel(channelId: string): Promise<ChannelDetail | null> {
  const res = await ytFetch("channels", {
    part: "snippet,statistics,brandingSettings",
    id: channelId,
  }) as YtAny;

  const items = (res.items as YtAny[]) ?? [];
  if (items.length === 0) return null;

  const ch = items[0];
  const snippet = ch.snippet as YtAny;
  const stats = ch.statistics as YtAny;
  const branding = ch.brandingSettings as YtAny;
  const image = branding?.image as YtAny | undefined;
  const thumbs = snippet.thumbnails as YtAny;
  const thumb = ((thumbs.high ?? thumbs.medium ?? thumbs.default) as YtAny | undefined)?.url as string ?? "";

  return {
    id: ch.id as string,
    title: snippet.title as string,
    description: (snippet.description as string) ?? "",
    thumbnailUrl: thumb,
    bannerUrl: (image?.bannerExternalUrl as string | null) ?? null,
    subscriberCount: parseInt((stats.subscriberCount as string) ?? "0", 10),
    videoCount: parseInt((stats.videoCount as string) ?? "0", 10),
    viewCount: parseInt((stats.viewCount as string) ?? "0", 10),
    publishedAt: snippet.publishedAt as string,
    country: (snippet.country as string | null) ?? null,
    handle: (snippet.customUrl as string | null) ?? null,
  };
}

async function getUploadPlaylistId(channelId: string): Promise<string | null> {
  const res = await ytFetch("channels", {
    part: "contentDetails",
    id: channelId,
  }) as YtAny;
  const items = (res.items as YtAny[]) ?? [];
  if (items.length === 0) return null;
  const details = items[0].contentDetails as YtAny;
  return (details.relatedPlaylists as YtAny).uploads as string;
}

async function getPlaylistVideoIds(playlistId: string, maxResults: number): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | undefined;

  while (ids.length < maxResults) {
    const remaining = maxResults - ids.length;
    const batchSize = Math.min(remaining, 50);
    const params: Record<string, string | number> = {
      part: "contentDetails",
      playlistId,
      maxResults: batchSize,
    };
    if (pageToken) params.pageToken = pageToken;

    const res = await ytFetch("playlistItems", params) as YtAny;
    const items = (res.items as YtAny[]) ?? [];
    for (const item of items) {
      const cd = item.contentDetails as YtAny;
      ids.push(cd.videoId as string);
    }
    pageToken = res.nextPageToken as string | undefined;
    if (!pageToken || items.length === 0) break;
  }
  return ids;
}

async function getVideoDetails(videoIds: string[]): Promise<VideoStats[]> {
  const results: VideoStats[] = [];
  const batchSize = 50;

  for (let i = 0; i < videoIds.length; i += batchSize) {
    const batch = videoIds.slice(i, i + batchSize);
    const res = await ytFetch("videos", {
      part: "snippet,statistics,contentDetails",
      id: batch.join(","),
      maxResults: 50,
    }) as YtAny;

    for (const v of ((res.items as YtAny[]) ?? [])) {
      const snippet = v.snippet as YtAny;
      const stats = v.statistics as YtAny;
      const cd = v.contentDetails as YtAny;
      const thumbs = snippet.thumbnails as YtAny;
      const thumb = ((thumbs.maxres ?? thumbs.high ?? thumbs.medium ?? thumbs.default) as YtAny | undefined)?.url as string ?? "";

      const viewCount = parseInt((stats.viewCount as string) ?? "0", 10);
      const likeCount = parseInt((stats.likeCount as string) ?? "0", 10);
      const commentCount = parseInt((stats.commentCount as string) ?? "0", 10);
      const durationSeconds = parseISO8601Duration(cd.duration as string ?? "PT0S");
      const engagementRate = viewCount > 0 ? ((likeCount + commentCount) / viewCount) * 100 : 0;

      const publishedAt = snippet.publishedAt as string;
      const publishedDate = new Date(publishedAt);
      const hourOfDay = publishedDate.getUTCHours();
      const dayOfWeek = publishedDate.getUTCDay();

      results.push({
        id: v.id as string,
        title: snippet.title as string,
        description: (snippet.description as string) ?? "",
        thumbnailUrl: thumb,
        publishedAt,
        viewCount,
        likeCount,
        commentCount,
        durationSeconds,
        durationFormatted: formatDuration(durationSeconds),
        engagementRate: Math.round(engagementRate * 100) / 100,
        hourOfDay,
        dayOfWeek,
        dayOfWeekName: DAY_NAMES[dayOfWeek],
        tags: (snippet.tags as string[] | undefined) ?? [],
        categoryId: (snippet.categoryId as string | null) ?? null,
      });
    }
  }
  return results;
}

export async function getChannelVideos(channelId: string, maxResults = 50): Promise<VideoStats[]> {
  const playlistId = await getUploadPlaylistId(channelId);
  if (!playlistId) return [];

  const videoIds = await getPlaylistVideoIds(playlistId, maxResults);
  if (videoIds.length === 0) return [];

  return getVideoDetails(videoIds);
}

function computeHeatmap(videos: VideoStats[]): HourlyHeatmapCell[] {
  const map = new Map<string, { totalViews: number; count: number }>();

  for (const v of videos) {
    const key = `${v.dayOfWeek}-${v.hourOfDay}`;
    const existing = map.get(key) ?? { totalViews: 0, count: 0 };
    map.set(key, { totalViews: existing.totalViews + v.viewCount, count: existing.count + 1 });
  }

  const cells: HourlyHeatmapCell[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const key = `${day}-${hour}`;
      const data = map.get(key) ?? { totalViews: 0, count: 0 };
      cells.push({
        hour,
        dayOfWeek: day,
        dayName: DAY_NAMES[day],
        avgViews: data.count > 0 ? Math.round(data.totalViews / data.count) : 0,
        videoCount: data.count,
      });
    }
  }
  return cells;
}

function computeDurationBuckets(videos: VideoStats[]): DurationBucket[] {
  const buckets = [
    { label: "< 1 min", min: 0, max: 60 },
    { label: "1-3 min", min: 60, max: 180 },
    { label: "3-7 min", min: 180, max: 420 },
    { label: "7-15 min", min: 420, max: 900 },
    { label: "15-30 min", min: 900, max: 1800 },
    { label: "30-60 min", min: 1800, max: 3600 },
    { label: "> 60 min", min: 3600, max: Infinity },
  ];

  return buckets.map((b) => {
    const filtered = videos.filter((v) => v.durationSeconds >= b.min && v.durationSeconds < b.max);
    const avgViews = filtered.length > 0 ? filtered.reduce((s, v) => s + v.viewCount, 0) / filtered.length : 0;
    const avgEngagement = filtered.length > 0 ? filtered.reduce((s, v) => s + v.engagementRate, 0) / filtered.length : 0;
    return {
      label: b.label,
      minSeconds: b.min,
      maxSeconds: b.max === Infinity ? 999999 : b.max,
      avgViews: Math.round(avgViews),
      avgEngagement: Math.round(avgEngagement * 100) / 100,
      videoCount: filtered.length,
    };
  }).filter((b) => b.videoCount > 0);
}

function computeViewsOverTime(videos: VideoStats[]): ViewsDataPoint[] {
  const sorted = [...videos].sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
  const map = new Map<string, { views: number; count: number }>();

  for (const v of sorted) {
    const month = v.publishedAt.substring(0, 7); // YYYY-MM
    const existing = map.get(month) ?? { views: 0, count: 0 };
    map.set(month, { views: existing.views + v.viewCount, count: existing.count + 1 });
  }

  return Array.from(map.entries()).map(([date, data]) => ({
    date,
    views: Math.round(data.views / data.count),
    videoCount: data.count,
  }));
}

export function computeAnalytics(channelId: string, videos: VideoStats[]): ChannelAnalytics {
  if (videos.length === 0) {
    return {
      channelId,
      totalVideos: 0,
      avgViews: 0,
      avgLikes: 0,
      avgComments: 0,
      avgEngagementRate: 0,
      avgDurationSeconds: 0,
      medianViews: 0,
      topVideos: [],
      heatmapData: computeHeatmap([]),
      durationBuckets: [],
      viewsOverTime: [],
      bestHour: 0,
      bestDay: "Monday",
      engagementVsViews: [],
    };
  }

  const total = videos.length;
  const avgViews = videos.reduce((s, v) => s + v.viewCount, 0) / total;
  const avgLikes = videos.reduce((s, v) => s + v.likeCount, 0) / total;
  const avgComments = videos.reduce((s, v) => s + v.commentCount, 0) / total;
  const avgEngagementRate = videos.reduce((s, v) => s + v.engagementRate, 0) / total;
  const avgDurationSeconds = videos.reduce((s, v) => s + v.durationSeconds, 0) / total;

  const sorted = [...videos].sort((a, b) => a.viewCount - b.viewCount);
  const mid = Math.floor(sorted.length / 2);
  const medianViews = sorted.length % 2 === 0
    ? (sorted[mid - 1].viewCount + sorted[mid].viewCount) / 2
    : sorted[mid].viewCount;

  const topVideos = [...videos]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 10)
    .map((v) => ({
      id: v.id,
      title: v.title,
      thumbnailUrl: v.thumbnailUrl,
      viewCount: v.viewCount,
      likeCount: v.likeCount,
      commentCount: v.commentCount,
      engagementRate: v.engagementRate,
      publishedAt: v.publishedAt,
      durationFormatted: v.durationFormatted,
    }));

  const heatmapData = computeHeatmap(videos);
  const bestCell = heatmapData.reduce((best, cell) => cell.avgViews > best.avgViews ? cell : best, heatmapData[0]);
  const bestHour = bestCell?.hour ?? 0;
  const bestDay = bestCell?.dayName ?? "Monday";

  const durationBuckets = computeDurationBuckets(videos);
  const viewsOverTime = computeViewsOverTime(videos);

  const engagementVsViews = videos.map((v) => ({
    videoId: v.id,
    title: v.title,
    viewCount: v.viewCount,
    engagementRate: v.engagementRate,
    durationSeconds: v.durationSeconds,
  }));

  return {
    channelId,
    totalVideos: total,
    avgViews: Math.round(avgViews),
    avgLikes: Math.round(avgLikes),
    avgComments: Math.round(avgComments),
    avgEngagementRate: Math.round(avgEngagementRate * 100) / 100,
    avgDurationSeconds: Math.round(avgDurationSeconds),
    medianViews: Math.round(medianViews),
    topVideos,
    heatmapData,
    durationBuckets,
    viewsOverTime,
    bestHour,
    bestDay,
    engagementVsViews,
  };
}

export async function compareChannels(channelIds: string[]): Promise<ChannelComparison[]> {
  const results: ChannelComparison[] = [];

  for (const channelId of channelIds) {
    try {
      const [channel, videos] = await Promise.all([
        getChannel(channelId),
        getChannelVideos(channelId, 30),
      ]);
      if (!channel) continue;

      const avgViews = videos.length > 0 ? videos.reduce((s, v) => s + v.viewCount, 0) / videos.length : 0;
      const avgEngagementRate = videos.length > 0 ? videos.reduce((s, v) => s + v.engagementRate, 0) / videos.length : 0;
      const avgDurationSeconds = videos.length > 0 ? videos.reduce((s, v) => s + v.durationSeconds, 0) / videos.length : 0;

      results.push({
        channelId: channel.id,
        title: channel.title,
        thumbnailUrl: channel.thumbnailUrl,
        subscriberCount: channel.subscriberCount,
        avgViews: Math.round(avgViews),
        avgEngagementRate: Math.round(avgEngagementRate * 100) / 100,
        avgDurationSeconds: Math.round(avgDurationSeconds),
        videoCount: channel.videoCount,
        totalViews: channel.viewCount,
      });
    } catch (err) {
      logger.warn({ channelId, err }, "Failed to fetch channel for comparison");
    }
  }

  return results;
}
