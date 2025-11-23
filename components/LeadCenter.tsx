
import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, ProductType } from '../types';
import { Search, Filter, Sparkles, Phone, Mail, ArrowRight, Wallet, Clock, Shield, FileText } from 'lucide-react';
import { analyzeLeadOpportunity } from '../services/geminiService';

const ALL_MOCK_LEADS: Lead[] = [
  // WON / CLOSED
  {
    id: '1', name: 'Ricardo Oliveira', email: 'ricardo.o@email.com', phone: '(11) 98765-4321',
    status: LeadStatus.WON, interest: ProductType.CONSORTIUM, value: 250000, score: 98,
    lastInteraction: '2 horas atrás', contemplated: true, crossSellOpportunity: ProductType.INSURANCE_HOME,
    notes: 'Cliente contemplado na assembleia de ontem. Prioridade máxima.'
  },
  // PROPOSALS
  {
    id: '2', name: 'Mariana Santos', email: 'mari.santos@email.com', phone: '(21) 99999-8888',
    status: LeadStatus.PROPOSAL, interest: ProductType.INSURANCE_LIFE, value: 1500, score: 75,
    lastInteraction: '1 dia atrás', contemplated: false,
    notes: 'Cliente recém casada, focada em proteção familiar.'
  },
  {
    id: '4', name: 'Carlos Ferreira', email: 'carlos.f@email.com', phone: '(41) 98877-6655',
    status: LeadStatus.PROPOSAL, interest: ProductType.INSURANCE_AUTO, value: 3500, score: 80,
    lastInteraction: '30 mins atrás', contemplated: false,
    notes: 'Aguardando vistoria.'
  },
  // NEW / PROSPECTING
  {
    id: '3', name: 'Roberto Carlos', email: 'rc@email.com', phone: '(31) 98888-7777',
    status: LeadStatus.NEW, interest: ProductType.CONSORTIUM, value: 450000, score: 88,
    lastInteraction: 'Recém chegado', contemplated: false,
    notes: 'Lead distribuído via algoritmo (Geo: SP).'
  },
  {
    id: '5', name: 'Julia Roberts', email: 'j.roberts@email.com', phone: '(11) 91234-5678',
    status: LeadStatus.NEW, interest: ProductType.INSURANCE_HOME, value: 600, score: 45,
    lastInteraction: '1 hora atrás', contemplated: false,
    notes: 'Lead frio, tentar contato.'
  },
  // QUOTES (CONTACTED)
  {
    id: '6', name: 'Pedro Pascal', email: 'p.pascal@email.com', phone: '(21) 99887-1122',
    status: LeadStatus.CONTACTED, interest: ProductType.INSURANCE_AUTO, value: 4200, score: 65,
    lastInteraction: 'Ontem', contemplated: false,
    notes: 'Solicitou cotação para SUV.'
  }
];

interface LeadCenterProps {
    mode: 'quotes' | 'proposals' | 'prospecting';
}

