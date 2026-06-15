import { Link, useLocation } from "wouter";
import { Search, BarChart2, TrendingUp, BookOpen, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Footer } from "./footer";
import { ScrollToTop } from "./scroll-to-top";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);

  const navItems = [
    { href: "/", label: "Discover", icon: Search },
    { href: "/compare", label: "Compare", icon: BarChart2 },
    { href: "/research", label: "Research", icon: TrendingUp },
  ];

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Top header - visible always */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <TrendingUp className="w-6 h-6" />
          <span>YT Analyzer</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 py-4 space-y-2 z-40">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
          <div className="border-t border-border pt-3 space-y-2">
            {["/faq", "/about", "/contact"].map((href) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground capitalize">
                {href.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
