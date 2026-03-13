import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { Login } from './pages/Login'
import { Registro } from './pages/Registro'
import { VitrineLotes } from './components/VitrineLotes'
import { NovaOferta } from './pages/NovaOferta'

import {
  LayoutDashboard,
  WalletCards,
  FileText,
  Settings,
  LogOut,
  FilePlus
} from 'lucide-react'

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#000000] text-[#ededed]">
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col">

        {/* LOGO */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
              <WalletCards className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              TaxTrade
            </h1>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-2">

          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 bg-white/5 text-white rounded-lg font-medium border border-white/5"
          >
            <LayoutDashboard className="w-5 h-5" />
            Vitrine
          </Link>

          <Link
            to="/dashboard/nova-oferta"
            className="flex items-center gap-3 px-4 py-3 text-[#a1a1aa] hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors"
          >
            <FilePlus className="w-5 h-5" />
            Vender Crédito
          </Link>

          <Link
            to="#"
            className="flex items-center gap-3 px-4 py-3 text-[#a1a1aa] hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors"
          >
            <FileText className="w-5 h-5" />
            Minhas Propostas
          </Link>

          <Link
            to="#"
            className="flex items-center gap-3 px-4 py-3 text-[#a1a1aa] hover:bg-white/5 hover:text-white rounded-lg font-medium transition-colors"
          >
            <Settings className="w-5 h-5" />
            Configurações
          </Link>

        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-[#a1a1aa] hover:text-red-400 transition-colors font-medium">
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>

      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <VitrineLotes />
            </DashboardLayout>
          }
        />

        <Route
          path="/dashboard/nova-oferta"
          element={
            <DashboardLayout>
              <NovaOferta />
            </DashboardLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}