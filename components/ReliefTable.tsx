import React, { useMemo, useRef, useState } from 'react';
import { ReliefEntry, Status, UrgencyLevel, EntryType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { MapPin, Phone, Clock, AlertCircle, CheckCircle, PackageOpen, Download, Loader2, Pencil, Save, X, Plus, Filter, StickyNote, FileSpreadsheet, Map, Trash2, AlertTriangle, Search } from 'lucide-react';
// @ts-ignore - html2canvas is loaded via importmap
import html2canvas from 'html2canvas';

interface ReliefTableProps {
  entries: ReliefEntry[];
  onUpdateStatus: (id: string, newStatus: Status) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updatedEntry: Partial<ReliefEntry>) => void;
  onManualAdd: () => ReliefEntry;
}

export const ReliefTable: React.FC<ReliefTableProps> = ({ entries, onUpdateStatus, onDelete, onEdit, onManualAdd }) => {
  const { t } = useLanguage();
  const tableRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ReliefEntry>>({});

  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<'ALL' | 'NEED' | 'OFFER'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const existingCategories = useMemo(() => {
    const cats = new Set(entries.map(e => e.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      if (typeFilter !== 'ALL' && entry.type !== typeFilter) return false;
      
      if (statusFilter === 'ACTIVE') {
         if (entry.status === 'COMPLETED') return false;
      } else if (statusFilter === 'COMPLETED') {
         if (entry.status !== 'COMPLETED') return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const searchableText = `
          ${entry.item} 
          ${entry.category} 
          ${entry.location} 
          ${entry.contactInfo} 
          ${entry.notes || ''} 
          ${entry.originalMessage}
        `.toLowerCase();
        
        if (!searchableText.includes(query)) return false;
      }
      
      return true;
    }).sort((a, b) => {
      if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1;
      if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1;
      
      const urgencyScore: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      const scoreA = urgencyScore[a.urgency as string] || 1;
      const scoreB = urgencyScore[b.urgency as string] || 1;
      
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      return b.timestamp - a.timestamp;
    });
  }, [entries, typeFilter, statusFilter, searchQuery]);

  const handleDownload = async () => {
    if (!tableRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(tableRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff',
        ignoreElements: (element: Element) => element.classList.contains('no-print')
      });
      
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      link.download = `Taipo-Relief-Update-${timestamp}.png`;
      link.href = url;
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('圖片下載失敗，請稍後再試。');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredEntries.length === 0) {
      alert("沒有可導出的數據");
      return;
    }

    const headers = ["類型", "狀態", "急迫性", "類別", "物品", "數量", "地點", "聯絡方法", "備註", "時間", "原始訊息"];
    
    const rows = filteredEntries.map(entry => {
      const time = new Date(entry.timestamp).toLocaleString('zh-HK');
      const urgencyMap: Record<string, string> = { 'HIGH': t('urgencyHigh'), 'MEDIUM': t('urgencyMedium'), 'LOW': t('urgencyLow') };
      const urgencyText = urgencyMap[entry.urgency] || entry.urgency;

      return [
        entry.type === 'NEED' ? t('filterNeed') : t('filterOffer'),
        entry.status === 'COMPLETED' ? t('statusCompleted') : t('filterActive'),
        urgencyText,
        entry.category,
        entry.item,
        entry.quantity,
        entry.location,
        entry.contactInfo,
        entry.notes || '',
        time,
        entry.originalMessage
      ].map(field => {
        const stringField = String(field || '');
        if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
          return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
      });
    });

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    link.href = url;
    link.download = `Taipo-Relief-Data-${timestamp}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleManualAddClick = () => {
    setTypeFilter('ALL');
    setStatusFilter('ALL'); 
    setSearchQuery('');
    
    const newEntry = onManualAdd();
    setEditingId(newEntry.id);
    setEditForm(newEntry);
  };

  const startEdit = (entry: ReliefEntry) => {
    setEditingId(entry.id);
    setEditForm({ ...entry });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (editingId && editForm) {
      onEdit(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleFormChange = (field: keyof ReliefEntry, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const getUrgencyBadge = (level: UrgencyLevel) => {
    switch (level) {
      case 'HIGH':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"><AlertCircle className="w-3 h-3"/> {t('urgencyHigh')}</span>;
      case 'MEDIUM':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">{t('urgencyMedium')}</span>;
      case 'LOW':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">{t('urgencyLow')}</span>;
    }
  };

  const renderContactInfo = (info: string) => {
    if (!info || info === 'None' || info === '無') return <span className="text-slate-400 italic">無</span>;
    
    const parts = info.split(/([4-9]\d{3}[ -]?\d{4}|[23]\d{3}[ -]?\d{4})/g);
    
    return (
      <span className="font-mono break-all">
        {parts.map((part, i) => {
          const digits = part.replace(/[^\d]/g, '');
          if (digits.length >= 8) {
             return (
               <a 
                 key={i} 
                 href={`tel:${digits}`} 
                 className="text-blue-600 hover:underline hover:text-blue-800 transition-colors font-bold"
                 onClick={(e) => e.stopPropagation()}
                 title="撥打電話"
               >
                 {part}
               </a>
             );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 relative">
         <div className="absolute top-4 right-4">
             <button 
              onClick={handleManualAddClick}
              className="flex items-center gap-1 text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> {t('reliefTableAddItem')}
            </button>
         </div>
        <PackageOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-slate-900 font-medium">暫無資料</h3>
        <p className="text-slate-500 text-sm">請在上方輸入訊息以建立第一筆記錄，或點擊手動新增。</p>
        
        <div className="mt-8 max-w-2xl mx-auto opacity-50 pointer-events-none select-none">
          <div className="text-xs text-slate-400 mb-2 font-mono uppercase tracking-widest">參考格式範例</div>
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
             <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 border-b border-slate-200">
                   <tr>
                      <th className="px-4 py-2 font-semibold text-slate-500">{t('tableHeaderStatusUrgency')}</th>
                      <th className="px-4 py-2 font-semibold text-slate-500">{t('tableHeaderItemCategoryQuantity')}</th>
                      <th className="px-4 py-2 font-semibold text-slate-500">{t('tableHeaderLocationTimeContact')}</th>
                   </tr>
                </thead>
                <tbody>
                   <tr>
                      <td className="px-4 py-3 align-top">
                         <div className="flex flex-col items-start gap-1">
                            <span className="text-[10px] bg-orange-50 text-orange-700 border border-orange-200 px-1.5 py-0.5 rounded">{t('filterNeed')}</span>
                            <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">{t('urgencyHigh')}</span>
                         </div>
                      </td>
                      <td className="px-4 py-3 align-top">
                         <div className="font-medium">便當/熱食</div>
                         <div className="text-xs text-slate-500 mt-1">食品 • 50 份</div>
                      </td>
                      <td className="px-4 py-3 align-top">
                         <div className="text-xs text-slate-600 space-y-1">
                            <div className="font-medium">大埔體育館</div>
                            <div>{new Date().toLocaleString('zh-HK')}</div>
                            <div>陳先生 9123 4567</div>
                         </div>
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div ref={tableRef} className="bg-white rounded-xl shadow-sm border border-slate-200 relative w-full">
        <datalist id="category-list">
          {existingCategories.map(cat => (
            <option key={cat} value={cat} />
          ))}
        </datalist>

        <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center bg-slate-50/70">
            <div className="flex flex-col flex-grow min-w-[200px]">
              <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  {t('reliefTableTitle')}
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">{t('reliefTableUpdatedAt')}: {new Date().toLocaleString('zh-HK', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                  onClick={handleManualAddClick}
                  className="no-print flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg shadow-sm text-xs font-medium hover:bg-blue-100 transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('reliefTableAddItem')}</span>
              </button>
              <button 
                onClick={handleExportCSV}
                className="no-print flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-600 text-xs font-medium hover:bg-slate-50 hover:text-emerald-600 transition-all active:scale-95"
                title={t('reliefTableExportCSV')}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('reliefTableExportCSV')}</span>
              </button>
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="no-print flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-600 text-xs font-medium hover:bg-slate-50 hover:text-blue-600 transition-all active:scale-95"
                title={t('reliefTableDownloadImage')}
              >
                {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Download className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{t('reliefTableDownloadImage')}</span>
                <span className="sm:hidden">{t('reliefTableDownload')}</span>
              </button>
            </div>
        </div>

        <div className="px-4 py-3 bg-white border-b border-slate-200 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between no-print">
          
          <div className="relative w-full md:w-64 order-2 md:order-1">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 text-slate-400" />
             </div>
             <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('reliefTableSearchPlaceholder')}
                className="pl-9 pr-8 py-1.5 w-full text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-slate-50/70 focus:bg-white"
             />
             {searchQuery && (
               <button 
                 onClick={() => setSearchQuery('')}
                 className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600"
               >
                 <X className="h-3.5 w-3.5" />
               </button>
             )}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto order-1 md:order-2">
              <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 hidden sm:inline"><Filter className="w-3 h-3 inline mr-1"/>{t('filterType')}</span>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                      {['ALL', 'NEED', 'OFFER'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setTypeFilter(type as any)}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                            typeFilter === type 
                              ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
                              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                          }`}
                        >
                          {type === 'ALL' ? t('filterAll') : type === 'NEED' ? t('filterNeed') : t('filterOffer')}
                        </button>
                      ))}
                  </div>
              </div>

              <div className="w-px h-4 bg-slate-200 hidden sm:block"></div>

              <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 hidden sm:inline">{t('filterStatus')}</span>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                      {['ALL', 'ACTIVE', 'COMPLETED'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status as any)}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                            statusFilter === status 
                              ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
                              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                          }`}
                        >
                          {status === 'ALL' ? t('filterAll') : status === 'ACTIVE' ? t('filterActive') : t('filterCompleted')}
                        </button>
                      ))}
                  </div>
              </div>
          </div>
        </div>

        {filteredEntries.length === 0 && (
           <div className="p-8 text-center text-slate-500 bg-slate-50/30">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm">找不到符合條件的項目</p>
              <button 
                 onClick={() => { setSearchQuery(''); setTypeFilter('ALL'); setStatusFilter('ALL'); }}
                 className="mt-2 text-xs text-blue-600 hover:underline"
              >
                 清除所有搜尋條件
              </button>
           </div>
        )}

        {filteredEntries.length > 0 && (
        <div className="w-full">
          <table className="w-full text-left text-sm table-fixed">
            <thead className="bg-slate-50/70 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700 w-[12%]">{t('tableHeaderStatusUrgency')}</th>
                <th className="px-4 py-3 font-semibold text-slate-700 w-[28%]">{t('tableHeaderItemCategoryQuantity')}</th>
                <th className="px-4 py-3 font-semibold text-slate-700 w-[25%]">{t('tableHeaderLocationTimeContact')}</th>
                <th className="px-4 py-3 font-semibold text-slate-700 w-[35%]">{t('tableHeaderNotesStatusActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.map((entry) => {
                const isEditing = editingId === entry.id;

                if (isEditing) {
                  return (
                    <tr key={entry.id} className="bg-amber-50 shadow-inner">
                        <td className="px-4 py-4 align-top">
                          <div className="flex flex-col gap-2">
                            <select 
                                value={editForm.type}
                                onChange={(e) => handleFormChange('type', e.target.value)}
                                className="text-xs border-slate-300 rounded p-1 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                onKeyDown={handleKeyDown}
                            >
                                <option value="NEED">{t('filterNeed')}</option>
                                <option value="OFFER">{t('filterOffer')}</option>
                            </select>
                            <select 
                                value={editForm.urgency}
                                onChange={(e) => handleFormChange('urgency', e.target.value)}
                                className="text-xs border-slate-300 rounded p-1 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                onKeyDown={handleKeyDown}
                            >
                                <option value="HIGH">{t('urgencyHigh')}</option>
                                <option value="MEDIUM">{t('urgencyMedium')}</option>
                                <option value="LOW">{t('urgencyLow')}</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="flex flex-col gap-2">
                              <input 
                                type="text" 
                                value={editForm.item || ''} 
                                onChange={(e) => handleFormChange('item', e.target.value)}
                                className="text-sm border-slate-300 rounded p-1 w-full placeholder:text-slate-400 font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="物品名稱"
                                onKeyDown={handleKeyDown}
                                autoFocus
                              />
                              <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    value={editForm.category || ''} 
                                    onChange={(e) => handleFormChange('category', e.target.value)}
                                    className="text-xs border-slate-300 rounded p-1 w-1/2 placeholder:text-slate-400 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    placeholder="類別"
                                    list="category-list"
                                    onKeyDown={handleKeyDown}
                                  />
                                  <input 
                                    type="text" 
                                    value={editForm.quantity || ''} 
                                    onChange={(e) => handleFormChange('quantity', e.target.value)}
                                    className="text-xs border-slate-300 rounded p-1 w-1/2 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    placeholder="數量"
                                    onKeyDown={handleKeyDown}
                                  />
                              </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="flex flex-col gap-2">
                              <input 
                                type="text" 
                                value={editForm.location || ''} 
                                onChange={(e) => handleFormChange('location', e.target.value)}
                                className="text-sm border-slate-300 rounded p-1 w-full placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="地點"
                                onKeyDown={handleKeyDown}
                              />
                              <input 
                                type="text" 
                                value={editForm.contactInfo || ''} 
                                onChange={(e) => handleFormChange('contactInfo', e.target.value)}
                                className="text-xs border-slate-300 rounded p-1 w-full placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="聯絡方法"
                                onKeyDown={handleKeyDown}
                              />
                              <div className="text-[10px] text-slate-400 italic">
                                * 儲存後自動更新時間
                              </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="flex flex-col gap-3 h-full justify-between">
                              <textarea
                                  value={editForm.notes || ''}
                                  onChange={(e) => handleFormChange('notes', e.target.value)}
                                  className="text-xs border-slate-300 rounded p-1 w-full h-[60px] placeholder:text-slate-400 resize-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                  placeholder="額外備註..."
                              />
                              <div className="flex items-center justify-end gap-2 no-print">
                                  <button onClick={saveEdit} className="text-white bg-emerald-600 flex items-center gap-1 text-xs font-bold hover:bg-emerald-700 px-2 py-1 rounded shadow-sm">
                                  <Save className="w-4 h-4" /> {t('save')}
                                  </button>
                                  <button onClick={cancelEdit} className="text-slate-500 flex items-center gap-1 text-xs hover:bg-slate-200 px-2 py-1 rounded">
                                  <X className="w-4 h-4" /> {t('cancel')}
                                  </button>
                              </div>
                          </div>
                        </td>
                    </tr>
                  );
                }

                return (
                <tr key={entry.id} className={`hover:bg-slate-50 transition-colors ${entry.status === 'COMPLETED' ? 'bg-slate-50/50 opacity-60' : ''}`}>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col items-start gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        entry.type === 'NEED' 
                          ? 'bg-orange-50 text-orange-700 border-orange-200' 
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {entry.type === 'NEED' ? t('filterNeed') : t('filterOffer')}
                      </span>
                      {getUrgencyBadge(entry.urgency)}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div>
                      <div className="text-slate-900 font-medium text-base break-words">
                        {searchQuery ? (
                          <span dangerouslySetInnerHTML={{
                            __html: entry.item.replace(new RegExp(`(${searchQuery})`, 'gi'), '<mark class="bg-yellow-200 rounded-sm">$1</mark>')
                          }} />
                        ) : entry.item}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        <div className="text-slate-500 text-xs bg-slate-100 px-2 py-0.5 rounded-full inline-block border border-slate-200">
                            {entry.category}
                        </div>
                        <div className="text-blue-700 text-xs bg-blue-50 px-2 py-0.5 rounded-full inline-block border border-blue-100 font-bold">
                            {entry.quantity}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-1.5 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
                        <div className="flex flex-col items-start gap-0.5 w-full">
                          <span className="break-words font-medium w-full">{entry.location}</span>
                          {entry.location && (
                            <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(entry.location + " 大埔 香港")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="no-print inline-flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 hover:bg-blue-100 transition-colors"
                                title="在 Google 地圖查看"
                            >
                                <Map className="w-3 h-3" /> 地圖查看
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-mono">{new Date(entry.timestamp).toLocaleString('zh-HK', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </div>

                      {entry.contactInfo && (
                        <div className="flex items-start gap-1.5 text-slate-600 text-xs">
                          <Phone className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
                          {renderContactInfo(entry.contactInfo)}
                        </div>
                      )}

                      {entry.originalMessage !== 'Manual Entry' && entry.originalMessage !== '手動新增項目' && (
                        <div className="mt-1 text-[10px] text-slate-400 max-w-full truncate no-print cursor-help border-t border-slate-100 pt-1" title={entry.originalMessage}>
                            源: {entry.originalMessage}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col justify-between h-full gap-3">
                        <div>
                          {entry.notes ? (
                              <div className="flex items-start gap-1 text-xs text-slate-600 bg-amber-50/50 p-2 rounded border border-amber-100/50">
                                  <StickyNote className="w-3 h-3 mt-0.5 text-amber-400 shrink-0" />
                                  <span className="whitespace-pre-wrap break-words">{entry.notes}</span>
                              </div>
                          ) : (
                              <span className="text-slate-300 text-xs italic pl-1">{t('noNotes')}</span>
                          )}
                        </div>
                        
                        <div className="no-print pt-3 border-t border-slate-100 flex items-center justify-end gap-3 mt-auto">
                          <label className="inline-flex items-center cursor-pointer group" title="切換完成狀態">
                              <input 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={entry.status === 'COMPLETED'}
                              onChange={() => onUpdateStatus(entry.id, entry.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED')}
                              />
                              <div className="relative w-7 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                              <span className={`ml-2 text-xs font-bold transition-colors ${entry.status === 'COMPLETED' ? 'text-emerald-600' : 'text-slate-400'}`}>
                              {entry.status === 'COMPLETED' ? t('statusCompleted') : t('statusInProgress')}
                              </span>
                          </label>
                          
                          <div className="h-4 w-px bg-slate-200"></div>

                          <div className="flex items-center gap-1">
                              <button 
                              onClick={() => startEdit(entry)}
                              className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors"
                              title={t('edit')}
                              >
                              <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button 
                              onClick={() => setDeleteConfirmationId(entry.id)}
                              className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                              title={t('delete')}
                              >
                              <Trash2 className="w-3.5 h-3.5" />
                              </button>
                          </div>
                        </div>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        )}

        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 text-center text-[10px] text-slate-500">
          大埔火災支援協調平台 • 資訊由大埔火災支援系統整理 • 請以官方消息為準 • Design by KINGKAZMAX
        </div>
      </div>

      {deleteConfirmationId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">{t('confirmDeleteTitle')}</h3>
            </div>
            <p className="text-slate-600 mb-6 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t('confirmDeleteMessage') }} />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmationId(null)}
                className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-sm transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => {
                  if (deleteConfirmationId) onDelete(deleteConfirmationId);
                  setDeleteConfirmationId(null);
                }}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium text-sm shadow-sm transition-colors"
              >
                {t('confirmDeleteTitle')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
