'use client';

import { ArrowUpRight } from 'lucide-react';
import { TebexIcon, DiscordIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function Store() {
  const { t, shared } = useLanguage();
  const { store } = t;

  if (!store) return null;

  return (
    <section id="loja" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/[0.08]">
      {/* Header */}
      <div className="mb-8">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#ff4d4d]">
          {store.tag}
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1">
          {store.title}
        </h2>
        <p className="text-sm text-gray-400 mt-2 max-w-2xl font-normal leading-relaxed">
          {store.description}
        </p>
      </div>

      {/* Cartão Principal de Divulgação da Loja */}
      <div className="rounded-2xl bg-[#121212] border border-white/[0.07] p-6 sm:p-9 relative overflow-hidden">
        {/* Realce subtil de fundo */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#ff0000]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Informação Principal */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-mono font-semibold text-[#ff4d4d] bg-[#ff0000]/10 border border-[#ff0000]/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {shared.brand}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                Tebex Creator
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
              {store.cardTitle}
            </h3>

            <p className="text-sm text-gray-300 leading-relaxed font-normal mb-8 max-w-xl">
              {store.cardDesc}
            </p>

            {/* Botões de Ação Diretos */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={shared.tebex}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff0000] hover:bg-[#d40000] text-sm font-semibold text-white transition-all shadow-[0_4px_16px_rgba(255,0,0,0.25)] group cursor-pointer"
              >
                <TebexIcon className="w-4 h-4 text-white" />
                <span>{store.visitStore}</span>
                <ArrowUpRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href={shared.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] text-sm font-medium text-gray-300 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
              >
                <DiscordIcon className="w-4 h-4 text-gray-400" />
                <span>{store.discordBtn}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
              </a>
            </div>
          </div>

          {/* Painel de Dados Rápidos / Especificações */}
          <div className="rounded-xl bg-[#0c0c0c] border border-white/[0.06] p-5 space-y-3.5">
            {store.specs.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-1 border-b border-white/[0.04] last:border-none">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                  {item.label}
                </span>
                <span className="text-xs font-mono font-medium text-white">
                  {item.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
