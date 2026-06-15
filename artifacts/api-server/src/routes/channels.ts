import { Router, type IRouter } from "express";
import {
  searchChannels,
  getChannel,
  getChannelVideos,
  computeAnalytics,
  compareChannels,
} from "../lib/youtube";

const router: IRouter = Router();

router.get("/channels/search", async (req, res): Promise<void> => {
  const q = req.query.q as string | undefined;
  if (!q) {
    res.status(400).json({ error: "Query parameter 'q' is required" });
    return;
  }
  const maxResults = Math.min(parseInt(String(req.query.maxResults ?? "10"), 10), 50);

  try {
    const channels = await searchChannels(q, maxResults);
    res.json(channels);
  } catch (err) {
    req.log.error({ err }, "Failed to search channels");
    res.status(500).json({ error: "Failed to search YouTube channels" });
  }
});

router.get("/channels/:channelId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.channelId) ? req.params.channelId[0] : req.params.channelId;
  const channelId = String(raw);

  try {
    const channel = await getChannel(channelId);
    if (!channel) {
      res.status(404).json({ error: "Channel not found" });
      return;
    }
    res.json(channel);
  } catch (err) {
    req.log.error({ err, channelId }, "Failed to get channel");
    res.status(500).json({ error: "Failed to fetch channel" });
  }
});

router.get("/videos/:channelId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.channelId) ? req.params.channelId[0] : req.params.channelId;
  const channelId = String(raw);

  try {
    const channel = await getChannel(channelId);
    if (!channel) {
      res.status(404).json({ error: "Channel not found" });
      return;
    }
    const videos = await getChannelVideos(channelId, 50);
    res.json(videos);
  } catch (err) {
    req.log.error({ err, channelId }, "Failed to get channel videos");
    res.status(500).json({ error: "Failed to fetch channel videos" });
  }
});

router.get("/analytics/:channelId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.channelId) ? req.params.channelId[0] : req.params.channelId;
  const channelId = String(raw);

  try {
    const channel = await getChannel(channelId);
    if (!channel) {
      res.status(404).json({ error: "Channel not found" });
      return;
    }
    const videos = await getChannelVideos(channelId, 50);
    const analytics = computeAnalytics(channelId, videos);
    res.json(analytics);
  } catch (err) {
    req.log.error({ err, channelId }, "Failed to compute analytics");
    res.status(500).json({ error: "Failed to compute channel analytics" });
  }
});

router.post("/compare", async (req, res): Promise<void> => {
  const body = req.body as { channelIds?: unknown };
  if (!Array.isArray(body.channelIds) || body.channelIds.length < 2) {
    res.status(400).json({ error: "channelIds must be an array with at least 2 items" });
    return;
  }
  const channelIds = (body.channelIds as unknown[]).filter((id): id is string => typeof id === "string").slice(0, 10);

  try {
    const comparisons = await compareChannels(channelIds);
    res.json(comparisons);
  } catch (err) {
    req.log.error({ err }, "Failed to compare channels");
    res.status(500).json({ error: "Failed to compare channels" });
  }
});

export default router;
