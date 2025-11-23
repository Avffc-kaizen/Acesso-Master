
import React from 'react';
import { HelpCircle, ChevronRight, Download, DollarSign, FileText, AlertTriangle, Mail } from 'lucide-react';

const HelpCenter: React.FC = () => {
  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto bg-gray-50/50">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
         <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
         </div>
         <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajuda do SeguroLink</h1>
         <p className="text-gray-500">Perguntas frequentes e suporte para configurar sua corretora.</p>
      </div>

      {/* FAQs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Baixa Automática */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                    <Download className="w-6 h-6 text-blue-600" />
                </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">1. Como funciona o baixa automática de apólices?</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                O SeguroLink facilita a gestão da sua carteira de apólices com download automático. Com ele você pode gerenciar sua carteira de forma simples e rápida.
            </p>
            <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-700 space-y-2">
                <p className="font-bold">Passo a passo:</p>
                <ol className="list-decimal pl-4 space-y-1">
                    <li>Vá em <strong>Configurações</strong> &gt; Acesso das Seguradoras.</li>
                    <li>Escolha a seguradora desejada.</li>
                    <li>Marque a opção <strong>Carteira de Apólices</strong>.</li>
                    <li>Digite sua senha e clique em Atualizar.</li>
                </ol>
            </div>
        </div>

        {/* Card 2: Comissões */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-xl">
                    <DollarSign className="w-6 h-6 text-green-600" />
                </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">2. Como controlar minhas comissões?</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                O SeguroLink oferece um controle centralizado. Acesso a todas as comissões, facilidade para gerar Notas Fiscais e repasses.
            </p>
            <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-700 space-y-2">
                <p className="font-bold">Para ativar:</p>
                <ol className="list-decimal pl-4 space-y-1">
                    <li>Acesse <strong>Configurações</strong> &gt; Acesso das Seguradoras.</li>
                    <li>Selecione a seguradora.</li>
                    <li>Marque a opção <strong>Extrato de Comissão</strong>.</li>
                    <li>Atualize suas credenciais.</li>
                </ol>
            </div>
        </div>

        {/* Card 3: Repasse */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-purple-50 rounded-xl">
                    <FileText className="w-6 h-6 text-purple-600" />
                </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">3. Como funciona o repasse para produtores?</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Cálculo Automático dos Repasses. Defina as regras e o sistema gera o relatório detalhado e comprovantes.
                <span className="block mt-1 text-purple-600 font-bold text-xs">* Disponível a partir do Plano Prata</span>
            </p>
            <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-700 space-y-2">
                <p className="font-bold">Como usar:</p>
                <ol className="list-decimal pl-4 space-y-1">
                    <li>Vá em <strong>Gestão de Comissões</strong> &gt; Extrato.</li>
                    <li>Escolha a comissão e clique em <strong>Repasse</strong>.</li>
                    <li>Siga as instruções da tela.</li>
                </ol>
            </div>
        </div>

        {/* Card 4: Parcelas Vencidas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-red-50 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">4. Como evitar cancelamento por falta de pagamento?</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Notifique seus clientes sobre pagamentos pendentes. Reduza o risco de cancelamento e mantenha comissões seguras.
            </p>
            <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-700 space-y-2">
                <p className="font-bold">Ativação:</p>
                <ol className="list-decimal pl-4 space-y-1">
                    <li>Vá em <strong>Configurações</strong> &gt; Acesso das Seguradoras.</li>
                    <li>Marque a opção <strong>Parcelas Vencidas</strong>.</li>
                    <li>Garanta que o login tenha essa permissão no portal.</li>
                </ol>
            </div>
        </div>

      </div>

      {/* Contact Footer */}
      <div className="bg-primary text-white p-8 rounded-2xl text-center mt-8">
         <h3 className="text-xl font-bold mb-2">Ainda com dúvidas?</h3>
         <p className="text-blue-200 text-sm mb-6">A equipe do SeguroLink está à disposição de segunda a sexta das 09:00 às 18:00.</p>
         <div className="flex flex-col md:flex-row justify-center gap-4">
             <a href="mailto:contato@segurolink.com.br" className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors">
                <Mail className="w-5 h-5" /> contato@segurolink.com.br
             </a>
             <div className="bg-white/10 px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold">
                (41) 3082-9457
             </div>
         </div>
      </div>

    </div>
  );
};

export default HelpCenter;
