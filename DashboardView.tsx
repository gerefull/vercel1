import React from 'react';
import { Post, ChannelStats, Language } from './types';
import { TrendingUp, Users, Eye, Calendar, FileText, ArrowUpRight, Globe } from 'lucide-react';
import { translations } from './translations';

interface DashboardViewProps {
  channelName: string;
  stats: ChannelStats[];
  upcomingPost: Post | undefined;
  goToScheduler: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ channelName, stats, upcomingPost, goToScheduler, lang, setLang }) => {
  const currentStats = stats[stats.length - 1];
  const prevStats = stats[stats.length - 2];
  
  const growth = currentStats.subscribers - prevStats.subscribers;
  const growthPercent = ((growth / prevStats.subscribers) * 100).toFixed(1);
  
  const t = translations[lang].dashboard;

  return (
    <div className="p-6 space-y-6 pb-32 animate-fade-in max-w-md mx-auto">
      {/* Modern Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{channelName}</h2>
          <p className="text-sm text-[#a1a1aa] font-medium">{t.overview}</p>
        </div>
        <button 
          onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
          className="w-10 h-10 flex items-center justify-center bg-[#18181b] border border-[#27272a] rounded-full text-[#a1a1aa] hover:text-white transition-colors"
        >
          <Globe size={18} />
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bw-card p-5 flex flex-col justify-between h-32">
          <div className="flex items-center gap-2 text-[#a1a1aa]">
            <Users size={18} /> 
            <span className="text-xs font-semibold uppercase tracking-wider">{t.subs}</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{currentStats.subscribers.toLocaleString()}</div>
            <div className="text-xs text-green-400 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp size={12} /> +{growthPercent}%
            </div>
          </div>
        </div>
        
        <div className="bw-card p-5 flex flex-col justify-between h-32">
          <div className="flex items-center gap-2 text-[#a1a1aa]">
            <Eye size={18} /> 
            <span className="text-xs font-semibold uppercase tracking-wider">{t.views}</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{currentStats.views.toLocaleString()}</div>
            <div className="text-xs text-[#71717a] mt-1 font-medium">CTR: 2.4%</div>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="bw-card p-5 bg-gradient-to-br from-[#18181b] to-[#27272a]/30 border border-[#27272a]">
        <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-white/10 rounded-lg">
                <FileText size={16} className="text-white" />
            </div>
            <h3 className="font-semibold text-sm text-white">{t.ai_tip}</h3>
        </div>
        <p className="text-sm font-medium text-[#d4d4d8] leading-relaxed">
            {translations[lang].stats.tip}
        </p>
      </div>

      {/* Next Scheduled Post */}
      <div className="bw-card p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar size={18} className="text-[#a1a1aa]" /> {t.up_next}
          </h3>
          <button onClick={goToScheduler} className="text-xs text-[#a1a1aa] font-medium hover:text-white flex items-center gap-1 transition-colors">
            {t.manage} <ArrowUpRight size={14} />
          </button>
        </div>
        
        {upcomingPost ? (
          <div className="bg-[#27272a]/50 rounded-xl p-4 border border-[#3f3f46] cursor-pointer hover:bg-[#27272a] transition-colors">
             <div className="flex justify-between text-xs font-medium text-[#a1a1aa] mb-2">
                <span>{upcomingPost.scheduledTime.toLocaleDateString()} • {upcomingPost.scheduledTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                {upcomingPost.generatedByAi && (
                    <span className="bg-white/10 text-white px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider">AI</span>
                )}
             </div>
             <p className="text-sm font-medium text-white line-clamp-2 leading-relaxed">{upcomingPost.content}</p>
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-[#27272a] rounded-xl bg-[#18181b]/50">
            <p className="text-[#71717a] text-sm font-medium mb-3">{t.no_posts}</p>
            <button onClick={goToScheduler} className="text-sm font-semibold text-white hover:text-[#d4d4d8] transition-colors">
                {t.create_one}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
