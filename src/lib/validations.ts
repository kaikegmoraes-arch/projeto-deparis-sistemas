import { z } from "zod";

// Brazilian phone regex - accepts formats: (11) 99999-9999, (11) 9999-9999, 11999999999
const phoneRegex = /^(\(?\d{2}\)?[\s-]?)?\d{4,5}[-\s]?\d{4}$/;

export const contactFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome deve ter no máximo 100 caracteres"),
  company: z.string().max(100, "Empresa deve ter no máximo 100 caracteres").optional().or(z.literal("")),
  phone: z.string().regex(phoneRegex, "Telefone inválido").optional().or(z.literal("")),
  email: z.string().email("E-mail inválido").max(255, "E-mail deve ter no máximo 255 caracteres"),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres").max(2000, "Mensagem deve ter no máximo 2000 caracteres"),
});

export const supportFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z.string().email("E-mail inválido").max(255, "E-mail deve ter no máximo 255 caracteres"),
  phone: z.string().min(1, "Telefone é obrigatório").regex(phoneRegex, "Telefone inválido"),
  company: z.string().min(1, "Empresa é obrigatória").max(100, "Empresa deve ter no máximo 100 caracteres"),
  problem_description: z.string().min(20, "Descreva o problema com pelo menos 20 caracteres").max(3000, "Descrição deve ter no máximo 3000 caracteres"),
});

export const quoteFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z.string().email("E-mail inválido").max(255, "E-mail deve ter no máximo 255 caracteres"),
  phone: z.string().min(1, "Telefone é obrigatório").regex(phoneRegex, "Telefone inválido"),
  company: z.string().min(1, "Empresa é obrigatória").max(100, "Empresa deve ter no máximo 100 caracteres"),
  service_type: z.string().min(1, "Selecione o tipo de serviço"),
  equipment_quantity: z.string().optional().or(z.literal("")),
  company_type: z.string().min(1, "Selecione o tipo de empresa"),
  urgency: z.string().min(1, "Selecione a urgência"),
  message: z.string().max(3000, "Mensagem deve ter no máximo 3000 caracteres").optional().or(z.literal("")),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type SupportFormData = z.infer<typeof supportFormSchema>;
export type QuoteFormData = z.infer<typeof quoteFormSchema>;
