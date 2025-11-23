
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  DollarSign, 
  HelpCircle, 
  FileText, 
  FileCheck,
  AlertTriangle,
  TrendingUp,
  Search,
  Bell,
  X
} from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  activeView: ViewState;
  setActiveView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  // Simplified and aligned menu
  const menuItems = [
    { id: ViewState.QUOTES, label: 'Cotações', icon: FileText },
    { id: ViewState.POLICIES, label: 'Apólices', icon: ShieldCheck },
    { id: ViewState.COMMISSIONS, label: 'Gestão de Comissões', icon: DollarSign },
    { id: ViewState.CLIENTS, label: 'Gestão de Clientes', icon: Users },
    { id: ViewState.PROPOSALS, label: 'Propostas', icon: FileCheck },
    { id: ViewState.CLAIMS, label: 'Sinistro', icon: AlertTriangle },
    { id: ViewState.DASHBOARD, label: 'Portal de Vendas', icon: LayoutDashboard },
    { id: ViewState.SETTINGS, label: 'Configurações', icon: Settings },
    // Secondary Section
    { id: ViewState.FINANCIAL, label: 'Financeiro', icon: TrendingUp },
    { id: ViewState.PROSPECTING, label: 'Prospecção', icon: Search },
    { id: ViewState.NEWS, label: 'Novidades', icon: Bell },
    { id: ViewState.HELP, label: 'Ajuda', icon: HelpCircle },
  ];

  return (
    <div className="w-64 bg-white h-full border-r border-gray-100 flex flex-col shadow-sm relative">
      
      {/* Mobile Close Button (Visible only when sidebar is shown on mobile, handled by parent logic mostly, but adding UI here) */}
      <div className="md:hidden absolute top-4 right-4">
         <button onClick={() => {}} className="p-2 text-gray-400 hover:text-gray-600">
             {/* The closing logic is handled by the overlay in App.tsx, but a visual indicator helps */}
             {/* We can't easily close from here without a prop, but the layout structure in App.tsx handles overlay click. 
                 This is just decorative/layout consistency if needed, or we assume the overlay is enough. 
                 Let's leave the X implicit in the mobile menu toggle or rely on App.tsx overlay. 
                 Actually, let's make the logo area nice.
             */}
         </button>
      </div>

      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md shrink-0">
            <ShieldCheck className="w-5 h-5 text-accent" />
        </div>
        <div>
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">SeguroLink</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Corretora Master</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-0.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={`${item.id}-${index}`}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-gray-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User Profile (Bottom) */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
          <div className="relative shrink-0">
            <img 
              src="https://picsum.photos/seed/broker/40/40" 
              alt="User" 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate group-hover:text-primary transition-colors">Carlos Silva</p>
            <p className="text-[10px] text-gray-500 truncate uppercase">Sair</p>
          </div>
          <LogOut className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
