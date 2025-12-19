import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Pencil, Trash2, UserPlus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
}

const userSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["user", "admin"]),
});

const updateUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().optional(),
  role: z.enum(["user", "admin"]),
});

type UserForm = z.infer<typeof userSchema>;
type UpdateUserForm = z.infer<typeof updateUserSchema>;

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const createForm = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: { email: "", password: "", role: "user" },
  });

  const editForm = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (editingUser) {
      editForm.reset({
        email: editingUser.email,
        password: "",
        role: editingUser.role as "user" | "admin",
      });
    }
  }, [editingUser, editForm]);

  const fetchUsers = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await supabase.functions.invoke("manage-users", {
        body: { action: "list" },
        headers: {
          Authorization: `Bearer ${sessionData.session?.access_token}`,
        },
      });

      if (response.error) throw response.error;
      setUsers(response.data.users || []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: UserForm) => {
    setSubmitting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await supabase.functions.invoke("manage-users", {
        body: { action: "create", email: data.email, password: data.password, role: data.role },
        headers: {
          Authorization: `Bearer ${sessionData.session?.access_token}`,
        },
      });

      if (response.error) throw response.error;
      if (response.data.error) throw new Error(response.data.error);

      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso.",
      });
      setIsCreateOpen(false);
      createForm.reset();
      fetchUsers();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar o usuário.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data: UpdateUserForm) => {
    if (!editingUser) return;
    setSubmitting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const updateData: any = {
        action: "update",
        user_id: editingUser.id,
        email: data.email,
        role: data.role,
      };
      if (data.password) {
        updateData.password = data.password;
      }

      const response = await supabase.functions.invoke("manage-users", {
        body: updateData,
        headers: {
          Authorization: `Bearer ${sessionData.session?.access_token}`,
        },
      });

      if (response.error) throw response.error;
      if (response.data.error) throw new Error(response.data.error);

      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso.",
      });
      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o usuário.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setSubmitting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await supabase.functions.invoke("manage-users", {
        body: { action: "delete", user_id: deletingUser.id },
        headers: {
          Authorization: `Bearer ${sessionData.session?.access_token}`,
        },
      });

      if (response.error) throw response.error;
      if (response.data.error) throw new Error(response.data.error);

      toast({
        title: "Sucesso",
        description: "Usuário removido com sucesso.",
      });
      setDeletingUser(null);
      fetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível remover o usuário.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gerenciar Usuários</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
            </DialogHeader>
            <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...createForm.register("email")}
                  placeholder="email@exemplo.com"
                />
                {createForm.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {createForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  {...createForm.register("password")}
                  placeholder="Mínimo 6 caracteres"
                />
                {createForm.formState.errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {createForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="role">Tipo de Conta</Label>
                <Select
                  value={createForm.watch("role")}
                  onValueChange={(value: "user" | "admin") => createForm.setValue("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Criar Usuário
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Último acesso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "admin"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {user.role === "admin" ? "Administrador" : "Usuário"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString("pt-BR")
                      : "Nunca"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingUser(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingUser(user)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4">
            <div>
              <Label htmlFor="edit_email">Email</Label>
              <Input
                id="edit_email"
                type="email"
                {...editForm.register("email")}
              />
              {editForm.formState.errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {editForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="edit_password">Nova Senha (opcional)</Label>
              <Input
                id="edit_password"
                type="password"
                {...editForm.register("password")}
                placeholder="Deixe vazio para manter a atual"
              />
            </div>
            <div>
              <Label htmlFor="edit_role">Tipo de Conta</Label>
              <Select
                value={editForm.watch("role")}
                onValueChange={(value: "user" | "admin") => editForm.setValue("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingUser(null)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Salvar Alterações
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário "{deletingUser?.email}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
