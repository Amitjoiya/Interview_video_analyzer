import React, { useState, useRef, useEffect } from 'react';
import { Brain, Activity, Zap, Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { UILanguage } from '../translations';

// Direct language list for guaranteed rendering
const LANG_OPTIONS = [
  { code: 'en' as UILanguage, name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi' as UILanguage, name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'es' as UILanguage, name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr' as UILanguage, name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de' as UILanguage, name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh' as UILanguage, name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja' as UILanguage, name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ar' as UILanguage, name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'pt' as UILanguage, name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ru' as UILanguage, name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
];

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isDark } = useTheme();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANG_OPTIONS.find(l => l.code === language) || LANG_OPTIONS[0];

  return (
    <header className={`relative backdrop-blur-xl border-b sticky top-0 z-50 overflow-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-900/80 border-slate-800' 
        : 'bg-white/80 border-slate-200'
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-4 -left-4 w-24 h-24 rounded-full blur-xl ${isDark ? 'bg-indigo-500/5' : 'bg-indigo-500/10'}`}></div>
        <div className={`absolute top-0 right-1/4 w-32 h-32 rounded-full blur-xl ${isDark ? 'bg-purple-500/5' : 'bg-purple-500/10'}`}></div>
        
        {/* Moving gradient line */}
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent to-transparent ${isDark ? 'via-indigo-500/50' : 'via-indigo-500/30'}`}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-sm opacity-50"></div>
              <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-2.5 rounded-xl shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t.header.title}
                <span 
                  onClick={() => {
                    localStorage.removeItem('apex7_intro_seen');
                    window.location.reload();
                  }}
                  className="text-xs bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text font-semibold cursor-pointer hover:opacity-70"
                  title="Click to replay intro"
                >v7.0</span>
              </h1>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.header.tagline}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Language Switcher - Always Visible */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl border transition-all ${
                  isDark 
                    ? 'text-slate-300 bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-indigo-500/50 hover:bg-slate-700/50'
                    : 'text-slate-700 bg-white border-slate-200 hover:border-indigo-500/50 hover:bg-slate-50 shadow-sm'
                }`}
              >
                <Globe className="w-4 h-4 text-indigo-400" />
                <span className="text-lg">{currentLang?.flag}</span>
                <span className="hidden sm:inline">{currentLang?.nativeName}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showLangDropdown && (
                <div className={`absolute right-0 mt-2 w-64 backdrop-blur-xl rounded-2xl border shadow-2xl py-2 z-50 max-h-96 overflow-y-auto ${
                  isDark 
                    ? 'bg-slate-900/95 border-slate-700 shadow-black/50'
                    : 'bg-white border-slate-200 shadow-slate-200/50'
                }`}>
                  <div className={`px-3 py-2 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Select Language</p>
                  </div>
                  <div className="py-1">
                    {LANG_OPTIONS.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangDropdown(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                          isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'
                        } ${language === lang.code ? (isDark ? 'bg-indigo-500/10' : 'bg-indigo-50') : ''}`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{lang.name}</p>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{lang.nativeName}</p>
                        </div>
                        {language === lang.code && (
                          <Check className="w-4 h-4 text-green-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={`hidden md:flex items-center gap-2 text-sm font-medium backdrop-blur-sm px-4 py-2 rounded-full border ${
              isDark 
                ? 'text-slate-300 bg-slate-800/50 border-slate-700'
                : 'text-slate-700 bg-white border-slate-200 shadow-sm'
            }`}>
              <Activity className="w-4 h-4 text-green-400" />
              <span>{t.header.neuralCore}</span>
            </div>
            <div className={`hidden lg:flex items-center gap-2 text-sm font-medium bg-gradient-to-r px-4 py-2 rounded-full border ${
              isDark 
                ? 'text-slate-300 from-indigo-500/10 to-purple-500/10 border-indigo-500/20'
                : 'text-slate-700 from-indigo-50 to-purple-50 border-indigo-200'
            }`}>
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Predictive AI</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};