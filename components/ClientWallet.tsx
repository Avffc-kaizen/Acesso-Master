
import React from 'react';
import { Client, ProductType } from '../types';
import { Search, Shield, Car, Home, Briefcase, AlertTriangle, MoreHorizontal, Phone } from 'lucide-react';

const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Ana Clara Souza',
    email: 'ana.souza@email.com',
    phone: '(11) 99999-1111',
    products: [ProductType.CONSORTIUM, ProductType.INSURANCE_HOME],
    ltv: 12500,
    clientSince: '2021-03-15',
    status: 'active',
    lastContact: '15 dias atrás',
    nextRenewalDate: '2024-05-20',
    nextRenewalProduct: ProductType.INSURANCE_HOME
  },
  {
    id: '2',
    name: 'Roberto Mendes',
    email: 'roberto.m@email.com',
    phone: '(11) 98888-2222',
    products: [ProductType.INSURANCE_AUTO],
    ltv: 3200,
    clientSince: '2023-01-10',
    status: 'risk',
    lastContact: '4 meses atrás',
    nextRenewalDate: '2024-01-15', // Past due or close
    nextRenewalProduct: ProductType.INSURANCE_AUTO
  },
  {
    id: '3',
    name: 'Fernanda Lima',
    email: 'fernanda.l@email.com',
    phone: '(21) 97777-3333',
    products: [ProductType.CONSORTIUM, ProductType.INSURANCE_LIFE, ProductType.INSURANCE_AUTO],
    ltv: 25000,
    clientSince: '2019-08-20',
    status: 'active',
    lastContact: '2 meses atrás',
  },
];

const getProductIcon = (type: ProductType) => {
  switch (type) {
    case ProductType.CONSORTIUM: return <Briefcase className="w-4 h-4" />;
    case ProductType.INSURANCE_AUTO: return <Car className="w-4 h-4" />;
    case ProductType.INSURANCE_LIFE: return <Shield className="w-4 h-4" />;
    case ProductType.INSURANCE_HOME: return <Home className="w-4 h-4" />;
    default: return <Shield className="w-4 h-4" />;
  }
};

const ClientWallet: React.FC = () => {
  return (
    <div className="p-6 space-y-6 h-full flex flex-col bg-gray-50/50">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Carteira de Clientes</h2>
          <p className="text-gray-500 text-sm">Gerencie o ciclo de vida e maximize o LTV (Lifetime Value).</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
              <span className="text-xs text-gray-500 block">LTV Total da Carteira</span>
              <span className="font-bold text-gray-800">R$ 40.700,00</span>
           </div>
           <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
              <span className="text-xs text-gray-500 block">Taxa de Retenção</span>
              <span className="font-bold text-emerald-600">98.5%</span>
           </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar cliente..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
          />
        </div>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-6">
        {MOCK_CLIENTS.map((client) => {
          // Calculate Share of Wallet (Simple Logic: 4 main products)
          const shareOfWallet = (client.products.length / 4) * 100;

          return (
            <div key={client.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow group relative">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-lg font-bold text-gray-600">
                      {client.name.charAt(0)}
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-900 text-sm">{client.name}</h3>
                      <p className="text-xs text-gray-500">Cliente desde {new Date(client.clientSince).getFullYear()}</p>
                   </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Renewal Alert */}
              {client.status === 'risk' && (
                <div className="bg-red-50 text-red-700 text-xs px-3 py-2 rounded-lg mb-4 flex items-center gap-2 font-medium">
                   <AlertTriangle className="w-4 h-4" />
                   Risco de Churn: Pouco contato
                </div>
              )}
              
              {client.nextRenewalDate && (
                  <div className="bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-lg mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Renovação: {client.nextRenewalProduct} em breve
                  </div>
              )}

              {/* Products Owned */}
              <div className="mb-4">
                <p className="text-[10px] uppercase text-gray-400 font-bold mb-2">Produtos Ativos</p>
                <div className="flex gap-2">
                  {client.products.map((prod) => (
                    <div key={prod} className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600" title={prod}>
                      {getProductIcon(prod)}
                    </div>
                  ))}
                  {/* Empty Slots for Cross-Sell */}
                  {Array.from({ length: 4 - client.products.length }).map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-300">
                      <div className="w-2 h-2 bg-gray-200 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Footer */}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">LTV</p>
                    <p className="text-sm font-bold text-gray-800">R$ {client.ltv.toLocaleString()}</p>
                  </div>
                  <button className="p-2 bg-secondary text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
              </div>
              
              {/* Share of Wallet Indicator */}
              <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-t-2xl opacity-50" style={{ width: '100%' }}>
                  <div className="h-full bg-white/50 absolute right-0" style={{ width: `${100 - shareOfWallet}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientWallet;
