import React from 'react';
import { AppView, Language } from '../types';
import { LayoutDashboard, Calendar, BarChart2, DollarSign } from 'lucide-react';
import { translations } from '../translations';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  lang: Language;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView, lang }) => {
  const t = translations[lang].nav;
  
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t.home },
    { id: 'scheduler', icon: Calendar, label: t.post },
    { id: 'analytics', icon: BarChart2, label: t.stats },
    { id: 'monetization', icon: DollarSign, label: t.earn },
  ];

  if (currentView === 'connect') return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-[#18181b]/90 backdrop-blur-lg border border-[#27272a] rounded-2xl p-2 shadow-2xl flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`flex flex-col items-center justify-center p-3 w-full rounded-xl transition-all duration-200 ${
                isActive ? 'bg-[#27272a] text-white' : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] mt-1 font-semibold tracking-wide ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};