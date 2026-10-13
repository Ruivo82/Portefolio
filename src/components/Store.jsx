'use client';

import { ArrowUpRight, ShoppingBag, Zap, ShieldCheck, Headphones, Sparkles } from 'lucide-react';
import { TebexIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function Store() {
  const { t, shared } = useLanguage();
  const { store } = t;

  if (!store) return null;

  const featureIcons = [Zap, ShieldCheck, Headphones];

  return (
    <section id="loja" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/[0.08]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
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

        {/* Botão de Acesso Direto à Loja */}
        <a
          href={shared.tebex}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ff0000] hover:bg-[#d40000] text-xs font-semibold text-white transition-all shadow-[0_2px_16px_rgba(255,0,0,0.3)] shrink-0 self-start md:self-end"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{store.visitStore}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Garantias & Vantagens da Loja */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        {store.features.map((item, idx) => {
          const Icon = featureIcons[idx] || Sparkles;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#131313] border border-white/[0.05] flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#ff4d4d] shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-mono">{item.title}</h4>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grelha de Produtos da Loja */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {store.products.map((product) => (
          <article
            key={product.id}
            className="group rounded-2xl bg-[#131313] hover:bg-[#161616] border border-white/[0.06] hover:border-[#ff4d4d]/40 p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/50"
          >
            <div>
              {/* Metadados Superiores */}
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="text-[11px] font-mono font-medium text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Título & Descrição */}
              <h3 className="text-xl font-bold text-white group-hover:text-[#ff4d4d] transition-colors mb-2">
                {product.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 font-normal">
                {product.description}
              </p>
            </div>

            <div>
              {/* Tags de Compatibilidade */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {(product.tags || []).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-[#181818] text-gray-300 font-mono border border-white/[0.04]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Botão de Compra / Acesso no Tebex */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-[#ff0000] border border-white/[0.08] hover:border-[#ff0000] text-xs font-semibold text-white transition-all group/btn"
                >
                  <TebexIcon className="w-3.5 h-3.5 text-gray-300 group-hover/btn:text-white" />
                  <span>{store.buyBtn}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-white" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Banner de Encomenda Personalizada */}
      <div className="rounded-2xl bg-gradient-to-r from-[#141414] to-[#1a1414] border border-white/[0.07] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#ff4d4d] font-semibold">
            Serviço Exclusivo
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">
            {store.customOrderTitle}
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            {store.customOrderDesc}
          </p>
        </div>

        <a
          href={shared.discord}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-white border border-white/[0.08] transition-colors shrink-0"
        >
          <span>{store.customOrderBtn}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
        </a>
      </div>
    </section>
  );
}
