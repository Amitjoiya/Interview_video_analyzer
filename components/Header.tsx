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
        ? 'bg-slate-900/70 border-slate-800/50' 
        : 'bg-white/80 border-slate-200'
    }`}>
      {/* Premium animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className={`absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-500/15'} animate-pulse`}></div>
        <div className={`absolute top-0 right-1/4 w-48 h-48 rounded-full blur-3xl ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/15'}`} style={{ animation: 'pulse 4s ease-in-out infinite 1s' }}></div>
        <div className={`absolute -top-5 right-10 w-32 h-32 rounded-full blur-2xl ${isDark ? 'bg-pink-500/5' : 'bg-pink-500/10'}`} style={{ animation: 'pulse 3s ease-in-out infinite 0.5s' }}></div>
        
        {/* Premium gradient border line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px]">
          <div className={`w-full h-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent ${isDark ? '' : 'opacity-50'}`}></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 py-3 items-center">
          {/* Premium Logo Section */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition-opacity"></div>
              {/* Logo container */}
              <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/25">
                <Brain className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className={`text-2xl font-bold tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {t.header.title}
                <span 
                  onClick={() => {
                    localStorage.removeItem('apex7_intro_seen');
                    window.location.reload();
                  }}
                  className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 font-semibold cursor-pointer hover:opacity-70 transition-opacity"
                  title="Click to replay intro"
                >v7.0</span>
              </h1>
              <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.header.tagline}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Premium Language Switcher */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border transition-all duration-300 ${
                  isDark 
                    ? 'text-slate-300 bg-slate-800/60 backdrop-blur-xl border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-700/60 hover:shadow-lg hover:shadow-indigo-500/10'
                    : 'text-slate-700 bg-white border-slate-200 hover:border-indigo-500/50 hover:bg-slate-50 shadow-sm hover:shadow-md'
                }`}
              >
                <Globe className="w-4 h-4 text-indigo-400" />
                <span className="text-lg">{currentLang?.flag}</span>
                <span className="hidden sm:inline">{currentLang?.nativeName}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showLangDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Premium Dropdown Menu */}
              {showLangDropdown && (
                <div className={`absolute right-0 mt-3 w-72 backdrop-blur-2xl rounded-2xl border shadow-2xl py-2 z-50 max-h-96 overflow-y-auto ${
                  isDark 
                    ? 'bg-slate-900/95 border-slate-700/50 shadow-black/50'
                    : 'bg-white border-slate-200 shadow-slate-200/50'
                }`}>
                  <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Select Language</p>
                  </div>
                  <div className="py-1">
                    {LANG_OPTIONS.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangDropdown(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                          isDark ? 'hover:bg-slate-800/70' : 'hover:bg-slate-100'
                        } ${language === lang.code ? (isDark ? 'bg-indigo-500/15 border-l-2 border-indigo-500' : 'bg-indigo-50 border-l-2 border-indigo-500') : 'border-l-2 border-transparent'}`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{lang.name}</p>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{lang.nativeName}</p>
                        </div>
                        {language === lang.code && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Premium Status Badges */}
            <div className={`hidden md:flex items-center gap-2 text-sm font-medium backdrop-blur-xl px-4 py-2.5 rounded-xl border ${
              isDark 
                ? 'text-slate-300 bg-slate-800/60 border-slate-700/50'
                : 'text-slate-700 bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="relative">
                <span className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-50"></span>
                <Activity className="w-4 h-4 text-green-400 relative" />
              </div>
              <span>{t.header.neuralCore}</span>
            </div>
            <div className={`hidden lg:flex items-center gap-2 text-sm font-medium bg-gradient-to-r px-4 py-2.5 rounded-xl border ${
              isDark 
                ? 'text-slate-300 from-indigo-500/15 to-purple-500/15 border-indigo-500/30'
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