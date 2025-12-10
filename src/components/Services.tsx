import { Wrench, ShoppingBag, FileText, Settings, Network, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Wrench,
    title: "Assistência Técnica e Suporte Remoto",
    description:
      "Manutenção preventiva e corretiva de equipamentos com atendimento remoto ágil.",
  },
  {
    icon: ShoppingBag,
    title: "Venda de Equipamentos e Soluções de TI",
    description:
      "Computadores, notebooks, servidores e periféricos das melhores marcas.",
  },
  {
    icon: FileText,
    title: "Consultoria Técnica para Empresas",
    description:
      "Análise da sua infraestrutura com plano de melhorias e otimização de recursos.",
  },
  {
    icon: Settings,
    title: "Instalação e Configuração de Sistemas",
    description:
      "Implantação de sistemas operacionais, softwares e configurações personalizadas.",
  },
  {
    icon: Network,
    title: "Implementação de Estrutura de Rede Local",
    description:
      "Projeto e instalação de redes cabeadas e Wi-Fi para sua empresa.",
  },
];

export function Services() {
  return (
    <section id="servicos" className="py-24 bg-card scroll-mt-20">
      <div className="container-custom section-padding">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
            Nossos Serviços
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Soluções completas em <span className="text-primary">tecnologia</span>
          </h2>
          <p className="text-muted-foreground">
            Oferecemos uma gama completa de serviços de TI para atender todas as 
            necessidades da sua empresa.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group p-6 rounded-xl bg-background border border-border hover:border-primary/30 hover:shadow-card-hover transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <service.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}

          {/* CTA Card */}
          <div className="p-6 rounded-xl gradient-primary flex flex-col justify-center items-center text-center animate-fade-in-up animation-delay-500">
            <h3 className="text-xl font-semibold text-primary-foreground mb-3">
              Precisa de um serviço personalizado?
            </h3>
            <p className="text-primary-foreground/80 text-sm mb-6">
              Entre em contato e vamos encontrar a solução ideal para você.
            </p>
            <Link to="/orcamento">
              <Button
                variant="secondary"
                className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Solicitar Orçamento
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
