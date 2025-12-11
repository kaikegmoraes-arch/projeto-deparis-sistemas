import { HeroBadge } from "./HeroBadge";
import { HeroCTA } from "./HeroCTA";
import { HeroStats } from "./HeroStats";
import { heroContent } from "@/content/hero";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom section-padding relative z-10 py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center">
          <HeroBadge />

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in-up animation-delay-100">
            Soluções em informática para o seu{" "}
            <span className="text-primary">negócio</span> com suporte confiável
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
            {heroContent.subtitle}
          </p>

          <HeroCTA />
          <HeroStats />
        </div>
      </div>
    </section>
  );
}
