import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
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
import {
  Loader2,
  RefreshCw,
  Mail,
  Phone,
  Building,
  Clock,
  MessageSquare,
  FileText,
  Headphones,
  LogOut,
  Users,
  FolderOpen,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import UserManagement from "@/components/admin/UserManagement";
import DocumentManagement from "@/components/admin/DocumentManagement";

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
  const [activeTab, setActiveTab] = useState<string>("requests");
  const [requestFilter, setRequestFilter] = useState<"all" | RequestType>("all");

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
    requestFilter === "all"
      ? requests
      : requests.filter((req) => req.type === requestFilter);

  const counts = {
    all: requests.length,
    contact: requests.filter((r) => r.type === "contact").length,
    support: requests.filter((r) => r.type === "support").length,
    quote: requests.filter((r) => r.type === "quote").length,
  };

  return (
    <div className="pt-20">
      {/* todo o conteúdo permanece igual */}
      {/* nenhuma lógica de proteção existe mais */}
    </div>
  );
}

export default function Admin() {
  return (
    <MainLayout>
      <AdminContent />
    </MainLayout>
  );
}
