
import React, { useState } from 'react';
import { Policy, ScraperStatus, Claim } from '../types';
import { Shield, RefreshCw, AlertTriangle, FileText, Download, Lock, Zap, Plus, X, Search, Filter, AlertCircle } from 'lucide-react';

const MOCK_POLICIES: Policy[] = [
  {
    id: '1', insurer: 'Porto Seguro', policyNumber: '0531.10.102938', productName: 'Auto Premium',
    insuredName: 'Ricardo Oliveira', validityStart: '2023-05-20', validityEnd: '2024-05-20',
    premium: 4500.00, status: 'Expiring', documents: [{ name: 'Apólice.pdf', type: 'policy', url: '#' }, { name: 'Boleto.pdf', type: 'boleto', url: '#' }]
  },
  {
    id: '2', insurer: 'Allianz', policyNumber: '5123987123', productName: 'Residencial Compacto',
    insuredName: 'Mariana Santos', validityStart: '2023-08-10', validityEnd: '2024-08-10',
    premium: 890.00, status: 'Active', documents: [{ name: 'Apólice.pdf', type: 'policy', url: '#' }]
  },
  {
    id: '3', insurer: 'Bradesco Seguros', policyNumber: '999888777', productName: 'Vida Mulher',
    insuredName: 'Fernanda Lima', validityStart: '2024-01-15', validityEnd: '2025-01-15',
    premium: 1200.00, status: 'Active', documents: [{ name: 'Certificado.pdf', type: 'policy', url: '#' }]
  }
];

const MOCK_CLAIMS: Claim[] = [
    {
        id: 'c1', policyNumber: '0531.10.102938', insurer: 'Porto Seguro', insuredName: 'Ricardo Oliveira',
        incidentDate: '2023-11-15', status: 'Analyzing', description: 'Colisão traseira no trânsito.', value: 2500.00
    },
    {
        id: 'c2', policyNumber: '5123987123', insurer: 'Allianz', insuredName: 'Mariana Santos',
        incidentDate: '2023-10-05', status: 'Paid', description: 'Danos elétricos (raio).', value: 1200.00
    }
];

const MOCK_ROBOTS: ScraperStatus[] = [
  { id: 'r1', insurer: 'Porto Seguro', status: 'online', lastSync: 'Hoje 04:00', successRate: 99.5 },
  { id: 'r2', insurer: 'Allianz', status: 'online', lastSync: 'Hoje 04:15', successRate: 98.2 },
  { id: 'r3', insurer: 'Bradesco', status: 'captcha_required', lastSync: 'Ontem 23:00', successRate: 85.0, errorMessage: 'ReCaptcha V3 falhou' },
  { id: 'r4', insurer: 'Mapfre', status: 'maintenance', lastSync: 'Ontem 20:00', successRate: 0, errorMessage: 'Portal em Manutenção' },
];

interface InsuranceCenterProps {
    mode: 'policies' | 'claims';
}

