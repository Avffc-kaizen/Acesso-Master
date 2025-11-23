
import React from 'react';
import { FinancialTransaction, ProductType } from '../types';
import { DollarSign, TrendingUp, AlertCircle, Calendar, ArrowDownLeft, ArrowUpRight, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MOCK_TRANSACTIONS: FinancialTransaction[] = [
  { id: '1', date: '2024-05-01', description: 'Comissão Seguro Vida - Ana Clara', amount: 450.00, type: 'commission_received', status: 'paid', productType: ProductType.INSURANCE_LIFE },
  { id: '2', date: '2024-05-05', description: '1ª Parcela Adesão Consórcio - Ricardo', amount: 2500.00, type: 'commission_received', status: 'paid', productType: ProductType.CONSORTIUM },
  { id: '3', date: '2024-05-20', description: 'Previsão: Renovação Auto - Roberto', amount: 350.00, type: 'commission_future', status: 'forecast', productType: ProductType.INSURANCE_AUTO },
  { id: '4', date: '2024-06-05', description: '2ª Parcela Adesão Consórcio - Ricardo', amount: 1250.00, type: 'commission_future', status: 'forecast', productType: ProductType.CONSORTIUM },
];

const CHART_DATA = [
  { month: 'Jan', realizado: 4000, projetado: 4000 },
  { month: 'Fev', realizado: 3500, projetado: 3500 },
  { month: 'Mar', realizado: 5200, projetado: 5200 },
  { month: 'Abr', realizado: 4800, projetado: 4800 },
  { month: 'Mai', realizado: 2950, projetado: 6500 }, // Current month partial
  { month: 'Jun', realizado: 0, projetado: 7200 },
];

interface FinancialMonitorProps {
    mode?: 'commissions' | 'general';
}

const FinancialMonitor: React.FC<FinancialMonitorProps> = ({ mode = 'commissions' }) => {
  const isGeneralMode = mode === 'general';

  return (
    <div className="p-6 space-y-6 h-full flex flex-col bg-gray-50/50 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">{isGeneralMode ? 'Visão Financeira Geral' : 'Gestão de Comissões'}</h2>
            <p className="text-gray-500 text-sm">
                {isGeneralMode ? 'Fluxo de caixa, despesas e saúde financeira da franquia.' : 'Controle de recebimentos, repasses e previsões de comissão.'}
            </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Recebido (Mês)</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">R$ 2.950,00</p>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-2 font-medium">
                <ArrowUpRight className="w-3 h-3" /> +12% vs mês anterior
            </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Provisão Futura (30d)</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">R$ 4.800,00</p>
            <p className="text-xs text-gray-400 mt-2">Baseado em renovações e parcelas.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-red-500">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm font-bold text-gray-800">Alerta Inadimplência</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">2 cotas de consórcio em atraso crítico.</p>
            <button className="text-xs font-bold text-red-600 hover:underline">Ver Cotas Impactadas</button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
         <h3 className="font-bold text-gray-800 mb-6">{isGeneralMode ? 'Resultados Financeiros (DRE)' : 'Fluxo de Comissões (Semestral)'}</h3>
         <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                        cursor={{fill: '#f1f5f9'}}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="realizado" stackId="a" fill={isGeneralMode ? "#10b981" : "#3b82f6"} radius={[0, 0, 4, 4]} barSize={32} />
                    <Bar dataKey="projetado" stackId="a" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
            </ResponsiveContainer>
         </div>
         <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
                <div className={`w-3 h-3 ${isGeneralMode ? 'bg-emerald-500' : 'bg-blue-500'} rounded-sm`}></div> Realizado
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-200 rounded-sm"></div> Projetado (Metas)
            </div>
         </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex justify-between items-center">
             <h3 className="font-bold text-gray-800">Extrato Recente</h3>
             {isGeneralMode && <button className="text-xs font-bold text-primary flex items-center gap-1"><PieChart className="w-3 h-3" /> Ver Relatório Completo</button>}
        </div>
        <div className="divide-y divide-gray-50">
            {MOCK_TRANSACTIONS.map((t) => (
                <div key={t.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${t.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            {t.type === 'commission_received' ? <ArrowDownLeft className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className="font-medium text-gray-800 text-sm">{t.description}</p>
                            <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString('pt-BR')} • {t.productType}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`font-bold text-sm ${t.status === 'paid' ? 'text-gray-900' : 'text-gray-400'}`}>
                            R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{t.status === 'paid' ? 'Recebido' : 'Previsto'}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialMonitor;
