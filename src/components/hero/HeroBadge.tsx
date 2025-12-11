import { heroContent } from "@/content/hero";

export function HeroBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-8 animate-fade-in-up">
      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      {heroContent.badge}
    </div>
  );
}