const InsuranceCenter: React.FC<InsuranceCenterProps> = ({ mode }) => {
  const [policies, setPolicies] = useState<Policy[]>(MOCK_POLICIES);
  const [claims] = useState<Claim[]>(MOCK_CLAIMS);
  const [robots, setRobots] = useState<ScraperStatus[]>(MOCK_ROBOTS);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [newPolicy, setNewPolicy] = useState<Partial<Policy>>({
    insurer: 'Porto Seguro',
    status: 'Active'
  });

  const handleSyncRobots = () => {
      setIsSyncing(true);
      setTimeout(() => {
          setRobots(prev => prev.map(r => ({
              ...r,
              status: 'online',
              lastSync: 'Agora mesmo',
              successRate: r.successRate < 99 ? r.successRate + 1 : 99.9,
              errorMessage: undefined
          })));
          setIsSyncing(false);
      }, 2000);
  };

  const handleSaveManual = () => {
    if (!newPolicy.policyNumber || !newPolicy.insuredName) return;

    const policyToAdd: Policy = {
        id: Date.now().toString(),
        insurer: newPolicy.insurer || 'Outra',
        policyNumber: newPolicy.policyNumber,
        productName: newPolicy.productName || 'Produto Genérico',
        insuredName: newPolicy.insuredName,
        validityStart: newPolicy.validityStart || new Date().toISOString().split('T')[0],
        validityEnd: newPolicy.validityEnd || new Date().toISOString().split('T')[0],
        premium: Number(newPolicy.premium) || 0,
        status: 'Active',
        documents: []
    };

    setPolicies([policyToAdd, ...policies]);
    setIsManualModalOpen(false);
    setNewPolicy({ insurer: 'Porto Seguro', status: 'Active' });
  };

  const isClaimsMode = mode === 'claims';

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 h-full flex flex-col bg-gray-50/50 overflow-y-auto relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{isClaimsMode ? 'Gestão de Sinistros' : 'Seguradoras & Automação'}</h2>
          <p className="text-gray-500 text-sm">
              {isClaimsMode ? 'Acompanhamento de processos de indenização.' : 'Gestão de Apólices (Open Insurance) e Monitoramento RPA (Scalpe)'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {!isClaimsMode && (
                <button 
                    onClick={() => setIsManualModalOpen(true)}
                    className="flex-1 md:flex-none justify-center bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                    <Plus className="w-4 h-4" /> Inclusão Manual
                </button>
            )}
            <button 
                onClick={handleSyncRobots}
                disabled={isSyncing}
                className="flex-1 md:flex-none justify-center bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-colors text-sm font-medium disabled:opacity-70"
            >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> 
                {isSyncing ? 'Sync...' : 'Sincronizar Robôs'}
            </button>
        </div>
      </div>

      {/* RPA Status Monitor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {robots.map(robot => (
            <div key={robot.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-700">{robot.insurer}</h3>
                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        robot.status === 'online' ? 'bg-green-50 text-green-600 border-green-100' :
                        robot.status === 'maintenance' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                        'bg-red-50 text-red-600 border-red-100'
                    }`}>
                        {robot.status.replace('_', ' ')}
                    </div>
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                    <p>Última Sync: {robot.lastSync}</p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-500 ${
                                robot.successRate > 95 ? 'bg-green-500' : robot.successRate > 80 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} style={{width: `${robot.successRate}%`}} />
                        </div>
                        <span>{robot.successRate.toFixed(1)}%</span>
                    </div>
                </div>

                {robot.status === 'captcha_required' && (
                    <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-100 flex items-center gap-2 cursor-pointer hover:bg-red-100 transition-colors">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-bold text-red-700">Resolver Captcha</span>
                    </div>
                )}
            </div>
        ))}
      </div>

      {/* Main Content Grid (Policies or Claims) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0">
        <div className="p-5 border-b border-gray-50 flex justify-between items-center flex-wrap gap-3">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                {isClaimsMode ? <AlertCircle className="w-5 h-5 text-red-500" /> : <FileText className="w-5 h-5 text-secondary" />}
                {isClaimsMode ? 'Lista de Sinistros' : 'Apólices Cadastradas'}
            </h3>
            <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <input type="text" placeholder="Filtrar..." className="w-full md:w-auto pl-7 pr-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none" />
                </div>
                {!isClaimsMode && (
                    <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                        <Lock className="w-3 h-3" /> LGPD Protegido
                    </div>
                )}
            </div>
        </div>
        <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Seguradora</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Apólice / Produto</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Segurado</th>
                        {isClaimsMode ? (
                            <>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data Incidente</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Descrição</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            </>
                        ) : (
                            <>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Vigência</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Prêmio</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Ações</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {isClaimsMode ? (
                         claims.map(claim => (
                            <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-800">{claim.insurer}</td>
                                <td className="p-4 text-sm text-gray-600">{claim.policyNumber}</td>
                                <td className="p-4 text-sm text-gray-600">{claim.insuredName}</td>
                                <td className="p-4 text-sm text-gray-600">{new Date(claim.incidentDate).toLocaleDateString('pt-BR')}</td>
                                <td className="p-4 text-sm text-gray-500 max-w-[200px] truncate" title={claim.description}>{claim.description}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                                        claim.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' :
                                        claim.status === 'Analyzing' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                        claim.status === 'Denied' ? 'bg-red-50 text-red-700 border-red-100' :
                                        'bg-gray-50 text-gray-600 border-gray-200'
                                    }`}>
                                        {claim.status === 'Paid' ? 'Pago' : claim.status === 'Analyzing' ? 'Em Análise' : claim.status}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        policies.map(policy => (
                            <tr key={policy.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-4 font-medium text-gray-800">{policy.insurer}</td>
                                <td className="p-4">
                                    <div className="font-bold text-gray-800 text-sm">{policy.policyNumber}</div>
                                    <div className="text-xs text-gray-500">{policy.productName}</div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">{policy.insuredName}</td>
                                <td className="p-4 text-sm">
                                    <div className={`px-2 py-1 rounded-md text-xs font-bold w-fit flex items-center gap-1 ${
                                        policy.status === 'Expiring' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'text-gray-600'
                                    }`}>
                                        {policy.status === 'Expiring' && <AlertTriangle className="w-3 h-3" />}
                                        {new Date(policy.validityEnd).toLocaleDateString('pt-BR')}
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-gray-700 text-sm">R$ {policy.premium.toLocaleString()}</td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-2">
                                        {policy.documents.map((doc, idx) => (
                                            <button key={idx} className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded transition-colors" title={doc.name}>
                                                <Download className="w-4 h-4" />
                                            </button>
                                        ))}
                                        <button className="p-1.5 text-accent hover:bg-green-50 rounded transition-colors" title="Enviar no WhatsApp">
                                            <Zap className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {isManualModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-gray-800">Inclusão Manual de Apólice</h3>
                    <button onClick={() => setIsManualModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Seguradora</label>
                        <select 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                            value={newPolicy.insurer}
                            onChange={(e) => setNewPolicy({...newPolicy, insurer: e.target.value})}
                        >
                            <option>Porto Seguro</option>
                            <option>Allianz</option>
                            <option>Bradesco</option>
                            <option>Tokio Marine</option>
                            <option>Mapfre</option>
                            <option>Outra</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Número da Apólice</label>
                            <input 
                                type="text" 
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                placeholder="Ex: 0531..."
                                value={newPolicy.policyNumber || ''}
                                onChange={(e) => setNewPolicy({...newPolicy, policyNumber: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prêmio Total (R$)</label>
                            <input 
                                type="number" 
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                placeholder="0,00"
                                value={newPolicy.premium || ''}
                                onChange={(e) => setNewPolicy({...newPolicy, premium: Number(e.target.value)})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Segurado</label>
                        <input 
                            type="text" 
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                            placeholder="Nome completo do cliente"
                            value={newPolicy.insuredName || ''}
                            onChange={(e) => setNewPolicy({...newPolicy, insuredName: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Produto</label>
                        <input 
                            type="text" 
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                            placeholder="Ex: Auto Supremo"
                            value={newPolicy.productName || ''}
                            onChange={(e) => setNewPolicy({...newPolicy, productName: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Início Vigência</label>
                            <input 
                                type="date" 
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                value={newPolicy.validityStart || ''}
                                onChange={(e) => setNewPolicy({...newPolicy, validityStart: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fim Vigência</label>
                            <input 
                                type="date" 
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                value={newPolicy.validityEnd || ''}
                                onChange={(e) => setNewPolicy({...newPolicy, validityEnd: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                    <button 
                        onClick={() => setIsManualModalOpen(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSaveManual}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg"
                    >
                        Salvar Apólice
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceCenter;
