'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight, ChevronDown, Globe, Check } from 'lucide-react';
import { PortugalFlag, UkFlag } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { lang, setLang, t, shared } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: t.nav.about, href: '#sobre' },
    { name: t.nav.projects, href: '#projetos' },
    { name: t.nav.store || 'Loja', href: '#loja' },
    { name: t.nav.skills, href: '#skills' },
    { name: t.nav.journey, href: '#trajetoria' },
  ];

  const languages = [
    { code: 'pt', label: 'Português', FlagComponent: PortugalFlag, full: 'Português (PT)' },
    { code: 'en', label: 'English', FlagComponent: UkFlag, full: 'English (EN)' },
  ];

  const currentLangObj = languages.find((l) => l.code === lang) || languages[0];
  const CurrentFlag = currentLangObj.FlagComponent;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3.5 sm:pt-4 pointer-events-none transition-all duration-300">
      <nav
        className={`w-full max-w-5xl rounded-full px-4 sm:px-5 py-2.5 flex items-center justify-between pointer-events-auto transition-all duration-300 ${
          scrolled
            ? 'bg-[#101010]/95 backdrop-blur-md border border-white/[0.12] shadow-2xl shadow-black/80'
            : 'bg-[#121212]/80 backdrop-blur-md border border-white/[0.08] shadow-lg shadow-black/40'
        }`}
      >
        {/* Identidade da Marca (Esquerda) */}
        <a href="#" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0 group-hover:border-[#ff0000]/60 transition-colors">
            <img
              src={shared.avatar}
              alt={shared.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white tracking-tight hidden xs:inline">
              {shared.name}
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#ff0000]/15 text-[#ff4d4d] border border-[#ff0000]/30 font-semibold">
              {shared.brand}
            </span>
          </div>
        </a>

        {/* Links Centrais de Navegação (Desktop) */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-gray-300 hover:text-white hover:bg-white/[0.06] active:bg-white/[0.1] transition-all duration-150"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Botões de Ação & Seletor de Idioma (Direita) */}
        <div className="hidden md:flex items-center gap-2">
          {/* Seletor de Idioma com Bandeiras SVG */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-gray-200 hover:text-white border border-white/[0.08] transition-all duration-150 cursor-pointer"
              title={t.nav.langSelect}
              aria-label={t.nav.langSelect}
              aria-expanded={langDropdownOpen}
            >
              <CurrentFlag className="w-4 h-3 rounded-sm shadow-sm shrink-0" />
              <span className="font-mono text-[11px] uppercase font-bold text-gray-300">
                {currentLangObj.code}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                  langDropdownOpen ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>

            {/* Menu Dropdown de Idiomas */}
            {langDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-[#141414] border border-white/10 shadow-2xl shadow-black/80 p-1.5 z-50 animate-fadeIn">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-gray-400 border-b border-white/[0.06] mb-1 flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-[#ff0000]" />
                  <span>{t.nav.langSelect}</span>
                </div>
                {languages.map((item) => {
                  const isSelected = item.code === lang;
                  const Flag = item.FlagComponent;

                  return (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLang(item.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#ff0000]/15 text-white font-semibold'
                          : 'text-gray-300 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Flag className="w-4 h-3 rounded-sm shadow-sm shrink-0" />
                        <span>{item.full}</span>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#ff4d4d]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Botão de Contacto / Conversa */}
          <a
            href="#contacto"
            className="px-4 py-1.5 rounded-full bg-[#ff0000] hover:bg-[#d40000] text-xs font-semibold text-white transition-all duration-200 shadow-[0_2px_12px_rgba(255,0,0,0.25)]"
          >
            {t.nav.talkToMe}
          </a>
        </div>

        {/* Botão Hambúrguer Mobile */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </nav>

      {/* Menu Mobile */}
      {mobileOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 bg-[#141414] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-1.5 animate-fadeIn pointer-events-auto">
          {/* Seletor de Idioma Mobile */}
          <div className="flex items-center justify-between p-2 mb-2 bg-[#181818] rounded-xl border border-white/[0.06]">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400 pl-2">
              <Globe className="w-3.5 h-3.5 text-[#ff0000]" />
              <span>{t.nav.langSelect}:</span>
            </div>
            <div className="flex gap-1.5">
              {languages.map((item) => {
                const isSelected = item.code === lang;
                const Flag = item.FlagComponent;

                return (
                  <button
                    key={item.code}
                    onClick={() => setLang(item.code)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#ff0000] text-white font-semibold shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <Flag className="w-4 h-3 rounded-sm shadow-sm shrink-0" />
                    <span className="font-mono uppercase">{item.code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Links de Navegação Mobile */}
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-gray-300 hover:text-white hover:bg-white/[0.06] px-4 py-2.5 rounded-xl transition-colors"
            >
              {link.name}
            </a>
          ))}

          {/* Ações Mobile */}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2 mt-2">
            <a
              href="#contacto"
              onClick={() => setMobileOpen(false)}
              className="text-center py-2.5 rounded-xl bg-[#ff0000] hover:bg-[#d40000] text-xs font-semibold text-white transition-colors"
            >
              {t.nav.talkToMe}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
