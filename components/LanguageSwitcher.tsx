import React from 'react';
import { useLanguage, Language } from '../contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages: { key: Language; label: string }[] = [
    { key: 'zhHK', label: '繁' },
    { key: 'zhCN', label: '简' },
    { key: 'en', label: 'EN' },
  ];

  return (
    <div className="flex items-center text-sm font-medium bg-slate-100 rounded-full p-1 border border-slate-200">
      {languages.map((lang, index) => (
        <React.Fragment key={lang.key}>
          <button
            onClick={() => setLanguage(lang.key)}
            className={`px-3 py-1 rounded-full transition-colors ${
              language === lang.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {lang.label}
          </button>
          {index < languages.length - 1 && (
            <span className="text-slate-300 mx-1">|</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
