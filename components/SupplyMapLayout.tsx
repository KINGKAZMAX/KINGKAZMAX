import React from 'react';
import { Map, ArrowUp, ArrowDown, Info, ExternalLink } from 'lucide-react';

export const SupplyMapLayout: React.FC = () => {
  const mapUrl = "https://www.google.com/maps/search/?api=1&query=Kwong+Fuk+Estate+Shopping+Centre+Tai+Po";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
           <div className="bg-emerald-600 p-1.5 rounded-lg text-white shadow-sm">
             <Map className="w-5 h-5" />
           </div>
           <div>
             <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-lg leading-tight">廣福邨商場物資擺放平面圖</h3>
                <a 
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
                  title="在 Google 地圖上查看"
                >
                   <ExternalLink className="w-3 h-3" />
                   Google Map
                </a>
             </div>
             <p className="text-xs text-slate-500">地面層 (G/F) • 最後更新: 11/28 02:20</p>
           </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
           <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-100 border border-blue-300"></div> 食物</span>
           <span className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-100 border border-amber-300"></div> 衣物</span>
           <span className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-100 border border-rose-300"></div> 醫療</span>
        </div>
      </div>

      <div className="p-4 md:p-8 bg-slate-50/30 overflow-x-auto">
        {/* Map Container - Min width ensures it doesn't get crushed on mobile */}
        <div className="relative min-w-[800px] bg-white border-2 border-slate-300 rounded-lg p-6 shadow-sm grid grid-cols-12 gap-4 text-center font-bold text-slate-700 select-none">
          
          {/* Top Info */}
          <div className="col-span-3 row-span-2 border-r-2 border-slate-200 flex flex-col justify-center items-center text-slate-400 p-2">
              <span className="writing-vertical-lr text-lg tracking-widest border-2 border-dashed border-slate-200 p-4 rounded-lg">
                  廣福邨商場
              </span>
              <div className="mt-4 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  居民喺 2 至 3 樓休息緊
              </div>
          </div>

          <div className="col-span-9 flex justify-center pb-4 text-xs text-slate-400 font-mono">
             11/28 02:20
          </div>

          {/* Top Center: Counseling & Medical */}
          <div className="col-span-3 col-start-5 flex gap-1">
             <div className="flex-1 border-2 border-slate-800 p-2 bg-slate-100 flex items-center justify-center">
                輔導
             </div>
             <div className="flex-1 border-2 border-slate-800 p-2 bg-slate-100 flex items-center justify-center">
                醫護分流
             </div>
          </div>

          {/* Empty Right Top */}
          <div className="col-span-4"></div>


          {/* Middle Section Rows */}
          
          {/* Row: Charging & Center items */}
          <div className="col-span-3 row-start-3 flex justify-center items-center p-4">
             <div className="border border-slate-400 p-2 text-sm bg-slate-50 rounded w-full">
                滙豐櫃員機充電
             </div>
          </div>

          <div className="col-span-2 row-start-3 col-start-4 flex gap-1">
              <div className="w-1/2 border-2 border-slate-800 p-1 bg-blue-50 flex items-center justify-center text-sm">
                 梳洗
              </div>
              <div className="w-1/2 border-2 border-slate-800 p-1 bg-blue-100 flex items-center justify-center text-sm">
                 飲品
              </div>
          </div>

          {/* Garden Area (Right) */}
          <div className="col-span-3 row-span-2 col-start-8 border-4 border-black p-2 bg-white text-left text-xs relative">
              <div className="absolute -top-3 -left-3 bg-black text-white px-2 py-1 font-bold text-sm">花園</div>
              <div className="grid grid-cols-2 gap-2 h-full content-center pt-2">
                  <span className="bg-rose-50 border border-rose-100 p-1 text-center">口罩</span>
                  <span className="text-right text-rose-600 font-bold">急救</span>
                  <span className="bg-slate-100 p-1 text-center">暖包</span>
                  <span className="text-right">消毒</span>
                  <span className="bg-slate-100 p-1 text-center">包紙</span>
                  <span className="text-right">卷紙</span>
                  <span className="bg-slate-100 p-1 text-center col-span-2">尿片 / 沐浴用品 / 抽紙</span>
                  <span className="text-center col-span-2 border-t border-slate-200 mt-1 pt-1">濕紙巾</span>
              </div>
          </div>


          {/* Center Column Stack */}
          <div className="col-span-1 row-start-4 col-start-4 border-2 border-slate-800 p-1 bg-blue-50 flex flex-col justify-center text-sm">
             <span>食物</span>
             <span>飲品</span>
          </div>
          <div className="col-span-1 row-start-4 col-start-5 border-2 border-slate-800 p-1 bg-blue-50 flex items-center justify-center text-xs">
             水+乾糧
          </div>

          {/* Clothes Stack */}
          <div className="col-span-1 row-start-5 col-start-4 border-2 border-slate-800 p-1 bg-amber-50 flex flex-col justify-center text-sm">
             女裝<br/>衣物
          </div>
          <div className="col-span-1 row-start-5 col-start-5 border-2 border-slate-800 p-1 bg-amber-50 flex flex-col justify-center text-sm">
             男裝<br/>衣物
          </div>
          <div className="col-span-1 row-start-5 col-start-6 flex items-center pl-2 text-xs text-slate-500">
             拖鞋
          </div>


          <div className="col-span-1 row-start-6 col-start-4 border-2 border-slate-800 p-1 bg-amber-50 flex flex-col justify-center text-sm">
             童裝<br/>衣物
          </div>
          <div className="col-span-1 row-start-6 col-start-5 border-2 border-slate-800 p-1 bg-amber-50 flex flex-col justify-center text-sm">
             衣物
          </div>
          <div className="col-span-1 row-start-6 col-start-6 border-2 border-slate-800 p-1 bg-slate-100 flex flex-col justify-center text-sm writing-vertical-lr">
             日常用品
          </div>


          {/* Left Resident Area */}
          <div className="col-span-2 row-span-3 row-start-4 col-start-2 border-2 border-slate-800 p-3 bg-white text-left flex flex-col justify-between">
              <div className="font-bold text-base border-b border-black pb-1 mb-2 text-center">留居民用</div>
              <ul className="text-xs space-y-2 list-disc pl-4">
                  <li>杯麵餅乾</li>
                  <li>濕紙巾</li>
                  <li>暖包</li>
                  <li>必需品</li>
              </ul>
          </div>


          {/* Right Bedding */}
          <div className="col-span-1 row-span-3 row-start-5 col-start-8 border-2 border-slate-800 bg-white flex items-center justify-center p-2 text-sm writing-vertical-lr">
              床上用品
          </div>
          <div className="col-span-1 row-span-3 row-start-5 col-start-8 mt-[120px] border-2 border-slate-800 bg-white flex items-center justify-center p-2 text-sm writing-vertical-lr z-10">
              寵物物資
          </div>

          
          {/* Bottom Row */}
          <div className="col-span-12 h-8"></div> {/* Spacer */}

          <div className="col-span-3 row-start-8 col-start-3 border-t-2 border-slate-300 pt-2 text-xs">
             另一條樓梯
          </div>

          <div className="col-span-2 row-start-8 col-start-4 border-2 border-slate-800 p-2 bg-slate-100">
             記者休息
          </div>

          <div className="col-span-2 row-start-8 col-start-6 border-2 border-slate-800 p-2 bg-slate-100">
             民建聯物資站
          </div>

          <div className="col-span-2 row-start-8 col-start-8 border-2 border-slate-800 p-2 bg-slate-100">
             熊貓善堂
          </div>

          <div className="col-span-1 row-span-2 row-start-7 col-start-11 border-2 border-slate-800 p-2 bg-slate-50 flex flex-col items-center justify-center">
             <span className="writing-vertical-lr text-lg">樓梯上嚟</span>
             <ArrowUp className="w-4 h-4 mt-2" />
          </div>

        </div>
      </div>
    </div>
  );
};