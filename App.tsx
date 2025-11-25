
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LeadCenter from './components/LeadCenter';
import ClientWallet from './components/ClientWallet';
import FinancialMonitor from './components/FinancialMonitor';
import InsuranceCenter from './components/InsuranceCenter'; 
import CommunicationHub from './components/CommunicationHub'; 
import Settings from './components/Settings'; 
import HelpCenter from './components/HelpCenter';
import AIChatAssistant from './components/AIChatAssistant';
import Login from './components/Login';
import Notifications from './components/Notifications';
import { ViewState, UserProfile, AppNotification, Policy, FinancialTransaction, ProductType } from './types';
import { Menu, Bell } from 'lucide-react';

// INITIAL MOCK DATA MOVED TO APP LEVEL
const INITIAL_NOTIFICATIONS: AppNotification[] = [
    { id: '1', title: 'Lead Atribuído', message: 'Booking Engine: Novo lead de Consórcio (R$ 300k) atribuído por Geolocalização (SP).', type: 'success', timestamp: '2 min atrás', read: false, actionLink: ViewState.QUOTES },
    { id: '2', title: 'RPA Scalpe Concluído', message: 'Sincronização com Allianz finalizada. 12 apólices atualizadas.', type: 'info', timestamp: '15 min atrás', read: false, actionLink: ViewState.POLICIES },
    { id: '3', title: 'Alerta de Contemplação', message: 'Cliente Ricardo Oliveira foi contemplado no grupo 2048!', type: 'warning', timestamp: '1 hora atrás', read: true, actionLink: ViewState.CLIENTS },
];

const INITIAL_POLICIES: Policy[] = [
  {
    id: '1', insurer: 'Porto Seguro', policyNumber: '0531.10.102938', productName: 'Auto Premium',
    insuredName: 'Ricardo Oliveira', validityStart: '2023-05-20', validityEnd: '2024-05-20',
    premium: 4500.00, status: 'Expiring', documents: [{ name: 'Apólice.pdf', type: 'policy', url: '#' }, { name: 'Boleto.pdf', type: 'boleto', url: '#' }]
  },
  {
    id: '2', insurer: 'Allianz', policyNumber: '5123987123', productName: 'Residencial Compacto',
    insuredName: 'Mariana Santos', validityStart: '2023-08-10', validityEnd: '2024-08-10',
    premium: 890.00, status: 'Active', documents: [{ name: 'Apólice.pdf', type: 'policy', url: '#' }]
  }
];

const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  { id: '1', date: '2024-05-01', description: 'Comissão Seguro Vida - Ana Clara', amount: 450.00, type: 'commission_received', status: 'paid', productType: ProductType.INSURANCE_LIFE },
  { id: '2', date: '2024-05-05', description: '1ª Parcela Adesão Consórcio - Ricardo', amount: 2500.00, type: 'commission_received', status: 'paid', productType: ProductType.CONSORTIUM },
  { id: '3', date: '2024-05-20', description: 'Previsão: Renovação Auto - Roberto', amount: 350.00, type: 'commission_future', status: 'forecast', productType: ProductType.INSURANCE_AUTO },
  { id: '4', date: '2024-06-05', description: '2ª Parcela Adesão Consórcio - Ricardo', amount: 1250.00, type: 'commission_future', status: 'forecast', productType: ProductType.CONSORTIUM },
];

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // App State
  const [activeView, setActiveView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Data State (Lifted Up)
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [policies, setPolicies] = useState<Policy[]>(INITIAL_POLICIES);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS);

  const handleLogin = (userProfile: UserProfile) => {
    setUser(userProfile);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setActiveView(ViewState.DASHBOARD);
  };

  const markNotificationRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Callback for Settings RPA Sync
  const handleIntegrationSync = (newPolicies: Policy[], newTransactions: FinancialTransaction[]) => {
      setPolicies(prev => [...newPolicies, ...prev]);
      setTransactions(prev => [...newTransactions, ...prev]);
      
      // Add notification
      const newNotif: AppNotification = {
          id: Date.now().toString(),
          title: 'Sincronização Completa',
          message: `O Robô importou ${newPolicies.length} apólices e ${newTransactions.length} parcelas financeiras.`,
          type: 'success',
          timestamp: 'Agora',
          read: false,
          actionLink: ViewState.POLICIES
      };
      setNotifications(prev => [newNotif, ...prev]);
  };

  const renderContent = () => {
    switch (activeView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
        
      case ViewState.QUOTES:
      case ViewState.PROPOSALS:
      case ViewState.PROSPECTING:
        return <LeadCenter mode={activeView as any} />;
        
      case ViewState.POLICIES:
        return <InsuranceCenter mode="policies" policies={policies} />;
      case ViewState.CLAIMS:
        return <InsuranceCenter mode="claims" policies={policies} />;
        
      case ViewState.COMMISSIONS:
      case ViewState.FINANCIAL:
        return <FinancialMonitor mode={activeView === ViewState.COMMISSIONS ? 'commissions' : 'general'} transactions={transactions} />;
        
      case ViewState.CLIENTS:
        return <ClientWallet />;
      case ViewState.NEWS:
        return <CommunicationHub />;
      case ViewState.SETTINGS:
        return <Settings onSyncData={handleIntegrationSync} />;
      case ViewState.HELP:
        return <HelpCenter />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-slate-900">
      {/* Sidebar */}
      <div className={`${isMobileMenuOpen ? 'block absolute z-50 h-full' : 'hidden'} md:block`}>
         <Sidebar 
            activeView={activeView} 
            setActiveView={(v) => { setActiveView(v); setIsMobileMenuOpen(false); }}
            user={user}
            onLogout={handleLogout}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            notificationCount={notifications.filter(n => !n.read).length}
         />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-gray-50/50">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white p-4 border-b border-gray-100 flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center gap-3">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Menu className="w-6 h-6" />
                </button>
                <div className="font-bold text-lg text-primary">Acesso Master</div>
            </div>
            <button 
                onClick={() => setIsNotificationsOpen(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative"
            >
                <Bell className="w-6 h-6" />
                {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </button>
        </header>

        {/* View Area */}
        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>

        {/* AI Overlay */}
        <AIChatAssistant />

        {/* Notifications Drawer */}
        <Notifications 
            isOpen={isNotificationsOpen} 
            onClose={() => setIsNotificationsOpen(false)}
            notifications={notifications}
            onMarkRead={markNotificationRead}
            onAction={setActiveView}
        />

        {/* Mobile Overlay for Menu */}
        {isMobileMenuOpen && (
            <div 
                className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                onClick={() => setIsMobileMenuOpen(false)}
            />
        )}
      </main>
    </div>
  );
};

export default App;
