
import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, ProductType, KanbanColumn, QuoteResult } from '../types';
import { Search, Filter, Sparkles, Phone, Mail, ArrowRight, Wallet, Clock, Shield, Target, GripVertical, AlertCircle, CheckCircle2, Tag, Play, RefreshCw, Zap } from 'lucide-react';
import ProposalManager from './ProposalManager';
import { simulateWebhookArrival } from '../services/integrationService';

const ALL_MOCK_LEADS: Lead[] = [
  // WON / CLOSED
  {
    id: '1', name: 'Ricardo Oliveira', email: 'ricardo.o@email.com', phone: '(11) 98765-4321',
    status: LeadStatus.WON, interest: ProductType.CONSORTIUM, value: 250000, score: 98,
    lastInteraction: '2 horas atrás', contemplated: true, crossSellOpportunity: ProductType.INSURANCE_HOME,
    notes: 'Cliente contemplado na assembleia de ontem. Prioridade máxima.', routingReason: 'Carteira Vinculada',
    tags: ['Renovação', 'Corretor: Carlos']
  },
  // PROPOSALS
  {
    id: '2', name: 'Mariana Santos', email: 'mari.santos@email.com', phone: '(21) 99999-8888',
    status: LeadStatus.PROPOSAL, interest: ProductType.INSURANCE_LIFE, value: 1500, score: 75,
    lastInteraction: '1 dia atrás', contemplated: false,
    notes: 'Cliente recém casada, focada em proteção familiar.', routingReason: 'Especialista em Vida',
    tags: ['Produto: Vida', 'Novo']
  },
  {
    id: '4', name: 'Carlos Ferreira', email: 'carlos.f@email.com', phone: '(41) 98877-6655',
    status: LeadStatus.PROPOSAL, interest: ProductType.INSURANCE_AUTO, value: 3500, score: 80,
    lastInteraction: '30 mins atrás', contemplated: false,
    notes: 'Aguardando vistoria.', routingReason: 'Geolocalização (PR)',
    tags: ['Produto: Auto', 'Corretor: Ana'],
    vehicleModel: 'Jeep Compass Longitude' // Added for quoting
  },
  // NEW / PROSPECTING
  {
    id: '3', name: 'Roberto Carlos', email: 'rc@email.com', phone: '(31) 98888-7777',
    status: LeadStatus.NEW, interest: ProductType.CONSORTIUM, value: 450000, score: 88,
    lastInteraction: 'Recém chegado', contemplated: false,
    notes: 'Lead distribuído via algoritmo (Geo: SP).', routingReason: 'Round-Robin',
    tags: ['Produto: Consórcio']
  },
];

const KANBAN_COLUMNS: KanbanColumn[] = [
    { id: LeadStatus.NEW, title: 'Prospecção', color: 'border-blue-500' },
    { id: LeadStatus.CONTACTED, title: 'Qualificação', color: 'border-yellow-500' },
    { id: LeadStatus.PROPOSAL, title: 'Proposta', color: 'border-purple-500' },
    { id: LeadStatus.WON, title: 'Fechamento', color: 'border-green-500' }
];

const FILTER_TAGS = [
    { id: 'Renovação', label: 'Renovação', color: 'bg-purple-100 text-purple-700' },
    { id: 'Produto: Auto', label: 'Prod: Auto', color: 'bg-blue-100 text-blue-700' },
    { id: 'Produto: Vida', label: 'Prod: Vida', color: 'bg-green-100 text-green-700' },
    { id: 'Produto: Consórcio', label: 'Prod: Consórcio', color: 'bg-orange-100 text-orange-700' },
    { id: 'Origem: Web', label: 'Origem: Web', color: 'bg-indigo-100 text-indigo-700' },
];

interface LeadCenterProps {
    mode: 'quotes' | 'proposals' | 'prospecting';
}

