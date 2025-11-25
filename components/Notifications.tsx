
import React from 'react';
import { AppNotification, ViewState } from '../types';
import { X, Bell, Check, AlertCircle, Info, Zap, Briefcase } from 'lucide-react';

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onAction: (view: ViewState) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ isOpen, onClose, notifications, onMarkRead, onAction }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
            onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-gray-800">Central de Eventos</h2>
                    <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {notifications.filter(n => !n.read).length}
                    </span>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {notifications.length > 0 ? (
                    notifications.map(notif => (
                        <div 
                            key={notif.id}
                            className={`p-4 rounded-xl border transition-all relative group ${
                                notif.read ? 'bg-white border-gray-100 opacity-70' : 'bg-blue-50/50 border-blue-100 shadow-sm'
                            }`}
                        >
                            <div className="flex gap-3">
                                <div className={`p-2 rounded-lg h-fit ${
                                    notif.type === 'success' ? 'bg-green-100 text-green-600' :
                                    notif.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                                    notif.type === 'error' ? 'bg-red-100 text-red-600' :
                                    'bg-blue-100 text-blue-600'
                                }`}>
                                    {notif.type === 'success' ? <Check className="w-4 h-4" /> :
                                     notif.type === 'warning' ? <Zap className="w-4 h-4" /> :
                                     notif.type === 'error' ? <AlertCircle className="w-4 h-4" /> :
                                     <Info className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`text-sm font-bold ${notif.read ? 'text-gray-600' : 'text-gray-800'}`}>
                                        {notif.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notif.message}</p>
                                    <p className="text-[10px] text-gray-400 mt-2 font-medium">{notif.timestamp}</p>
                                    
                                    {notif.actionLink && (
                                        <button 
                                            onClick={() => { onAction(notif.actionLink!); onClose(); }}
                                            className="mt-3 text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-bold text-primary hover:bg-gray-50 shadow-sm"
                                        >
                                            Ver Detalhes
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Mark Read Button */}
                            {!notif.read && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onMarkRead(notif.id); }}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                    title="Marcar como lido"
                                >
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Briefcase className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-sm">Nenhum evento recente.</p>
                    </div>
                )}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                <button className="text-xs font-bold text-gray-500 hover:text-primary transition-colors">
                    Limpar todas as notificações
                </button>
            </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;
