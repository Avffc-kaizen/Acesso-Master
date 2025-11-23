
import React from 'react';
import { PlayCircle, CheckCircle, Award, BookOpen } from 'lucide-react';

const University: React.FC = () => {
  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto bg-gray-50/50">
      <div className="bg-primary rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Universidade Acesso Master</h1>
            <p className="text-blue-200 max-w-xl mb-6">Domine a arte da venda consultiva. Aprenda a conectar consórcio e seguros para multiplicar seus resultados.</p>
            <div className="flex gap-4">
                <button className="bg-accent hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold transition-colors flex items-center gap-2">
                    <PlayCircle className="w-5 h-5" /> Continuar Curso
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl font-bold transition-colors">
                    Ver Certificados
                </button>
            </div>
        </div>
        <Award className="absolute -right-6 -bottom-6 w-48 h-48 text-white/5 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition-all cursor-pointer">
            <div className="w-full h-32 bg-gray-100 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/0 transition-colors"></div>
                 <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">O Poder do Cross-Sell</h3>
            <p className="text-xs text-gray-500 mb-3">Como vender seguro de vida para clientes de consórcio imobiliário.</p>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-accent h-full w-3/4"></div>
            </div>
            <p className="text-[10px] text-gray-400 mt-1 text-right">75% concluído</p>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition-all cursor-pointer">
             <div className="w-full h-32 bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
                 <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Matemática do Consórcio</h3>
            <p className="text-xs text-gray-500 mb-3">Entendendo lances embutidos, taxas de administração e fundo de reserva.</p>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-1/4"></div>
            </div>
             <p className="text-[10px] text-gray-400 mt-1 text-right">25% concluído</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm opacity-60">
             <div className="w-full h-32 bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
                 <CheckCircle className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Onboarding da Franquia</h3>
            <p className="text-xs text-gray-500 mb-3">Módulo introdutório obrigatório.</p>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-full"></div>
            </div>
             <p className="text-[10px] text-green-600 mt-1 text-right font-bold">Concluído</p>
        </div>
      </div>
    </div>
  );
};

export default University;
