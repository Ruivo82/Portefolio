'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowUpRight, Search, X, Sparkles, Terminal, ShoppingBag, Layers, Code2 } from 'lucide-react';
import { GithubIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';
import { fetchGitHubRepos, mergeProjectsWithGitHub } from '../utils/github';

export default function Projects() {
  const { t, lang, shared } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [gitHubRepos, setGitHubRepos] = useState([]);
  const [syncStatus, setSyncStatus] = useState('syncing');

  // Obter o username do GitHub dinamicamente
  const githubUsername = shared?.github
    ? shared.github.replace(/^https?:\/\/github\.com\//i, '').replace(/\/.*$/, '')
    : 'Ruivo82';

  // Buscar repositórios públicos atualizados do GitHub em segundo plano
  useEffect(() => {
    let isMounted = true;
    async function loadRepos() {
      try {
        const repos = await fetchGitHubRepos(githubUsername);
        if (isMounted && Array.isArray(repos) && repos.length > 0) {
          setGitHubRepos(repos);
          setSyncStatus('synced');
        } else if (isMounted) {
          setSyncStatus('idle');
        }
      } catch (err) {
        console.warn('GitHub sync notice:', err);
        if (isMounted) setSyncStatus('idle');
      }
    }

    loadRepos();
    return () => {
      isMounted = false;
    };
  }, [githubUsername]);

  // Mesclar a lista curada estática com novos repositórios do GitHub
  const allProjects = useMemo(() => {
    return mergeProjectsWithGitHub(t.projects.items || [], gitHubRepos, lang);
  }, [t.projects.items, gitHubRepos, lang]);

  // Definição dos filtros padrão
  const standardFilters = [
    { id: 'all', label: t.projects.filters.all },
    { id: 'fivemLua', label: t.projects.filters.fivemLua },
    { id: 'fivemNode', label: t.projects.filters.fivemNode },
    { id: 'web', label: t.projects.filters.web || (lang === 'pt' ? 'Web & Aplicações' : 'Web & Apps') },
    { id: 'discord', label: lang === 'pt' ? 'Discord / Bots' : 'Discord & Bots' },
    { id: 'storeFivem', label: t.projects.filters.storeFivem },
  ];

  // Identificar categorias adicionais dinâmicas presentes nos projetos
  const knownCategoryIds = new Set(standardFilters.map((f) => f.id));
  const dynamicFilters = [];
  for (const proj of allProjects) {
    if (proj.categoryId && !knownCategoryIds.has(proj.categoryId)) {
      knownCategoryIds.add(proj.categoryId);
      dynamicFilters.push({
        id: proj.categoryId,
        label: proj.category || proj.categoryId,
      });
    }
  }

  const allPossibleFilters = [...standardFilters, ...dynamicFilters];

  // Calcular contagens de projetos por categoria
  const filterCounts = useMemo(() => {
    const counts = { all: allProjects.length };
    for (const proj of allProjects) {
      if (proj.categoryId) {
        counts[proj.categoryId] = (counts[proj.categoryId] || 0) + 1;
      }
    }
    return counts;
  }, [allProjects]);

  // Mostrar apenas filtros que possuam pelo menos 1 projeto
  const filterButtons = allPossibleFilters.filter(
    (item) => item.id === 'all' || (filterCounts[item.id] || 0) > 0
  );

  // Filtragem composta: Categoria + Pesquisa de texto
  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return allProjects.filter((project) => {
      const matchesCategory =
        activeFilter === 'all' || project.categoryId === activeFilter;

      if (!matchesCategory) return false;

      if (!query) return true;

      const titleMatch = (project.title || '').toLowerCase().includes(query);
      const descMatch = (project.description || '').toLowerCase().includes(query);
      const categoryMatch = (project.category || '').toLowerCase().includes(query);
      const tagsMatch = (project.tags || []).some((t) =>
        t.toLowerCase().includes(query)
      );

      return titleMatch || descMatch || categoryMatch || tagsMatch;
    });
  }, [allProjects, activeFilter, searchQuery]);

  // Gerador de identidade visual de montra para cada projeto
  const getShowcaseVisual = (project) => {
    const id = (project.id || '').toLowerCase();
    const cat = project.categoryId || '';
    const tags = (project.tags || []).map((t) => t.toLowerCase());

    if (cat === 'storeFivem' || id.includes('tebex')) {
      return {
        badge: lang === 'pt' ? 'LOJA OFICIAL' : 'OFFICIAL STORE',
        subType: 'TEBEX STORE',
        watermark: 'STORE',
        accentBadge: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
        glowGradient: 'from-amber-500/10 via-transparent to-transparent',
        Icon: ShoppingBag,
      };
    }

    if (cat === 'fivemLua' || tags.includes('lua')) {
      return {
        badge: 'FIVEM / LUA',
        subType: 'LUA RESOURCE',
        watermark: 'LUA',
        accentBadge: 'border-[#ff0000]/30 text-[#ff4d4d] bg-[#ff0000]/10',
        glowGradient: 'from-[#ff0000]/10 via-transparent to-transparent',
        Icon: Layers,
      };
    }

    if (cat === 'fivemNode' || tags.includes('node.js')) {
      return {
        badge: 'FIVEM / NODE',
        subType: 'SERVER TOOL',
        watermark: 'NODE',
        accentBadge: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
        glowGradient: 'from-emerald-500/10 via-transparent to-transparent',
        Icon: Terminal,
      };
    }

    if (cat === 'web' || tags.includes('javascript') || tags.includes('react')) {
      return {
        badge: lang === 'pt' ? 'WEB & APP' : 'WEB & APPS',
        subType: 'WEB APPLICATION',
        watermark: 'WEB',
        accentBadge: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
        glowGradient: 'from-cyan-500/10 via-transparent to-transparent',
        Icon: Code2,
      };
    }

    return {
      badge: (project.category || 'PROJETO').toUpperCase(),
      subType: 'OPEN REPO',
      watermark: 'GIT',
      accentBadge: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
      glowGradient: 'from-purple-500/10 via-transparent to-transparent',
      Icon: Sparkles,
    };
  };

  return (
    <section id="projetos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/[0.08]">
      {/* Cabeçalho da Montra */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#ff4d4d]">
              {t.projects.tag}
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.04] border border-white/[0.08] text-gray-300"
              title={
                lang === 'pt'
                  ? 'Montra sincronizada em tempo real com o GitHub'
                  : 'Showcase synced in real time with GitHub'
              }
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  syncStatus === 'synced' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'
                }`}
              />
              {t.projects.liveSync} • {allProjects.length} {lang === 'pt' ? 'itens em exibição' : 'items on display'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            {t.projects.title}
          </h2>
        </div>

        {/* Barra de Pesquisa de Catálogo */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.projects.searchPlaceholder || 'Filtrar montra...'}
            className="w-full pl-8 pr-7 py-2 text-xs bg-[#131313] hover:bg-[#161616] focus:bg-[#161616] border border-white/[0.08] focus:border-[#ff0000]/60 rounded-full text-white placeholder-gray-500 transition-colors focus:outline-none font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Filtros em Estilo Expositor com Contadores */}
      <div className="flex flex-wrap gap-1.5 mb-8 pb-3 border-b border-white/[0.05]">
        {filterButtons.map((item) => {
          const count = filterCounts[item.id] || 0;
          const isActive = activeFilter === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveFilter(item.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#ff0000] text-white font-semibold shadow-md shadow-[#ff0000]/25'
                  : 'bg-[#141414] hover:bg-[#1f1f1f] text-gray-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-black/25 text-white' : 'bg-white/[0.06] text-gray-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Montra em Grelha (3 Colunas em Desktop / Vitrine Visual) */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => {
            const visual = getShowcaseVisual(project);
            const VisualIcon = visual.Icon;

            return (
              <article
                key={project.id}
                className="group relative rounded-2xl bg-[#111111] hover:bg-[#151515] border border-white/[0.07] hover:border-[#ff4d4d]/40 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/70 overflow-hidden"
              >
                {/* Linha de Neon Superior no Hover */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff0000] to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20" />

                <div>
                  {/* Moldura Visual de Vitrine (Mini-Expositor) */}
                  <div className="relative h-24 bg-[#0a0a0a] border-b border-white/[0.06] p-3 flex flex-col justify-between overflow-hidden">
                    {/* Marca d'água técnica estilizada no fundo */}
                    <div className="absolute right-2 -bottom-2 text-4xl font-black font-mono tracking-tighter text-white/[0.03] select-none group-hover:text-white/[0.07] transition-colors">
                      {visual.watermark}
                    </div>

                    {/* Brilho suave temático */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${visual.glowGradient} opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                    {/* Barra de Janela / Controlos de Montra */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#ff5f56]/80 inline-block" />
                        <span className="w-2 h-2 rounded-full bg-[#ffbd2e]/80 inline-block" />
                        <span className="w-2 h-2 rounded-full bg-[#27c93f]/80 inline-block" />
                      </div>

                      <span className={`text-[9px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded-full border ${visual.accentBadge}`}>
                        {visual.badge}
                      </span>
                    </div>

                    {/* Rodapé da Moldura: Tipo de Recurso & Estado */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                        <VisualIcon className="w-3 h-3 text-gray-500" />
                        <span>{visual.subType}</span>
                      </div>

                      {project.stats && (
                        <span className="text-[10px] font-mono font-medium text-gray-300 px-2 py-0.5 rounded bg-black/50 border border-white/[0.08] backdrop-blur-sm">
                          {project.stats}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Informação do Recurso */}
                  <div className="p-5 pb-3">
                    <h3 className="text-base font-bold text-white group-hover:text-[#ff4d4d] transition-colors leading-snug line-clamp-1 mb-2">
                      <a
                        href={project.demo || project.github || `https://github.com/${githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus:outline-none"
                      >
                        {project.title}
                      </a>
                    </h3>

                    <p className="text-xs text-gray-400 leading-relaxed font-normal line-clamp-2 min-h-[2rem]">
                      {project.description}
                    </p>

                    {/* Tags Técnicas Estilo Ficha de Produto */}
                    <div className="flex flex-wrap gap-1 mt-4">
                      {(project.tags || []).slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#181818] text-gray-300 font-mono border border-white/[0.04]"
                        >
                          {tag}
                        </span>
                      ))}
                      {(project.tags || []).length > 3 && (
                        <span className="text-[9px] font-mono text-gray-500 px-1.5 py-0.5">
                          +{(project.tags || []).length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botões de Ação da Montra */}
                <div className="px-5 pb-5 pt-3 border-t border-white/[0.05] flex items-center gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 rounded-lg bg-[#181818] hover:bg-[#222222] border border-white/[0.06] text-xs font-mono text-gray-300 hover:text-white inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>{t.projects.code}</span>
                    </a>
                  )}

                  <a
                    href={project.demo || project.github || `https://github.com/${githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 rounded-lg bg-[#ff0000]/15 hover:bg-[#ff0000] border border-[#ff0000]/30 hover:border-[#ff0000] text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <span>{t.projects.access}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Estado Vazio de Catálogo */
        <div className="py-12 text-center rounded-2xl bg-[#121212] border border-white/[0.06] p-8">
          <p className="text-sm text-gray-400 mb-3">
            {t.projects.noProjectsFound || 'Nenhum projeto encontrado.'}
          </p>
          <button
            onClick={() => {
              setActiveFilter('all');
              setSearchQuery('');
            }}
            className="text-xs px-3.5 py-1.5 rounded-full bg-[#181818] hover:bg-[#222222] text-white border border-white/[0.08] transition-colors cursor-pointer"
          >
            {t.projects.clearSearch || 'Limpar filtros'}
          </button>
        </div>
      )}
    </section>
  );
}
