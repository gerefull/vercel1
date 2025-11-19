import React, { useState } from 'react';
import { Post, Language } from './types';
import { generatePostContent } from './geminiService';
import { Sparkles, Plus, Clock, Trash2, X, Globe } from 'lucide-react';
import { translations } from './translations';

interface SchedulerViewProps {
  posts: Post[];
  onAddPost: (post: Post) => void;
  onDeletePost: (id: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const SchedulerView: React.FC<SchedulerViewProps> = ({ posts, onAddPost, onDeletePost, lang, setLang }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const t = translations[lang].scheduler;
  
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [manualContent, setManualContent] = useState('');
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [scheduleDate, setScheduleDate] = useState('');

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    const content = await generatePostContent(topic, tone, lang);
    setManualContent(content);
    setMode('manual'); 
    setIsGenerating(false);
  };

  const handleSave = () => {
    if (!manualContent || !scheduleDate) return;
    
    const newPost: Post = {
      id: Date.now().toString(),
      content: manualContent,
      scheduledTime: new Date(scheduleDate),
      status: 'scheduled',
      generatedByAi: isGenerating || mode === 'ai', 
      topic: topic
    };

    onAddPost(newPost);
    setShowModal(false);
    setTopic('');
    setManualContent('');
    setScheduleDate('');
  };

  const sortedPosts = [...posts].sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());

  return (
    <div className="p-6 pb-32 h-full relative max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">{t.title}</h2>
        <div className="flex gap-3">
            <button 
                onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
                className="w-10 h-10 flex items-center justify-center bg-[#18181b] border border-[#27272a] rounded-full text-[#a1a1aa] hover:text-white transition-colors"
            >
                <Globe size={18} />
            </button>
            <button 
                onClick={() => setShowModal(true)}
                className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:bg-[#e4e4e7] transition-colors"
            >
                <Plus size={20} />
            </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {sortedPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center mt-16 opacity-60">
            <div className="w-16 h-16 bg-[#18181b] rounded-2xl border border-[#27272a] flex items-center justify-center mb-4">
                <Clock size={28} className="text-[#a1a1aa]" />
            </div>
            <p className="text-white font-semibold text-lg">{t.empty_state}</p>
            <p className="text-sm text-[#71717a] mt-1">{t.empty_sub}</p>
          </div>
        )}
        
        {sortedPosts.map((post) => (
          <div key={post.id} className="bw-card p-4 relative group hover:border-[#3f3f46]">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2 text-xs font-medium text-[#a1a1aa] bg-[#27272a] px-2.5 py-1 rounded-lg">
                <Clock size={12} />
                {post.scheduledTime.toLocaleDateString()} • {post.scheduledTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
              </div>
              {post.generatedByAi && (
                <div className="bg-white/10 text-white px-2 py-0.5 rounded-md border border-white/10 text-[10px] font-bold uppercase">
                  AI Gen
                </div>
              )}
            </div>
            <p className="text-[#fafafa] text-sm font-medium whitespace-pre-wrap leading-relaxed">{post.content}</p>
            
            <button 
              onClick={() => onDeletePost(post.id)}
              className="absolute top-3 right-3 text-[#71717a] hover:text-red-400 p-1 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Post Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#09090b] w-full max-w-md border border-[#27272a] rounded-3xl p-6 animate-fade-in shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">{t.new_post}</h3>
              <button onClick={() => setShowModal(false)} className="bg-[#18181b] p-2 rounded-full text-[#a1a1aa] hover:text-white"><X size={20} /></button>
            </div>

            <div className="flex bg-[#18181b] p-1 rounded-xl mb-6">
              <button 
                onClick={() => setMode('ai')}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${mode === 'ai' ? 'bg-[#27272a] text-white shadow-sm' : 'text-[#a1a1aa] hover:text-white'}`}
              >
                 {t.tab_ai}
              </button>
              <button 
                onClick={() => setMode('manual')}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${mode === 'manual' ? 'bg-[#27272a] text-white shadow-sm' : 'text-[#a1a1aa] hover:text-white'}`}
              >
                {t.tab_manual}
              </button>
            </div>

            {mode === 'ai' ? (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-[#a1a1aa] block mb-2 uppercase tracking-wide">{t.topic_label}</label>
                  <input 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t.topic_placeholder}
                    className="w-full p-3.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#a1a1aa] block mb-2 uppercase tracking-wide">{t.tone_label}</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.entries(t.tones).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setTone(label)}
                            className={`text-xs py-2.5 px-3 border rounded-xl transition-all font-medium ${tone === label ? 'bg-white text-black border-white' : 'bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46]'}`}
                        >
                            {label}
                        </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic}
                  className="w-full bw-button py-3.5 text-sm flex justify-center items-center gap-2 mt-2 shadow-lg shadow-white/5"
                >
                  {isGenerating ? (
                    <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></div>
                  ) : (
                    <>
                      {t.generate_btn} <Sparkles size={16} />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <textarea 
                  value={manualContent}
                  onChange={(e) => setManualContent(e.target.value)}
                  placeholder="Write your post content..."
                  rows={6}
                  className="w-full p-4 text-sm leading-relaxed resize-none"
                />
                <div>
                  <label className="text-xs font-semibold text-[#a1a1aa] block mb-2 uppercase tracking-wide">Schedule Date</label>
                  <input 
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full p-3.5 text-sm [color-scheme:dark]"
                  />
                </div>
                <button 
                  onClick={handleSave}
                  disabled={!manualContent || !scheduleDate}
                  className="w-full bw-button py-3.5 text-sm mt-2"
                >
                  {t.schedule_btn}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
