import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Suporte from "./pages/Suporte";
import Orcamento from "./pages/Orcamento";
import TesteSupabase from "./pages/teste-supabase";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/suporte" element={<Suporte />} />
        <Route path="/orcamento" element={<Orcamento />} />

        {/* 🔥 ROTA DE TESTE DO SUPABASE */}
        <Route path="/teste-supabase" element={<TesteSupabase />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
