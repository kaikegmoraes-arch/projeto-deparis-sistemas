useEffect(() => {
  const checkRoleAndRedirect = async () => {
    if (user) {
      setIsCheckingRole(true);
      try {
        const { data: isAdmin } = await supabase.rpc("has_role", {
          _user_id: user.id,
          _role: "admin",
        });

        // Comentando a lógica de redirecionamento para teste
        // if (isAdmin) {
        //   navigate("/admin");
        // } else {
        //   navigate("/documentos");
        // }
      } catch (error) {
        console.error("Error checking role:", error);
        // navigate("/documentos");
      } finally {
        setIsCheckingRole(false);
      }
    }
  };

  checkRoleAndRedirect();
}, [user, navigate]);
