import { useParams, Link } from "wouter";
import { POSTS } from "@/data/research";
import { ArrowLeft, Clock, Calendar, Tag, ArrowRight } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  Analytics: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Algorithm: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Content Strategy": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Growth: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Creator Tools": "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let key = 0;

  function flushList() {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={key++} className="space-y-2 my-5 pl-1">
          {listBuffer.map((item, i) => (
            <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  }

  for (const line of lines) {
    if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={key++} className="text-2xl font-bold mt-10 mb-4 text-foreground border-b border-border pb-3">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={key++} className="text-lg font-bold mt-7 mb-3 text-foreground">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      flushList();
      elements.push(
        <p key={key++} className="font-semibold text-foreground mt-5 mb-2">
          {line.slice(2, -2)}
        </p>
      );
    } else if (line.startsWith("- ")) {
      listBuffer.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList();
    } else if (line.trim().length > 0) {
      flushList();
      // Handle inline bold
      const parts = line.split(/\*\*(.*?)\*\*/g);
      elements.push(
        <p key={key++} className="text-muted-foreground leading-relaxed my-3">
          {parts.map((part, i) =>
            i % 2 === 1 ? <strong key={i} className="text-foreground font-semibold">{part}</strong> : part
          )}
        </p>
      );
    }
  }
  flushList();
  return elements;
}

export default function ResearchPost() {
  const params = useParams();
  const slug = params.slug as string;
  const post = POSTS.find((p) => p.slug === slug);

  const currentIdx = POSTS.findIndex((p) => p.slug === slug);
  const prev = currentIdx > 0 ? POSTS[currentIdx - 1] : null;
  const next = currentIdx < POSTS.length - 1 ? POSTS[currentIdx + 1] : null;
  const related = POSTS.filter((p) => p.slug !== slug && p.category === post?.category).slice(0, 3);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
        <h1 className="text-3xl font-bold">Article not found</h1>
        <p className="text-muted-foreground">This article doesn't exist or may have been moved.</p>
        <Link href="/research" className="inline-flex items-center gap-2 text-primary hover:underline text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Research
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      {/* Back */}
      <Link
        href="/research"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Research
      </Link>

      {/* Article header */}
      <div className="space-y-5 mb-10 opacity-0-init animate-fade-in-up" style={{ animationFillMode: "forwards" }}>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`text-xs font-medium px-3 py-1 rounded-full border flex items-center gap-1.5 ${CATEGORY_COLORS[post.category] ?? "bg-muted text-muted-foreground border-border"}`}>
            <Tag className="w-3 h-3" /> {post.category}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {post.readTime}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {post.date}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
          {post.title}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-primary/40 pl-5 italic">
          {post.excerpt}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-border mb-10" />

      {/* Article body */}
      <article className="opacity-0-init animate-fade-in-up" style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}>
        {renderContent(post.content)}
      </article>

      {/* Divider */}
      <div className="h-px bg-border mt-14 mb-10" />

      {/* Prev / Next navigation */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-0-init animate-fade-in-up mb-12"
        style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
      >
        {prev ? (
          <Link href={`/research/${prev.slug}`} className="group p-5 bg-card border border-border rounded-2xl hover:border-primary/40 transition-all">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Previous
            </p>
            <p className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {prev.title}
            </p>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/research/${next.slug}`} className="group p-5 bg-card border border-border rounded-2xl hover:border-primary/40 transition-all text-right">
            <p className="text-xs text-muted-foreground mb-2 flex items-center justify-end gap-1">
              Next <ArrowRight className="w-3 h-3" />
            </p>
            <p className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {next.title}
            </p>
          </Link>
        ) : <div />}
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div
          className="opacity-0-init animate-fade-in-up"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <h2 className="text-xl font-bold mb-5">More in {post.category}</h2>
          <div className="space-y-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/research/${r.slug}`}
                className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:bg-muted/20 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-1">{r.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{r.excerpt}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
                  <Clock className="w-3 h-3" /> {r.readTime}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/research" className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium">
              View all articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
