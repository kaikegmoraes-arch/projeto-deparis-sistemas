import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Monitor, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { signInWithEmail, signInWithGoogle, loading, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCheckingRole, setIsCheckingRole] = useState(false);

  // Redirect based on role when user is authenticated
  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      if (user) {
        setIsCheckingRole(true);
        try {
          const { data: isAdmin } = await supabase.rpc("has_role", {
            _user_id: user.id,
            _role: "admin",
          });

          if (isAdmin) {
            navigate("/admin");
          } else {
            navigate("/documentos");
          }
        } catch (error) {
          console.error("Error checking role:", error);
          navigate("/documentos");
        } finally {
          setIsCheckingRole(false);
        }
      }
    };

    checkRoleAndRedirect();
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: "Erro ao entrar com Google",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onLogin = async (data: LoginForm) => {
    const { error } = await signInWithEmail(data.email, data.password);
    if (error) {
      toast({
        title: "Erro ao entrar",
        description: error.message === "Invalid login credentials" 
          ? "Email ou senha incorretos" 
          : error.message,
        variant: "destructive",
      });
    }
    // Redirect will happen via useEffect when user state changes
  };

  if (isCheckingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-card border border-border animate-fade-in">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Monitor className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-foreground leading-tight">Deparis</span>
            <span className="text-xs text-muted-foreground leading-tight">Sistemas e Informática</span>
          </div>
        </Link>

        <h2 className="text-2xl font-bold text-center text-foreground mb-6">
          Acesso ao Sistema
        </h2>

        {/* Google Login Button */}
        <Button 
          type="button" 
          variant="outline" 
          className="w-full mb-4 flex items-center justify-center gap-2"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continuar com Google
        </Button>

        <div className="flex items-center gap-3 my-4">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">ou</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...loginForm.register("email")}
              className="mt-1"
            />
            {loginForm.formState.errors.email && (
              <p className="text-sm text-destructive mt-1">
                {loginForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              {...loginForm.register("password")}
              className="mt-1"
            />
            {loginForm.formState.errors.password && (
              <p className="text-sm text-destructive mt-1">
                {loginForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Entrar
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-border">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary text-center block">
            ← Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  );
}
