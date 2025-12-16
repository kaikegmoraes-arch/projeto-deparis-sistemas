import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2, Headphones, Clock, Shield, CheckCircle } from "lucide-react";
import { supportFormSchema, SupportFormData } from "@/lib/validations";
import { ReCaptcha, resetReCaptcha } from "@/components/ReCaptcha";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const benefits = [
  {
    icon: Clock,
    title: "Resposta Rápida",
    description: "Retorno em até 24 horas úteis",
  },
  {
    icon: Shield,
    title: "Suporte Seguro",
    description: "Conexões criptografadas",
  },
  {
    icon: CheckCircle,
    title: "Resolução Garantida",
    description: "Acompanhamento até a solução",
  },
];

const Suporte = () => {
  const { toast } = useToast();
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  
  const form = useForm<SupportFormData>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      problem_description: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: SupportFormData) => {
    if (!recaptchaToken) {
      toast({
        title: "Verificação necessária",
        description: "Por favor, complete o CAPTCHA antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: response, error } = await supabase.functions.invoke("submit-form", {
        body: {
          type: "support",
          recaptchaToken,
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          problem_description: data.problem_description,
        },
      });

      if (error) throw error;

      if (response.error) {
        toast({
          title: response.rateLimited ? "Limite de envios atingido" : "Erro ao enviar",
          description: response.error,
          variant: "destructive",
        });
        resetReCaptcha();
        setRecaptchaToken(null);
        return;
      }

      toast({
        title: "Chamado enviado!",
        description: "Nossa equipe entrará em contato em breve.",
      });

      form.reset();
      resetReCaptcha();
      setRecaptchaToken(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
      resetReCaptcha();
      setRecaptchaToken(null);
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
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                <Headphones className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-in-up">
                Central de <span className="text-primary">Suporte</span>
              </h1>
              <p className="text-lg text-muted-foreground animate-fade-in-up animation-delay-100">
                Abra um chamado de suporte técnico e nossa equipe entrará em contato
                para resolver seu problema.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 bg-card border-y border-border">
          <div className="container-custom section-padding">
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className="flex items-center gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="py-16 lg:py-24">
          <div className="container-custom section-padding">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Abrir Chamado de Suporte
                </h2>
                <p className="text-muted-foreground">
                  Preencha o formulário abaixo com os detalhes do seu problema.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-8 rounded-2xl shadow-card border border-border">
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
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
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

                  <FormField
                    control={form.control}
                    name="problem_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição do Problema *</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={6}
                            placeholder="Descreva detalhadamente o problema que está enfrentando..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* reCAPTCHA */}
                  <div className="py-2">
                    <ReCaptcha 
                      onVerify={(token) => setRecaptchaToken(token)}
                      onExpire={() => setRecaptchaToken(null)}
                      onError={() => setRecaptchaToken(null)}
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2" size="lg" disabled={isLoading || !recaptchaToken}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enviando chamado...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar Chamado
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

export default Suporte;