import React, { useState } from 'react';
import { Search, MapPin, Phone, Info, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PetSupportEntry } from '../types';
// FIX: Imported translations to resolve 'Cannot find name translations' error and allow correct type checking.
import { translations } from '../translations';

// --- 1. 完整數據源 (JSON) ---
const ANIMAL_RELIEF_DATA: PetSupportEntry[] = [
  {
    id: 1,
    name: "大圍珍禽異獸及動物醫院 (24小時)",
    phone: "2687 1030",
    address: "沙田大圍積信街75號",
    note: "",
    category: "medical",
    urgent: true
  },
  {
    id: 2,
    name: "城大醫療動物中心",
    phone: "3650 3200",
    address: "香港九龍深水埗醫局街202號",
    note: "豁免診金 (貓狗醫療協助)",
    category: "medical",
    urgent: false
  },
  {
    id: 3,
    name: "土瓜灣動物醫院",
    phone: "9653 5735",
    address: "馬頭涌北帝街139號",
    note: "兩棲及爬蟲協會提供免費建議、檢查及診症服務",
    category: "medical",
    urgent: false
  },
  {
    id: 4,
    name: "28/11 NPV 動物流動獸醫診所",
    phone: "5931 9764",
    address: "大埔運頭街10號聖母無玷之心堂",
    note: "為宏福苑火災貓狗提供免費緊急醫療服務",
    category: "medical",
    urgent: true
  },
  {
    id: 5,
    name: "NPV動物醫院 (貓狗)",
    phone: "5931 9764",
    address: "太子基隆街50號A院",
    note: "NPV優先預留急症位置予大埔宏福苑火災受影響的貓狗，緊急醫療費用全免",
    category: "medical",
    urgent: true
  },
  {
    id: 6,
    name: "N24社區動物醫院 (24小時)",
    phone: "2956 5999",
    address: "洪水橋德興樓地下4-6號舖",
    note: "診金及X光免費",
    category: "medical",
    urgent: true
  },
  {
    id: 7,
    name: "出借寵物氧氣 (QQ O2)",
    phone: "5541 6234 (Q媽) | 9790 5359 (Abby)",
    address: "-",
    note: "WhatsApp Call",
    category: "supplies",
    urgent: true
  },
  {
    id: 8,
    name: "新界(北)動物醫療中心",
    phone: "2507 7411 / 8404 2979",
    address: "新界上水新豐路50至52號地下",
    note: "診金全免 | IG @ntnamc.vet | 營業時間：早上9時至午夜12時",
    category: "medical",
    urgent: false
  },
  {
    id: 9,
    name: "香港社企動物醫院 @hksev",
    phone: "2668 6618",
    address: "-",
    note: "24小時服務；聞氧免費",
    category: "medical",
    urgent: true
  },
  {
    id: 10,
    name: "免費刺蝟托管服務",
    phone: "IG @hongkonghedgehog",
    address: "-",
    note: "費用一律全免，直至有需要人士 settle down",
    category: "shelter",
    urgent: false
  },
  {
    id: 11,
    name: "Rola小寵物免費緊急暫託",
    phone: "IG/FB: rolathepet",
    address: "-",
    note: "其他小型動物可查詢",
    category: "shelter",
    urgent: false
  },
  {
    id: 12,
    name: "Don Don Pet Travel",
    phone: "9440 6668",
    address: "-",
    note: "免費提供飛機籠，貓暫住",
    category: "shelter",
    urgent: false
  },
  {
    id: 13,
    name: "動物暫托 (貓) - 大埔人大埔貓",
    phone: "FB @大埔人大埔貓專頁",
    address: "-",
    note: "",
    category: "shelter",
    urgent: false
  },
  {
    id: 14,
    name: "動物暫托 (貓) - 香港群貓會",
    phone: "FB @香港群貓會",
    address: "-",
    note: "",
    category: "shelter",
    urgent: false
  },
  {
    id: 15,
    name: "動物暫托 (狗) - 唯珍牽",
    phone: "5408 9929",
    address: "-",
    note: "IG @reginapaws_hk",
    category: "shelter",
    urgent: false
  },
  {
    id: 16,
    name: "小腳板動物診所",
    phone: "9864 1089",
    address: "-",
    note: "免費提供檢查及治療支援 | 11月28-27日 11am-7pm",
    category: "medical",
    urgent: true
  },
  {
    id: 17,
    name: "懷仁動物醫院",
    phone: "21915 636",
    address: "大埔懷仁街31號地下",
    note: "支援宏福苑居民和動物-免診金 | 需簡單核實住址",
    category: "medical",
    urgent: true
  },
  {
    id: 18,
    name: "臨時安置 (貓狗) - 香港拯救貓狗協會",
    phone: "9864 1089",
    address: "-",
    note: "IG @hkscda",
    category: "shelter",
    urgent: false
  },
  {
    id: 19,
    name: "阿棍屋",
    phone: "9738 7272",
    address: "-",
    note: "IG @hjoyandmercy",
    category: "shelter",
    urgent: false
  },
  {
    id: 20,
    name: "香港寵物會寵物救援團隊救護車",
    phone: "9782 2999 / 5481 4646",
    address: "大埔宏福苑附近待命",
    note: "通報單位編號及寵物種類 | 準備好氧氣急救用品",
    category: "transport",
    urgent: true
  },
  {
    id: 21,
    name: "Your Wellness Partner",
    phone: "IG/FB @Your Wellness Partner",
    address: "-",
    note: "提供貓砂/尿墊/貓狗糧食",
    category: "supplies",
    urgent: false
  },
  {
    id: 22,
    name: "寵物基本護理、清潔、洗澡",
    phone: "4645 3939",
    address: "大埔中心",
    note: "IG @eonpetgrooomer | 由寵物美容師提供，於大埔中心住所提供服務",
    category: "service",
    urgent: false
  },
  {
    id: 23,
    name: "普益獸醫診所",
    phone: "2653 3632",
    address: "香港新界大埔普益街19號地舖",
    note: "義診、治療",
    category: "medical",
    urgent: true
  }
];

