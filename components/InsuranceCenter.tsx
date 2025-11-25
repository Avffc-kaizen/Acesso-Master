
import React, { useState } from 'react';
import { Policy, ScraperStatus } from '../types';
import { RefreshCw, AlertTriangle, Server, Activity, HardHat, Clock, Settings, Zap, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react';

const MOCK_ROBOTS: ScraperStatus[] = [
  { id: 'r1', insurer: 'Porto Seguro', status: 'online', lastSync: '10 min atrás', successRate: 99.5, currentAction: 'Calculando renovações automáticas...' },
  { id: 'r2', insurer: 'Allianz', status: 'online', lastSync: '2 min atrás', successRate: 98.2, currentAction: 'Baixando parcelas pagas...' },
  { id: 'r3', insurer: 'Bradesco', status: 'captcha_required', lastSync: 'Ontem 23:00', successRate: 85.0, errorMessage: 'Intervenção manual necessária' },
  { id: 'r4', insurer: 'SulAmérica', status: 'online', lastSync: '1 min atrás', successRate: 100, currentAction: 'Monitoramento Ativo' },
];

interface InsuranceCenterProps {
    mode: 'policies' | 'claims';
    policies: Policy[]; // Now receiving from App State
}

const InsuranceCenter: React.FC<InsuranceCenterProps> = ({ mode, policies }) => {
  const [robots, setRobots] = useState<ScraperStatus[]>(MOCK_ROBOTS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSupportChat, setShowSupportChat] = useState<string | null>(null);

  const handleSyncRobots = () => {
      setIsSyncing(true);
      setTimeout(() => {
          setRobots(prev => prev.map(r => ({
              ...r,
              status: 'online',
              lastSync: 'Agora mesmo',
              currentAction: 'Cálculo e Sincronização concluídos',
              errorMessage: undefined
          })));
          setIsSyncing(false);
      }, 2000);
  };

  const isClaimsMode = mode === 'claims';

  if (isClaimsMode) {
      return (
          <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
              <div className="w-24 h-24 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-6">
                  <HardHat className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Aba de Sinistros</h2>
              <p className="text-gray-500 max-w-md mb-6">
                  Estamos construindo um módulo revolucionário para gestão de sinistros com IA. 
                  Em breve você poderá abrir e acompanhar processos diretamente por aqui.
              </p>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-500">
                  <Clock className="w-4 h-4" /> Disponível na próxima atualização
              </div>
          </div>
      );
  }

  return (
    <div className="p-6 space-y-6 h-full flex flex-col bg-gray-50/50 overflow-y-auto relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             Central de Apólices & Automação
             <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wide">Scalpe Ativo</span>
          </h2>
          <p className="text-gray-500 text-sm">
              O "Motor Scalpe" gerencia renovações e cálculos automaticamente.
          </p>
        </div>
        <div className="flex gap-2">
            <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4" /> Configurar Robôs
            </button>
            <button 
                onClick={handleSyncRobots}
                disabled={isSyncing}
                className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-colors text-sm font-medium disabled:opacity-70"
            >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> 
                {isSyncing ? 'Calculando...' : 'Sync Manual'}
            </button>
        </div>
      </div>

      {/* RPA Status Monitor (Enhanced Visuals) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {robots.map(robot => (
            <div key={robot.id} className={`bg-white p-5 rounded-xl border shadow-sm relative overflow-hidden group transition-all ${
                robot.status === 'online' ? 'border-gray-200 hover:border-green-300' : 'border-red-100 hover:border-red-300'
            }`}>
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg font-bold text-gray-500">
                            {robot.insurer.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm">{robot.insurer}</h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className={`w-2 h-2 rounded-full ${robot.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                <span className="text-xs text-gray-500 font-medium capitalize">{robot.status.replace('_', ' ')}</span>
                            </div>
                        </div>
                    </div>
                    {robot.status === 'online' ? (
                        <Activity className="w-5 h-5 text-green-500" />
                    ) : (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                </div>
                
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 mb-2">
                    <p className="text-xs font-mono text-gray-600 truncate flex items-center gap-2">
                        <Zap className="w-3 h-3 text-orange-400" />
                        {robot.currentAction || 'Aguardando ciclo...'}
                    </p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3">
                    <span>Sync: {robot.lastSync}</span>
                    <span className={robot.successRate > 98 ? 'text-green-600' : 'text-orange-500'}>Health: {robot.successRate}%</span>
                </div>

                {/* Chat Support Button */}
                <button 
                    onClick={() => setShowSupportChat(robot.insurer)}
                    className="w-full py-1.5 bg-white border border-gray-200 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-50 hover:text-primary flex items-center justify-center gap-2 transition-colors"
                >
                    <MessageSquare className="w-3 h-3" /> Chat Suporte
                </button>

                {robot.status === 'captcha_required' && (
                    <div className="absolute inset-0 bg-white/90 flex items-center justify-center p-4 backdrop-blur-[1px]">
                        <button className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-xs font-bold border border-red-200 shadow-sm flex items-center gap-2 hover:bg-red-100 animate-pulse">
                            <AlertTriangle className="w-4 h-4" /> Resolver Captcha
                        </button>
                    </div>
                )}
            </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0">
        <div className="p-5 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                Data Lakehouse: Apólices Sincronizadas
            </h3>
            <span className="text-xs text-gray-400 font-medium">Atualizado em tempo real</span>
        </div>
        <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Seguradora</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Apólice / Produto</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Segurado</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Vigência</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Prêmio</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status RPA</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {policies.map(policy => (
                        <tr key={policy.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="p-4 font-medium text-gray-800">{policy.insurer}</td>
                            <td className="p-4">
                                <div className="font-bold text-gray-800 text-sm">{policy.policyNumber}</div>
                                <div className="text-xs text-gray-500">{policy.productName}</div>
                            </td>
                            <td className="p-4 text-sm text-gray-600">{policy.insuredName}</td>
                            <td className="p-4 text-sm">
                                <div className={`px-2 py-1 rounded-md text-xs font-bold w-fit ${
                                    policy.status === 'Expiring' ? 'bg-orange-50 text-orange-600' : 'text-gray-600'
                                }`}>
                                    {new Date(policy.validityEnd).toLocaleDateString('pt-BR')}
                                </div>
                            </td>
                            <td className="p-4 font-bold text-gray-700 text-sm">R$ {policy.premium.toLocaleString()}</td>
                            <td className="p-4 text-center">
                                <span className="text-[10px] font-mono text-green-600 bg-green-50 px-2 py-1 rounded-full font-bold flex items-center justify-center gap-1 w-fit mx-auto">
                                    <CheckCircle2 className="w-3 h-3" /> SYNCED
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Support Chat Overlay */}
      {showSupportChat && (
          <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100 animate-in slide-in-from-bottom-10">
              <div className="bg-slate-800 text-white p-4 rounded-t-2xl flex justify-between items-center">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Suporte {showSupportChat}
                  </h4>
                  <button onClick={() => setShowSupportChat(null)} className="text-gray-300 hover:text-white">
                      <ExternalLink className="w-4 h-4" />
                  </button>
              </div>
              <div className="h-64 bg-gray-50 p-4 overflow-y-auto text-xs space-y-3">
                  <div className="flex justify-start">
                      <div className="bg-white p-2 rounded-lg rounded-bl-none shadow-sm border border-gray-200 max-w-[80%]">
                          Olá, sou o assistente virtual da {showSupportChat}. Identifiquei uma divergência no cálculo?
                      </div>
                  </div>
                   <div className="flex justify-end">
                      <div className="bg-blue-100 text-blue-900 p-2 rounded-lg rounded-br-none max-w-[80%]">
                          Sim, o prêmio calculado no RPA está diferente do portal.
                      </div>
                  </div>
              </div>
              <div className="p-3 border-t border-gray-100 flex gap-2">
                  <input type="text" placeholder="Mensagem..." className="flex-1 bg-gray-100 rounded-lg px-3 text-xs focus:outline-none" />
                  <button className="bg-slate-800 text-white p-2 rounded-lg text-xs font-bold">Enviar</button>
              </div>
          </div>
      )}
    </div>
  );
};

export default InsuranceCenter;
