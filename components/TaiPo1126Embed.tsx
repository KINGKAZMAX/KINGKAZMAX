import React from 'react';
import { HeartHandshake, ExternalLink } from 'lucide-react';

export const TaiPo1126Embed: React.FC = () => {
  const targetUrl = "https://taipo1126.com/";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col mb-8">
       <div className="bg-teal-50 px-4 py-3 border-b border-teal-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="bg-teal-600 p-1.5 rounded-lg text-white shadow-sm">
                <HeartHandshake className="w-5 h-5" />
             </div>
             <div>
                <h3 className="font-bold text-teal-900 leading-tight">宏福苑互助平台</h3>
                <p className="text-[10px] text-teal-700/70">社區互助資源</p>
             </div>
          </div>
          <a 
             href={targetUrl}
             target="_blank" 
             rel="noopener noreferrer"
             className="text-xs font-medium text-teal-600 hover:text-teal-800 bg-white/50 hover:bg-white px-2.5 py-1.5 rounded-lg border border-teal-200 flex items-center gap-1 transition-colors"
          >
             <ExternalLink className="w-3.5 h-3.5" /> 前往網站
          </a>
       </div>
       <div className="w-full h-[600px] relative bg-slate-50">
          <iframe 
             src={targetUrl}
             className="w-full h-full border-0"
             title="Tai Po 1126 Mutual Aid"
             loading="lazy"
             sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 to-transparent p-2 text-center text-[10px] text-slate-400 pointer-events-none">
             如無法顯示，請點擊上方按鈕前往網站查看
          </div>
       </div>
    </div>
  );
};