const LeadCenter: React.FC<LeadCenterProps> = ({ mode }) => {
  const [leads, setLeads] = useState<Lead[]>(ALL_MOCK_LEADS);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // State for Quoting Modal
  const [isQuoting, setIsQuoting] = useState(false);
  const [quotingLead, setQuotingLead] = useState<Lead | null>(null);

  // Filter Logic
  const toggleTag = (tagId: string) => {
      if (activeTags.includes(tagId)) {
          setActiveTags(activeTags.filter(t => t !== tagId));
      } else {
          setActiveTags([...activeTags, tagId]);
      }
  };

  const filteredLeads = leads.filter(lead => {
      if (activeTags.length === 0) return true;
      return activeTags.some(tag => lead.tags?.includes(tag));
  });

  // Kanban Logic
  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
      setDraggedLead(lead);
      e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: LeadStatus) => {
      e.preventDefault();
      if (draggedLead && draggedLead.status !== targetStatus) {
          const updatedLeads = leads.map(l => 
              l.id === draggedLead.id ? { ...l, status: targetStatus } : l
          );
          setLeads(updatedLeads);
      }
      setDraggedLead(null);
  };

  const getLeadsByStatus = (status: LeadStatus) => {
      return filteredLeads.filter(l => l.status === status);
  };

  const startQuote = (lead: Lead, e: React.MouseEvent) => {
      e.stopPropagation();
      setQuotingLead(lead);
      setIsQuoting(true);
  };

  const handleProposalSuccess = (quote: QuoteResult) => {
      if (quotingLead) {
          // Update lead status to WON
          setLeads(prev => prev.map(l => 
              l.id === quotingLead.id ? { ...l, status: LeadStatus.WON, notes: `${l.notes || ''} [Venda: ${quote.insurerName}]` } : l
          ));
      }
  };

  // Webhook Simulation
  const handleSyncExternal = async () => {
      setIsSyncing(true);
      const newWebLead = await simulateWebhookArrival();
      
      // Delay for UI effect
      setTimeout(() => {
          setLeads(prev => [newWebLead, ...prev]);
          setIsSyncing(false);
          // Auto select filter to show it
          if(!activeTags.includes('Origem: Web')) setActiveTags([...activeTags, 'Origem: Web']);
      }, 1500);
  };

  if (isQuoting && quotingLead) {
      return (
          <ProposalManager 
            lead={quotingLead} 
            onBack={() => setIsQuoting(false)} 
            onSuccess={handleProposalSuccess}
            initialQuotes={quotingLead.preCalculatedQuotes} // Pass pre-calculated if available
          />
      );
  }

  return (
    <div className="p-6 space-y-6 h-full flex flex-col bg-gray-50/50">
      
      {/* Header & Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Portal de Vendas (CRM)</h2>
                <p className="text-gray-500 text-sm">Integrado com Sistemas de Vida e Consórcio.</p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={handleSyncExternal}
                    disabled={isSyncing}
                    className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-70"
                >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> 
                    {isSyncing ? 'Buscando Formulários...' : 'Sincronizar Web'}
                </button>
                <button className="bg-primary hover:bg-slate-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-primary/20">
                    <Sparkles className="w-4 h-4 text-accent" /> Novo Lead
                </button>
            </div>
        </div>

        {/* Tag Filter Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 mr-2">
                <Filter className="w-4 h-4" /> Filtros:
            </div>
            {FILTER_TAGS.map(tag => (
                <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                        activeTags.includes(tag.id) 
                        ? tag.color + ' ring-2 ring-offset-1 ring-gray-200' 
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    {tag.label}
                </button>
            ))}
            {activeTags.length > 0 && (
                <button onClick={() => setActiveTags([])} className="text-xs text-red-500 font-bold hover:underline ml-2">
                    Limpar
                </button>
            )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-4 h-full min-w-[1000px]">
            {KANBAN_COLUMNS.map(column => (
                <div 
                    key={column.id}
                    className="flex-1 flex flex-col min-w-[280px] h-full"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column.id)}
                >
                    {/* Column Header */}
                    <div className={`bg-white p-3 rounded-t-xl border-b-4 ${column.color} shadow-sm mb-2 flex justify-between items-center`}>
                        <h3 className="font-bold text-gray-700 text-sm">{column.title}</h3>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold">
                            {getLeadsByStatus(column.id).length}
                        </span>
                    </div>

                    {/* Drop Zone */}
                    <div className="flex-1 bg-gray-100/50 rounded-xl p-2 space-y-3 overflow-y-auto border border-dashed border-gray-200 hover:border-blue-300 transition-colors custom-scrollbar">
                        {getLeadsByStatus(column.id).map(lead => (
                            <div
                                key={lead.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, lead)}
                                onClick={() => setSelectedLead(lead)}
                                className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-move hover:shadow-md transition-all group relative ${selectedLead?.id === lead.id ? 'ring-2 ring-primary' : ''}`}
                            >
                                {/* Ready to Propose Badge (Integration) */}
                                {lead.readyToPropose && (
                                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-accent to-emerald-400 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1 z-10 animate-pulse">
                                        <Zap className="w-3 h-3 fill-current" /> 3 Cotações Prontas
                                    </div>
                                )}

                                {/* Tags Display */}
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {lead.tags?.map((tag, idx) => (
                                        <span key={idx} className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${tag.includes('Web') ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Main Info */}
                                <h4 className="font-bold text-gray-800 text-sm mb-1">{lead.name}</h4>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs text-gray-500">{lead.interest}</span>
                                    <span className="text-sm font-bold text-gray-900">R$ {lead.value.toLocaleString()}</span>
                                </div>

                                {/* Actions (Hover) */}
                                <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center">
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                        <Clock className="w-3 h-3" /> {lead.lastInteraction}
                                    </div>
                                    <button 
                                        onClick={(e) => startQuote(lead, e)}
                                        className={`p-1.5 rounded-lg transition-all shadow-sm flex items-center gap-1 text-xs font-bold ${
                                            lead.readyToPropose 
                                            ? 'bg-accent text-white hover:bg-emerald-600 w-full justify-center ml-2' 
                                            : 'bg-primary text-white opacity-0 group-hover:opacity-100 hover:bg-slate-700 hover:scale-110'
                                        }`}
                                        title={lead.readyToPropose ? "Ver Cotações Prontas" : "Gerar Cotação Real"}
                                    >
                                        {lead.readyToPropose ? (
                                            <>Ver Propostas <ArrowRight className="w-3 h-3" /></>
                                        ) : (
                                            <Play className="w-3 h-3 fill-current" />
                                        )}
                                    </button>
                                </div>

                                {/* Propensity Score (if not hovered) */}
                                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-2 group-hover:hidden">
                                    <div 
                                        className={`h-full rounded-full ${lead.score > 80 ? 'bg-accent' : lead.score > 50 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                                        style={{ width: `${lead.score}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LeadCenter;
