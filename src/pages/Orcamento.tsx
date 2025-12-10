import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2, FileText } from "lucide-react";

const serviceTypes = [
  "Assistência Técnica",
  "Suporte Remoto",
  "Venda de Equipamentos",
  "Consultoria em TI",
  "Instalação de Sistemas",
  "Estrutura de Rede",
  "Outro",
];

const companyTypes = [
  "MEI",
  "ME (Microempresa)",
  "EPP (Empresa de Pequeno Porte)",
  "Média Empresa",
  "Grande Empresa",
];

const urgencyLevels = [
  { value: "baixa", label: "Baixa - Pode aguardar até 15 dias" },
  { value: "normal", label: "Normal - Em até 7 dias" },
  { value: "alta", label: "Alta - Em até 3 dias" },
  { value: "urgente", label: "Urgente - Imediato" },
];

const Orcamento = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service_type: "",
    equipment_quantity: "",
    company_type: "",
    urgency: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from("requests").insert({
        type: "quote",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        service_type: formData.service_type,
        equipment_quantity: formData.equipment_quantity ? parseInt(formData.equipment_quantity) : null,
        company_type: formData.company_type,
        urgency: formData.urgency,
        message: formData.message,
      });

      if (error) throw error;

      toast({
        title: "Solicitação enviada!",
        description: "Entraremos em contato com seu orçamento em breve.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        service_type: "",
        equipment_quantity: "",
        company_type: "",
        urgency: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-16 lg:py-24 gradient-hero">
          <div className="container-custom section-padding">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-in-up">
                Solicitar <span className="text-primary">Orçamento</span>
              </h1>
              <p className="text-lg text-muted-foreground animate-fade-in-up animation-delay-100">
                Preencha o formulário detalhado abaixo e receba um orçamento 
                personalizado para sua necessidade.
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="py-16 lg:py-24">
          <div className="container-custom section-padding">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 rounded-2xl shadow-card border border-border">
                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Informações de Contato
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa *</Label>
                      <Input
                        id="company"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Nome da empresa"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Detalhes do Serviço
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="service_type">Tipo de Serviço *</Label>
                      <Select
                        value={formData.service_type}
                        onValueChange={(value) => setFormData({ ...formData, service_type: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="equipment_quantity">Quantidade de Equipamentos</Label>
                      <Input
                        id="equipment_quantity"
                        type="number"
                        min="0"
                        value={formData.equipment_quantity}
                        onChange={(e) => setFormData({ ...formData, equipment_quantity: e.target.value })}
                        placeholder="Ex: 10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company_type">Tipo de Empresa *</Label>
                      <Select
                        value={formData.company_type}
                        onValueChange={(value) => setFormData({ ...formData, company_type: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o porte" />
                        </SelectTrigger>
                        <SelectContent>
                          {companyTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="urgency">Urgência do Atendimento *</Label>
                      <Select
                        value={formData.urgency}
                        onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a urgência" />
                        </SelectTrigger>
                        <SelectContent>
                          {urgencyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Informações Adicionais
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="message">Descrição da Necessidade</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Descreva com mais detalhes o que você precisa..."
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando solicitação...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Solicitar Orçamento
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Orcamento;
