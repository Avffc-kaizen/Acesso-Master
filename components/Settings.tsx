
import React, { useState } from 'react';
import { Lock, Shield, Server, Users, Save, RefreshCw, Eye, EyeOff, Clock, AlertTriangle, FileText, Search, Check, X, Building } from 'lucide-react';
import { AuditLogEntry } from '../types';

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: '1', timestamp: '2024-05-23 14:30:01', user: 'Carlos Silva', action: 'VIEW_POLICY', resource: 'Apólice #0531 (Porto)', status: 'SUCCESS', ipAddress: '192.168.1.10' },
  { id: '2', timestamp: '2024-05-23 14:15:22', user: 'Sistema (RPA)', action: 'LOGIN_ATTEMPT', resource: 'Portal Allianz', status: 'SUCCESS', ipAddress: '10.0.0.5' },
  { id: '3', timestamp: '2024-05-23 10:00:00', user: 'João Pereira', action: 'EXPORT_DATA', resource: 'Lista de Leads (CSV)', status: 'WARNING', ipAddress: '192.168.1.15' },
  { id: '4', timestamp: '2024-05-22 18:45:10', user: 'Desconhecido', action: 'LOGIN_FAIL', resource: 'Painel Admin', status: 'DENIED', ipAddress: '45.20.10.99' },
];

const INSURERS_LIST = [
    { name: 'Alfa', status: 'pending' },
    { name: 'Allianz', status: 'configured' },
    { name: 'Azul', status: 'pending' },
    { name: 'Banestes', status: 'pending' },
    { name: 'Bradesco', status: 'error' },
    { name: 'CHUBB', status: 'pending' },
    { name: 'Darwin Seguros', status: 'pending' },
    { name: 'ESSOR', status: 'pending' },
    { name: 'EZZE Seguros', status: 'pending' },
    { name: 'GENERALI', status: 'pending' },
    { name: 'HDI', status: 'configured' },
    { name: 'Justos', status: 'pending' },
    { name: 'Mapfre', status: 'pending' },
    { name: 'Mitsui', status: 'pending' },
    { name: 'Porto Seguro', status: 'configured' },
    { name: 'SANCOR', status: 'pending' },
    { name: 'Sompo', status: 'pending' },
    { name: 'Suhai', status: 'pending' },
    { name: 'Tokio Marine', status: 'pending' },
    { name: 'Yelum', status: 'pending' },
    { name: 'Zurich', status: 'pending' },
];

