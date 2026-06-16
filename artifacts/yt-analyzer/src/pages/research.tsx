import { useState } from "react";
import { Link } from "wouter";
import { POSTS, CATEGORIES } from "@/data/research";
import { Search, Clock, ArrowRight, BookOpen, Tag } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  Analytics: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Algorithm: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Content Strategy": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Growth: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Creator Tools": "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export default function Research() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = POSTS.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch =
      search.trim() === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = POSTS[0];

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-12">

      {/* Header */}
      <div className="space-y-4 opacity-0-init animate-fade-in-up" style={{ animationFillMode: "forwards" }}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold tracking-wider uppercase">
          <BookOpen className="w-3 h-3" /> Research & Insights
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          The YouTube Analytics <span className="animate-shimmer-text">Playbook</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Data-driven articles on content strategy, algorithm mechanics, growth tactics, and channel analytics — written for creators who think in numbers.
        </p>
      </div>

      {/* Featured post */}
      <Link
        href={`/research/${featured.slug}`}
        className="opacity-0-init animate-fade-in-up block group"
        style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group-hover:-translate-y-1">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: "radial-gradient(ellipse at 20% 50%, rgba(255,45,85,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.1) 0%, transparent 50%)",
            }}
          />
          <div className="relative p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                Featured
              </span>
              <span className={`text-xs font-medium px-3 py-1 rounded-full border ${CATEGORY_COLORS[featured.category] ?? "bg-muted text-muted-foreground border-border"}`}>
                {featured.category}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {featured.readTime}
              </span>
              <span className="text-xs text-muted-foreground">{featured.date}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors leading-snug">
              {featured.title}
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed max-w-3xl mb-6">
              {featured.excerpt}
            </p>
            <div className="flex items-center gap-2 text-primary text-sm font-semibold">
              Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>

      {/* Filter bar */}
      <div
        className="opacity-0-init animate-fade-in-up flex flex-col md:flex-row gap-4"
        style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
      >
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 flex-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {cat !== "All" && <Tag className="w-3 h-3" />}
              {cat}
              <span className="text-xs opacity-60 ml-0.5">
                ({cat === "All" ? POSTS.length : POSTS.filter((p) => p.category === cat).length})
              </span>
            </button>
          ))}
        </div>
        {/* Search */}
        <div className="relative md:w-64 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between -mt-4">
        <p className="text-sm text-muted-foreground">
          {filtered.length} article{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" && <> in <span className="text-foreground font-medium">{activeCategory}</span></>}
          {search && <> matching <span className="text-foreground font-medium">"{search}"</span></>}
        </p>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <Link
              key={post.slug}
              href={`/research/${post.slug}`}
              className="opacity-0-init animate-fade-in-up block group"
              style={{ animationDelay: `${0.05 * i}s`, animationFillMode: "forwards" }}
            >
              <div className="h-full bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[post.category] ?? "bg-muted text-muted-foreground border-border"}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>
                <h3 className="font-bold text-base leading-snug mb-3 group-hover:text-primary transition-colors flex-1">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-5">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                  <span className="text-xs text-primary font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card/50 rounded-2xl border border-border border-dashed">
          <BookOpen className="w-10 h-10 mx-auto text-muted-foreground mb-4 opacity-30" />
          <h3 className="text-lg font-medium">No articles found</h3>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
}
