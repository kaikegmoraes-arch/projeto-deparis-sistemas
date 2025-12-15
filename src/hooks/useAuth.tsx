import { useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 BYPASS TOTAL PARA TESTES
    const fakeUser = {
      id: "test-admin",
      email: "admin@teste.com",
      role: "admin",
    } as unknown as User;

    setUser(fakeUser);
    setSession({ user: fakeUser } as Session);
    setLoading(false);
  }, []);

  const signInWithEmail = useCallback(async () => {
    return { error: null, data: null };
  }, []);

  const signUp = useCallback(async () => {
    return { error: null, data: null };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    return { error: null, data: null };
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    setSession(null);
  }, []);

  return {
    user,
    session,
    loading,
    signInWithEmail,
    signUp,
    signInWithGoogle,
    signOut,
  };
}
