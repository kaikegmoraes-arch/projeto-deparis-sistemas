import { Link } from "react-router-dom";
import { Monitor, Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Sobre", href: "/#sobre" },
  { name: "Serviços", href: "/#servicos" },
  { name: "Suporte", href: "/suporte" },
  { name: "Contato", href: "/#contato" },
  { name: "Orçamento", href: "/orcamento" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom section-padding py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <Monitor className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-100 leading-tight">
                  Deparis
                </span>
                <span className="text-xs text-gray-400 leading-tight">
                  Sistemas e Informática
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 mb-6 max-w-md leading-relaxed">
              Atendimento especializado em soluções tecnológicas. 
              Oferecemos suporte técnico, consultoria e equipamentos 
              para pequenas e médias empresas.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>contato@deparissistemas.com.br</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>(11) 1234-5678</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-100 mb-4">Links Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-gray-100 mb-4">Serviços</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>Assistência Técnica</li>
              <li>Suporte Remoto</li>
              <li>Venda de Equipamentos</li>
              <li>Consultoria em TI</li>
              <li>Redes Corporativas</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              <p className="font-medium text-gray-400">Deparis Sistemas e Informática Ltda</p>
              <p>CNPJ: 58.080.493/0001-05</p>
            </div>
            <p className="text-sm text-gray-500">
              © {currentYear} Deparis Sistemas. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
