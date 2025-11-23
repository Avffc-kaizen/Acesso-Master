
import React, { useState } from 'react';
import { Conversation, Policy } from '../types';
import { MessageSquare, Mail, Send, Bot, Sparkles, Check, X, Paperclip } from 'lucide-react';
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
    contextPolicyId: '1' // Linked to Porto Seguro policy in Mocks
  },
  {
    id: '2',
    channel: 'email',
    customerName: 'Empresa XYZ',
    lastMessage: 'Solicitação de endosso na apólice de frota.',
    timestamp: '09:15',
    unreadCount: 0,
    sentiment: 'urgent'
  }
];

const CommunicationHub: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(MOCK_CONVERSATIONS[0]);
  const [draft, setDraft] = useState<string>('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'agent', text: string}[]>([
    { role: 'user', text: 'Bom dia! Você tem o boleto da minha renovação Porto Seguro?' }
  ]);

  // Simulate generating AI draft when chat is selected
  const handleGenerateDraft = async () => {
    if (!selectedChat) return;
    
    setIsGeneratingDraft(true);
    
    // Simulate fetching the policy context
    const mockPolicy: Policy = {
        id: '1',
        insurer: 'Porto Seguro',
        policyNumber: '0531.10.102938',
        productName: 'Auto Premium',
        insuredName: selectedChat.customerName,
        validityStart: '2023-05-20',
        validityEnd: '2024-05-20',
        premium: 4500.00,
        status: 'Expiring',
        documents: []
    };

    const aiResponse = await generateDraftResponse(selectedChat.lastMessage, mockPolicy);
    setDraft(aiResponse);
    setIsGeneratingDraft(false);
  };

  const handleSend = () => {
    if(draft) {
        setMessages([...messages, {role: 'agent', text: draft}]);
        setDraft('');
    }
  }

  return (
    <div className="flex h-full bg-white">
      
      {/* Left: Conversation List */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-100 bg-white">
            <h2 className="font-bold text-gray-800 text-lg">Inbox Unificado</h2>
            <p className="text-xs text-gray-500">WhatsApp & E-mail</p>
        </div>
        <div className="flex-1 overflow-y-auto">
            {MOCK_CONVERSATIONS.map(chat => (
                <div 
                    key={chat.id} 
                    onClick={() => { setSelectedChat(chat); setDraft(''); }}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-white ${selectedChat?.id === chat.id ? 'bg-white border-l-4 border-l-primary' : ''}`}
                >
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm text-gray-800">{chat.customerName}</h4>
                        <span className="text-[10px] text-gray-400">{chat.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{chat.lastMessage}</p>
                    <div className="flex gap-2 mt-2">
                         <div className={`p-1 rounded text-white ${chat.channel === 'whatsapp' ? 'bg-green-500' : 'bg-blue-500'}`}>
                            {chat.channel === 'whatsapp' ? <MessageSquare className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                         </div>
                         {chat.sentiment === 'urgent' && (
                             <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] rounded-full font-bold">Urgente</span>
                         )}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Center: Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50 relative">
        {selectedChat ? (
            <>
                <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                            {selectedChat.customerName.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">{selectedChat.customerName}</h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                via {chatTypeLabel(selectedChat.channel)}
                            </p>
                        </div>
                    </div>
                    <button className="text-gray-400 hover:text-primary">
                        <Bot className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {messages.map((msg, idx) => (
                         <div key={idx} className={`flex ${msg.role === 'agent' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-sm ${
                                msg.role === 'agent' ? 'bg-secondary text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                            }`}>
                                {msg.text}
                            </div>
                         </div>
                    ))}
                </div>

                {/* Human-in-the-loop Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    {draft && (
                        <div className="mb-4 p-3 bg-purple-50 border border-purple-100 rounded-xl relative animate-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-2 text-purple-700 text-xs font-bold mb-2">
                                <Sparkles className="w-3 h-3" /> SUGESTÃO IA (RAG)
                            </div>
                            <textarea 
                                className="w-full bg-transparent text-sm text-gray-700 focus:outline-none resize-none"
                                rows={3}
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button onClick={() => setDraft('')} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded">
                                    <X className="w-4 h-4" />
                                </button>
                                <button onClick={handleSend} className="px-3 py-1 bg-purple-600 text-white text-xs rounded-lg font-bold hover:bg-purple-700 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Aprovar & Enviar
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input 
                            type="text" 
                            placeholder="Digite sua mensagem..." 
                            className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
                        />
                        {selectedChat.contextPolicyId && !draft && (
                            <button 
                                onClick={handleGenerateDraft}
                                disabled={isGeneratingDraft}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2"
                            >
                                {isGeneratingDraft ? 'Gerando...' : <><Sparkles className="w-4 h-4" /> Gerar Resposta</>}
                            </button>
                        )}
                        <button className="p-2 bg-primary text-white rounded-xl hover:bg-slate-800 transition-colors">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </>
        ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
                <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                <p>Selecione uma conversa para iniciar</p>
            </div>
        )}
      </div>

    </div>
  );
};

function chatTypeLabel(type: string) {
    return type === 'whatsapp' ? 'WhatsApp Business' : 'E-mail';
}

export default CommunicationHub;
