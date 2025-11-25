
import React, { useState } from 'react';
import { FinancialTransaction, ProductType } from '../types';
import { DollarSign, TrendingUp, AlertCircle, Calendar, ArrowDownLeft, ArrowUpRight, PieChart, Users, ArrowRight, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Mock for Producer Splits
const MOCK_SPLITS = [
    { id: 's1', producer: 'João Silva (Filial SP)', policy: 'Auto - Ricardo O.', premium: 4500, comTotal: 900, splitPct: 40, splitValue: 360, status: 'pending' },
    { id: 's2', producer: 'Maria Costa (Externo)', policy: 'Vida - Fernanda L.', premium: 1200, comTotal: 300, splitPct: 50, splitValue: 150, status: 'paid' },
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
    transactions: FinancialTransaction[]; // Now receiving from App State
}

const FinancialMonitor: React.FC<FinancialMonitorProps> = ({ mode = 'commissions', transactions }) => {
  const isGeneralMode = mode === 'general';
  const [activeTab, setActiveTab] = useState<'extract' | 'splits'>('extract');

  return (
    <div className="p-6 space-y-6 h-full flex flex-col bg-gray-50/50 overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">{isGeneralMode ? 'Visão Financeira Geral' : 'Gestão de Comissões'}</h2>
            <p className="text-gray-500 text-sm">
                {isGeneralMode ? 'Fluxo de caixa, despesas e saúde financeira da franquia.' : 'Controle de recebimentos, repasses e previsões de comissão.'}
            </p>
        </div>
        {!isGeneralMode && (
            <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                <button 
                    onClick={() => setActiveTab('extract')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'extract' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    Extrato
                </button>
                <button 
                    onClick={() => setActiveTab('splits')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'splits' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <Users className="w-4 h-4" /> Repasses
                </button>
            </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">{activeTab === 'splits' ? 'Total Repassado (Mês)' : 'Recebido (Mês)'}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{activeTab === 'splits' ? 'R$ 510,00' : 'R$ 2.950,00'}</p>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-2 font-medium">
                <ArrowUpRight className="w-3 h-3" /> +12% vs mês anterior
            </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">{activeTab === 'splits' ? 'Pendente de Pgto' : 'Provisão Futura (30d)'}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{activeTab === 'splits' ? 'R$ 360,00' : 'R$ 4.800,00'}</p>
            <p className="text-xs text-gray-400 mt-2">{activeTab === 'splits' ? 'Vence dia 05' : 'Baseado em renovações'}</p>
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

      {/* Main Content Area */}
      {activeTab === 'extract' ? (
          <>
            {/* Chart Area */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-300">
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
            </div>

            {/* Recent Transactions (Dynamic from Props) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Extrato Recente (Sincronizado via RPA)</h3>
                    {isGeneralMode && <button className="text-xs font-bold text-primary flex items-center gap-1"><PieChart className="w-3 h-3" /> Ver Relatório Completo</button>}
                </div>
                <div className="divide-y divide-gray-50">
                    {transactions.map((t) => (
                        <div key={t.id} className={`p-4 hover:bg-gray-50 transition-colors flex items-center justify-between ${t.status === 'pending' || t.status === 'overdue' ? 'bg-yellow-50/30' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${t.status === 'paid' ? 'bg-green-100 text-green-600' : t.status === 'overdue' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
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
                                <p className={`text-[10px] uppercase font-bold ${t.status === 'overdue' ? 'text-red-500' : t.status === 'pending' ? 'text-yellow-600' : 'text-gray-400'}`}>
                                    {t.status === 'paid' ? 'Recebido' : t.status === 'overdue' ? 'Atrasado' : 'Pendente'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </>
      ) : (
          /* SPLITS VIEW (REPASSES) */
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                 <Users className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                 <div>
                     <h4 className="text-sm font-bold text-blue-800">Controle de Repasse</h4>
                     <p className="text-xs text-blue-700 mt-1">
                         Gerencie o pagamento de produtores e parceiros. O cálculo é feito sobre a <strong>Comissão Líquida Recebida</strong>.
                     </p>
                 </div>
             </div>

             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Produtor</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Origem (Apólice)</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Base Calc.</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">% Split</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Valor Repasse</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Status</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {MOCK_SPLITS.map((split) => (
                            <tr key={split.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <p className="text-sm font-bold text-gray-800">{split.producer}</p>
                                </td>
                                <td className="p-4">
                                    <p className="text-sm text-gray-600">{split.policy}</p>
                                    <p className="text-xs text-gray-400">Prêmio: R$ {split.premium}</p>
                                </td>
                                <td className="p-4 text-center text-xs text-gray-600">
                                    R$ {split.comTotal}
                                </td>
                                <td className="p-4 text-center">
                                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded">
                                        {split.splitPct}%
                                    </span>
                                </td>
                                <td className="p-4 text-right font-bold text-gray-800">
                                    R$ {split.splitValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                                </td>
                                <td className="p-4 text-right">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${
                                        split.status === 'paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                                    }`}>
                                        {split.status === 'paid' ? 'Pago' : 'Pendente'}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    {split.status === 'pending' ? (
                                        <button className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                                            Pagar
                                        </button>
                                    ) : (
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
          </div>
      )}

    </div>
  );
};

export default FinancialMonitor;
