
import React, { useState } from 'react';
import { Conversation, Policy, ProductType, QuoteResult } from '../types';
import { MessageSquare, Mail, Send, Bot, Sparkles, Check, X, Paperclip, Smartphone, FileText, DollarSign, Clock, ChevronRight, ArrowRight } from 'lucide-react';
import { generateDraftResponse } from '../services/geminiService';

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    channel: 'whatsapp',
    customerName: 'Ricardo Oliveira',
    lastMessage: 'Bom dia! Você tem o boleto da minha renovação Porto Seguro?',
    timestamp: '10:30',
    unreadCount: 1,
    sentiment: 'neutral',
    contextPolicyId: '1' 
  },
  {
    id: '2',
    channel: 'email',
    customerName: 'Empresa XYZ',
    lastMessage: 'Solicitação de endosso na apólice de frota.',
    timestamp: '09:15',
    unreadCount: 0,
    sentiment: 'urgent'
  },
  {
    id: '3',
    channel: 'whatsapp',
    customerName: 'Mariana Santos',
    lastMessage: 'Pode me enviar a proposta ajustada?',
    timestamp: 'Ontem',
    unreadCount: 0,
    sentiment: 'positive'
  }
];

// Mock Context Data (Simulating the unified backend)
const MOCK_ACTIVE_QUOTES: Record<string, any> = {
    '3': {
        id: 'q_mariana',
        product: 'Seguro de Vida - Mulher',
        insurer: 'SulAmérica',
        premium: 145.90,
        coverage: 'R$ 500.000',
        validity: '2 dias',
        status: 'Ready'
    }
};

const MOCK_POLICIES: Record<string, any> = {
    '1': {
        product: 'Auto Premium',
        insurer: 'Porto Seguro',
        validityEnd: '20/05/2024',
        status: 'Active'
    }
};

