import { heroContent } from "@/content/hero";

export function HeroStats() {
  return (
    <div className="mt-16 pt-10 border-t border-border/50 animate-fade-in-up animation-delay-400">
      <p className="text-sm text-muted-foreground mb-6">
        Confiado por empresas em todo o Brasil
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground/60">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-primary">{heroContent.stats.clients}</span>
          <span className="text-sm">Clientes atendidos</span>
        </div>

        <div className="w-px h-12 bg-border hidden sm:block" />

        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-primary">{heroContent.stats.experience}</span>
          <span className="text-sm">Anos de experiência</span>
        </div>

        <div className="w-px h-12 bg-border hidden sm:block" />

        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-primary">{heroContent.stats.satisfaction}</span>
          <span className="text-sm">Satisfação</span>
        </div>
      </div>
    </div>
  );
}
