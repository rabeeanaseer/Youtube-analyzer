import { Link } from "wouter";
import { TrendingUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-primary font-bold text-lg">
              <TrendingUp className="w-5 h-5" />
              <span>YT Analyzer</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professional YouTube analytics intelligence for creators and content strategists. Reverse-engineer what makes videos go viral.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Discover Channels</Link></li>
              <li><Link href="/compare" className="text-muted-foreground hover:text-primary transition-colors">Compare Channels</Link></li>
              <li><Link href="/research" className="text-muted-foreground hover:text-primary transition-colors">Research & Insights</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">How It Works</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/about-author" className="text-muted-foreground hover:text-primary transition-colors">About Author</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="text-muted-foreground hover:text-primary transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} YT Analyzer. All rights reserved. Data sourced from YouTube Data API v3.</p>
          <p className="text-xs">Not affiliated with YouTube or Google LLC.</p>
        </div>
      </div>
    </footer>
  );
}