const CommunicationHub: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(MOCK_CONVERSATIONS[0]);
  const [draft, setDraft] = useState<string>('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [showContextPanel, setShowContextPanel] = useState(true);
  const [messages, setMessages] = useState<{role: 'user' | 'agent' | 'system', text: string, attachment?: string}[]>([
    { role: 'user', text: 'Bom dia! Você tem o boleto da minha renovação Porto Seguro?' }
  ]);

  // Derived Context
  const activeQuote = selectedChat ? MOCK_ACTIVE_QUOTES[selectedChat.id] : null;
  const activePolicy = selectedChat ? MOCK_POLICIES[selectedChat.id] : null;

  const handleGenerateDraft = async () => {
    if (!selectedChat) return;
    setIsGeneratingDraft(true);
    
    // Pass unified context to AI
    const mockPolicy: Policy = {
        id: '1', insurer: 'Porto Seguro', policyNumber: '0531.10.102938', productName: 'Auto Premium',
        insuredName: selectedChat.customerName, validityStart: '2023-05-20', validityEnd: '2024-05-20',
        premium: 4500.00, status: 'Expiring', documents: []
    };
    
    let contextPrompt = selectedChat.lastMessage;
    if(activeQuote) {
        contextPrompt += ` [CONTEXTO: Existe uma cotação ativa de ${activeQuote.product} na ${activeQuote.insurer} valor R$ ${activeQuote.premium}. O cliente está quente.]`;
    }

    const aiResponse = await generateDraftResponse(contextPrompt, mockPolicy);
    setDraft(aiResponse);
    setIsGeneratingDraft(false);
  };

  const handleSend = () => {
    if(draft) {
        setMessages([...messages, {role: 'agent', text: draft}]);
        setDraft('');
    }
  };

  const handleAttachQuote = () => {
      if(activeQuote) {
          setMessages([...messages, {
              role: 'system', 
              text: `Proposta PDF: ${activeQuote.product} - ${activeQuote.insurer}`,
              attachment: 'proposal.pdf'
          }]);
      }
  };

  return (
    <div className="flex h-full bg-white overflow-hidden">
      
      {/* Left: Conversation List */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50 shrink-0">
        <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center h-16">
            <div>
                <h2 className="font-bold text-gray-800 text-lg">Mensagens</h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Omnichannel</p>
            </div>
            <div className="flex gap-1">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="WhatsApp Online"></div>
                 <div className="w-2 h-2 rounded-full bg-blue-500" title="Email Online"></div>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto">
            {MOCK_CONVERSATIONS.map(chat => (
                <div 
                    key={chat.id} 
                    onClick={() => { setSelectedChat(chat); setDraft(''); setMessages([{ role: 'user', text: chat.lastMessage }]); }}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-white group ${selectedChat?.id === chat.id ? 'bg-white border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                >
                    <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-bold text-sm ${selectedChat?.id === chat.id ? 'text-primary' : 'text-gray-800'}`}>{chat.customerName}</h4>
                        <span className="text-[10px] text-gray-400">{chat.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 group-hover:text-gray-700 transition-colors">{chat.lastMessage}</p>
                    
                    <div className="flex justify-between items-center mt-2">
                         <div className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 text-white ${chat.channel === 'whatsapp' ? 'bg-green-500' : 'bg-blue-500'}`}>
                            {chat.channel === 'whatsapp' ? <Smartphone className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                            {chat.channel === 'whatsapp' ? 'WhatsApp' : 'Email'}
                         </div>
                         {MOCK_ACTIVE_QUOTES[chat.id] && (
                             <span className="text-[10px] font-bold text-accent flex items-center gap-1">
                                 <DollarSign className="w-3 h-3" /> Negociação
                             </span>
                         )}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Center: Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50 relative min-w-0">
        {selectedChat ? (
            <>
                {/* Chat Header */}
                <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm z-10 h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-slate-700 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                            {selectedChat.customerName.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 leading-tight">{selectedChat.customerName}</h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                {selectedChat.channel === 'whatsapp' ? 'Via WhatsApp Business' : 'Via E-mail Corporativo'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowContextPanel(!showContextPanel)}
                        className={`p-2 rounded-lg transition-colors ${showContextPanel ? 'bg-gray-100 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <FileText className="w-5 h-5" />
                    </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    {messages.map((msg, idx) => (
                         <div key={idx} className={`flex ${msg.role === 'agent' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'}`}>
                            
                            {msg.role === 'system' ? (
                                <div className="bg-gray-100 text-gray-600 text-xs py-1 px-4 rounded-full flex items-center gap-2 border border-gray-200">
                                    {msg.attachment && <Paperclip className="w-3 h-3" />}
                                    {msg.text}
                                </div>
                            ) : (
                                <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-sm ${
                                    msg.role === 'agent' ? 'bg-secondary text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            )}
                         </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    {draft && (
                        <div className="mb-4 p-4 bg-purple-50 border border-purple-100 rounded-xl relative animate-in slide-in-from-bottom-2 shadow-sm">
                            <div className="flex items-center gap-2 text-purple-700 text-xs font-bold mb-2">
                                <Sparkles className="w-3 h-3" /> Sugestão Inteligente (IA Mestre)
                            </div>
                            <textarea 
                                className="w-full bg-transparent text-sm text-gray-700 focus:outline-none resize-none leading-relaxed"
                                rows={3}
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button onClick={() => setDraft('')} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                                <button onClick={handleSend} className="px-4 py-1.5 bg-purple-600 text-white text-xs rounded-lg font-bold hover:bg-purple-700 flex items-center gap-2 shadow-lg shadow-purple-200 transition-all transform hover:scale-105">
                                    <Check className="w-3 h-3" /> Aprovar & Enviar
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 items-end">
                        <div className="flex-1 bg-gray-100 rounded-xl flex items-center px-2 border border-transparent focus-within:border-secondary/30 focus-within:bg-white transition-all">
                            <button 
                                onClick={handleAttachQuote}
                                disabled={!activeQuote}
                                className="p-2 text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Anexar Proposta Ativa"
                            >
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <input 
                                type="text" 
                                placeholder="Digite sua mensagem..." 
                                value={draft && !isGeneratingDraft ? '' : undefined} // Clear if draft is active elsewhere? No, simplistic approach
                                className="flex-1 bg-transparent py-3 px-2 text-sm focus:outline-none"
                            />
                        </div>
                        <button 
                            onClick={handleGenerateDraft}
                            disabled={isGeneratingDraft}
                            className="p-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors"
                            title="Gerar resposta com IA"
                        >
                            <Sparkles className={`w-5 h-5 ${isGeneratingDraft ? 'animate-spin' : ''}`} />
                        </button>
                        <button onClick={() => setMessages([...messages, {role: 'agent', text: 'Ok'}])} className="p-3 bg-primary text-white rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-primary/20">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </>
        ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 flex-col bg-gray-50/50">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-10 h-10 text-gray-300" />
                </div>
                <p className="font-medium">Selecione uma conversa para iniciar o atendimento.</p>
            </div>
        )}
      </div>

      {/* Right: Context Panel (The "Unified" Part) */}
      {selectedChat && showContextPanel && (
        <div className="w-72 bg-white border-l border-gray-100 flex flex-col shrink-0 animate-in slide-in-from-right-10">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> Contexto do Cliente
                </h3>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-6">
                
                {/* Active Quote Card */}
                {activeQuote ? (
                    <div className="bg-white rounded-xl border border-accent/30 shadow-sm overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 rounded-bl-full -mr-8 -mt-8 z-0"></div>
                        <div className="p-4 relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                                <span className="text-xs font-bold text-accent uppercase tracking-wider">Cotação Ativa</span>
                            </div>
                            <h4 className="font-bold text-gray-800 text-sm">{activeQuote.product}</h4>
                            <p className="text-xs text-gray-500 mb-3">{activeQuote.insurer}</p>
                            
                            <div className="flex justify-between items-end mb-3">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Valor Mensal</p>
                                    <p className="text-lg font-bold text-gray-900">R$ {activeQuote.premium.toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Validade</p>
                                    <p className="text-xs font-bold text-red-500">{activeQuote.validity}</p>
                                </div>
                            </div>

                            <button 
                                onClick={handleAttachQuote}
                                className="w-full py-2 bg-accent text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Paperclip className="w-3 h-3" /> Anexar PDF
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
                        <p className="text-xs text-gray-400">Nenhuma cotação em andamento.</p>
                        <button className="mt-2 text-xs text-primary font-bold hover:underline">
                            Iniciar Novo Cálculo
                        </button>
                    </div>
                )}

                {/* Active Policy Summary */}
                {activePolicy && (
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                            <Check className="w-3 h-3" /> Apólice Vigente
                        </h4>
                        <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-xs text-gray-800">{activePolicy.product}</p>
                                    <p className="text-[10px] text-gray-500">{activePolicy.insurer}</p>
                                </div>
                                <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Ativa</span>
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-50 flex justify-between text-[10px] text-gray-500">
                                <span>Vence em:</span>
                                <span className="font-medium text-gray-700">{activePolicy.validityEnd}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Ações Rápidas</h4>
                    <div className="space-y-2">
                        <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-700 transition-colors flex items-center justify-between group">
                            Enviar 2ª Via Boleto <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                        </button>
                        <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-700 transition-colors flex items-center justify-between group">
                            Agendar Ligação <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                        </button>
                        <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-700 transition-colors flex items-center justify-between group">
                            Ver Perfil Completo <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationHub;
