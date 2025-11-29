import React, { useState } from 'react';
import { ReliefEntry } from '../types';
import { RefreshCw, ExternalLink, Package, MapPin, Filter } from 'lucide-react';

interface SupplyStatusListProps {
  supplies: ReliefEntry[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const SupplyStatusList: React.FC<SupplyStatusListProps> = ({ supplies, isLoading, onRefresh }) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const categories = Array.from(new Set(supplies.map(s => s.category).filter(Boolean)));
  
  const filteredSupplies = supplies.filter(s => {
    if (filterCategory !== 'ALL' && s.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
           <div className="bg-indigo-600 p-1.5 rounded-lg text-white shadow-sm">
             <Package className="w-5 h-5" />
           </div>
           <div>
             <h3 className="font-bold text-slate-800 text-lg leading-tight">物資供應總覽</h3>
             <div className="flex items-center gap-2 mt-0.5">
               <span className="text-[10px] text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">實時更新</span>
               <a 
                 href="https://docs.google.com/spreadsheets/d/1C0jp45oyC0zMeBq2mcvPxWmkln8lZw3ELxajxdsuhYg/edit?usp=sharing"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-[10px] text-blue-600 hover:underline flex items-center gap-1"
               >
                 <ExternalLink className="w-3 h-3" /> 查看原始 Google Sheet
               </a>
             </div>
           </div>
        </div>

        <div className="flex items-center gap-2">
           {categories.length > 0 && (
             <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1">
               <Filter className="w-3.5 h-3.5 text-slate-400" />
               <select 
                  className="text-xs border-none outline-none text-slate-600 bg-transparent pr-2"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
               >
                 <option value="ALL">所有類別</option>
                 {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
               </select>
             </div>
           )}
           
           <button 
             onClick={onRefresh}
             disabled={isLoading}
             className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
             title="刷新列表"
           >
             <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
           </button>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[400px]">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-4 py-2 font-semibold text-slate-600 border-b border-slate-200">類別</th>
              <th className="px-4 py-2 font-semibold text-slate-600 border-b border-slate-200">物資名稱</th>
              <th className="px-4 py-2 font-semibold text-slate-600 border-b border-slate-200">數量</th>
              <th className="px-4 py-2 font-semibold text-slate-600 border-b border-slate-200">存放地點</th>
              <th className="px-4 py-2 font-semibold text-slate-600 border-b border-slate-200">狀態/備註</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {supplies.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400 italic">
                   {isLoading ? '正在讀取物資清單...' : '暫無物資記錄或無法讀取 Google Sheet'}
                </td>
              </tr>
            ) : filteredSupplies.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2 text-xs text-slate-500 font-medium">
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{item.category}</span>
                </td>
                <td className="px-4 py-2 font-bold text-slate-800">{item.item}</td>
                <td className="px-4 py-2 font-mono text-indigo-600 font-bold">{item.quantity}</td>
                <td className="px-4 py-2 text-slate-600 text-xs">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {item.location}
                  </div>
                </td>
                <td className="px-4 py-2 text-xs">
                   {item.notes ? (
                     <span className="text-slate-600 block max-w-[200px] truncate" title={item.notes}>{item.notes}</span>
                   ) : (
                     <span className="text-slate-300">-</span>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};