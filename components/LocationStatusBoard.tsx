import React, { useEffect, useState } from 'react';
import { ExternalLink, RefreshCw, MapPin, Phone, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { LocationStatus } from '../types';
import { fetchLocationStatusFromSheet } from '../services/googleSheetService';

export const LocationStatusBoard: React.FC = () => {
  const [locations, setLocations] = useState<LocationStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchLocationStatusFromSheet();
      setLocations(data);
    } catch (error) {
      console.error("Failed to load locations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="mb-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
         <div className="flex items-center gap-2">
            <div className="bg-slate-700 p-1.5 rounded-lg text-white shadow-sm">
                <MapPin className="w-5 h-5" />
            </div>
            <div>
                <h2 className="text-lg font-bold text-slate-800">各救援站點實時狀態</h2>
                <p className="text-xs text-slate-500">顯示 Google Sheet 同步的最新狀態 (所有站點)</p>
            </div>
         </div>
         <div className="flex gap-2">
             <button 
               onClick={loadData} 
               disabled={loading}
               className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
             >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> 刷新數據
             </button>
             <a 
                href="https://docs.google.com/spreadsheets/d/1C0jp45oyC0zMeBq2mcvPxWmkln8lZw3ELxajxdsuhYg/edit?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 flex items-center gap-1 transition-colors"
             >
                <ExternalLink className="w-3.5 h-3.5" /> Google Sheet
             </a>
         </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">地點名稱</th>
              <th className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">支援狀態</th>
              <th className="px-4 py-3 font-semibold text-slate-700 min-w-[200px]">目前狀況詳情</th>
              <th className="px-4 py-3 font-semibold text-slate-700 min-w-[150px]">缺資列表</th>
              <th className="px-4 py-3 font-semibold text-slate-700 min-w-[150px]">聯絡人</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {locations.map((loc) => {
              // Determine status badge style
              let statusBadge;
              let rowClass = "hover:bg-slate-50 transition-colors";

              if (loc.needs_support === true) {
                statusBadge = <span className="inline-flex items-center gap-1 text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100 text-xs"><AlertCircle className="w-3.5 h-3.5"/> 急需支援</span>;
                rowClass += " bg-red-50/30"; // Highlight urgent rows slightly
              } else if (loc.needs_support === false) {
                statusBadge = <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-xs"><CheckCircle className="w-3.5 h-3.5"/> 充足/無需</span>;
              } else {
                statusBadge = <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-xs"><HelpCircle className="w-3.5 h-3.5"/> {String(loc.needs_support || '未註明')}</span>;
              }

              return (
                <tr key={loc.id} className={rowClass}>
                  <td className="px-4 py-3 font-bold text-slate-800">
                    <div className="flex flex-col gap-1">
                        <span>{loc.location_name}</span>
                        <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.location_name + " 大埔")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-[10px] text-blue-500 hover:underline w-fit"
                        >
                        <MapPin className="w-3 h-3" /> 地圖
                        </a>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap align-top pt-4">{statusBadge}</td>
                  <td className="px-4 py-3 text-slate-600 align-top pt-4 text-xs leading-relaxed">
                      {loc.current_status}
                  </td>
                  <td className="px-4 py-3 align-top pt-4">
                     {loc.needed_items && loc.needed_items.length > 0 ? (
                       <div className="flex flex-wrap gap-1">
                         {loc.needed_items.map((item, idx) => (
                           <span key={idx} className="bg-white text-slate-700 border border-slate-200 text-xs px-2 py-0.5 rounded shadow-sm">
                             {item}
                           </span>
                         ))}
                       </div>
                     ) : (
                       <span className="text-slate-300 text-xs">-</span>
                     )}
                  </td>
                  <td className="px-4 py-3 text-xs align-top pt-4">
                    {loc.contacts.map((c, i) => (
                      <div key={i} className="flex flex-col mb-1.5 last:mb-0">
                        <span className="font-medium text-slate-700">{c.name}</span>
                        {c.phone && (
                          <a href={`tel:${c.phone.replace(/[^\d+]/g, '')}`} className="text-blue-600 hover:underline flex items-center gap-1 font-mono">
                             <Phone className="w-3 h-3" /> {c.phone}
                          </a>
                        )}
                      </div>
                    ))}
                  </td>
                </tr>
              );
            })}
            {locations.length === 0 && !loading && (
               <tr>
                 <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    暫無資料或無法連接 Google Sheet
                 </td>
               </tr>
            )}
            {loading && locations.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                        <div className="flex justify-center items-center gap-2">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            正在載入資料...
                        </div>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};