
import React, { useEffect, useState } from 'react';
import { Task, Lead } from '../types';
import { TrendingUp, Calendar, CheckCircle2, AlertCircle, Phone, ArrowRight, Sparkles, DollarSign, Server, Activity } from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart as RePieChart, Pie, Cell, Label
} from 'recharts';
import { getQuickStatsInsight } from '../services/geminiService';

// Mock Data
const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Ligar para Ricardo (Contemplado)', type: 'call', priority: 'high', dueTime: '09:00', relatedLeadId: '1' },
  { id: '2', title: 'Renovação Seguro Auto - Mariana', type: 'email', priority: 'medium', dueTime: '10:30', relatedLeadId: '2' },
  { id: '3', title: 'Reunião Mensal da Franquia', type: 'meeting', priority: 'low', dueTime: '14:00' },
  { id: '4', title: 'Validar pagamento adesão', type: 'system', priority: 'high', dueTime: '16:00' },
];

const GOAL_DATA = [
  { name: 'Atingido', value: 75 },
  { name: 'Restante', value: 25 },
];

const Dashboard: React.FC = () => {
  const [insight, setInsight] = useState<string>("Sincronizando com a Central...");

  useEffect(() => {
    const fetchInsight = async () => {
        // Simulate passing "Contemplated" leads to trigger specific AI advice
        const mockLeads = [{ value: 150000, contemplated: true }, { value: 50000, contemplated: false }];
        const aiText = await getQuickStatsInsight(mockLeads as any);
        setInsight(aiText);
    };
    fetchInsight();
  }, []);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-gray-50/50">
      
      {/* 1. Humanized Header & Insight */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Olá, Carlos! 🚀</h1>
            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <Sparkles className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <p className="text-gray-700 text-sm font-medium italic">"{insight}"</p>
            </div>
        </div>
        <div className="flex items-center gap-4 divide-x divide-gray-100">
             <div className="px-4 text-center">
                <p className="text-xs text-gray-400 font-semibold uppercase">Sua Unidade</p>
                <p className="font-bold text-gray-800">SP - Jardins</p>
             </div>
             <div className="px-4 text-center">
                <p className="text-xs text-gray-400 font-semibold uppercase">Ranking</p>
                <p className="font-bold text-accent">#3 Regional</p>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Left Column: Workflow & Priorities */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Priority Tasks (Resumo do Dia) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        Ações Prioritárias
                    </h3>
                    <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full text-gray-600">4 pendentes</span>
                </div>
                <div className="divide-y divide-gray-50">
                    {MOCK_TASKS.map(task => (
                        <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${
                                    task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                }`} />
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">{task.title}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> Hoje, {task.dueTime}
                                    </p>
                                </div>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 bg-secondary text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all">
                                Iniciar
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Access / Smart Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-primary to-slate-800 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg group cursor-pointer transition-transform hover:scale-[1.01]">
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                            <Phone className="w-5 h-5 text-accent" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Campanha Blitz</h3>
                        <p className="text-sm text-gray-300 mb-3">Você tem 5 leads quentes não contatados.</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-accent">
                            COMEÇAR AGORA <ArrowRight className="w-3 h-3" />
                        </div>
                    </div>
                    <div className="absolute -right-5 -bottom-5 w-32 h-32 bg-white/5 rounded-full" />
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-gray-800">Monitor Financeiro</h3>
                        <p className="text-xs text-gray-500">Previsão de fechamento (Mês atual)</p>
                    </div>
                    <div className="mt-4">
                        <p className="text-3xl font-bold text-gray-900 tracking-tight">R$ 12.450<span className="text-base text-gray-400 font-normal">,00</span></p>
                        <div className="w-full bg-gray-100 h-2 rounded-full mt-2 overflow-hidden">
                            <div className="bg-green-500 h-full rounded-full" style={{width: '65%'}} />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1 text-right">65% da meta financeira</p>
                    </div>
                </div>
            </div>

        </div>

        {/* 3. Right Column: Gamification & Goals */}
        <div className="space-y-6">
            {/* Sales Goal Circle */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
                <h3 className="font-bold text-gray-800 mb-2">Meta de Vendas (Consórcio)</h3>
                <p className="text-xs text-gray-500 text-center mb-4">Faltam R$ 250k para o nível Master</p>
                
                <div className="w-48 h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                        <Pie
                        data={GOAL_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={5}
                        dataKey="value"
                        cornerRadius={10}
                        >
                        <Cell key="cell-0" fill="#3b82f6" />
                        <Cell key="cell-1" fill="#f1f5f9" />
                        <Label 
                            value="75%" 
                            position="center" 
                            className="text-3xl font-bold text-gray-800"
                        />
                        </Pie>
                    </RePieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                         <span className="text-3xl font-bold text-primary mt-2">75%</span>
                    </div>
                </div>
                <div className="mt-4 flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        <span className="text-gray-600">Realizado</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                        <span className="text-gray-400">Restante</span>
                    </div>
                </div>
            </div>

             {/* Alerts Section */}
             <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-orange-800 text-sm">Atenção Operacional</h4>
                        <p className="text-xs text-orange-700 mt-1 leading-relaxed">
                            3 propostas pendentes de assinatura há mais de 24h.
                        </p>
                        <button className="mt-3 text-xs font-bold text-orange-800 underline">
                            Resolver Pendências
                        </button>
                    </div>
                </div>
             </div>

             {/* RPA / Infrastructure Health */}
             <div className="bg-white border border-gray-100 rounded-2xl p-5">
                 <div className="flex justify-between items-center mb-3">
                     <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                        <Server className="w-4 h-4 text-gray-400" /> Infraestrutura
                     </h4>
                     <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                     </span>
                 </div>
                 <div className="flex gap-2 text-xs">
                    <div className="flex-1 bg-gray-50 p-2 rounded-lg text-center border border-gray-100">
                        <p className="text-gray-500 mb-1">Robôs</p>
                        <p className="font-bold text-gray-800">3/4 Online</p>
                    </div>
                    <div className="flex-1 bg-gray-50 p-2 rounded-lg text-center border border-gray-100">
                        <p className="text-gray-500 mb-1">Latência</p>
                        <p className="font-bold text-green-600">45ms</p>
                    </div>
                 </div>
                 <p className="text-[10px] text-gray-400 mt-3 text-center flex items-center justify-center gap-1">
                    <Activity className="w-3 h-3" /> Última sincronização: 2 min atrás
                 </p>
             </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
