
import React, { useState, useEffect, useRef } from 'react';
import { Shield, Users, Zap, Link, MessageSquare, Mail, Server, Lock, FileKey, RefreshCw, CheckCircle2, AlertCircle, Play, Save, ChevronRight, QrCode, FileText, Terminal, XCircle, Activity } from 'lucide-react';
import { RoutingRule, Policy, FinancialTransaction, ProductType } from '../types';

// MOCK DATA
const MOCK_ROUTING_RULES: RoutingRule[] = [
    { id: 'r1', name: 'Distribuição Geográfica', type: 'GEO', isActive: true, priority: 1, parameters: 'Distribui leads do DDD 11 para Unidade SP e DDD 21 para Unidade RJ.' },
    { id: 'r2', name: 'Especialista em Produto', type: 'SKILL', isActive: true, priority: 2, parameters: 'Leads de Consórcio > R$ 300k vão para Consultores Senior.' },
];

interface InsurerConfig {
    id: string;
    name: string;
    status: 'online' | 'error' | 'paused' | 'maintenance' | 'configuring';
    login?: string;
    url: string;
    lastSync: string;
    products: { auto: boolean; life: boolean; residential: boolean; consortium: boolean; health: boolean };
    certificate: boolean; // has certificate?
    daysToRenew: number;
    successRate: number; // Added for Optimization Logic
}

const INSURERS_CONFIG: InsurerConfig[] = [
    { id: '1', name: 'Porto Seguro', status: 'configuring', login: '668.***.***-04', url: 'https://corretor.portoseguro.com.br', lastSync: 'Pendente', products: { auto: true, life: true, residential: true, consortium: true, health: true }, certificate: true, daysToRenew: 30, successRate: 99.5 },
    { id: '2', name: 'Allianz', status: 'online', login: 'master_allianz', url: 'https://www.allianznet.com.br', lastSync: '1 hora atrás', products: { auto: true, life: false, residential: true, consortium: false, health: false }, certificate: false, daysToRenew: 45, successRate: 98.2 },
    { id: '3', name: 'Bradesco Seguros', status: 'error', login: 'brad_cod_123', url: 'https://www.bradescoseguros.com.br', lastSync: 'Falha há 2h', products: { auto: true, life: true, residential: false, consortium: false, health: true }, certificate: true, daysToRenew: 30, successRate: 85.0 },
    { id: '4', name: 'SulAmérica', status: 'online', login: 'sula_master', url: 'https://portal.sulamericaseguros.com.br', lastSync: '5 min atrás', products: { auto: false, life: true, residential: false, consortium: true, health: true }, certificate: true, daysToRenew: 60, successRate: 97.0 },
    { id: '5', name: 'Ademicon', status: 'online', login: 'ademicon_parceiro', url: 'https://parceiros.ademicon.com.br', lastSync: '15 min atrás', products: { auto: false, life: false, residential: false, consortium: true, health: false }, certificate: true, daysToRenew: 0, successRate: 96.5 },
];

