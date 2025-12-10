import { Monitor, Headset, FileSearch } from "lucide-react";

const features = [
  {
    icon: Monitor,
    title: "Venda de Equipamentos e Soluções",
    description:
      "Fornecemos equipamentos de qualidade e soluções tecnológicas personalizadas para sua empresa.",
  },
  {
    icon: Headset,
    title: "Suporte para Empresas",
    description:
      "Suporte técnico especializado com atendimento remoto e presencial para resolver seus problemas rapidamente.",
  },
  {
    icon: FileSearch,
    title: "Consultoria em Informática",
    description:
      "Análise completa da sua infraestrutura de TI com recomendações estratégicas para otimização.",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-card">
      <div className="container-custom section-padding">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl gradient-card shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
