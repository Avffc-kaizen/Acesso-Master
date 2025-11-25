
import React, { useEffect, useState } from 'react';
import { Task, Lead } from '../types';
import { TrendingUp, Calendar, CheckCircle2, AlertCircle, Phone, ArrowRight, Sparkles, DollarSign, Server, Activity, Users, MapPin, BarChart3, PieChart, Edit2, Save, X } from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart as RePieChart, Pie, Cell, Label,
  BarChart, Bar, XAxis, YAxis, Tooltip
} from 'recharts';
import { getQuickStatsInsight } from '../services/geminiService';

// Mock Data Initial State
const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Ligar para Ricardo (Contemplado)', type: 'call', priority: 'high', dueTime: '09:00', relatedLeadId: '1' },
  { id: '2', title: 'Renovação Seguro Auto - Mariana', type: 'email', priority: 'medium', dueTime: '10:30', relatedLeadId: '2' },
  { id: '3', title: 'Reunião Mensal da Franquia', type: 'meeting', priority: 'low', dueTime: '14:00' },
  { id: '4', title: 'Validar pagamento adesão', type: 'system', priority: 'high', dueTime: '16:00' },
];

const GOAL_DATA = [
  { name: 'Atingido', value: 75 },
  { name: 'Restante', value: 25 },
];

const MANAGER_UNIT_DATA = [
  { name: 'Matriz SP', value: 120000, leads: 450, conversion: 12 },
  { name: 'Filial RJ', value: 95000, leads: 320, conversion: 15 },
  { name: 'Filial MG', value: 60000, leads: 200, conversion: 10 },
  { name: 'Filial SC', value: 45000, leads: 150, conversion: 8 },
];

