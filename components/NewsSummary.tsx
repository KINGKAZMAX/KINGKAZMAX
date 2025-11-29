import React, { useState, useEffect, useCallback } from 'react';
// FIX: Corrected the import path for the Google Gemini API SDK.
import { GoogleGenAI } from '@google/genai';
import { useLanguage } from '../contexts/LanguageContext';
import { Newspaper, RefreshCw, Link as LinkIcon, AlertTriangle } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export const NewsSummary: React.FC = () => {
  const { language, t } = useLanguage();
  const [summary, setSummary] = useState<string>('');
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const getLanguageForAI = () => {
    switch (language) {
      case 'zhCN': return 'Simplified Chinese (简体中文)';
      case 'en': return 'English';
      default: return 'Traditional Chinese (繁體中文)';
    }
  };

  const generateSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const aiLanguage = getLanguageForAI();
      const prompt = `
        You are a news summarization AI. Your task is to provide the latest real-time status update on the "香港大埔火災" (Hong Kong Tai Po Fire) incident.
        
        Instructions:
        1. Use your search tool to find the most recent information (within the last 12 hours if possible) from major, reputable news websites (e.g., RTHK, Ming Pao, SCMP, HK01).
        2. Synthesize the information into a concise, neutral summary written in **${aiLanguage}**.
        3. The summary should cover key points like: current fire status, rescue operations, casualties, official announcements, and arrangements for affected residents.
        4. Do not include speculation. Stick to factual reporting.
        5. The summary should be around 150-200 characters.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      
      setSummary(response.text || '暫時無法生成摘要。');
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const uniqueSources = Array.from(new Map(groundingChunks.map((item: GroundingChunk) => [item.web.uri, item])).values());
      setSources(uniqueSources);

      setLastUpdated(new Date());

    } catch (e) {
      console.error("Error generating news summary:", e);
      setError(t('newsSummaryError'));
      setSummary('');
      setSources([]);
    } finally {
      setIsLoading(false);
    }
  }, [language, t]);

  useEffect(() => {
    generateSummary();
    const interval = setInterval(() => {
      generateSummary();
    }, 6 * 60 * 60 * 1000); // 6 hours

    return () => clearInterval(interval);
  }, [generateSummary]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-slate-700 p-1.5 rounded-lg text-white shadow-sm">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{t('newsSummaryTitle')}</h2>
            <p className="text-xs text-slate-500">
              {lastUpdated ? `${t('newsSummaryUpdatedAt')}: ${lastUpdated.toLocaleString('zh-HK')}` : t('newsSummaryFetching')}
            </p>
          </div>
        </div>
        <button
          onClick={generateSummary}
          disabled={isLoading}
          className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? t('newsSummaryUpdating') : t('newsSummaryRefresh')}
        </button>
      </div>
      <div className="p-6">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-slate-500 py-8">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>正在從各大新聞網站匯總最新資訊...</span>
          </div>
        )}
        {error && !isLoading && (
            <div className="flex flex-col items-center justify-center gap-2 text-red-600 bg-red-50 p-6 rounded-lg border border-red-200">
                <AlertTriangle className="w-8 h-8"/>
                <span className="font-medium">{error}</span>
            </div>
        )}
        {!isLoading && !error && summary && (
          <div>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
            {sources.length > 0 && (
              <div className="mt-6 border-t border-slate-200 pt-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('newsSummarySources')}</h4>
                <ul className="space-y-1.5">
                  {sources.map((source, index) => (
                    <li key={index}>
                      <a 
                        href={source.web.uri} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors group"
                      >
                        <LinkIcon className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0" />
                        <span className="truncate">{source.web.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};