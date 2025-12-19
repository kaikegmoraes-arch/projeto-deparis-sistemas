import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Monitor, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  const { signInWithEmail, loading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signInWithEmail(email, password);
    if (error) {
      toast({
        title: "Erro ao entrar",
        description: error.message === "Invalid login credentials" 
          ? "Email ou senha incorretos" 
          : error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-card border border-border animate-fade-in">
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

        <form onSubmit={onLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
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
