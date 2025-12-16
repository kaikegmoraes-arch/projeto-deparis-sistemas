import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FormData {
  type: "support" | "quote";
  recaptchaToken: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  problem_description?: string;
  service_type?: string;
  equipment_quantity?: number | null;
  company_type?: string;
  urgency?: string;
  message?: string | null;
}

const RATE_LIMIT_HOURS = 1;

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const data: FormData = await req.json();
    const { type, recaptchaToken, ...formData } = data;

    // Get client IP from headers
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") ||
                     "unknown";

    console.log(`Processing ${type} form submission from IP: ${clientIP}`);

    // 1. Verify reCAPTCHA
    const recaptchaSecret = Deno.env.get("RECAPTCHA_SECRET_KEY");
    if (!recaptchaSecret) {
      console.error("RECAPTCHA_SECRET_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Configuração do servidor inválida" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
      }
    );

    const recaptchaResult = await recaptchaResponse.json();
    console.log("reCAPTCHA result:", recaptchaResult);

    if (!recaptchaResult.success) {
      return new Response(
        JSON.stringify({ error: "Verificação CAPTCHA falhou. Por favor, tente novamente." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Check rate limit
    const oneHourAgo = new Date(Date.now() - RATE_LIMIT_HOURS * 60 * 60 * 1000).toISOString();
    
    const { data: recentSubmissions, error: rateLimitError } = await supabase
      .from("rate_limits")
      .select("created_at")
      .eq("ip_address", clientIP)
      .eq("form_type", type)
      .gte("created_at", oneHourAgo)
      .order("created_at", { ascending: false })
      .limit(1);

    if (rateLimitError) {
      console.error("Error checking rate limit:", rateLimitError);
    }

    if (recentSubmissions && recentSubmissions.length > 0) {
      const lastSubmission = new Date(recentSubmissions[0].created_at);
      const nextAllowed = new Date(lastSubmission.getTime() + RATE_LIMIT_HOURS * 60 * 60 * 1000);
      const minutesRemaining = Math.ceil((nextAllowed.getTime() - Date.now()) / (60 * 1000));
      
      return new Response(
        JSON.stringify({ 
          error: `Você já enviou uma solicitação de ${type === "support" ? "suporte" : "orçamento"} recentemente. Aguarde ${minutesRemaining} minuto(s) para enviar novamente.`,
          rateLimited: true,
          minutesRemaining
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Insert form data
    const insertData: Record<string, unknown> = {
      type,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
    };

    if (type === "support") {
      insertData.problem_description = formData.problem_description?.trim();
    } else if (type === "quote") {
      insertData.service_type = formData.service_type;
      insertData.equipment_quantity = formData.equipment_quantity;
      insertData.company_type = formData.company_type;
      insertData.urgency = formData.urgency;
      insertData.message = formData.message?.trim() || null;
    }

    const { error: insertError } = await supabase
      .from("requests")
      .insert(insertData);

    if (insertError) {
      console.error("Error inserting request:", insertError);
      return new Response(
        JSON.stringify({ error: "Erro ao enviar solicitação. Tente novamente." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Record rate limit
    const { error: rateLimitInsertError } = await supabase
      .from("rate_limits")
      .insert({
        ip_address: clientIP,
        form_type: type,
      });

    if (rateLimitInsertError) {
      console.error("Error recording rate limit:", rateLimitInsertError);
      // Don't fail the request, just log the error
    }

    console.log(`Successfully processed ${type} form from IP: ${clientIP}`);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing form:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});