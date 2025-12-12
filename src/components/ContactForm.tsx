import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2, MapPin, Mail, Phone } from "lucide-react";
import { contactFormSchema, ContactFormData } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function ContactForm() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      company: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: ContactFormData) => {
    try {
      const { error } = await supabase.from("requests").insert({
        type: "contact",
        name: data.name.trim(),
        company: data.company?.trim() || null,
        phone: data.phone?.trim() || null,
        email: data.email.trim(),
        message: data.message.trim(),
      });

      if (error) throw error;

      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve.",
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
    <section id="contato" className="py-24 bg-background scroll-mt-20">
      <div className="container-custom section-padding">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Info */}
          <div className="animate-slide-in-left">
            <span className="inline-block px-4 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
              Contato
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Entre em <span className="text-primary">contato</span> conosco
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Estamos prontos para atender sua empresa. Entre em contato pelo 
              formulário ou através dos nossos canais de atendimento.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">E-mail</h4>
                  <p className="text-muted-foreground">contato@deparissistemas.com.br</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Telefone</h4>
                  <p className="text-muted-foreground">(11) 1234-5678</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Endereço</h4>
                  <p className="text-muted-foreground">São Paulo, SP - Brasil</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="animate-slide-in-right">
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
                          <Input placeholder="Seu nome" {...field} />
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
                        <FormLabel>Empresa</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da empresa" {...field} />
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
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(11) 99999-9999" {...field} />
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

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem *</FormLabel>
                      <FormControl>
                        <Textarea rows={5} placeholder="Como podemos ajudar?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
