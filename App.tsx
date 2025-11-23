
import React, { useState } from 'react';
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
import { ViewState } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
        
      case ViewState.QUOTES:
        return <LeadCenter mode="quotes" />;
      case ViewState.PROPOSALS:
        return <LeadCenter mode="proposals" />;
      case ViewState.PROSPECTING:
        return <LeadCenter mode="prospecting" />;
        
      case ViewState.POLICIES:
        return <InsuranceCenter mode="policies" />;
      case ViewState.CLAIMS:
        return <InsuranceCenter mode="claims" />;
        
      case ViewState.COMMISSIONS:
        return <FinancialMonitor mode="commissions" />;
      case ViewState.FINANCIAL:
        return <FinancialMonitor mode="general" />;
        
      case ViewState.CLIENTS:
        return <ClientWallet />;
      case ViewState.NEWS:
        return <CommunicationHub />;
      case ViewState.SETTINGS:
        return <Settings />;
      case ViewState.HELP:
        return <HelpCenter />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-slate-900">
      {/* Sidebar */}
      <div className={`${isMobileMenuOpen ? 'block absolute z-50 h-full' : 'hidden'} md:block`}>
         <Sidebar activeView={activeView} setActiveView={(v) => { setActiveView(v); setIsMobileMenuOpen(false); }} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-gray-50/50">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white p-4 border-b border-gray-100 flex justify-between items-center shadow-sm z-10">
            <div className="font-bold text-lg text-primary flex items-center gap-2">
                Acesso Master
            </div>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Menu className="w-6 h-6" />
            </button>
        </header>

        {/* View Area */}
        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>

        {/* AI Overlay */}
        <AIChatAssistant />

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
