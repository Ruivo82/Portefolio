'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Sobre', href: '#sobre' },
    { name: 'Projetos', href: '#projetos' },
    { name: 'Habilidades', href: '#skills' },
    { name: 'Trajetória', href: '#trajetoria' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3.5 sm:pt-4 pointer-events-none transition-all duration-300">
      <nav
        className={`w-full max-w-5xl rounded-full px-5 py-2.5 sm:py-3 flex items-center justify-between pointer-events-auto transition-all duration-300 ${
          scrolled
            ? 'bg-[#141414] border border-white/10 shadow-2xl shadow-black/60'
            : 'bg-transparent border border-transparent shadow-none'
        }`}
      >
        {/* Brand Identity */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0 group-hover:border-[#ff0000]/60 transition-colors">
            <img
              src={portfolioData.personal.avatar}
              alt="Diogo Lopes"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white tracking-tight">
              Diogo Lopes
            </span>
            <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-[#ff0000]/15 text-[#ff4d4d] border border-[#ff0000]/30 font-semibold">
              RV Studios
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-4 py-1.5 rounded-full text-xs font-medium text-gray-300 hover:text-white hover:bg-white/[0.06] active:bg-white/[0.1] transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href={portfolioData.personal.tebex}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-gray-200 hover:text-white border border-white/[0.08] transition-all duration-200"
          >
            <span>Loja Tebex</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
          </a>
          <a
            href="#contacto"
            className="px-4 py-1.5 rounded-full bg-[#ff0000] hover:bg-[#d40000] text-xs font-semibold text-white transition-all duration-200 shadow-[0_2px_12px_rgba(255,0,0,0.25)]"
          >
            Falar Comigo
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white transition-colors"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 bg-[#141414] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-1.5 animate-fadeIn">
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
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2 mt-2">
            <a
              href={portfolioData.personal.tebex}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-white transition-colors"
            >
              Loja Tebex (RV Studios)
            </a>
            <a
              href="#contacto"
              onClick={() => setMobileOpen(false)}
              className="text-center py-2.5 rounded-xl bg-[#ff0000] hover:bg-[#d40000] text-xs font-semibold text-white transition-colors"
            >
              Falar Comigo
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
