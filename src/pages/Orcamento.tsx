import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { quoteFormSchema, QuoteFormData } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
  
  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      service_type: "",
      equipment_quantity: "",
      company_type: "",
      urgency: "",
      message: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: QuoteFormData) => {
    try {
      const { error } = await supabase.from("requests").insert({
        type: "quote",
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        company: data.company.trim(),
        service_type: data.service_type,
        equipment_quantity: data.equipment_quantity ? parseInt(data.equipment_quantity) : null,
        company_type: data.company_type,
        urgency: data.urgency,
        message: data.message?.trim() || null,
      });

      if (error) throw error;

      toast({
        title: "Solicitação enviada!",
        description: "Entraremos em contato com seu orçamento em breve.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-card p-8 rounded-2xl shadow-card border border-border">
                  {/* Contact Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Informações de Contato
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome *</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone *</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="(11) 99999-9999" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Empresa *</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome da empresa" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Detalhes do Serviço
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="service_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Serviço *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o serviço" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {serviceTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="equipment_quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantidade de Equipamentos</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" placeholder="Ex: 10" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="company_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Empresa *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o porte" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {companyTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="urgency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Urgência do Atendimento *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a urgência" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {urgencyLevels.map((level) => (
                                  <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Informações Adicionais
                    </h3>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição da Necessidade</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={5}
                              placeholder="Descreva com mais detalhes o que você precisa..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
              </Form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Orcamento;
