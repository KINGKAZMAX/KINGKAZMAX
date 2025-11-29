import React, { useState, useEffect } from 'react';
import { ReliefEntry, Stats, Status } from './types';
import { SmartInput } from './components/SmartInput';
import { ReliefTable } from './components/ReliefTable';
import { SuppliesSummary } from './components/SuppliesSummary';
import { NewsSummary } from './components/NewsSummary';
import { SFExpressNotice } from './components/SFExpressNotice';
import { EmotionalSupportCard } from './components/EmotionalSupportCard';
import { ExternalResourceHub } from './components/ExternalResourceHub';
import { VolunteerSchedule } from './components/VolunteerSchedule';
import { TaiPo1126Embed } from './components/TaiPo1126Embed';
import { SupportTaiPoEmbed } from './components/SupportTaiPoEmbed';
import { DeveloperContact } from './components/DeveloperContact';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useLanguage } from './contexts/LanguageContext';
import { PetSupportInfo } from './components/PetSupportInfo'; // Import the new component
import { ShieldAlert, Info, Menu, X, BarChart3, ExternalLink, Link as LinkIcon } from 'lucide-react';

const MOCK_INITIAL_DATA: ReliefEntry[] = [];

export default function App() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<ReliefEntry[]>(() => {
    const saved = localStorage.getItem('relief_entries');
    return saved ? JSON.parse(saved) : MOCK_INITIAL_DATA;
  });
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('relief_entries', JSON.stringify(entries));
  }, [entries]);

  const stats: Stats = {
    totalNeeds: entries.filter(e => e.type === 'NEED' && e.status !== 'COMPLETED').length,
    totalOffers: entries.filter(e => e.type === 'OFFER' && e.status !== 'COMPLETED').length,
    completed: entries.filter(e => e.status === 'COMPLETED').length,
    highUrgency: entries.filter(e => e.urgency === 'HIGH' && e.status !== 'COMPLETED').length,
  };

  const handleNewEntries = (newEntries: ReliefEntry[]) => {
    setEntries(prev => [...newEntries, ...prev]);
  };

  const handleUpdateStatus = (id: string, newStatus: Status) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleEditEntry = (id: string, updatedEntry: Partial<ReliefEntry>) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updatedEntry, timestamp: Date.now() } : e));
  };

  const handleManualAdd = () => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `manual-${Date.now()}`;
    const newEntry: ReliefEntry = {
      id,
      type: 'NEED',
      category: t('filterNeed'),
      item: 'New Item',
      quantity: '1',
      location: 'TBC',
      contactInfo: 'N/A',
      urgency: 'MEDIUM',
      status: 'PENDING',
      timestamp: Date.now(),
      originalMessage: 'Manual Entry',
      notes: '',
    };
    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  };

  const scrollToResources = () => {
     const element = document.getElementById('external-resources');
     if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
     }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <SuppliesSummary 
         entries={entries} 
         isOpen={isSummaryOpen} 
         onClose={() => setIsSummaryOpen(false)} 
         onEdit={handleEditEntry}
         onDelete={handleDelete}
      />

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg shadow-md shadow-blue-500/20">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">{t('appTitle')}</h1>
                <p className="text-[10px] text-slate-500 font-medium tracking-wide">{t('appSubtitle')}</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                {t('systemStatus')}
              </span>
              
              <button 
                onClick={() => setIsSummaryOpen(true)}
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all text-sm font-medium"
              >
                 <BarChart3 className="w-4 h-4" />
                 {t('suppliesSummaryTitle')}
              </button>

              <button 
                onClick={scrollToResources}
                className="hover:text-blue-600 transition-colors flex items-center gap-1 text-sm font-medium"
              >
                <LinkIcon className="w-3.5 h-3.5" /> {t('externalResources')}
              </button>

              <a 
                href="https://taipo1126.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors flex items-center gap-1 text-sm font-medium"
              >
                {t('wangFukMutualAid')} <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
              
              <a 
                href="https://firerescue.ccthk.hk/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors flex items-center gap-1 text-sm font-medium"
              >
                {t('contactUs')} <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
              <LanguageSwitcher />
            </div>

            <button 
              className="md:hidden p-2 text-slate-500 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 border-t border-slate-200 p-4 space-y-3 shadow-xl">
             <div className="flex justify-center mb-2">
                <LanguageSwitcher />
             </div>
             <button 
                onClick={() => {
                   setIsSummaryOpen(true);
                   setMobileMenuOpen(false);
                }} 
                className="flex w-full items-center gap-2 text-slate-700 bg-slate-100 p-3 rounded-lg"
             >
                <BarChart3 className="w-4 h-4" />
                {t('suppliesSummaryTitle')}
             </button>
             <button
               onClick={() => {
                   scrollToResources();
                   setMobileMenuOpen(false);
               }}
               className="block w-full text-left text-slate-600 hover:text-blue-600 p-2 flex items-center gap-2"
             >
               <LinkIcon className="w-3.5 h-3.5" /> {t('externalResources')}
             </button>
             <a 
               href="https://taipo1126.com/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="block text-slate-600 hover:text-blue-600 p-2 flex items-center gap-2"
             >
               {t('wangFukMutualAid')} <ExternalLink className="w-3 h-3" />
             </a>
             <a 
               href="https://firerescue.ccthk.hk/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="block text-slate-600 hover:text-blue-600 p-2 flex items-center gap-2"
             >
               {t('contactUs')} <ExternalLink className="w-3 h-3" />
             </a>
          </div>
        )}
      </header>

      <main className="flex-grow bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <NewsSummary />
          <PetSupportInfo /> {/* New Pet Support Info Component */}
          <VolunteerSchedule />
          <TaiPo1126Embed />
          <SupportTaiPoEmbed />
          <ExternalResourceHub />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
             <div className="space-y-6">
                <SmartInput onEntriesParsed={handleNewEntries} />
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-blue-900 text-sm">{t('howToUseTitle')}</h4>
                      <p className="text-xs text-blue-800/80 mt-1 leading-relaxed">
                        {t('howToUseStep1')}<br/>
                        {t('howToUseStep2')}<br/>
                        {t('howToUseStep3')}<br/>
                        {t('howToUseStep4')}
                      </p>
                    </div>
                  </div>
                </div>
             </div>
             <div>
                <SFExpressNotice />
             </div>
             <div>
                <EmotionalSupportCard />
             </div>
          </div>

          <div className="w-full">
               <ReliefTable 
                  entries={entries} 
                  onUpdateStatus={handleUpdateStatus} 
                  onDelete={handleDelete}
                  onEdit={handleEditEntry}
                  onManualAdd={handleManualAdd}
               />
          </div>
        </div>
      </main>

      <footer className="bg-slate-200 border-t border-slate-300/50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <DeveloperContact />
           <p className="text-slate-500 text-sm mt-6 mb-2">
             此平台為緊急即時開發，僅供大埔火災資訊協調使用。
           </p>
           <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
             <span>Privacy: Local Storage Only</span>
           </div>
        </div>
      </footer>
    </div>
  );
}