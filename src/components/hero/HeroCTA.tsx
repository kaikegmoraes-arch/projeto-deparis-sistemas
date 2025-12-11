import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Headphones } from "lucide-react";

export function HeroCTA() {
  return (
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
  );
}
