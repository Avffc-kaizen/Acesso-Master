
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
  MessageSquare
} from 'lucide-react';
import { ViewState, UserProfile } from '../types';

interface SidebarProps {
  activeView: ViewState;
  setActiveView: (view: ViewState) => void;
  user: UserProfile | null;
  onLogout: () => void;
  onOpenNotifications: () => void;
  notificationCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, user, onLogout, onOpenNotifications, notificationCount }) => {
  // Simplified and aligned menu based on new requirements
  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Visão Geral', icon: LayoutDashboard },
    { id: ViewState.QUOTES, label: 'CRM & Cotações', icon: FileText },
    { id: ViewState.NEWS, label: 'Comunicação', icon: MessageSquare },
    { id: ViewState.POLICIES, label: 'Apólices & Gestão', icon: ShieldCheck },
    { id: ViewState.CLAIMS, label: 'Sinistros', icon: AlertTriangle },
    { id: ViewState.CLIENTS, label: 'Carteira & Cross-Sell', icon: Users },
    { id: ViewState.FINANCIAL, label: 'Financeiro', icon: DollarSign },
    { id: ViewState.SETTINGS, label: 'Configurações', icon: Settings },
    { id: ViewState.HELP, label: 'Ajuda do Sistema', icon: HelpCircle },
  ];

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-100 flex flex-col shadow-sm z-20 hidden md:flex">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
            <ShieldCheck className="w-5 h-5 text-accent" />
        </div>
        <div>
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">Acesso Master</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Ecossistema Unificado</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={`${item.id}-${index}`}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
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

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        {/* Notification Button */}
        <button 
            onClick={onOpenNotifications}
            className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-600 transition-colors"
        >
            <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-gray-500" />
                Notificações
            </div>
            {notificationCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{notificationCount}</span>
            )}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
          <div className="relative">
            <img 
              src={user?.avatar || "https://picsum.photos/seed/broker/40/40"} 
              alt="User" 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate group-hover:text-primary transition-colors">{user?.name || 'Usuário'}</p>
            <p className="text-[10px] text-gray-500 truncate uppercase">{user?.role || 'Visitante'}</p>
          </div>
          <button onClick={onLogout} title="Sair">
             <LogOut className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
