import { Link } from "wouter";
import { TrendingUp, BarChart2, Lightbulb, Target } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">About YT Analyzer</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A professional-grade intelligence platform built for YouTube creators, content strategists, and digital marketers who want data — not guesswork.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            icon: TrendingUp,
            title: "Built for Creators",
            body: "YT Analyzer was created because most analytics tools either paywalled everything or buried actionable insight under vanity metrics. We surface exactly what moves the needle: posting windows, video length correlations, engagement benchmarks, and competitive positioning."
          },
          {
            icon: BarChart2,
            title: "Live YouTube Data",
            body: "Every number you see is pulled directly from the YouTube Data API v3 in real time. No stale caches, no synthetic data. Subscriber counts, view trajectories, engagement rates, and posting patterns are always current."
          },
          {
            icon: Lightbulb,
            title: "Insight Over Information",
            body: "Raw data is noise without interpretation. YT Analyzer transforms numbers into plain-language growth recommendations: the right video length for this specific channel, the best day to post, and which content patterns are under-exploited."
          },
          {
            icon: Target,
            title: "Competitive Intelligence",
            body: "The Compare tool lets you stack up to 5 channels side by side across subscriber count, average views, engagement rate, and video length — giving you a forensic view of what separates top performers from the pack."
          }
        ].map((card) => (
          <div key={card.title} className="p-6 bg-card border border-border rounded-xl space-y-3">
            <div className="p-2.5 bg-primary/10 rounded-lg w-fit">
              <card.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{card.body}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-8 space-y-4">
        <h2 className="text-2xl font-bold">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed">
          YouTube is the world's second-largest search engine and the most powerful long-form content platform ever built. Yet most creators operate on intuition rather than evidence — uploading when they feel like it, choosing topics based on trends, and guessing at optimal video length.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          YT Analyzer exists to fix that. We believe every creator deserves access to the same depth of competitive analysis that large media companies pay analysts to produce. Our goal is to make that intelligence free, fast, and actionable — so you can spend less time wondering and more time creating.
        </p>
      </div>

      <div className="text-center space-y-4">
        <p className="text-muted-foreground">Have a question or want to know more?</p>
        <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Get in Touch
        </Link>
      </div>
    </div>
  );
}
