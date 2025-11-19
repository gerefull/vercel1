import React, { useEffect, useState } from 'react';
import { ChannelStats, Language } from '../types';
import { analyzeChannelStats } from '../services/geminiService';
import { api } from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FileText, AlertCircle, RefreshCw, Globe, Brain } from 'lucide-react';
import { translations } from '../translations';

interface AnalyticsViewProps {
  stats: ChannelStats[];
  lang: Language;
  setLang: (lang: Language) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats, lang, setLang }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ChannelStats[]>(stats);
  
  const t = translations[lang].stats;

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      const result = await analyzeChannelStats(data, lang);
      setInsight(result);
      setLoading(false);
    };
    fetchInsight();
  }, [lang]);

  const refreshData = async () => {
      const freshData = await api.getChannelStats("channel_id");
      setData(freshData);
  };

  return (
    <div className="p-6 pb-32 space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">{t.title}</h2>
        <div className="flex gap-3">
            <button 
                onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
                className="w-10 h-10 flex items-center justify-center bg-[#18181b] border border-[#27272a] rounded-full text-[#a1a1aa] hover:text-white transition-colors"
            >
                <Globe size={18} />
            </button>
            <button onClick={refreshData} className="w-10 h-10 flex items-center justify-center bg-[#18181b] border border-[#27272a] rounded-full text-[#a1a1aa] hover:text-white transition-colors">
                <RefreshCw size={18} />
            </button>
        </div>
      </div>

      {/* Chart */}
      <div className="bw-card p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-6 text-[#a1a1aa]">{t.subs_views}</h3>
        <div className="h-48 w-full -ml-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dy={10} tick={{fontWeight: 500}} />
              <YAxis yAxisId="left" stroke="#fafafa" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} tick={{fontWeight: 500}} />
              <YAxis yAxisId="right" orientation="right" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tick={{fontWeight: 500}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                labelStyle={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}
              />
              <Line yAxisId="left" type="monotone" dataKey="subscribers" stroke="#fafafa" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#fafafa' }} />
              <Line yAxisId="right" type="monotone" dataKey="views" stroke="#52525b" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#52525b' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modern AI Analysis */}
      <div className="bw-card p-6 relative overflow-hidden border-white/10">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Brain size={64} />
        </div>
        
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-white text-black p-1.5 rounded-lg">
                <FileText size={18} />
            </div>
            <h3 className="font-bold text-lg text-white tracking-tight">{t.ai_consultant}</h3>
        </div>
        
        {loading ? (
            <div className="flex items-center gap-3 py-4 opacity-70">
                <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></div>
                <span className="text-sm font-medium text-[#a1a1aa]">{t.analyzing}</span>
            </div>
        ) : (
            <div className="text-sm font-medium text-[#e4e4e7] leading-loose whitespace-pre-line">
                {insight}
            </div>
        )}
      </div>

      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 flex items-start gap-4">
        <AlertCircle className="text-[#a1a1aa] shrink-0 mt-0.5" size={20} />
        <div>
            <p className="font-bold text-white mb-1 text-xs uppercase tracking-wider">{t.did_you_know}</p>
            <p className="text-sm text-[#d4d4d8] leading-relaxed">{t.tip}</p>
        </div>
      </div>
    </div>
  );
};