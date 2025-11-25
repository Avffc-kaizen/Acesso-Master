import React, { useState, useEffect } from 'react';
import { Lead, QuoteRequest, QuoteResult, ProductType, CoverageItem } from '../types';
import { triggerMultiCalculation } from '../services/quoteEngine';
import { ArrowLeft, CheckCircle2, Download, Edit2, Play, Printer, RefreshCw, Save, Send, Share2, Shield, AlertTriangle, Link, Zap, MessageSquare, Mail, Copy, FileText, Paperclip, BrainCircuit } from 'lucide-react';

interface ProposalManagerProps {
    lead: Lead;
    onBack: () => void;
    onSuccess?: (quote: QuoteResult) => void;
    initialQuotes?: QuoteResult[]; // Allow passing pre-calculated quotes
}

const ProposalManager: React.FC<ProposalManagerProps> = ({ lead, onBack, onSuccess, initialQuotes }) => {
    // If we have initial quotes, start at 'presentation' (Ready to Send)
    const [step, setStep] = useState<'input' | 'comparing' | 'presentation' | 'editing' | 'issued'>(
        initialQuotes ? 'presentation' : 'input'
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false); 
    const [quotes, setQuotes] = useState<QuoteResult[]>(initialQuotes || []);
    const [selectedQuote, setSelectedQuote] = useState<QuoteResult | null>(null);
    const [messageDraft, setMessageDraft] = useState(lead.aiDraftMessage || '');
    
    // Form States
    const [formData, setFormData] = useState<QuoteRequest>({
        leadId: lead.id,
        productType: lead.interest,
        clientData: {
            name: lead.name,
            age: 35, // Default for demo
            cpf: lead.cpf || '',
            zipCode: '01000-000'
        },
        itemData: {
            model: lead.vehicleModel || 'Onix Plus 1.0 Turbo',
            fipeValue: 85000,
            lives: 1,
            creditValue: lead.value
        }
    });

    const handleCalculate = async () => {
        setIsLoading(true);
        setStep('comparing');
        // Simulate API call to Engine
        const results = await triggerMultiCalculation(formData);
        setQuotes(results);
        setIsLoading(false);
    };

    const handleSelectForEdit = (quote: QuoteResult) => {
        setSelectedQuote(quote);
        setStep('editing');
    };

    const handleUpdateCoverage = async (coverageName: string, newValue: number) => {
        if (!selectedQuote) return;
        
        setIsSyncing(true); // Show visual sync
        
        // Optimistic UI update
        const updatedCoverages = selectedQuote.coverages.map(c => 
            c.name === coverageName ? { ...c, value: newValue } : c
        );
        
        setSelectedQuote({ ...selectedQuote, coverages: updatedCoverages, status: 'calculating' });

        // Simulate re-calc delay with insurer API
        setTimeout(() => {
            const factor = newValue > (selectedQuote.coverages.find(c => c.name === coverageName)?.value || 0) ? 1.05 : 0.95;
            const newPremium = selectedQuote.totalPremium * factor;
            
            setSelectedQuote(prev => prev ? ({
                ...prev,
                coverages: updatedCoverages,
                totalPremium: newPremium,
                installments: prev.installments.map(i => ({ ...i, value: i.value * factor })),
                status: 'success'
            }) : null);
            setIsSyncing(false);
        }, 1500);
    };

    const handleIssue = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep('issued');
            if (selectedQuote && onSuccess) {
                onSuccess(selectedQuote);
            }
        }, 2000);
    };

    const handleSendCommunication = (type: 'whatsapp' | 'email') => {
        alert(`Simulação: Enviando ${type === 'whatsapp' ? 'WhatsApp' : 'E-mail'} para ${lead.name} com 3 PDFs anexados.`);
        // Here you would hook into the real backend API
    };

    // --- RENDER HELPERS ---

    const renderInputForm = () => (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white">
                    <Shield className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Novo Cálculo Multi-Seguradora</h2>
                    <p className="text-gray-500">Dados serão replicados automaticamente nos portais.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-800 border-l-4 border-primary pl-3">Dados do Segurado</h3>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
                        <input 
                            type="text" 
                            value={formData.clientData.name} 
                            onChange={e => setFormData({...formData, clientData: {...formData.clientData, name: e.target.value}})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm" 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CPF</label>
                             <input 
                                type="text" 
                                value={formData.clientData.cpf} 
                                onChange={e => setFormData({...formData, clientData: {...formData.clientData, cpf: e.target.value}})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm" 
                                placeholder="000.000.000-00"
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Idade</label>
                             <input 
                                type="number" 
                                value={formData.clientData.age} 
                                onChange={e => setFormData({...formData, clientData: {...formData.clientData, age: parseInt(e.target.value)}})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm" 
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-gray-800 border-l-4 border-accent pl-3">Dados do Risco ({lead.interest})</h3>
                    {lead.interest === ProductType.INSURANCE_AUTO && (
                        <>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Modelo Veículo (FIPE)</label>
                                <input 
                                    type="text" 
                                    value={formData.itemData.model} 
                                    onChange={e => setFormData({...formData, itemData: {...formData.itemData, model: e.target.value}})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor FIPE (R$)</label>
                                <input 
                                    type="number" 
                                    value={formData.itemData.fipeValue} 
                                    onChange={e => setFormData({...formData, itemData: {...formData.itemData, fipeValue: parseInt(e.target.value)}})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm" 
                                />
                            </div>
                        </>
                    )}
                    {(lead.interest === ProductType.INSURANCE_LIFE || lead.interest === ProductType.INSURANCE_HEALTH) && (
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{lead.interest === ProductType.INSURANCE_HEALTH ? 'Vidas' : 'Profissão'}</label>
                            <input 
                                type="text" 
                                value={lead.interest === ProductType.INSURANCE_HEALTH ? formData.itemData.lives : 'Empresário'} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm" 
                            />
                        </div>
                    )}
                     {lead.interest === ProductType.CONSORTIUM && (
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor Carta de Crédito (R$)</label>
                            <input 
                                type="number" 
                                value={formData.itemData.creditValue} 
                                onChange={e => setFormData({...formData, itemData: {...formData.itemData, creditValue: parseInt(e.target.value)}})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm" 
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
                <button onClick={onBack} className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                    Cancelar
                </button>
                <button 
                    onClick={handleCalculate}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <Play className="w-5 h-5" /> Calcular em 5 Seguradoras
                </button>
            </div>
        </div>
    );

    const QuoteCard = ({ quote, mini = false }: { quote: QuoteResult, mini?: boolean }) => (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col relative group hover:border-primary transition-all hover:shadow-lg ${mini ? 'scale-95' : ''}`}>
            {quote.score >= 8 && (
                <div className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">
                    RECOMENDADA
                </div>
            )}
            
            <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex flex-col items-center text-center relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg font-bold text-gray-600 shadow-sm mb-2">
                    {quote.insurerLogo}
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{quote.insurerName}</h3>
                <p className="text-xs text-gray-500">{quote.productName}</p>
                {/* PDF Icon Badge */}
                <div className="absolute top-2 left-2 bg-red-50 text-red-600 p-1 rounded flex items-center gap-1 border border-red-100">
                    <FileText className="w-3 h-3" /> <span className="text-[9px] font-bold">PDF</span>
                </div>
            </div>

            <div className="p-4 text-center">
                 <p className="text-xs text-gray-400 uppercase font-bold mb-1">
                    {lead.interest === ProductType.CONSORTIUM ? 'Parcela' : 'Prêmio Total'}
                 </p>
                 <p className="text-2xl font-bold text-primary">R$ {quote.totalPremium.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
            </div>

            {!mini && (
                <div className="px-4 pb-2 space-y-2 flex-1">
                     {quote.coverages.slice(0,3).map((cov, idx) => (
                         <div key={idx} className="flex justify-between text-xs border-b border-gray-50 last:border-0 py-1">
                             <span className="text-gray-500 truncate">{cov.name}</span>
                             <span className="font-bold text-gray-700">
                                 {cov.description === 'R$' ? `R$ ${cov.value.toLocaleString()}` : cov.description === '%' ? `${cov.value}%` : cov.value}
                             </span>
                         </div>
                     ))}
                </div>
            )}
        </div>
    );

    const renderPresentationMode = () => (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
             {/* Header */}
             <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h2 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                            <Zap className="w-5 h-5 text-accent" /> Apresentação Inteligente
                        </h2>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            {lead.name} <span className="text-gray-300">|</span> 3 Melhores Opções Selecionadas
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                     <button onClick={() => setStep('comparing')} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50">
                        Ver Comparativo Técnico
                     </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden bg-gray-50">
                
                {/* Left: The 3 Quotes */}
                <div className="w-7/12 p-6 overflow-y-auto">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" /> Opções Geradas (Arquivos PDF)
                    </h3>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {quotes.map((quote) => (
                             <div key={quote.id} className="cursor-pointer hover:ring-2 ring-primary ring-offset-2 rounded-2xl transition-all" onClick={() => handleSelectForEdit(quote)}>
                                <QuoteCard quote={quote} />
                             </div>
                        ))}
                    </div>
                </div>

                {/* Right: The Communication Draft */}
                <div className="w-5/12 bg-white border-l border-gray-200 p-6 flex flex-col shadow-xl">
                    
                    {/* Strategy Banner */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 p-5 rounded-xl mb-4 shadow-sm relative overflow-hidden">
                        <BrainCircuit className="absolute -right-4 -top-4 w-20 h-20 text-purple-100" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-purple-700 font-bold mb-2 text-sm">
                                <Zap className="w-4 h-4" /> Estratégia de Venda Definida
                            </div>
                            <div className="flex gap-2 mb-3">
                                <span className="text-[10px] bg-white text-purple-600 px-2 py-1 rounded border border-purple-100 font-bold">Foco: Custo-Benefício</span>
                                <span className="text-[10px] bg-white text-purple-600 px-2 py-1 rounded border border-purple-100 font-bold">Alta Conversão</span>
                            </div>
                            <p className="text-xs text-purple-800 leading-relaxed">
                                Selecionei a opção da <strong>{quotes[0]?.insurerName}</strong> como âncora. O script abaixo já direciona o cliente para o fechamento.
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                             <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-green-600" /> Mensagem Pronta (WhatsApp)
                             </label>
                        </div>
                        
                        {/* Attachments Chips */}
                        <div className="flex flex-wrap gap-2">
                            {quotes.map((q, i) => (
                                <span key={q.id} className="bg-red-50 text-red-600 border border-red-100 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 max-w-[150px] truncate">
                                    <FileText className="w-3 h-3 shrink-0" /> {q.insurerName}_Prop_{i+1}.pdf
                                </span>
                            ))}
                        </div>
                        
                        <div className="relative flex-1">
                            <textarea 
                                className="w-full h-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 focus:ring-2 focus:ring-primary/20 outline-none resize-none leading-relaxed"
                                value={messageDraft}
                                onChange={(e) => setMessageDraft(e.target.value)}
                            />
                            <button className="absolute bottom-4 right-4 text-xs text-primary font-bold hover:underline bg-white/80 px-2 py-1 rounded shadow-sm flex items-center gap-1">
                                <RefreshCw className="w-3 h-3" /> Regenerar Texto
                            </button>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-gray-100">
                            <button 
                                onClick={() => handleSendCommunication('whatsapp')}
                                className="w-full py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                            >
                                <Send className="w-5 h-5" /> Enviar WhatsApp com 3 PDFs
                            </button>
                            <button 
                                onClick={() => handleSendCommunication('email')}
                                className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <Mail className="w-4 h-4" /> Enviar por E-mail
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderComparison = () => (
        <div className="space-y-6 animate-in slide-in-from-right-8 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        Comparativo Técnico
                    </h2>
                    <p className="text-sm text-gray-500">
                        Detalhes das coberturas para {lead.name}
                    </p>
                </div>
                {initialQuotes && (
                    <button onClick={() => setStep('presentation')} className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Voltar para Apresentação
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {quotes.map((quote) => (
                    <div key={quote.id} className="relative">
                        <QuoteCard quote={quote} />
                        <div className="mt-2 flex gap-2">
                            <button 
                                onClick={() => handleSelectForEdit(quote)}
                                className="flex-1 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-slate-800 flex items-center justify-center gap-1 shadow-sm"
                            >
                                <Edit2 className="w-3 h-3" /> Editar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderEditing = () => (
        <div className="flex flex-col h-full animate-in zoom-in-95 duration-300 relative">
            
            {/* Sync Overlay */}
            {isSyncing && (
                <div className="absolute inset-0 bg-white/50 z-20 flex items-center justify-center backdrop-blur-[1px]">
                     <div className="bg-white shadow-xl rounded-full px-6 py-3 flex items-center gap-3 border border-gray-100">
                         <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                         <span className="text-sm font-bold text-gray-700">Recalculando no Portal {selectedQuote?.insurerName}...</span>
                     </div>
                </div>
            )}

            {/* Toolbar */}
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setStep(initialQuotes ? 'presentation' : 'comparing')} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h2 className="font-bold text-gray-800 flex items-center gap-2">
                            Editando Proposta: {selectedQuote?.proposalNumber}
                        </h2>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Link className="w-3 h-3" />
                            Conectado API: {selectedQuote?.insurerName}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50">
                        <Printer className="w-4 h-4" /> Visualizar PDF
                    </button>
                    <button 
                        onClick={handleIssue}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-700 shadow-lg shadow-green-600/20"
                    >
                        <CheckCircle2 className="w-4 h-4" /> Aprovar & Emitir
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Editor Panel */}
                <div className="w-2/3 p-8 overflow-y-auto bg-gray-50">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" /> Coberturas e Garantias
                        </h3>
                        <div className="space-y-4">
                            {selectedQuote?.coverages.map((cov, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                                    <div>
                                        <p className="font-bold text-sm text-gray-700">{cov.name}</p>
                                        <p className="text-xs text-gray-400">{cov.type === 'basic' ? 'Cobertura Básica' : 'Adicional'}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {cov.editable ? (
                                            <>
                                                <input 
                                                    type="range" 
                                                    min={0} 
                                                    max={cov.value * 2 || 100} 
                                                    value={cov.value} 
                                                    onChange={(e) => handleUpdateCoverage(cov.name, parseInt(e.target.value))}
                                                    className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                                />
                                                <div className="w-24 text-right">
                                                     <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded text-sm">
                                                        {cov.description === 'R$' ? '' : cov.value}
                                                        {cov.description === 'R$' ? cov.value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : cov.description}
                                                     </span>
                                                </div>
                                            </>
                                        ) : (
                                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">Fixo</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Live Preview Panel */}
                <div className="w-1/3 bg-white border-l border-gray-200 p-6 flex flex-col shadow-xl z-10">
                    <h3 className="font-bold text-gray-400 uppercase text-xs mb-6 tracking-wider">Resumo Financeiro</h3>
                    
                    <div className="flex-1">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-gray-600">Prêmio Líquido</span>
                            <span className="font-bold">R$ {(selectedQuote?.totalPremium || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                        </div>
                         <div className="flex justify-between items-end mb-6 text-xs text-gray-400">
                            <span>IOF (7.38%)</span>
                            <span>R$ {((selectedQuote?.totalPremium || 0) * 0.0738).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                        </div>
                        
                        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                             <p className="text-center text-sm text-primary font-bold mb-2">Total a Pagar</p>
                             <p className="text-center text-4xl font-bold text-primary mb-6">
                                R$ {(selectedQuote?.totalPremium || 0 * 1.0738).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                             </p>
                             
                             <div className="space-y-2">
                                 {selectedQuote?.installments.map((inst, idx) => (
                                     <div key={idx} className="flex justify-between text-sm border-b border-primary/10 pb-1 last:border-0">
                                         <span className="text-gray-600">{inst.count}x sem juros</span>
                                         <span className="font-bold text-gray-800">R$ {inst.value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-[10px] text-gray-400">Validade da proposta: {selectedQuote?.validity}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderIssued = () => (
        <div className="flex flex-col items-center justify-center h-full animate-in zoom-in-95 duration-500 bg-white">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Proposta Emitida com Sucesso!</h2>
            <p className="text-gray-500 mb-8 text-center max-w-md">
                A proposta #{selectedQuote?.proposalNumber} foi processada e enviada para o cliente.
                O PDF está disponível para download.
            </p>

            <div className="flex gap-4">
                <button 
                    onClick={() => window.open(selectedQuote?.pdfUrl || '#', '_blank')}
                    className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 flex items-center gap-2 shadow-sm"
                >
                    <Download className="w-5 h-5" /> Baixar PDF
                </button>
                <button 
                    onClick={onBack}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                    Voltar para Leads
                </button>
            </div>
        </div>
    );

    return (
        <div className="absolute inset-0 bg-white z-50 flex flex-col">
            {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <RefreshCw className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-lg font-bold text-gray-800">Calculando Melhores Ofertas...</p>
                    <p className="text-sm text-gray-500">Integrando com 5 seguradoras...</p>
                </div>
            )}
            
            {step === 'input' && renderInputForm()}
            {step === 'comparing' && renderComparison()}
            {step === 'presentation' && renderPresentationMode()}
            {step === 'editing' && renderEditing()}
            {step === 'issued' && renderIssued()}
        </div>
    );
};

export default ProposalManager;