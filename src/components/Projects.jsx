'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { GithubIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';
import { fetchGitHubRepos, mergeProjectsWithGitHub } from '../utils/github';

export default function Projects() {
  const { t, lang, shared } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [gitHubRepos, setGitHubRepos] = useState([]);
  const [syncStatus, setSyncStatus] = useState('syncing');

  // Obter o username do GitHub dinamicamente (ex: "https://github.com/Ruivo82" -> "Ruivo82")
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
      // Filtro de categoria
      const matchesCategory =
        activeFilter === 'all' || project.categoryId === activeFilter;

      if (!matchesCategory) return false;

      // Filtro de pesquisa
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

  return (
    <section id="projetos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/[0.08]">
      {/* Header Compacto */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#ff4d4d]">
              {t.projects.tag}
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.04] border border-white/[0.08] text-gray-400"
              title={
                lang === 'pt'
                  ? 'Repositórios sincronizados em tempo real com a API do GitHub'
                  : 'Repositories synchronized in real time with GitHub API'
              }
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  syncStatus === 'synced' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'
                }`}
              />
              {t.projects.liveSync} • {allProjects.length}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {t.projects.title}
          </h2>
        </div>

        {/* Barra de Pesquisa Rápida */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.projects.searchPlaceholder || 'Pesquisar projetos...'}
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#131313] hover:bg-[#161616] focus:bg-[#161616] border border-white/[0.08] focus:border-[#ff0000]/60 rounded-full text-white placeholder-gray-500 transition-colors focus:outline-none font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Barra de Filtros Organizada com Contadores */}
      <div className="flex flex-wrap gap-1.5 mb-6 pb-2 border-b border-white/[0.04]">
        {filterButtons.map((item) => {
          const count = filterCounts[item.id] || 0;
          const isActive = activeFilter === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveFilter(item.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#ff0000] text-white font-semibold shadow-sm shadow-[#ff0000]/25'
                  : 'bg-[#141414] hover:bg-[#1f1f1f] text-gray-400 hover:text-white border border-white/[0.05]'
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

      {/* Grid de Projetos Compacto (3 colunas em ecrãs grandes) */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <article
              key={project.id}
              className="group relative rounded-xl bg-[#121212] hover:bg-[#161616] border border-white/[0.06] hover:border-[#ff4d4d]/40 p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/60 overflow-hidden"
            >
              {/* Linha de realce no topo no hover */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff0000] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Metadados Superiores & Ações Rápidas */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-gray-400 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06]">
                      {project.category}
                    </span>
                    {project.stats && (
                      <span className="text-[10px] font-mono font-medium text-[#ff4d4d] px-1.5 py-0.5 rounded-md bg-[#181818] border border-[#ff0000]/20">
                        {project.stats}
                      </span>
                    )}
                  </div>

                  {/* Ícones de Ação Rápida */}
                  <div className="flex items-center gap-1">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={t.projects.code}
                        className="p-1.5 rounded-md bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 hover:text-white transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={t.projects.access}
                        className="p-1.5 rounded-md bg-white/[0.03] hover:bg-[#ff0000] text-gray-400 hover:text-white transition-colors"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-base font-bold text-white group-hover:text-[#ff4d4d] transition-colors leading-snug line-clamp-1">
                  <a
                    href={project.demo || project.github || `https://github.com/${githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus:outline-none"
                  >
                    {project.title}
                  </a>
                </h3>

                {/* Descrição Compacta e Padronizada */}
                <p className="text-xs text-gray-400 leading-relaxed font-normal mt-1.5 line-clamp-2 min-h-[2rem]">
                  {project.description}
                </p>
              </div>

              {/* Rodapé: Tags Técnicas & Link de Acesso */}
              <div className="pt-3 mt-4 border-t border-white/[0.05] flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1 items-center overflow-hidden">
                  {(project.tags || []).slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#181818] text-gray-300 font-mono border border-white/[0.04]"
                    >
                      {tag}
                    </span>
                  ))}
                  {(project.tags || []).length > 3 && (
                    <span className="text-[9px] font-mono text-gray-500 px-1">
                      +{(project.tags || []).length - 3}
                    </span>
                  )}
                </div>

                <a
                  href={project.demo || project.github || `https://github.com/${githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-medium text-gray-400 group-hover:text-[#ff4d4d] transition-colors flex items-center gap-0.5 shrink-0"
                >
                  <span>{t.projects.access}</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400 group-hover:text-[#ff4d4d] transition-colors" />
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Estado Vazio caso a Pesquisa/Filtro não devolva resultados */
        <div className="py-12 text-center rounded-xl bg-[#121212] border border-white/[0.06] p-8">
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