interface SettingsProps {
    onSyncData?: (newPolicies: Policy[], newTransactions: FinancialTransaction[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ onSyncData }) => {
  const [activeTab, setActiveTab] = useState<'scalpe' | 'corretora' | 'integrations' | 'routing' | 'forms'>('scalpe');
  const [selectedInsurerId, setSelectedInsurerId] = useState<string>(INSURERS_CONFIG[0].id);
  
  // Test Connection State
  const [isTesting, setIsTesting] = useState(false);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Insurer State (Local)
  const [localInsurers, setLocalInsurers] = useState(INSURERS_CONFIG);
  const selectedInsurer = localInsurers.find(i => i.id === selectedInsurerId) || localInsurers[0];

  useEffect(() => {
      if (logsEndRef.current) {
          logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  }, [testLogs]);

  const addLog = (msg: string) => setTestLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleTestConnection = async () => {
      setIsTesting(true);
      setConnectionStatus('idle');
      setTestLogs([]);
      
      const isPorto = selectedInsurer.id === '1';

      // Simulation Steps mimicking RPA Scalpe with Real Scraping
      const steps = isPorto ? [
          { msg: `[RPA_CORE] Inicializando driver (Headless Chrome v112)...`, delay: 300 },
          { msg: `[NET] Resolvendo DNS: ${selectedInsurer.url}`, delay: 400 },
          { msg: `[SSL] Handshake TLS 1.3 estabelecido (Cipher: AES_256_GCM).`, delay: 500 },
          { msg: `[AUTH] Injetando credenciais seguras (User: ${selectedInsurer.login})...`, delay: 800 },
          { msg: `[DOM] Aguardando renderização do dashboard...`, delay: 600 },
          { msg: `[RECV] 200 OK. Sessão autenticada. Token: eyJhbGciOiJIUzI1...`, delay: 300 },
          
          // --- SCRAPING LOGIC: FINANCEIRO (BAIXAS) ---
          { msg: `[NAV] Navegando para: /financeiro/extrato-comissoes`, delay: 1000 },
          { msg: `[FILTER] Aplicando filtro: Status = PAGO | Período = Últimos 7 dias`, delay: 600 },
          { msg: `[SCRAPE] Extraindo baixas confirmadas...`, delay: 500 },
          { msg: `[EXTRACT] ID: 9901 | Cliente: Roberto M. | Vlr: R$ 350,00 | Status: PAGO`, delay: 400 },
          { msg: `[EXTRACT] ID: 9902 | Cliente: Ana Clara | Vlr: R$ 125,00 | Status: PAGO`, delay: 400 },
          { msg: `[DATA] 2 Transações financeiras 'BAIXADAS' identificadas.`, delay: 200 },
          
          // --- SCRAPING LOGIC: EMISSÃO (NOVAS APÓLICES) ---
          { msg: `[NAV] Navegando para: /producao/emitidos`, delay: 800 },
          { msg: `[FILTER] Período: Últimos 7 dias`, delay: 400 },
          { msg: `[SCRAPE] Buscando novas apólices emitidas...`, delay: 600 },
          { msg: `[DOC] Download: Apolice_Renovacao_Roberto.pdf (1.8MB) ... OK`, delay: 500 },
          { msg: `[DOC] Download: Apolice_Vida_AnaClara.pdf (0.9MB) ... OK`, delay: 500 },
          { msg: `[DATA] 2 Novas apólices sincronizadas com sucesso.`, delay: 200 },
          
          { msg: `[SYNC] Replicando dados para o Sistema Nativo (Financial + InsuranceCenter)...`, delay: 600 },
          { msg: `[DONE] Ciclo RPA finalizado. Latência total: 4.8s.`, delay: 100 },
      ] : [
          { msg: `Iniciando handshake com ${selectedInsurer.url}...`, delay: 800 },
          { msg: `[INFO] Health Score: ${selectedInsurer.successRate}%. Ajustando timeout...`, delay: 500 },
          { msg: `Validando certificado SSL (Porta 443)... OK`, delay: 1500 },
          { msg: `Enviando credenciais criptografadas (User: ${selectedInsurer.login})...`, delay: 2200 },
          { msg: `Aguardando resposta do servidor (Timeout: 30s)...`, delay: 1000 },
          { msg: `Autenticação bem sucedida!`, delay: 1200 },
          { msg: `Sincronizando dados...`, delay: 1500 },
          { msg: `Conexão estável.`, delay: 800 },
      ];

      for (const step of steps) {
          addLog(step.msg);
          await new Promise(r => setTimeout(r, step.delay));
      }

      setConnectionStatus('success');
      setIsTesting(false);
      
      // Update status to online
      setLocalInsurers(prev => prev.map(ins => 
          ins.id === selectedInsurerId ? { ...ins, status: 'online', lastSync: 'Agora mesmo' } : ins
      ));

      // TRIGGER DATA REPLICATION IF PORTO
      if (isPorto && onSyncData) {
          const uniqueSuffix = Date.now();
          
          // 1. REPLICATE ISSUED POLICIES (LAST 7 DAYS)
          const scrapedPolicies: Policy[] = [
            {
                id: `p_new_${uniqueSuffix}_1`,
                insurer: 'Porto Seguro',
                policyNumber: '0531.22.999888',
                productName: 'Porto Seguro Auto (Renovação)',
                insuredName: 'Roberto Mendes',
                validityStart: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0], // Issued 2 days ago
                validityEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                premium: 2800.00,
                status: 'Active',
                documents: [{ name: 'Apolice_Digital.pdf', type: 'policy', url: '#' }]
            },
            {
                id: `p_new_${uniqueSuffix}_2`,
                insurer: 'Porto Seguro',
                policyNumber: '0998.11.222333',
                productName: 'Vida Mais Mulher',
                insuredName: 'Ana Clara Souza',
                validityStart: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0], // Issued 5 days ago
                validityEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                premium: 1500.00,
                status: 'Active',
                documents: [{ name: 'Certificado_Vida.pdf', type: 'policy', url: '#' }]
            }
          ];

          // 2. REPLICATE PAID INSTALLMENTS
          const scrapedTransactions: FinancialTransaction[] = [
              { 
                  id: `t_paid_${uniqueSuffix}_1`, 
                  date: new Date().toISOString().split('T')[0], // Today
                  description: 'Comissão - Renovação Auto Roberto', 
                  amount: 350.00, 
                  type: 'commission_received', 
                  status: 'paid', // PAID STATUS
                  productType: ProductType.INSURANCE_AUTO 
              },
              { 
                  id: `t_paid_${uniqueSuffix}_2`, 
                  date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0], // Yesterday
                  description: 'Comissão - Vida Ana Clara (Parc 1/12)', 
                  amount: 125.00, 
                  type: 'commission_received', 
                  status: 'paid', // PAID STATUS
                  productType: ProductType.INSURANCE_LIFE 
              }
          ];

          onSyncData(scrapedPolicies, scrapedTransactions);
      }
  };

  return (
    <div className="p-6 space-y-6 h-full flex flex-col bg-gray-50/50 overflow-y-auto">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configurações do Ecossistema</h2>
          <p className="text-gray-500 text-sm">Controle total sobre automação, integrações e regras de negócio.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 bg-white p-1 rounded-xl border border-gray-200 w-fit overflow-x-auto shadow-sm">
        <button 
          onClick={() => setActiveTab('scalpe')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'scalpe' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <Server className="w-4 h-4" /> Motor Scalpe (RPA)
        </button>
        <button 
          onClick={() => setActiveTab('integrations')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'integrations' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <Link className="w-4 h-4" /> Integrações
        </button>
         <button 
          onClick={() => setActiveTab('forms')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'forms' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <FileText className="w-4 h-4" /> Modelos de Entrada
        </button>
        <button 
          onClick={() => setActiveTab('routing')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'routing' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <Zap className="w-4 h-4" /> Booking Engine
        </button>
        <button 
          onClick={() => setActiveTab('corretora')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'corretora' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <Users className="w-4 h-4" /> Dados Franquia
        </button>
      </div>

      <div className="flex-1 min-h-0">
        
        {/* === TAB: MOTOR SCALPE (RPA) === */}
        {activeTab === 'scalpe' && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full animate-in fade-in">
                
                {/* Left: Insurer List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-fit">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-bold text-gray-700 text-sm">Cias. Seguradoras</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {localInsurers.map((insurer) => (
                            <button 
                                key={insurer.id}
                                onClick={() => { setSelectedInsurerId(insurer.id); setTestLogs([]); setConnectionStatus('idle'); }}
                                className={`w-full p-4 flex items-center justify-between transition-colors hover:bg-gray-50 ${selectedInsurerId === insurer.id ? 'bg-blue-50/50 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ${
                                        insurer.status === 'online' ? 'bg-green-500' : 
                                        insurer.status === 'error' ? 'bg-red-500' : 
                                        insurer.status === 'configuring' ? 'bg-yellow-500 animate-pulse' :
                                        insurer.status === 'paused' ? 'bg-gray-400' : 'bg-yellow-500'
                                    }`} />
                                    <div>
                                        <div className={`text-sm font-medium text-left ${selectedInsurerId === insurer.id ? 'text-primary font-bold' : 'text-gray-700'}`}>
                                            {insurer.name}
                                        </div>
                                        {/* OPTIMIZATION VISUAL INDICATOR */}
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <Activity className={`w-3 h-3 ${insurer.successRate > 90 ? 'text-green-500' : 'text-orange-500'}`} />
                                            <span className={`text-[10px] ${insurer.successRate > 90 ? 'text-green-600' : 'text-orange-500'}`}>
                                                SR: {insurer.successRate}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className={`w-4 h-4 ${selectedInsurerId === insurer.id ? 'text-primary' : 'text-gray-300'}`} />
                            </button>
                        ))}
                    </div>
                    <div className="p-4 border-t border-gray-100">
                        <button className="w-full py-2 border border-dashed border-gray-300 text-gray-500 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
                            + Adicionar Seguradora
                        </button>
                    </div>
                </div>

                {/* Right: Detailed Config */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl font-bold text-gray-600">
                                    {selectedInsurer.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{selectedInsurer.name}</h2>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        Status Atual: 
                                        <span className={`font-bold uppercase text-xs px-2 py-0.5 rounded-full ${
                                            selectedInsurer.status === 'online' ? 'bg-green-100 text-green-700' : 
                                            selectedInsurer.status === 'error' ? 'bg-red-100 text-red-700' : 
                                            selectedInsurer.status === 'configuring' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {selectedInsurer.status === 'configuring' ? 'Configuração Pendente' : selectedInsurer.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleTestConnection}
                                    disabled={isTesting}
                                    className={`px-4 py-2 border rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                                        connectionStatus === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
                                        'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 
                                     connectionStatus === 'success' ? <CheckCircle2 className="w-4 h-4" /> : 
                                     <Play className="w-4 h-4" />}
                                    {isTesting ? 'RPA Trabalhando...' : connectionStatus === 'success' ? 'Dados Replicados' : 'Conectar e Extrair'}
                                </button>
                                <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-slate-800 flex items-center gap-2 shadow-lg shadow-primary/20 transition-all">
                                    <Save className="w-4 h-4" /> Salvar
                                </button>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* 1. Credentials */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-primary" /> Credenciais de Acesso
                                </h4>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL do Portal</label>
                                    <input 
                                        type="text" 
                                        defaultValue={selectedInsurer.url}
                                        readOnly
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Login (Mascarado)</label>
                                    <input 
                                        type="text" 
                                        defaultValue={selectedInsurer.login} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none font-mono" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha (Criptografada)</label>
                                    <input 
                                        type="password" 
                                        defaultValue="Conseg10*" 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                                    />
                                </div>
                            </div>

                            {/* 2. Security / Certificate */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                    <FileKey className="w-4 h-4 text-primary" /> Segurança & Certificados
                                </h4>
                                
                                <div className={`p-4 rounded-xl border border-dashed flex flex-col items-center justify-center text-center transition-colors h-full ${selectedInsurer.certificate ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}`}>
                                    {selectedInsurer.certificate ? (
                                        <>
                                            <CheckCircle2 className="w-6 h-6 text-green-600 mb-2" />
                                            <p className="text-sm font-bold text-green-800">Certificado A1 Válido</p>
                                            <p className="text-xs text-green-600">Expira em: 12/2025</p>
                                            <button className="mt-2 text-xs font-bold text-green-800 underline">Substituir Arquivo</button>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="w-6 h-6 text-gray-400 mb-2" />
                                            <p className="text-sm font-medium text-gray-600">Nenhum certificado digital</p>
                                            <button className="mt-2 px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-primary">Upload .PFX</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 3. Products Scope */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 text-primary" /> Escopo de Sincronização
                            </h4>
                            <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(selectedInsurer.products).map(([key, isActive]) => (
                                    <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isActive ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}>
                                            {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 capitalize group-hover:text-primary transition-colors">
                                            {key === 'life' ? 'Vida' : key === 'consortium' ? 'Consórcio' : key === 'residential' ? 'Residencial' : key === 'health' ? 'Saúde' : key}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Console Output Log */}
                    <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-4 font-mono text-xs overflow-hidden flex flex-col relative group">
                        <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
                            <div className="flex items-center gap-2 text-slate-300">
                                <Terminal className="w-4 h-4" />
                                <span className="font-bold">Scalpe Debug Console</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${isTesting ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`} />
                                {testLogs.length > 0 && (
                                    <button onClick={() => setTestLogs([])} className="text-slate-500 hover:text-white transition-colors">
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="h-64 overflow-y-auto space-y-1 text-slate-300 pr-2 custom-scrollbar font-mono">
                             {testLogs.length === 0 ? (
                                 <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-50">
                                     <Terminal className="w-8 h-8 mb-2" />
                                     <span className="italic">Aguardando comando de teste...</span>
                                 </div>
                             ) : (
                                 testLogs.map((log, idx) => (
                                     <div key={idx} className="break-all flex gap-2 animate-in fade-in duration-300">
                                         <span className="text-slate-500 shrink-0">{'>'}</span>
                                         <span className={log.includes('[ERROR]') ? 'text-red-400' : log.includes('[DONE]') ? 'text-green-400 font-bold' : log.includes('[SCRAPE]') ? 'text-blue-400' : log.includes('[AUTH]') ? 'text-yellow-400' : log.includes('[EXTRACT]') ? 'text-purple-400 font-bold' : log.includes('[SEC]') ? 'text-cyan-400' : ''}>
                                            {log}
                                         </span>
                                     </div>
                                 ))
                             )}
                             <div ref={logsEndRef} />
                        </div>
                    </div>
                </div>
             </div>
        )}

        {/* === TAB: FORMS (MODELOS DE ENTRADA) === */}
        {activeTab === 'forms' && (
            <div className="space-y-6 animate-in fade-in">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" /> Formulários de Entrada (Landing Pages)
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                        Configure as URLs dos sistemas externos. Quando um cliente preenche estes formulários, 
                        o sistema importa o lead, calcula 3 opções automaticamente e gera o PDF.
                    </p>

                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                             <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-gray-700">Sistema de Vida</span>
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">Ativo</span>
                             </div>
                             <input 
                                type="text" 
                                readOnly 
                                value="https://aistudio.google.com/apps/drive/1GuQy6C59ve1HBmalsX8x0MDG550qht_1" 
                                className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs text-gray-500 mb-2"
                             />
                             <div className="flex items-center gap-2 text-xs text-gray-500">
                                 <CheckCircle2 className="w-3 h-3 text-green-500" /> Webhook conectado
                             </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                             <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-gray-700">Sistema de Consórcio</span>
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">Ativo</span>
                             </div>
                             <input 
                                type="text" 
                                readOnly 
                                value="https://aistudio.google.com/apps/drive/15mWckNa2a1xweIYYPvsD8kmfF8vXCori" 
                                className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs text-gray-500 mb-2"
                             />
                             <div className="flex items-center gap-2 text-xs text-gray-500">
                                 <CheckCircle2 className="w-3 h-3 text-green-500" /> Webhook conectado
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* === TAB: INTEGRAÇÕES === */}
        {activeTab === 'integrations' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
                
                {/* WhatsApp Config */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <div className="flex items-center gap-3 mb-6">
                         <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                             <MessageSquare className="w-5 h-5" />
                         </div>
                         <div>
                             <h3 className="font-bold text-gray-800">WhatsApp API</h3>
                             <p className="text-xs text-gray-500">Gateway para disparos e atendimento.</p>
                         </div>
                         <span className="ml-auto bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">Conectado</span>
                     </div>
                     
                     <div className="space-y-4">
                         <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-4">
                             <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                                 <QrCode className="w-8 h-8 text-gray-400" />
                             </div>
                             <div className="flex-1">
                                 <p className="text-sm font-bold text-gray-800">Sessão Ativa: Master_SP</p>
                                 <p className="text-xs text-gray-500 mb-2">+55 11 99999-8888</p>
                                 <button className="text-xs text-red-500 font-bold hover:underline">Desconectar</button>
                             </div>
                         </div>
                         
                         <div>
                             <label className="text-xs font-bold text-gray-500 uppercase mb-1">Webhook URL (Recebimento)</label>
                             <input type="text" value="https://api.acessomaster.com/webhooks/whatsapp" readOnly className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600" />
                         </div>
                     </div>
                </div>

                {/* Email Config */}
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <div className="flex items-center gap-3 mb-6">
                         <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                             <Mail className="w-5 h-5" />
                         </div>
                         <div>
                             <h3 className="font-bold text-gray-800">E-mail Transacional</h3>
                             <p className="text-xs text-gray-500">SMTP / SendGrid / AWS SES</p>
                         </div>
                         <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">Validado</span>
                     </div>
                     
                      <div className="space-y-3">
                         <div>
                             <label className="text-xs font-bold text-gray-500 uppercase mb-1">Servidor SMTP</label>
                             <input type="text" value="smtp.sendgrid.net" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                         </div>
                          <div className="grid grid-cols-2 gap-3">
                              <div>
                                 <label className="text-xs font-bold text-gray-500 uppercase mb-1">Porta</label>
                                 <input type="text" value="587" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                              </div>
                              <div>
                                 <label className="text-xs font-bold text-gray-500 uppercase mb-1">Segurança</label>
                                 <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                     <option>TLS</option>
                                     <option>SSL</option>
                                 </select>
                              </div>
                          </div>
                     </div>
                </div>

                {/* API Status */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">Integridade das Conexões (Portais)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {localInsurers.map(ins => (
                             <div key={ins.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-200">
                                <span className="text-sm font-medium text-gray-700">{ins.name}</span>
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-2 h-2 rounded-full ${ins.status === 'online' ? 'bg-green-500' : ins.status === 'configuring' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                    <span className="text-xs text-gray-500">{ins.status === 'online' ? '12ms' : 'Sync...'}</span>
                                </div>
                             </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* ... (Routing & Corretora Tabs Placeholder) ... */}
        {(activeTab === 'routing' || activeTab === 'corretora') && (
             <div className="flex flex-col items-center justify-center h-full text-gray-400">
                 <Server className="w-12 h-12 mb-4 opacity-20" />
                 <p className="mb-2">Configurações Avançadas</p>
                 <p className="text-sm text-center max-w-md">Os módulos de roteamento e dados cadastrais estão sendo migrados para a nova estrutura de microsserviços.</p>
             </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
