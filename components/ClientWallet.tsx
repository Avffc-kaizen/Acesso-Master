
import React, { useState } from 'react';
import { Client, ProductType, Policy, TimelineEvent, FamilyMember } from '../types';
import { Search, Shield, Car, Home, Briefcase, AlertTriangle, MoreHorizontal, Phone, Mail, Clock, Activity, Users, ChevronRight, FileText, Calendar, Plus, UserPlus, Heart, Sparkles, ChevronDown, DollarSign, MessageSquare, AlertCircle, CheckCircle2, Target, TrendingUp, BarChart2, Play } from 'lucide-react';
import { analyzeClientPortfolio } from '../services/geminiService';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Ana Clara Souza',
    email: 'ana.souza@email.com',
    phone: '(11) 99999-1111',
    products: [ProductType.CONSORTIUM, ProductType.INSURANCE_HOME],
    ltv: 12500,
    clientSince: '2021-03-15',
    status: 'active',
    lastContact: '15 dias atrás',
    nextRenewalDate: '2024-05-20',
    nextRenewalProduct: ProductType.INSURANCE_HOME
  },
  {
    id: '2',
    name: 'Roberto Mendes',
    email: 'roberto.m@email.com',
    phone: '(11) 98888-2222',
    products: [ProductType.INSURANCE_AUTO],
    ltv: 3200,
    clientSince: '2023-01-10',
    status: 'risk',
    lastContact: '4 meses atrás',
    nextRenewalDate: '2024-01-15', 
    nextRenewalProduct: ProductType.INSURANCE_AUTO
  },
];

// Unified View Data Structure
const MOCK_CLIENT_POLICIES: Policy[] = [
    {
        id: 'p1', insurer: 'Porto Seguro', policyNumber: '0531.10.102938', productName: 'Consórcio Imobiliário',
        insuredName: 'Ana Clara Souza', validityStart: '2021-03-20', validityEnd: '2031-03-20',
        premium: 250000.00, status: 'Active', documents: [],
        installments: [
            { number: 35, total: 1250.00, dueDate: '2024-05-10', status: 'paid', commissionValue: 25.00, commissionStatus: 'received' },
            { number: 36, total: 1250.00, dueDate: '2024-06-10', status: 'open', commissionValue: 25.00, commissionStatus: 'projected' },
        ],
        consortiumDetails: {
            group: '2048', quota: '155', administrator: 'Porto',
            letterValue: 250000, balanceDue: 140000, nextAssemblyDate: '2024-06-15',
            suggestedBidPct: 42.5,
            assemblyHistory: [
                { month: 'Jan', winningBidPct: 45, averageBidPct: 28, clientBidPct: 30, result: 'lost' },
                { month: 'Fev', winningBidPct: 44, averageBidPct: 29, clientBidPct: 0, result: 'skipped' },
                { month: 'Mar', winningBidPct: 48, averageBidPct: 31, clientBidPct: 35, result: 'lost' },
                { month: 'Abr', winningBidPct: 41, averageBidPct: 30, clientBidPct: 0, result: 'skipped' },
                { month: 'Mai', winningBidPct: 39, averageBidPct: 28, clientBidPct: 35, result: 'lost' },
            ]
        }
    },
    {
        id: 'p2', insurer: 'Allianz', policyNumber: '888.777.666', productName: 'Seguro Residencial',
        insuredName: 'Ana Clara Souza', validityStart: '2023-08-15', validityEnd: '2024-08-15',
        premium: 890.00, status: 'Active', documents: [],
        installments: [
            { number: 1, total: 890.00, dueDate: '2023-08-15', status: 'paid', commissionValue: 180.00, commissionStatus: 'received' }
        ]
    }
];

const MOCK_ACTIVE_QUOTES = [
    {
        id: 'q1',
        product: 'Seguro de Vida - Familiar',
        insurer: 'SulAmérica',
        premium: 1250.00,
        createdAt: '2024-05-20',
        status: 'sent', // sent, negotiating, draft
        probability: 'high'
    },
    {
        id: 'q2',
        product: 'Consórcio Auto',
        insurer: 'Ademicon',
        premium: 450.00, // parcela
        createdAt: '2024-05-18',
        status: 'negotiating',
        probability: 'medium'
    }
];