const LeadCenter: React.FC<LeadCenterProps> = ({ mode }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isSimulatingDistribution, setIsSimulatingDistribution] = useState(false);

  // Filter leads based on mode
  useEffect(() => {
      let filtered: Lead[] = [];
      if (mode === 'proposals') {
          filtered = ALL_MOCK_LEADS.filter(l => l.status === LeadStatus.PROPOSAL || l.status === LeadStatus.WON);
      } else if (mode === 'prospecting') {
          filtered = ALL_MOCK_LEADS.filter(l => l.status === LeadStatus.NEW);
      } else {
          // quotes -> Contacted and others basically
          filtered = ALL_MOCK_LEADS.filter(l => l.status === LeadStatus.CONTACTED || l.status === LeadStatus.NEW || l.status === LeadStatus.PROPOSAL);
      }
      setLeads(filtered);
      setSelectedLead(null);
      setAiAnalysis(null);
  }, [mode]);

  const getTitle = () => {
      switch(mode) {
          case 'proposals': return 'Gestão de Propostas';
          case 'prospecting': return 'Prospecção de Novos Clientes';
          case 'quotes': return 'Central de Cotações';
          default: return 'Central de Leads';
      }
  };

  const getDescription = () => {
      switch(mode) {
          case 'proposals': return 'Acompanhe o fechamento e emissão.';
          case 'prospecting': return 'Leads novos aguardando primeiro contato.';
          case 'quotes': return 'Cotações em andamento e negociações.';
          default: return 'Motor de Distribuição e Gestão Inteligente';
      }
  };

  const handleAnalyze = async (lead: Lead) => {
    setSelectedLead(lead);
    setIsAnalyzing(true);
    setAiAnalysis(null);
    
    const result = await analyzeLeadOpportunity(lead);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const simulateLeadDistribution = () => {
    setIsSimulatingDistribution(true);
    setTimeout(() => {
        const newLead: Lead = {
            id: Math.random().toString(),
            name: 'Novo Cliente Potencial',
            email: 'novo@cliente.com',
            phone: '(11) 90000-0000',
            status: LeadStatus.NEW,
            interest: ProductType.INSURANCE_AUTO,
            value: 5000,
            score: 85,
            lastInteraction: 'Agora',
            contemplated: false,
            notes: 'Roteado por: Especialidade em Auto'
        };
        setLeads([newLead, ...leads]);
        setIsSimulatingDistribution(false);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 h-full flex flex-col bg-gray-50/50 overflow-y-auto lg:overflow-hidden">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{getTitle()}</h2>
          <p className="text-gray-500 text-sm">{getDescription()}</p>
        </div>
        {mode === 'prospecting' && (
            <button 
                onClick={simulateLeadDistribution}
                disabled={isSimulatingDistribution}
                className="w-full md:w-auto bg-primary hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all shadow-lg shadow-primary/20 disabled:opacity-70"
            >
            {isSimulatingDistribution ? (
                <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> Buscando...</>
            ) : (
                <><Sparkles className="w-4 h-4 text-accent" /> Solicitar Novos Leads</>
            )}
            </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar por nome, email ou telefone..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
          />
        </div>
        <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 text-sm font-medium">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      {/* Main Layout - Stacked on Mobile, Side-by-side on Desktop */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 flex-1 min-h-0">
        
        {/* Lead List */}
        <div className="w-full lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col shrink-0 lg:shrink h-[500px] lg:h-auto">
            {leads.length > 0 ? (
                <div className="overflow-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cliente</th>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Produto</th>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Potencial</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {leads.map((lead) => (
                            <tr 
                                key={lead.id} 
                                className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${selectedLead?.id === lead.id ? 'bg-blue-50' : ''}`} 
                                onClick={() => handleAnalyze(lead)}
                            >
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${lead.contemplated ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-200' : 'bg-gray-100 text-gray-500'}`}>
                                        {lead.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">{lead.name}</div>
                                        <div className="text-xs text-gray-500">{lead.lastInteraction}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-700">{lead.interest}</span>
                                    <span className="text-xs text-gray-500">R$ {lead.value.toLocaleString('pt-BR')}</span>
                                </div>
                            </td>
                            <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${
                                    lead.status === LeadStatus.NEW ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    lead.status === LeadStatus.WON ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                    lead.contemplated ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                    'bg-gray-50 text-gray-600 border-gray-200'
                                }`}>
                                {lead.contemplated ? 'CONTEMPLADO ★' : lead.status}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <div className="flex flex-col items-end">
                                        <span className={`text-sm font-bold ${lead.score > 80 ? 'text-accent' : 'text-gray-600'}`}>
                                            {lead.score}/100
                                        </span>
                                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                                            <div 
                                                className={`h-full rounded-full ${lead.score > 80 ? 'bg-accent' : lead.score > 50 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                                                style={{ width: `${lead.score}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex items-center justify-center flex-1 text-gray-400 flex-col p-8">
                    <FileText className="w-12 h-12 mb-2 opacity-20" />
                    <p>Nenhum registro encontrado nesta categoria.</p>
                </div>
            )}
        </div>

        {/* Lead Detail & Strategy Panel */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 shrink-0 pb-4 lg:pb-0">
            {selectedLead ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
                    
                    {/* Profile Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{selectedLead.name}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-medium">{selectedLead.interest}</span>
                                {selectedLead.contemplated && (
                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded font-bold border border-amber-200">Contemplado</span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="WhatsApp">
                                <Phone className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Email">
                                <Mail className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Financial Journey Visualization */}
                    <div className="mb-6">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Wallet className="w-3 h-3" /> Jornada Financeira
                        </h4>
                        <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                            {/* Current Step */}
                            <div className="relative">
                                <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-white shadow-sm"></div>
                                <p className="text-sm font-bold text-gray-800">Produto Atual</p>
                                <p className="text-xs text-gray-500">{selectedLead.interest} - R$ {selectedLead.value.toLocaleString()}</p>
                            </div>
                            
                            {/* Next Step (Cross Sell) */}
                            <div className={`relative ${selectedLead.contemplated ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                                <div className={`absolute -left-[21px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${selectedLead.contemplated ? 'bg-accent animate-pulse' : 'bg-gray-300'}`}></div>
                                <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                    Oportunidade Cruzada
                                    {selectedLead.contemplated && <span className="text-[10px] bg-accent text-white px-1.5 rounded">AGORA</span>}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {selectedLead.crossSellOpportunity || 'Seguro Prestamista / Residencial'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* AI Strategy Box */}
                    <div className="bg-gradient-to-b from-gray-50 to-white p-5 rounded-xl border border-gray-200 mb-6 flex-1">
                         <h4 className="text-xs font-bold text-purple-600 uppercase mb-3 flex items-center gap-2">
                            <Sparkles className="w-3 h-3" />
                            Estratégia do Mestre (IA)
                        </h4>
                        {isAnalyzing ? (
                            <div className="flex flex-col items-center justify-center h-32 text-center">
                                <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-3"></div>
                                <p className="text-xs text-gray-500">Analisando perfil e calculando next best action...</p>
                            </div>
                        ) : aiAnalysis ? (
                            <div className="prose prose-sm text-gray-700 text-sm leading-relaxed">
                                {aiAnalysis}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                <Shield className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p>Clique no lead para revelar a estratégia ideal.</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Actions */}
                    <div className="mt-auto space-y-3">
                        {selectedLead.contemplated && (
                            <button className="w-full bg-accent hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 animate-pulse">
                                <Shield className="w-4 h-4" />
                                Ofertar Seguro Agora
                            </button>
                        )}
                         <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2">
                            Registrar Interação
                            <Clock className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col items-center justify-center text-gray-400 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <ArrowRight className="w-6 h-6 text-gray-300" />
                    </div>
                    <h3 className="text-gray-800 font-bold mb-2">Selecione um Cliente</h3>
                    <p className="text-sm max-w-[200px]">Clique na lista ao lado para ver a Jornada Financeira e a análise de IA.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LeadCenter;
