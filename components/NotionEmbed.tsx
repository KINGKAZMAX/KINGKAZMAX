import React from 'react';
import { BookMarked, ExternalLink } from 'lucide-react';

export const NotionEmbed: React.FC = () => {
  const targetUrl = "https://opaque-laundry-ab5.notion.site/150-2b797bbbedf88061b0b3f8970b8642a7";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col mb-8">
       <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="bg-slate-800 p-1.5 rounded-lg text-white shadow-sm">
                <BookMarked className="w-5 h-5" />
             </div>
             <div>
                <h3 className="font-bold text-slate-900 leading-tight">大埔火災全港150+資源整合</h3>
                <p className="text-[10px] text-slate-500/70">來自 Notion 協作平台</p>
             </div>
          </div>
          <a
             href={targetUrl}
             target="_blank"
             rel="noopener noreferrer"
             className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-white/50 hover:bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 transition-colors"
          >
             <ExternalLink className="w-3.5 h-3.5" /> 前往 Notion
          </a>
       </div>
       <div className="w-full h-[600px] relative bg-slate-50">
          <iframe
             src={targetUrl}
             className="w-full h-full border-0"
             title="Tai Po Fire All HK 150+ Resource Integration"
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
