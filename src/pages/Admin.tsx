import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw, Mail, Phone, Building, Clock, MessageSquare, FileText, Headphones, LogOut } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type RequestType = "contact" | "support" | "quote";
type RequestStatus = "novo" | "em_andamento" | "finalizado";

interface Request {
  id: string;
  type: RequestType;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string | null;
  problem_description: string | null;
  service_type: string | null;
  equipment_quantity: number | null;
  company_type: string | null;
  urgency: string | null;
  status: RequestStatus;
  created_at: string;
}

const statusColors: Record<RequestStatus, string> = {
  novo: "bg-blue-100 text-blue-800 border-blue-200",
  em_andamento: "bg-yellow-100 text-yellow-800 border-yellow-200",
  finalizado: "bg-green-100 text-green-800 border-green-200",
};

const statusLabels: Record<RequestStatus, string> = {
  novo: "Novo",
  em_andamento: "Em andamento",
  finalizado: "Finalizado",
};

const typeLabels: Record<RequestType, string> = {
  contact: "Contato",
  support: "Suporte",
  quote: "Orçamento",
};

const typeIcons: Record<RequestType, typeof MessageSquare> = {
  contact: MessageSquare,
  support: Headphones,
  quote: FileText,
};

function AdminContent() {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | RequestType>("all");

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar as solicitações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: RequestStatus) => {
    try {
      const { error } = await supabase
        .from("requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status } : req))
      );

      toast({
        title: "Status atualizado",
        description: `Status alterado para "${statusLabels[status]}"`,
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests =
    activeTab === "all"
      ? requests
      : requests.filter((req) => req.type === activeTab);

  const counts = {
    all: requests.length,
    contact: requests.filter((r) => r.type === "contact").length,
    support: requests.filter((r) => r.type === "support").length,
    quote: requests.filter((r) => r.type === "quote").length,
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-12 gradient-hero border-b border-border">
        <div className="container-custom section-padding">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Painel Administrativo
              </h1>
              <p className="text-muted-foreground">
                Logado como: {user?.email}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchRequests} variant="outline" className="gap-2">
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
              <Button onClick={signOut} variant="outline" className="gap-2">
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container-custom section-padding">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="mb-6">
              <TabsTrigger value="all" className="gap-2">
                Todas ({counts.all})
              </TabsTrigger>
              <TabsTrigger value="contact" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Contato ({counts.contact})
              </TabsTrigger>
              <TabsTrigger value="support" className="gap-2">
                <Headphones className="w-4 h-4" />
                Suporte ({counts.support})
              </TabsTrigger>
              <TabsTrigger value="quote" className="gap-2">
                <FileText className="w-4 h-4" />
                Orçamento ({counts.quote})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  Nenhuma solicitação encontrada.
                </div>
              ) : (
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[100px]">Tipo</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead className="hidden md:table-cell">Contato</TableHead>
                        <TableHead className="hidden lg:table-cell">Empresa</TableHead>
                        <TableHead className="hidden xl:table-cell">Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.map((request) => {
                        const TypeIcon = typeIcons[request.type];
                        return (
                          <TableRow key={request.id}>
                            <TableCell>
                              <Badge variant="outline" className="gap-1">
                                <TypeIcon className="w-3 h-3" />
                                {typeLabels[request.type]}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {request.name}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex flex-col gap-1 text-sm">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Mail className="w-3 h-3" />
                                  {request.email}
                                </span>
                                {request.phone && (
                                  <span className="flex items-center gap-1 text-muted-foreground">
                                    <Phone className="w-3 h-3" />
                                    {request.phone}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {request.company && (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Building className="w-3 h-3" />
                                  {request.company}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="hidden xl:table-cell">
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {format(new Date(request.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge className={statusColors[request.status]}>
                                {statusLabels[request.status]}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Select
                                value={request.status}
                                onValueChange={(value) => updateStatus(request.id, value as RequestStatus)}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="novo">Novo</SelectItem>
                                  <SelectItem value="em_andamento">Em andamento</SelectItem>
                                  <SelectItem value="finalizado">Finalizado</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

export default function Admin() {
  return (
    <MainLayout>
      <ProtectedRoute>
        <AdminContent />
      </ProtectedRoute>
    </MainLayout>
  );
}
