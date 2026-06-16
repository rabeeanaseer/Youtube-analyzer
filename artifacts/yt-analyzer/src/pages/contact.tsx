import { useState } from "react";
import { Mail, Globe, MessageSquare, Send, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Questions, feedback, collaboration proposals, or just want to say hello — reach out any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Mail, title: "Email", value: "hello@novatratech.co", href: "mailto:hello@novatratech.co" },
          { icon: Globe, title: "Website", value: "novatratech.co", href: "https://novatratech.co" },
          { icon: MessageSquare, title: "Response Time", value: "Within 48 hours", href: null },
        ].map((item) => (
          <Card key={item.title} className="bg-card border-border text-center">
            <CardContent className="p-6 space-y-3">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="font-medium">{item.title}</p>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                  {item.value}
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">{item.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {submitted ? (
        <div className="flex flex-col items-center gap-4 py-16 bg-card border border-border rounded-xl">
          <CheckCircle className="w-12 h-12 text-emerald-400" />
          <h2 className="text-xl font-semibold">Message received</h2>
          <p className="text-muted-foreground">We'll get back to you within 48 hours.</p>
          <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
            className="text-sm text-primary hover:underline mt-2">Send another message</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 space-y-6">
          <h2 className="text-xl font-semibold">Send a Message</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required data-testid="input-name" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required data-testid="input-email" />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</label>
            <Input id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" required data-testid="input-subject" />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
            <textarea
              id="message" name="message" value={form.message} onChange={handleChange}
              placeholder="Tell us what's on your mind..."
              required data-testid="input-message"
              className="w-full h-36 px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <button type="submit" data-testid="button-submit"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
            <Send className="w-4 h-4" /> Send Message
          </button>
        </form>
      )}
    </div>
  );
}