const Dashboard: React.FC = () => {
  const [insight, setInsight] = useState<string>("Sincronizando com a Central...");
  const [viewMode, setViewMode] = useState<'agent' | 'manager'>('agent');
  
  // Task Editing State
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [tempEditData, setTempEditData] = useState<{title: string, priority: 'high' | 'medium' | 'low'}>({ title: '', priority: 'low' });

  useEffect(() => {
    const fetchInsight = async () => {
        // Simulate passing "Contemplated" leads to trigger specific AI advice
        const mockLeads = [{ value: 150000, contemplated: true }, { value: 50000, contemplated: false }];
        const aiText = await getQuickStatsInsight(mockLeads as any);
        setInsight(aiText);
    };
    fetchInsight();
  }, []);

  // Handlers for Task Editing
  const startEditing = (task: Task) => {
      setEditingTaskId(task.id);
      setTempEditData({ title: task.title, priority: task.priority });
  };

  const cancelEditing = () => {
      setEditingTaskId(null);
  };

  const saveTask = () => {
      if (!editingTaskId) return;
      setTasks(prev => prev.map(t => t.id === editingTaskId ? { ...t, ...tempEditData } : t));
      setEditingTaskId(null);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-gray-50/50">
      
      {/* 1. Header with Role Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">
                {viewMode === 'agent' ? 'Olá, Carlos! 🚀' : 'Painel de Gestão da Rede 🏢'}
            </h1>
            <p className="text-gray-500 text-sm">
                {viewMode === 'agent' ? 'Vamos bater a meta hoje?' : 'Visão consolidada das unidades e KPIs estratégicos.'}
            </p>
        </div>
        
        <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex">
            <button 
                onClick={() => setViewMode('agent')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'agent' ? 'bg-primary text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                Operacional (Corretor)
            </button>
            <button 
                onClick={() => setViewMode('manager')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'manager' ? 'bg-primary text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                Estratégico (Gestor)
            </button>
        </div>
      </div>

      {viewMode === 'agent' ? (
        /* ==================== AGENT VIEW (EXISTING) ==================== */
        <>
            {/* AI Insight Box */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
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
                {/* Left Column: Workflow */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                Ações Prioritárias
                            </h3>
                            <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                                {tasks.length} pendentes
                            </span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {tasks.map(task => (
                                <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-4 flex-1">
                                        {/* Priority Indicator / Selector */}
                                        {editingTaskId === task.id ? (
                                            <select 
                                                value={tempEditData.priority}
                                                onChange={(e) => setTempEditData({...tempEditData, priority: e.target.value as any})}
                                                className="w-4 h-4 rounded-full border-none focus:ring-2 focus:ring-primary cursor-pointer text-[0px]"
                                                style={{
                                                    backgroundColor: tempEditData.priority === 'high' ? '#ef4444' : tempEditData.priority === 'medium' ? '#eab308' : '#3b82f6',
                                                    color: 'transparent'
                                                }}
                                            >
                                                <option value="high" className="text-black bg-white">Alta</option>
                                                <option value="medium" className="text-black bg-white">Média</option>
                                                <option value="low" className="text-black bg-white">Baixa</option>
                                            </select>
                                        ) : (
                                            <div className={`w-2 h-2 rounded-full shrink-0 ${
                                                task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                            }`} />
                                        )}

                                        <div className="flex-1">
                                            {editingTaskId === task.id ? (
                                                <input 
                                                    type="text" 
                                                    value={tempEditData.title}
                                                    onChange={(e) => setTempEditData({...tempEditData, title: e.target.value})}
                                                    className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm text-gray-800 focus:outline-none focus:border-primary"
                                                    autoFocus
                                                />
                                            ) : (
                                                <p className="font-medium text-gray-800 text-sm">{task.title}</p>
                                            )}
                                            
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                <Calendar className="w-3 h-3" /> Hoje, {task.dueTime}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        {editingTaskId === task.id ? (
                                            <>
                                                <button onClick={saveTask} className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                                                    <Save className="w-4 h-4" />
                                                </button>
                                                <button onClick={cancelEditing} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => startEditing(task)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="bg-secondary text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-600 transition-all shadow-sm">
                                                    Iniciar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

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

                {/* Right Column: Gamification */}
                <div className="space-y-6">
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
                    </div>

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
                </div>
            </div>
        </>
      ) : (
        /* ==================== MANAGER VIEW (NEW) ==================== */
        <div className="animate-in fade-in duration-300 space-y-6">
            
            {/* Network KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Faturamento Rede (Mês)</p>
                    <p className="text-2xl font-bold text-gray-900">R$ 4.2M</p>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-bold">+18% vs mês anterior</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Leads Distribuídos</p>
                    <p className="text-2xl font-bold text-gray-900">1.840</p>
                    <span className="text-xs text-gray-500">Taxa de Conversão Global: 12.5%</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">NPS da Rede</p>
                    <p className="text-2xl font-bold text-emerald-600">78</p>
                    <span className="text-xs text-gray-500">Zona de Excelência</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                     <p className="text-xs font-bold text-gray-400 uppercase mb-2">Churn Rate</p>
                     <p className="text-2xl font-bold text-red-500">2.1%</p>
                     <span className="text-xs text-gray-500">Atenção: Acima da meta (1.5%)</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Ranking Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            Performance por Unidade
                        </h3>
                        <button className="text-xs font-bold text-primary hover:underline">Ver Relatório Completo</button>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Unidade</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase text-right">Vendas (R$)</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase text-right">Leads</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase text-right">Conv. %</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {MANAGER_UNIT_DATA.map((unit, idx) => (
                                <tr key={unit.name} className="hover:bg-gray-50">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                            idx === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {idx + 1}
                                        </div>
                                        <span className="font-bold text-gray-700">{unit.name}</span>
                                    </td>
                                    <td className="p-4 text-right font-medium">R$ {unit.value.toLocaleString()}</td>
                                    <td className="p-4 text-right text-gray-500">{unit.leads}</td>
                                    <td className="p-4 text-right">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            unit.conversion > 12 ? 'bg-green-50 text-green-700' : 
                                            unit.conversion < 10 ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {unit.conversion}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Network Health / Geo Map */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                         <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" /> Cobertura Geográfica
                         </h3>
                         <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden group">
                             <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <p className="text-xs font-bold text-primary">Mapa Interativo (Em Breve)</p>
                             </div>
                             <MapPin className="w-8 h-8 text-gray-300" />
                         </div>
                         <div className="mt-4 space-y-2">
                             <div className="flex justify-between text-sm">
                                 <span className="text-gray-500">Unidades Ativas</span>
                                 <span className="font-bold text-gray-800">14</span>
                             </div>
                             <div className="flex justify-between text-sm">
                                 <span className="text-gray-500">Estados</span>
                                 <span className="font-bold text-gray-800">4 (SP, RJ, MG, SC)</span>
                             </div>
                         </div>
                    </div>

                    <div className="bg-primary text-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-5 h-5 text-accent" />
                            <h3 className="font-bold">Total Corretores</h3>
                        </div>
                        <p className="text-4xl font-bold tracking-tight">85</p>
                        <p className="text-sm text-blue-200 mt-1">12 novos este mês</p>
                        <button className="mt-4 w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg text-sm font-bold transition-colors">
                            Gerenciar Time
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
