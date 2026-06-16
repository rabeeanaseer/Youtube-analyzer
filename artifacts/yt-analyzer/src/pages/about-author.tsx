import { Link } from "wouter";
import { Globe, Linkedin, Github, BarChart2, Cloud, Code2, Lightbulb, MessageSquare, Cpu, Database, Layers } from "lucide-react";

export default function AboutAuthor() {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12">
      {/* Profile header */}
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <div className="flex-shrink-0">
          <div className="w-36 h-36 rounded-full bg-gradient-to-br from-primary/40 to-blue-500/40 border-4 border-border flex items-center justify-center text-5xl font-bold text-primary">
            RN
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rabeea Naseer</h1>
            <p className="text-primary font-medium mt-1 leading-snug">
              AI &amp; Data-Driven Systems Developer building scalable SaaS, automation, and data-intelligent web ecosystems
            </p>
            <p className="text-sm text-muted-foreground mt-1">Founder @ NovatraTech · Rawalpindi, Pakistan · Open to global collaborations</p>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            I'm a Data Scientist and Founder at NovatraTech, specializing in building scalable SaaS platforms, automated pipelines, and data-intelligent web ecosystems that solve real operational problems for businesses. My approach bridges deep data science with hands-on cloud architecture — handling everything from training AI models to provisioning secure GCP infrastructure and rock-solid VPC network topologies.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Beyond client infrastructure, I actively explore applied data science and intelligent automation — maintaining open-source experiments on GitHub and Kaggle, focusing on predictive analytics, LLM pipelines, and scalable data systems. If you're exploring building a product and don't want to start from zero, I develop production-ready systems and SaaS frameworks that businesses can build on, customize, or license directly.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="https://www.linkedin.com/in/rabeea-naseer-045b4a337/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
            <a
              href="https://github.com/rabeeanaseer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a
              href="https://novatratech.co"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Globe className="w-4 h-4" /> novatratech.co
            </a>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm hover:border-primary/50 hover:text-primary transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> Contact Me
            </Link>
          </div>
        </div>
      </div>

      {/* Expertise grid */}
      <div>
        <h2 className="text-xl font-bold mb-6">Expertise &amp; Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Layers,
              title: "Full-Scale Systems",
              body: "End-to-end SaaS platforms and data-driven web products — from initial concept to production launch with zero handoffs and zero gaps."
            },
            {
              icon: Code2,
              title: "Custom Development",
              body: "Advanced web applications, engineered WordPress architectures, and bespoke tools tailored to specific operational workflows."
            },
            {
              icon: Cpu,
              title: "Intelligence & Automation",
              body: "AI integrations, LLM pipelines, and automated workflow scripts that remove manual effort from repetitive, high-volume processes."
            },
            {
              icon: Cloud,
              title: "Infrastructure & DevOps",
              body: "Cloud/VPS deployments, secure GCP environments, VPC network topologies, and hardened security configurations at scale."
            },
            {
              icon: Database,
              title: "Data Science & Analytics",
              body: "Predictive analytics, automated pipelines, and competitive intelligence tools — the kind of analysis that used to need a full data team."
            },
            {
              icon: Lightbulb,
              title: "Digital Optimization",
              body: "User-centric UI/UX design and technical SEO — ensuring products not only work at scale but are discoverable and delightful to use."
            },
            {
              icon: BarChart2,
              title: "Content & Growth Analytics",
              body: "Translating raw YouTube and content platform data into actionable editorial decisions — what to make, how long, and when to publish."
            },
          ].map((item) => (
            <div key={item.title} className="p-5 bg-card border border-border rounded-xl space-y-3">
              <div className="p-2 bg-primary/10 rounded-lg w-fit">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why I built this */}
      <div className="bg-card border border-border rounded-xl p-8 space-y-4">
        <h2 className="text-xl font-bold">Why I Built YT Analyzer</h2>
        <p className="text-muted-foreground leading-relaxed">
          I was frustrated. Every time I wanted to audit a competitor's YouTube channel, I had to either pay $99/month for an enterprise tool or spend hours manually cross-referencing data in spreadsheets. Neither was acceptable for a data systems builder who lives on automation.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          YT Analyzer is the tool I wished existed — pulling live data from the YouTube API, running the analysis automatically, and surfacing the insights that actually change what you create next. It's built for content strategists who think in data and create in stories.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          It's also a live demonstration of what NovatraTech builds: automated data pipelines that extract, clean, and visualize competitor metrics — the kind of intelligence layer that scales from solo creators all the way up to enterprise content operations.
        </p>
        <div className="pt-2 flex flex-wrap gap-4 text-sm text-muted-foreground border-t border-border">
          <span>🌐 <a href="https://novatratech.co" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">novatratech.co</a></span>
          <span>📍 Rawalpindi, Pakistan</span>
          <span>🤝 Open to global collaborations</span>
        </div>
      </div>
    </div>
  );
}
