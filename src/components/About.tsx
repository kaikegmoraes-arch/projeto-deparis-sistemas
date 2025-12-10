import { CheckCircle } from "lucide-react";

const highlights = [
  "Equipe técnica qualificada e certificada",
  "Atendimento personalizado para cada cliente",
  "Soluções adaptadas ao seu orçamento",
  "Suporte contínuo e acompanhamento",
];

export function About() {
  return (
    <section id="sobre" className="py-24 bg-background scroll-mt-20">
      <div className="container-custom section-padding">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-slide-in-left">
            <span className="inline-block px-4 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
              Sobre a Deparis
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Tecnologia que transforma{" "}
              <span className="text-primary">negócios</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Somos uma empresa especializada em soluções tecnológicas voltadas para 
              pequenas e médias empresas. Atuamos com suporte técnico especializado, 
              fornecimento de soluções em informática e consultoria para gestão tecnológica.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Nossa missão é simplificar a tecnologia para que você possa focar no 
              que realmente importa: o crescimento do seu negócio. Com uma equipe 
              dedicada e experiente, oferecemos soluções sob medida que se adaptam 
              às necessidades específicas de cada cliente.
            </p>

            <ul className="space-y-4">
              {highlights.map((item, index) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-foreground"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual */}
          <div className="relative animate-slide-in-right">
            <div className="aspect-square rounded-2xl gradient-primary p-8 flex items-center justify-center">
              <div className="text-center text-primary-foreground">
                <div className="text-7xl font-bold mb-4">10+</div>
                <div className="text-xl font-medium mb-2">Anos de</div>
                <div className="text-xl font-medium">Experiência</div>
              </div>
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-hero border border-border">
              <div className="text-2xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Clientes satisfeitos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
