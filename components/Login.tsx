
import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Building, Key } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'Corretor' | 'Gerente' | 'Master'>('Corretor');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockUser: UserProfile = {
        name: role === 'Corretor' ? 'Carlos Silva' : 'Amanda Gerente',
        email: email || (role === 'Corretor' ? 'carlos@conseg.com.br' : 'amanda@conseg.com.br'),
        role: role,
        avatar: 'https://picsum.photos/seed/broker/40/40'
      };
      onLogin(mockUser);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[60%] bg-purple-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg mb-4">
              <ShieldCheck className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Bem-vindo ao Master</h1>
            <p className="text-gray-500 mt-2">Acesse seu ecossistema unificado.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Persona Switcher (For Demo) */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                <button 
                    type="button"
                    onClick={() => setRole('Corretor')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === 'Corretor' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
                >
                    Operacional
                </button>
                <button 
                     type="button"
                     onClick={() => setRole('Gerente')}
                     className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === 'Gerente' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
                >
                    Gerencial
                </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'Corretor' ? "carlos@conseg.com.br" : "admin@conseg.com.br"}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                <span className="text-gray-600">Lembrar acesso</span>
              </label>
              <a href="#" className="text-primary font-bold hover:underline">Esqueceu a senha?</a>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-primary/20"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Acessar Plataforma <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
             <div className="flex items-center gap-2 justify-center text-xs text-gray-400">
                <Lock className="w-3 h-3" />
                Ambiente seguro com criptografia ponta a ponta.
             </div>
          </div>
        </div>

        {/* Right Side: Visuals */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-primary to-slate-900 p-12 text-white flex-col justify-between relative overflow-hidden">
           <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")'}}></div>
           
           <div className="relative z-10">
             <div className="flex gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
             </div>
             <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 transform translate-x-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Building className="w-5 h-5 text-accent" />
                        <span className="font-bold text-sm">Booking Engine Ativo</span>
                    </div>
                    <p className="text-xs text-gray-300">Novo lead atribuído via Geolocalização (SP).</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 transform -translate-x-4">
                    <div className="flex items-center gap-3 mb-2">
                         <Key className="w-5 h-5 text-blue-400" />
                        <span className="font-bold text-sm">RPA Scalpe</span>
                    </div>
                    <p className="text-xs text-gray-300">Sincronização de 1.402 apólices concluída com sucesso.</p>
                </div>
             </div>
           </div>

           <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">O Poder da Unificação.</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Gerencie consórcios, seguros e financeiro em uma única tela. 
                Aumente seu Cross-Sell com inteligência artificial.
              </p>
           </div>
        </div>

      </div>
      
      <p className="absolute bottom-6 text-slate-500 text-xs font-mono">
        v2.5.0-rc1 | Acesso Master System
      </p>
    </div>
  );
};

export default Login;
