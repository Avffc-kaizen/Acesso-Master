
import React from 'react';
import { HelpCircle, Server, Zap, MessageSquare, Filter, Shield, AlertTriangle } from 'lucide-react';

const HelpCenter: React.FC = () => {
  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto bg-gray-50/50">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
         <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
         </div>
         <h1 className="text-3xl font-bold text-gray-900 mb-2">Mapeamento do Sistema</h1>
         <p className="text-gray-500">Guia rápido para o ecossistema unificado e automatizado.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Motor Scalpe */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3 text-primary">
                <Server className="w-6 h-6" />
                <h3 className="text-lg font-bold">Motor Scalpe (Automação)</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
                Responsável por 90% do trabalho manual. Ele acessa os portais das seguradoras automaticamente para:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
                <li>Calcular renovações e seguros novos (Multicálculo).</li>
                <li>Baixar parcelas pagas e atualizar o financeiro.</li>
                <li>Extrair apólices e propostas em PDF.</li>
            </ul>
        </div>

        {/* CRM Unificado */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
             <div className="flex items-center gap-3 mb-3 text-purple-600">
                <Filter className="w-6 h-6" />
                <h3 className="text-lg font-bold">Portal de Vendas (CRM)</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
                Separado por <strong>TAGS</strong> para facilitar sua visão:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
                <li><strong>Renovação:</strong> Leads que precisam ser renovados.</li>
                <li><strong>Produto:</strong> Filtre por Auto, Vida, Consórcio.</li>
                <li><strong>Corretor:</strong> Veja quem está cuidando de cada lead.</li>
            </ul>
        </div>

        {/* Comunicação */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
             <div className="flex items-center gap-3 mb-3 text-green-600">
                <MessageSquare className="w-6 h-6" />
                <h3 className="text-lg font-bold">Hub de Comunicação</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
                Centraliza E-mail e WhatsApp em uma única tela.
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
                <li>Configure sua API de WhatsApp em <em>Configurações &gt; Integrações</em>.</li>
                <li>Configure seu provedor de E-mail Marketing para disparos em massa.</li>
            </ul>
        </div>

         {/* Sinistro */}
         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 opacity-70">
             <div className="flex items-center gap-3 mb-3 text-orange-500">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold">Sinistros (Em Breve)</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
                Estamos desenvolvendo um módulo dedicado para abertura e acompanhamento de sinistros integrado às seguradoras.
            </p>
        </div>

      </div>
    </div>
  );
};

export default HelpCenter;