const SERVICES_OPTIONS = [
    'Seguro Automóvel',
    'Seguro Residencial',
    'Seguro Condomínio',
    'Seguro Empresarial',
    'Seguro Vida Individual',
    'Seguro Moto',
    'Seguro Caminhão',
    'Parcelas Vencidas',
    'Carteira de Apólices',
    'Extrato de Comissão'
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'access' | 'corretora' | 'users' | 'audit'>('access');
  const [selectedInsurer, setSelectedInsurer] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Insurer Configuration State
  const [configLogin, setConfigLogin] = useState('');
  const [configPassword, setConfigPassword] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (service: string) => {
      if (selectedServices.includes(service)) {
          setSelectedServices(selectedServices.filter(s => s !== service));
      } else {
          setSelectedServices([...selectedServices, service]);
      }
  };

  const getAvailableServices = (insurerName: string) => {
      if (insurerName === 'Alfa') {
          return [
              'Seguro Automóvel',
              'Seguro Residencial',
              'Parcelas Vencidas',
              'Carteira de Apólices'
          ];
      }
      if (insurerName === 'Allianz') {
          return [
              'Seguro Caminhão',
              'Seguro Condomínio',
              'Seguro Empresarial',
              'Seguro Automóvel',
              'Seguro Residencial',
              'Parcelas Vencidas',
              'Seguro Moto',
              'Carteira de Apólices',
              'Seguro Vida Individual',
              'Extrato de Comissão'
          ];
      }
      if (insurerName === 'Azul') {
          return [
              'Parcelas Vencidas',
              'Carteira de Apólices',
              'Extrato de Comissão'
          ];
      }
      if (insurerName === 'HDI') {
         return [
             'Seguro Condomínio',
             'Seguro Automóvel',
             'Seguro Residencial',
             'Parcelas Vencidas',
             'Seguro Moto',
             'Carteira de Apólices',
             'Extrato de Comissão'
         ];
      }
      return SERVICES_OPTIONS;
  };

  const filteredLogs = MOCK_AUDIT_LOGS.filter(log => {
    const term = searchTerm.toLowerCase();
    return (
      log.user.toLowerCase().includes(term) ||
      log.action.toLowerCase().includes(term) ||
      log.resource.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-4 md:p-6 space-y-6 h-full flex flex-col bg-gray-50/50 overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Configurações</h2>
          <p className="text-gray-500 text-sm">Configurações da CONSEG CORRETORA NACIONAL DE SEGUROS LTDA</p>
        </div>
      </div>

      {/* Navigation Tabs (SeguroLink Style) */}
      <div className="flex gap-1 bg-white p-1 rounded-xl border border-gray-200 w-full md:w-fit overflow-x-auto shadow-sm">
        <button 
          onClick={() => setActiveTab('corretora')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'corretora' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <Building className="w-4 h-4" /> Dados da Corretora
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <Users className="w-4 h-4" /> Dados de usuários
        </button>
        <button 
          onClick={() => setActiveTab('access')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'access' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <Shield className="w-4 h-4" /> Acessos das seguradoras
        </button>
        <button 
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'audit' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <FileText className="w-4 h-4" /> Auditoria (Logs)
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        
        {/* ACESSOS SEGURADORAS TAB */}
        {activeTab === 'access' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                 <p className="text-sm text-blue-800">
                   Agora configure os acessos da <strong>CONSEG CORRETORA NACIONAL DE SEGUROS LTDA</strong> nas seguradoras.
                 </p>
                 <div className="flex flex-wrap gap-4 mt-3 text-xs">
                    <span className="flex items-center gap-1.5 text-green-700 font-medium"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Acesso configurado com sucesso!</span>
                    <span className="flex items-center gap-1.5 text-gray-500 font-medium"><div className="w-2 h-2 bg-gray-300 rounded-full"></div> Acesso não configurado</span>
                    <span className="flex items-center gap-1.5 text-red-600 font-medium"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Falha de usuário/senha</span>
                 </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {INSURERS_LIST.map((insurer) => (
                    <div 
                        key={insurer.name}
                        onClick={() => setSelectedInsurer(insurer.name)}
                        className={`bg-white p-4 rounded-xl border shadow-sm cursor-pointer transition-all hover:shadow-md flex flex-col items-center justify-center gap-3 h-28 relative group ${
                            insurer.status === 'configured' ? 'border-green-200' : 
                            insurer.status === 'error' ? 'border-red-200' : 
                            'border-gray-200 hover:border-primary/50'
                        }`}
                    >
                        {/* Status Indicator */}
                        <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${
                             insurer.status === 'configured' ? 'bg-green-500' : 
                             insurer.status === 'error' ? 'bg-red-500' : 
                             'bg-gray-200'
                        }`}></div>

                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center font-bold text-gray-400 text-lg">
                            {insurer.name.charAt(0)}
                        </div>
                        <span className={`text-sm font-bold text-center ${
                             insurer.status === 'configured' ? 'text-green-700' : 
                             insurer.status === 'error' ? 'text-red-700' : 
                             'text-gray-600'
                        }`}>{insurer.name}</span>
                        
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* OTHER TABS */}
        {activeTab === 'corretora' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
                <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-700">Dados da Corretora</h3>
                <p>Módulo de gestão cadastral (CNPJ, Endereço, SUSEP).</p>
            </div>
        )}

        {activeTab === 'users' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-700">Dados de Usuários</h3>
                <p>Gerencie os usuários, permissões e acessos ao sistema.</p>
            </div>
        )}

        {/* AUDIT TAB */}
        {activeTab === 'audit' && (
           <div className="space-y-4 animate-in fade-in duration-300">
             <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:flex-1 flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-400 absolute left-0" />
                    <input 
                    type="text" 
                    placeholder="Filtrar logs por usuário, ação ou recurso..." 
                    className="w-full pl-6 text-sm outline-none bg-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="text-xs font-bold text-primary hover:underline self-end md:self-auto">Exportar CSV</button>
             </div>
             
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Timestamp</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Ação</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Usuário</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Recurso</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">IP Origem</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredLogs.length > 0 ? (
                            filteredLogs.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-xs font-mono text-gray-500">{log.timestamp}</td>
                                <td className="p-4">
                                    <span className="font-bold text-xs text-gray-700">{log.action}</span>
                                </td>
                                <td className="p-4 text-sm text-gray-800">{log.user}</td>
                                <td className="p-4 text-sm text-gray-600">{log.resource}</td>
                                <td className="p-4 text-xs font-mono text-gray-400">{log.ipAddress}</td>
                                <td className="p-4 text-right">
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold border ${
                                        log.status === 'SUCCESS' ? 'bg-green-50 text-green-600 border-green-100' :
                                        log.status === 'WARNING' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                        'bg-red-50 text-red-600 border-red-100'
                                    }`}>
                                        {log.status}
                                    </span>
                                </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-400 text-sm">
                                Nenhum registro encontrado para "{searchTerm}".
                            </td>
                            </tr>
                        )}
                    </tbody>
                    </table>
                </div>
             </div>
           </div>
        )}

      </div>

      {/* MODAL DE CONFIGURAÇÃO (SeguroLink Style) */}
      {selectedInsurer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-gray-800 text-lg truncate pr-4">Acesso: {selectedInsurer}</h3>
                    <button onClick={() => setSelectedInsurer(null)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-6">
                    
                    {/* Services Selection */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-3">Quais serviços deseja habilitar?</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {getAvailableServices(selectedInsurer).map(service => (
                                <label key={service} className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                        selectedServices.includes(service) ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-white group-hover:border-primary'
                                    }`}>
                                        {selectedServices.includes(service) && <Check className="w-3 h-3" />}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={selectedServices.includes(service)}
                                        onChange={() => toggleService(service)}
                                    />
                                    <span className="text-sm text-gray-600">{service}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Credentials */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                {selectedInsurer === 'Bradesco' ? 'Login (CPF/CNPJ)' : selectedInsurer === 'Azul' ? 'Usuário' : 'Login'}
                            </label>
                            <input 
                                type="text" 
                                value={configLogin}
                                onChange={(e) => setConfigLogin(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder={selectedInsurer === 'Bradesco' ? "CNPJ ou CPF" : "Digite o login..."}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha</label>
                            <div className="relative">
                                <input 
                                    type="password" 
                                    value={configPassword}
                                    onChange={(e) => setConfigPassword(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Bradesco Specifics */}
                    {selectedInsurer === 'Bradesco' && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-800">
                                <strong>Nota:</strong> Alguns corretores trabalham dentro de agências do Bradesco e precisam informar a Agência Produtora.
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Agência Produtora</label>
                                <input type="text" placeholder="_______" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="bradesco_api" className="rounded text-primary" />
                                <label htmlFor="bradesco_api" className="text-sm text-gray-600">Realizou o vínculo do robô SeguroLink?</label>
                            </div>
                        </div>
                    )}

                    {/* Allianz Specifics */}
                    {selectedInsurer === 'Allianz' && (
                        <div className="space-y-4">
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Desconto Cap (Todos)</label>
                                    <input type="number" defaultValue={15} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Desconto (Residencial)</label>
                                    <input type="number" defaultValue={10} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Desconto (Condomínio)</label>
                                    <input type="number" defaultValue={20} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cotação via Api ou Robô?</label>
                                <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                    <option>Robô (Não é necessário autorização)</option>
                                    <option>API (Requer token)</option>
                                </select>
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ramo/Filial | Corretor | Colaborador</label>
                                <input type="text" placeholder="048 | 2489595 | 0000" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                             </div>
                        </div>
                    )}

                    {/* Warning */}
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
                        <p className="text-xs text-orange-800 leading-relaxed">
                            <strong>Aviso:</strong> Os serviços de Carteira de Apólices, Parcelas Vencidas e Extrato de Comissão só funcionarão se o usuário cadastrado tiver acesso a esse(s) serviço(s) no portal da seguradora.
                        </p>
                    </div>

                    <p className="text-[10px] text-gray-400 text-right">Última atualização: {new Date().toLocaleString('pt-BR')}</p>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 shrink-0">
                    <button 
                        onClick={() => setSelectedInsurer(null)}
                        className="w-full sm:w-auto px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl text-sm font-bold transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={() => setSelectedInsurer(null)} // Mock save
                        className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg"
                    >
                        Atualizar Acesso
                    </button>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
