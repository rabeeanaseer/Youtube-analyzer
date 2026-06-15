import { Info } from "lucide-react";

interface GraphNoteProps {
  strengths: string[];
  watch: string[];
  explanation: string;
}

export function GraphNote({ strengths, watch, explanation }: GraphNoteProps) {
  return (
    <div className="mt-4 rounded-lg border border-border bg-background p-4 space-y-3 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground font-medium">
        <Info className="w-4 h-4 text-primary" />
        <span>How to read this chart</span>
      </div>
      <p className="text-muted-foreground leading-relaxed">{explanation}</p>
      {strengths.length > 0 && (
        <div>
          <p className="text-emerald-400 font-medium mb-1.5">Strengths to note</p>
          <ul className="space-y-1">
            {strengths.map((s, i) => (
              <li key={i} className="text-muted-foreground flex gap-2">
                <span className="text-emerald-400 mt-0.5">+</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {watch.length > 0 && (
        <div>
          <p className="text-amber-400 font-medium mb-1.5">Watch out for</p>
          <ul className="space-y-1">
            {watch.map((w, i) => (
              <li key={i} className="text-muted-foreground flex gap-2">
                <span className="text-amber-400 mt-0.5">!</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
