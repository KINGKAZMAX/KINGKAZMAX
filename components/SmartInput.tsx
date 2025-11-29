import React, { useState } from 'react';
import { parseMessageToEntries } from '../services/aiService';
import { ReliefEntry } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles, ArrowRight, Loader2, MessageSquarePlus } from 'lucide-react';

interface SmartInputProps {
  onEntriesParsed: (entries: ReliefEntry[]) => void;
}

export const SmartInput: React.FC<SmartInputProps> = ({ onEntriesParsed }) => {
  const { language, t } = useLanguage();
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setIsAnalyzing(true);
    try {
      const entries = await parseMessageToEntries(input, language);
      onEntriesParsed(entries);
      setInput(''); // Clear input on success
    } catch (e) {
      alert("無法分析訊息，請稍後再試。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          {t('smartInputTitle')}
        </h3>
        <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">Powered by Gemini</span>
      </div>
      <div className="p-4">
        <p className="text-sm text-slate-500 mb-3">
          {t('smartInputDescription')}
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('smartInputPlaceholder')}
          className="w-full h-32 p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none mb-3"
        />
        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !input.trim()}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isAnalyzing || !input.trim()
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('smartInputButtonAnalyzing')}
              </>
            ) : (
              <>
                <MessageSquarePlus className="w-4 h-4" />
                {t('smartInputButtonExtract')}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
