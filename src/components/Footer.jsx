'use client';

import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t, shared } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/[0.08] text-gray-500 text-xs font-mono">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-gray-300 font-semibold">{shared.name}</span>
          <span className="text-gray-600 mx-2">•</span>
          <span>{shared.brand}</span>
          <span className="text-gray-600 mx-2">•</span>
          <span>{new Date().getFullYear()}</span>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <span>{t.footer.backToTop}</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}