// --- 2. 輔助函數與組件 ---

interface CategoryBadgeProps {
  category: PetSupportEntry['category'];
  urgent: boolean;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, urgent }) => {
  const { t } = useLanguage();
  const styles: Record<PetSupportEntry['category'] | 'default', string> = {
    medical: "bg-blue-100 text-blue-800 border-blue-200",
    shelter: "bg-green-100 text-green-800 border-green-200",
    supplies: "bg-yellow-100 text-yellow-800 border-yellow-200",
    transport: "bg-red-100 text-red-800 border-red-200",
    service: "bg-purple-100 text-purple-800 border-purple-200",
    default: "bg-gray-100 text-gray-800 border-gray-200"
  };

  return (
    <div className="flex gap-2">
      <span className={`px-2 py-1 rounded-md text-xs font-bold border ${styles[category] || styles.default}`}>
        {/* FIX: Cast dynamic key to `keyof typeof translations` to satisfy TypeScript's t function type */}
        {t(`petSupportCategory${category.charAt(0).toUpperCase() + category.slice(1)}` as keyof typeof translations)}
      </span>
      {urgent && (
        <span className="px-2 py-1 rounded-md text-xs font-bold bg-red-500 text-white animate-pulse">
          {t('petSupportEmergencySupport')}
        </span>
      )}
    </div>
  );
};

const parsePhoneAndLinks = (text: string) => {
  const phoneRegex = /([4-9]\d{3}[ -]?\d{4}|[23]\d{3}[ -]?\d{4})/g;
  const instagramRegex = /(IG @[a-zA-Z0-9._]+)/g;
  const facebookRegex = /(FB @[a-zA-Z0-9._]+)/g;
  
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  const combinedRegex = new RegExp(`(${phoneRegex.source}|${instagramRegex.source}|${facebookRegex.source})`, 'g');

  text.split(combinedRegex).forEach((part, index) => {
    if (!part) return;

    if (part.match(phoneRegex)) {
      const digits = part.replace(/[^\d]/g, '');
      parts.push(
        <a key={index} href={`tel:${digits}`} className="text-blue-600 hover:underline flex items-center gap-1">
          <Phone className="w-3 h-3" /> {part}
        </a>
      );
    } else if (part.match(instagramRegex)) {
        const username = part.split('@')[1];
        parts.push(
            <a key={index} href={`https://www.instagram.com/${username}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> {part}
            </a>
        );
    } else if (part.match(facebookRegex)) {
        const pageName = part.split('@')[1];
        parts.push(
            <a key={index} href={`https://www.facebook.com/${pageName}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> {part}
            </a>
        );
    }
    else {
      parts.push(<span key={index}>{part}</span>);
    }
  });

  return <>{parts}</>;
};

// --- 3. 主組件 ---

export const PetSupportInfo: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = Array.from(new Set(ANIMAL_RELIEF_DATA.map(s => s.category))).sort();
  
  const filteredData = ANIMAL_RELIEF_DATA.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      {/* Header */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
          🐾 {t('petSupportTitle')}
        </h2>
        <p className="text-xs text-slate-500">
          {t('petSupportSubtitle')}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="p-4 space-y-4 border-b border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder={t('petSupportSearchPlaceholder')}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-slate-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {[
            { id: "all", label: t('petSupportFilterAll') },
            { id: "medical", label: t('petSupportFilterMedical') },
            { id: "shelter", label: t('petSupportFilterShelter') },
            { id: "transport", label: t('petSupportFilterTransport') },
            { id: "supplies", label: t('petSupportFilterSupplies') },
            { id: "service", label: t('petSupportCategoryService') }, // Add service category filter
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filterCategory === cat.id 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            
            <div className="flex justify-between items-start mb-3">
              <CategoryBadge category={item.category} urgent={item.urgent} />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
              {item.name}
            </h3>

            <div className="space-y-2 text-sm text-slate-600">
              {/* Phone / Contact */}
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 text-slate-400 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  {parsePhoneAndLinks(item.phone)}
                </div>
              </div>

              {/* Address */}
              {item.address !== "-" && (
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address + " 香港大埔")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-slate-600 hover:text-blue-600 hover:underline transition-colors"
                >
                  <MapPin className="w-4 h-4 mt-1 text-slate-400 shrink-0" />
                  <span>{item.address}</span>
                </a>
              )}

              {/* Note */}
              {item.note && (
                <div className="flex items-start gap-2 mt-3 pt-3 border-t border-slate-100">
                  <Info className="w-4 h-4 mt-0.5 text-orange-500 shrink-0" />
                  <span className="text-slate-700 bg-orange-50 px-2 py-1 rounded text-xs">
                    {item.note}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-10 text-slate-500">
          {t('petSupportNoData')}
        </div>
      )}
    </div>
  );
};