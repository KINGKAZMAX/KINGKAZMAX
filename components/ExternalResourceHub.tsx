import React from 'react';
import { ExternalLink, FileText, Map, Home, MessageCircle, Send, Globe, Link as LinkIcon, Users, BookMarked } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const ExternalResourceHub: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div id="external-resources" className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8 scroll-mt-24">
      <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="bg-indigo-600 p-1.5 rounded-lg text-white shadow-sm">
             <LinkIcon className="w-5 h-5" />
           </div>
           <div>
             <h3 className="font-bold text-slate-800 text-lg leading-tight">{t('externalResourceHubTitle')}</h3>
             <p className="text-xs text-slate-500">資訊匯總 • 住宿地圖 • 通訊群組</p>
           </div>
        </div>
        <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded-full font-medium">第三方資源</span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide pb-2 border-b border-slate-100">
              <Globe className="w-4 h-4 text-indigo-500" />
              核心資訊平台
            </h4>
            
            <a href="https://wangfuk-fire-sos.netlify.app/" target="_blank" rel="noopener noreferrer" 
               className="group flex items-start gap-3 p-3 rounded-xl border border-indigo-100 bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-200 transition-all">
               <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 group-hover:scale-110 transition-transform">
                  <Globe className="w-5 h-5" />
               </div>
               <div>
                  <div className="font-bold text-indigo-900 text-sm flex items-center gap-1">
                     🕸️ 出/收物資統一資訊平台
                     <ExternalLink className="w-3 h-3 opacity-50" />
                  </div>
                  <p className="text-xs text-indigo-700/70 mt-1 leading-relaxed">
                     wangfuk-fire-sos.netlify.app
                  </p>
               </div>
            </a>

            <a href="https://docs.google.com/spreadsheets/d/1EDxjs45cfmaK3vAE8lmqXjASWXkJkjKbc4pkKRnQFTc/edit?gid=506658690#gid=506658690" target="_blank" rel="noopener noreferrer" 
               className="group flex items-start gap-3 p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-200 transition-all">
               <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
               </div>
               <div>
                  <div className="font-bold text-emerald-900 text-sm flex items-center gap-1">
                     「心連心」一站式支援資訊平台
                     <ExternalLink className="w-3 h-3 opacity-50" />
                  </div>
                  <p className="text-xs text-emerald-700/70 mt-1 leading-relaxed">
                     Google 試算表匯總
                  </p>
               </div>
            </a>

            <a href="https://opaque-laundry-ab5.notion.site/150-2b797bbbedf88061b0b3f8970b8642a7" target="_blank" rel="noopener noreferrer" 
               className="group flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-200 transition-all">
               <div className="bg-slate-100 p-2 rounded-lg text-slate-600 group-hover:scale-110 transition-transform">
                  <BookMarked className="w-5 h-5" />
               </div>
               <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1">
                     大埔火災全港150+資源整合
                     <ExternalLink className="w-3 h-3 opacity-50" />
                  </div>
                  <p className="text-xs text-slate-700/70 mt-1 leading-relaxed">
                     Notion 協作平台
                  </p>
               </div>
            </a>
          </div>

          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide pb-2 border-b border-slate-100">
              <Home className="w-4 h-4 text-orange-500" />
              住宿與研究數據 (本土研究社)
            </h4>
            
            <div className="grid gap-3">
              <a href="https://shorturl.at/EuK07" target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition-all group">
                 <Map className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                 <span className="text-sm font-medium text-slate-700 group-hover:text-orange-800">大埔區閒置房屋及住宿設施地圖</span>
              </a>
              
              <a href="https://shorturl.at/RarON" target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition-all group">
                 <Home className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                 <span className="text-sm font-medium text-slate-700 group-hover:text-orange-800">大埔鄰近可供利用的住宿資源</span>
              </a>
            </div>
          </div>

          <div className="space-y-4">
             <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide pb-2 border-b border-slate-100">
              <Users className="w-4 h-4 text-blue-500" />
              即時通訊群組
            </h4>

            <div className="bg-sky-50 border border-sky-100 rounded-xl p-3">
               <div className="flex items-center gap-2 mb-2 text-sky-700 text-xs font-bold">
                  <Send className="w-3.5 h-3.5" /> Telegram 群組
               </div>
               <div className="flex flex-wrap gap-2">
                  <a href="https://t.me/+7PObuQ5xWiI2ZGFl" target="_blank" rel="noreferrer" className="px-2 py-1 bg-white text-sky-600 text-xs rounded border border-sky-200 hover:bg-sky-100 transition-colors">大埔救援(大組)</a>
                  <a href="https://t.me/+eZU1LSsOI9w0YjE9" target="_blank" rel="noreferrer" className="px-2 py-1 bg-white text-sky-600 text-xs rounded border border-sky-200 hover:bg-sky-100 transition-colors">外區支援</a>
                  <a href="https://t.me/+rD2pJFnFnBswNjhl" target="_blank" rel="noreferrer" className="px-2 py-1 bg-white text-sky-600 text-xs rounded border border-sky-200 hover:bg-sky-100 transition-colors">保暖物資</a>
                  <a href="https://t.me/+KbJF_gjyBAUzMzJl" target="_blank" rel="noreferrer" className="px-2 py-1 bg-white text-sky-600 text-xs rounded border border-sky-200 hover:bg-sky-100 transition-colors">食物飲品</a>
                  <a href="https://t.me/+RXlIwyO8SIIxYTM1" target="_blank" rel="noreferrer" className="px-2 py-1 bg-white text-sky-600 text-xs rounded border border-sky-200 hover:bg-sky-100 transition-colors">小朋友物資</a>
               </div>
            </div>

            <a href="https://chat.whatsapp.com/GzrflPOshLsLRxEVfXMTbE?mode=wwt" target="_blank" rel="noreferrer" 
               className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 transition-colors group">
               <div className="flex items-center gap-2">
                  <div className="bg-green-500 text-white p-1 rounded-full">
                     <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-green-800">火災時事及救援 4群</span>
               </div>
               <ExternalLink className="w-3.5 h-3.5 text-green-600 opacity-50 group-hover:opacity-100" />
            </a>

          </div>

        </div>
      </div>
    </div>
  );
};
