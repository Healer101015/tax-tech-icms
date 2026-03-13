import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { VitrineLotes } from './components/VitrineLotes';
import { NovaOferta } from './pages/NovaOferta';
import { MinhasPropostas } from './pages/MinhasPropostas'; // <-- Nossa nova tela importada aqui!
import { LayoutDashboard, WalletCards, FileText, Settings, LogOut, FilePlus } from 'lucide-react';

// ==========================================
// GUARDIÃO DE ROTAS (Blindagem do Frontend)
// ==========================================
function RotaPrivada({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('@TaxTrade:token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// ==========================================
// LAYOUT DO DASHBOARD (Menu Lateral Premium)
// ==========================================
function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Função que faz o logout real e limpa o cofre do navegador
  const handleLogout = () => {
    localStorage.removeItem('@TaxTrade:token');
    localStorage.removeItem('@TaxTrade:usuario');
    navigate('/login');
  };

  // Estilização inteligente: acende em azul a aba que você está acessando agora
  const navClass = (path: string) => {
    // Verifica se a rota atual é exatamente igual ao caminho do botão
    const isActive = location.pathname === path;
    return `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors w-full text-left ${isActive
      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10'
      : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white border border-transparent'
      }`;
  };

  return (
    <div className="flex min-h-screen bg-[#000000] text-[#ededed]">

      {/* Sidebar Inteiramente Escura e Fixa */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <WalletCards className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">TaxTrade</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button onClick={() => navigate('/dashboard')} className={navClass('/dashboard')}>
            <LayoutDashboard className="w-5 h-5" /> Vitrine de Lotes
          </button>

          <button onClick={() => navigate('/dashboard/nova-oferta')} className={navClass('/dashboard/nova-oferta')}>
            <FilePlus className="w-5 h-5" /> Vender Crédito
          </button>

          <button onClick={() => navigate('/dashboard/propostas')} className={navClass('/dashboard/propostas')}>
            <FileText className="w-5 h-5" /> Minhas Propostas
          </button>

          <button className={navClass('/dashboard/configuracoes')}>
            <Settings className="w-5 h-5" /> Configurações
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-[#a1a1aa] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" /> Sair da Conta
          </button>
        </div>
      </aside>

      {/* Área Principal (Compensa os 64 de largura da sidebar fixa com ml-64) */}
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto relative">
        {children}
      </main>
    </div>
  );
}

// ==========================================
// ROTEADOR PRINCIPAL
// ==========================================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Raiz redireciona direto pro Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rotas Abertas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rotas Privadas (Protegidas pelo Guardião e com Menu Lateral) */}
        <Route path="/dashboard" element={
          <RotaPrivada>
            <DashboardLayout>
              <VitrineLotes />
            </DashboardLayout>
          </RotaPrivada>
        } />

        <Route path="/dashboard/nova-oferta" element={
          <RotaPrivada>
            <DashboardLayout>
              <NovaOferta />
            </DashboardLayout>
          </RotaPrivada>
        } />

        <Route path="/dashboard/propostas" element={
          <RotaPrivada>
            <DashboardLayout>
              <MinhasPropostas />
            </DashboardLayout>
          </RotaPrivada>
        } />

      </Routes>
    </BrowserRouter>
  );
}