const MOCK_TIMELINE: TimelineEvent[] = [
    { id: 't1', type: 'message', title: 'Contato via WhatsApp', date: 'Hoje, 09:30', description: 'Cliente solicitou 2ª via do boleto do consórcio.', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { id: 't2', type: 'system', title: 'Baixa Automática (Scalpe)', date: 'Ontem, 18:00', description: 'Pagamento da parcela #35 confirmado pela Seguradora.', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { id: 't3', type: 'renewal', title: 'Renovação Residencial', date: '15/08/2023', description: 'Apólice renovada com aumento de cobertura para vendaval.', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { id: 't4', type: 'sale', title: 'Venda Cruzada (Consórcio)', date: '20/03/2021', description: 'Cliente adquiriu carta de crédito de R$ 250k.', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
];

const MOCK_FAMILY: FamilyMember[] = [
    { id: 'f1', name: 'Pedro Souza', relation: 'Cônjuge', age: 35, products: [ProductType.INSURANCE_AUTO], opportunity: ProductType.INSURANCE_LIFE, opportunityScore: 92 },
    { id: 'f2', name: 'Lucas Souza', relation: 'Filho(a)', age: 5, products: [], opportunity: ProductType.CONSORTIUM, opportunityScore: 75 },
];

const getProductIcon = (type: ProductType) => {
  switch (type) {
    case ProductType.CONSORTIUM: return <Briefcase className="w-4 h-4" />;
    case ProductType.INSURANCE_AUTO: return <Car className="w-4 h-4" />;
    case ProductType.INSURANCE_LIFE: return <Shield className="w-4 h-4" />;
    case ProductType.INSURANCE_HOME: return <Home className="w-4 h-4" />;
    default: return <Shield className="w-4 h-4" />;
  }
};

const ClientWallet: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'quotes' | 'timeline' | 'family'>('overview');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedPolicyId, setExpandedPolicyId] = useState<string | null>(null);

  const handleSelectClient = async (client: Client) => {
    setSelectedClient(client);
    setAiAnalysis(null);
    setIsAnalyzing(true);
    // Fetch AI Analysis
    const analysis = await analyzeClientPortfolio(client);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
    setExpandedPolicyId(null);
    setActiveTab('overview');
  };

  const togglePolicyExpand = (id: string) => {
      setExpandedPolicyId(expandedPolicyId === id ? null : id);
  };

  const renderTimelineIcon = (type: TimelineEvent['type']) => {
      switch(type) {
          case 'message': return <MessageSquare className="w-4 h-4" />;
          case 'renewal': return <RefreshIcon />;
          case 'claim': return <AlertTriangle className="w-4 h-4" />;
          case 'sale': return <DollarSign className="w-4 h-4" />;
          case 'system': return <Activity className="w-4 h-4" />;
          default: return <FileText className="w-4 h-4" />;
      }
  };

  return (
    <div className="p-6 space-y-6 h-full flex flex-col bg-gray-50/50">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Carteira 360º</h2>
          <p className="text-gray-500 text-sm">Visão Unificada: Cliente &gt; Negociações &gt; Apólices</p>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        
        {/* Left: Client List */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
             {/* Search */}
             <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Buscar cliente..." 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 shadow-sm"
                />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {MOCK_CLIENTS.map((client) => (
                    <div 
                        key={client.id}
                        onClick={() => handleSelectClient(client)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            selectedClient?.id === client.id 
                            ? 'bg-white border-primary shadow-md ring-1 ring-primary/20' 
                            : 'bg-white border-gray-100 hover:border-gray-300 shadow-sm'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                    selectedClient?.id === client.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {client.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className={`font-bold text-sm ${selectedClient?.id === client.id ? 'text-primary' : 'text-gray-900'}`}>{client.name}</h3>
                                    <p className="text-xs text-gray-500">{client.products.length} produtos ativos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Right: Client Detail 360 */}
        <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            {selectedClient ? (
                <>
                    {/* Header Profile */}
                    <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex justify-between items-start">
                        <div className="flex gap-4">
                             <div className="w-16 h-16 bg-gradient-to-br from-primary to-slate-800 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                {selectedClient.name.charAt(0)}
                             </div>
                             <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h2>
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {selectedClient.phone}</span>
                                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {selectedClient.email}</span>
                                </div>
                             </div>
                        </div>
                        {isAnalyzing ? (
                            <div className="flex items-center gap-2 text-purple-600 text-xs font-bold animate-pulse">
                                <Sparkles className="w-4 h-4" /> Mestre AI Analisando...
                            </div>
                        ) : aiAnalysis && (
                            <div className="bg-purple-50 border border-purple-100 p-3 rounded-xl max-w-xs">
                                <p className="text-xs text-purple-800 leading-snug"><strong>Dica do Mestre:</strong> {aiAnalysis}</p>
                            </div>
                        )}
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-gray-100 overflow-x-auto">
                        <button 
                            onClick={() => setActiveTab('overview')}
                            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Apólices Ativas
                        </button>
                         <button 
                            onClick={() => setActiveTab('quotes')}
                            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'quotes' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Cotações em Andamento <span className="bg-accent/10 text-accent px-1.5 py-0.5 rounded-full text-[10px]">2</span>
                        </button>
                        <button 
                             onClick={() => setActiveTab('timeline')}
                             className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'timeline' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Histórico
                        </button>
                        <button 
                             onClick={() => setActiveTab('family')}
                             className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'family' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Rede Familiar
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                        
                        {/* ACTIVE QUOTES TAB (NEW) */}
                        {activeTab === 'quotes' && (
                            <div className="space-y-4 animate-in slide-in-from-right-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-bold text-gray-700">Negociações no Pipeline</h4>
                                    <button className="text-xs bg-accent text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-600 shadow-sm flex items-center gap-1">
                                        <Plus className="w-3 h-3" /> Nova Oportunidade
                                    </button>
                                </div>

                                {MOCK_ACTIVE_QUOTES.map(quote => (
                                    <div key={quote.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${quote.status === 'sent' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600 font-bold border border-gray-100">
                                                {quote.product.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-gray-800 text-sm">{quote.product}</h4>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                                        quote.status === 'sent' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                                    }`}>
                                                        {quote.status === 'sent' ? 'Enviada' : 'Negociação'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">{quote.insurer} • Criada em {quote.createdAt}</p>
                                            </div>
                                        </div>

                                        <div className="text-right flex flex-col items-end gap-2">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">R$ {quote.premium.toLocaleString()}</p>
                                                <p className="text-[10px] text-gray-400">Prêmio Total</p>
                                            </div>
                                            <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                                                <Play className="w-3 h-3 fill-current" /> Retomar Cotação
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
                                
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold text-gray-700">Apólices & Financeiro</h4>
                                    <button className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-bold text-gray-600 hover:bg-gray-50">
                                        Exportar Relatório
                                    </button>
                                </div>

                                {/* Accordion List */}
                                {MOCK_CLIENT_POLICIES.map(policy => (
                                    <div key={policy.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all hover:shadow-md">
                                        
                                        {/* Policy Header (Clickable) */}
                                        <div 
                                            onClick={() => togglePolicyExpand(policy.id)}
                                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${
                                                    policy.productName.includes('Consórcio') ? 'bg-purple-100 text-purple-600' : 
                                                    expandedPolicyId === policy.id ? 'bg-primary text-white' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                    {policy.productName.includes('Consórcio') ? <Briefcase className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-gray-800 text-sm">{policy.productName}</h5>
                                                    <p className="text-xs text-gray-500">{policy.insurer} • {policy.policyNumber}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-400 uppercase font-bold">Vigência</p>
                                                    <p className="text-sm font-medium text-gray-700">{new Date(policy.validityEnd).toLocaleDateString('pt-BR')}</p>
                                                </div>
                                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedPolicyId === policy.id ? 'rotate-180' : ''}`} />
                                            </div>
                                        </div>

                                        {/* Expanded Content */}
                                        {expandedPolicyId === policy.id && (
                                            <div className="bg-gray-50 border-t border-gray-100 p-4 animate-in slide-in-from-top-2">
                                                
                                                {/* 1. CONSORTIUM SPECIFIC INTELLIGENCE (If Applicable) */}
                                                {policy.consortiumDetails && (
                                                    <div className="mb-6 bg-white rounded-xl border border-purple-100 shadow-sm p-4">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <Sparkles className="w-4 h-4 text-purple-600" />
                                                            <h3 className="font-bold text-gray-800 text-sm">Inteligência de Lances (Consórcio)</h3>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                            {/* Info Cards */}
                                                            <div className="space-y-3">
                                                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Próxima Assembleia</p>
                                                                    <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                                                        {new Date(policy.consortiumDetails.nextAssemblyDate).toLocaleDateString('pt-BR')}
                                                                        <Clock className="w-4 h-4 text-orange-500" />
                                                                    </p>
                                                                </div>
                                                                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                                                    <p className="text-[10px] text-purple-600 uppercase font-bold">Lance Sugerido (IA)</p>
                                                                    <p className="text-lg font-bold text-purple-800">{policy.consortiumDetails.suggestedBidPct}%</p>
                                                                    <p className="text-[10px] text-purple-500">R$ {(policy.consortiumDetails.letterValue * (policy.consortiumDetails.suggestedBidPct || 0) / 100).toLocaleString()}</p>
                                                                </div>
                                                            </div>

                                                            {/* Chart - Winning Bids History */}
                                                            <div className="col-span-2 h-40">
                                                                <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Histórico de Lances Vencedores (Grupo {policy.consortiumDetails.group})</p>
                                                                <ResponsiveContainer width="100%" height="100%">
                                                                    <AreaChart data={policy.consortiumDetails.assemblyHistory}>
                                                                        <defs>
                                                                            <linearGradient id="colorBid" x1="0" y1="0" x2="0" y2="1">
                                                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                                                            </linearGradient>
                                                                        </defs>
                                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                                                        <XAxis dataKey="month" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                                                                        <YAxis unit="%" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                                                                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                                                        <Area type="monotone" dataKey="winningBidPct" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorBid)" name="Lance Vencedor" />
                                                                        <Area type="monotone" dataKey="averageBidPct" stroke="#94a3b8" strokeDasharray="5 5" fill="none" name="Média Grupo" />
                                                                    </AreaChart>
                                                                </ResponsiveContainer>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* 2. FINANCIAL EXTRACT */}
                                                <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3" /> Extrato Financeiro da Apólice
                                                </h6>
                                                {policy.installments && (
                                                    <table className="w-full text-left">
                                                        <thead>
                                                            <tr className="border-b border-gray-200">
                                                                <th className="pb-2 text-xs font-bold text-gray-500">Parcela</th>
                                                                <th className="pb-2 text-xs font-bold text-gray-500">Vencimento</th>
                                                                <th className="pb-2 text-xs font-bold text-gray-500">Valor Prêmo</th>
                                                                <th className="pb-2 text-xs font-bold text-gray-500">Status Pgto</th>
                                                                <th className="pb-2 text-xs font-bold text-gray-500 text-right">Sua Comissão</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200">
                                                            {policy.installments.map((inst) => (
                                                                <tr key={inst.number} className="group hover:bg-white transition-colors">
                                                                    <td className="py-2 text-xs font-medium text-gray-700">#{inst.number}</td>
                                                                    <td className="py-2 text-xs text-gray-600">{new Date(inst.dueDate).toLocaleDateString('pt-BR')}</td>
                                                                    <td className="py-2 text-xs text-gray-600">R$ {inst.total.toLocaleString()}</td>
                                                                    <td className="py-2">
                                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                                            inst.status === 'paid' ? 'bg-green-100 text-green-700' : 
                                                                            inst.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                                        }`}>
                                                                            {inst.status === 'paid' ? 'Baixado' : inst.status === 'open' ? 'Aberto' : 'Atrasado'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-2 text-right">
                                                                        <span className={`text-xs font-bold ${inst.commissionStatus === 'received' ? 'text-green-600' : 'text-gray-400'}`}>
                                                                            R$ {inst.commissionValue.toLocaleString()}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                )}
                                                <div className="mt-3 flex justify-end gap-2">
                                                    <button className="text-xs text-primary font-bold hover:underline">Ver Documentos</button>
                                                    <button className="text-xs text-primary font-bold hover:underline">Baixar Boleto</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* TIMELINE TAB */}
                        {activeTab === 'timeline' && (
                            <div className="space-y-6 animate-in slide-in-from-bottom-4 relative pl-2">
                                {/* Vertical Line */}
                                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                                {MOCK_TIMELINE.map((event) => (
                                    <div key={event.id} className="relative flex gap-4 group">
                                        {/* Icon Node */}
                                        <div className={`relative z-10 w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center shrink-0 ${event.iconBg} ${event.iconColor}`}>
                                            {renderTimelineIcon(event.type)}
                                        </div>
                                        
                                        {/* Content Card */}
                                        <div className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-sm text-gray-800">{event.title}</h4>
                                                <span className="text-[10px] text-gray-400 font-medium">{event.date}</span>
                                            </div>
                                            <p className="text-xs text-gray-600">{event.description}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="relative flex gap-4">
                                     <div className="relative z-10 w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center shrink-0 text-gray-400 text-xs font-bold">
                                         Início
                                     </div>
                                </div>
                            </div>
                        )}

                        {/* FAMILY TAB */}
                        {activeTab === 'family' && (
                            <div className="space-y-4 animate-in slide-in-from-bottom-4">
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 mb-6">
                                    <div className="p-2 bg-blue-100 rounded-lg h-fit">
                                        <Target className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-blue-800">Mapa de Oportunidades Familiar</h4>
                                        <p className="text-xs text-blue-700 mt-1">
                                            A IA identificou <strong>2 oportunidades de cross-sell</strong> na rede familiar deste cliente.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Add Button */}
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-primary/50 hover:bg-blue-50/50 transition-all group">
                                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-gray-400">
                                            <Plus className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm font-bold text-gray-500 mt-2 group-hover:text-primary">Adicionar Familiar</p>
                                    </div>

                                    {MOCK_FAMILY.map(member => (
                                        <div key={member.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm relative overflow-hidden group hover:border-primary/30">
                                            {member.opportunity && (
                                                <div className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                                    Oportunidade {member.opportunityScore}%
                                                </div>
                                            )}
                                            
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-sm">{member.name}</h4>
                                                    <p className="text-xs text-gray-500">{member.relation} • {member.age} anos</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {member.products.length > 0 ? member.products.map((prod, idx) => (
                                                    <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium border border-gray-200">
                                                        {prod}
                                                    </span>
                                                )) : (
                                                    <span className="text-[10px] text-gray-400 italic">Sem produtos ativos</span>
                                                )}
                                            </div>

                                            {member.opportunity && (
                                                <div className="mt-3 pt-3 border-t border-gray-50">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Sugerido por IA:</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                                                            {getProductIcon(member.opportunity)} {member.opportunity}
                                                        </span>
                                                        <button className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg font-medium hover:bg-slate-800 transition-colors">
                                                            Cotar Agora
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                     <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-300" />
                     </div>
                     <h3 className="text-gray-800 font-bold text-lg mb-2">Selecione um Cliente</h3>
                     <p className="text-sm text-center max-w-xs">Acesse a visão unificada (apólices + financeiro) na lista ao lado.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
)

export default ClientWallet;
