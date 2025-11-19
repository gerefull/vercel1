import React, { useState } from 'react';
import { Bot, ArrowRight, Zap, AlertTriangle } from 'lucide-react';
import { translations } from '../translations';
import { Language } from '../types';
import { api } from '../services/api';

interface ConnectViewProps {
  onConnect: (channelName: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const ConnectView: React.FC<ConnectViewProps> = ({ onConnect, lang, setLang }) => {
  const [step, setStep] = useState(1);
  const [channelName, setChannelName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const t = translations[lang].connect;

  const validateInput = (input: string) => {
    const regex = /^(?:@|(?:https?:\/\/)?(?:t|telegram)\.me\/)([a-zA-Z0-9_]{5,32})$/;
    return regex.test(input);
  };

  const handleConnect = async () => {
    setError('');
    
    if (!channelName) {
      setError(lang === 'ru' ? 'Введите имя канала' : 'Channel name required');
      return;
    }

    if (!validateInput(channelName)) {
      setError(lang === 'ru' ? 'Неверный формат' : 'Invalid format');
      return;
    }

    setLoading(true);
    const verified = await api.verifyChannel(channelName);
    
    if (verified) {
        onConnect(channelName);
    } else {
        setError(lang === 'ru' ? 'Ошибка верификации' : 'Verification failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-[#09090b]">
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-end z-10">
        <button 
          onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
          className="flex items-center gap-2 bg-[#18181b] border border-[#27272a] rounded-full px-4 py-2 text-xs font-bold text-[#a1a1aa] hover:text-white transition-colors"
        >
          {lang === 'en' ? 'EN' : 'RU'}
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full animate-fade-in mt-8">
        
        <div className="mb-8 p-6 bg-[#18181b] rounded-3xl border border-[#27272a] shadow-lg">
            <Bot size={48} className="text-white" strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl font-bold mb-3 text-white tracking-tight">
            {t.title}
        </h1>
        <p className="text-[#a1a1aa] mb-10 text-base font-medium leading-relaxed">
          {t.subtitle}
        </p>

        <div className="w-full bw-card overflow-hidden">
            <div className="p-6">
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
                            <h2 className="font-semibold text-lg text-white">{t.step1}</h2>
                            <span className="text-xs font-bold text-[#a1a1aa] bg-[#27272a] rounded-full px-2 py-1">1/2</span>
                        </div>
                        <div className="text-sm font-medium text-[#d4d4d8] text-left flex gap-4 items-start leading-relaxed">
                            <div className="mt-1 shrink-0 bg-[#27272a] p-2 rounded-lg">
                                <Zap size={16} className="text-white" />
                            </div>
                            {t.step1_desc}
                        </div>
                        <button 
                            onClick={() => setStep(2)}
                            className="w-full bw-button py-3.5 text-base shadow-lg shadow-white/5"
                        >
                            {t.btn_added}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
                            <h2 className="font-semibold text-lg text-white">{t.step2}</h2>
                            <span className="text-xs font-bold text-[#a1a1aa] bg-[#27272a] rounded-full px-2 py-1">2/2</span>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="relative group">
                              <input
                                  type="text"
                                  placeholder={t.placeholder}
                                  value={channelName}
                                  onChange={(e) => setChannelName(e.target.value)}
                                  className="w-full p-4 text-base text-white placeholder-[#52525b]"
                              />
                          </div>
                          {error && (
                            <div className="flex items-center gap-2 text-xs font-medium text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                              <AlertTriangle size={16} /> {error}
                            </div>
                          )}
                        </div>

                        <button 
                            onClick={handleConnect}
                            disabled={loading}
                            className={`w-full py-3.5 font-semibold text-base rounded-xl flex items-center justify-center gap-2 transition-all ${
                            loading 
                                ? 'bg-[#27272a] text-[#a1a1aa] cursor-wait' 
                                : 'bg-white text-black hover:bg-gray-200'
                            }`}
                        >
                            {loading ? (
                                <span className="animate-pulse">{t.verifying}</span>
                            ) : (
                            <>
                                {t.btn_verify} <ArrowRight size={18} />
                            </>
                            )}
                        </button>
                        
                        <button 
                          onClick={() => setStep(1)}
                          className="text-xs font-medium text-[#a1a1aa] hover:text-white transition-colors w-full text-center"
                        >
                          {lang === 'ru' ? 'Вернуться назад' : 'Go back'}
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};