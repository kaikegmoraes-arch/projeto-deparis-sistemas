import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Headphones } from "lucide-react";

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
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Há mais de 10 anos no mercado
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in-up animation-delay-100">
            Soluções em informática para o seu{" "}
            <span className="text-primary">negócio</span> com suporte confiável
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
            Atendimento especializado em tecnologia para pequenas e médias empresas. 
            Consultoria, suporte técnico e soluções completas em TI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
            <Link to="/#contato">
              <Button size="lg" className="gap-2 shadow-hero">
                Fale Conosco
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/suporte">
              <Button size="lg" variant="outline" className="gap-2">
                <Headphones className="w-4 h-4" />
                Solicitar Suporte
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-10 border-t border-border/50 animate-fade-in-up animation-delay-400">
            <p className="text-sm text-muted-foreground mb-6">
              Confiado por empresas em todo o Brasil
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground/60">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-primary">500+</span>
                <span className="text-sm">Clientes atendidos</span>
              </div>
              <div className="w-px h-12 bg-border hidden sm:block" />
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-primary">10+</span>
                <span className="text-sm">Anos de experiência</span>
              </div>
              <div className="w-px h-12 bg-border hidden sm:block" />
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-primary">98%</span>
                <span className="text-sm">Satisfação</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
