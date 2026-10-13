'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';
import { fetchGitHubRepos, mergeProjectsWithGitHub } from '../utils/github';

export default function Projects() {
  const { t, lang, shared } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
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

  // Adicionar dinamicamente filtros para quaisquer outras categorias encontradas nos projetos
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

  // Mostrar apenas os botões de filtros para os quais existam projetos
  const filterButtons = allPossibleFilters.filter(
    (item) => item.id === 'all' || allProjects.some((p) => p.categoryId === item.id)
  );

  // Filtrar os projetos com base na categoria
  const filtered = activeFilter === 'all'
    ? allProjects
    : allProjects.filter((p) => p.categoryId === activeFilter);

  return (
    <section id="projetos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/[0.08]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#ff4d4d]">
              {t.projects.tag}
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.04] border border-white/[0.08] text-gray-400"
              title={
                lang === 'pt'
                  ? 'Repositórios sincronizados em tempo real com a API do GitHub'
                  : 'Repositories synchronized in real time with the GitHub API'
              }
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  syncStatus === 'synced' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'
                }`}
              />
              {t.projects.liveSync || (lang === 'pt' ? 'GitHub Live' : 'Live GitHub')}
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1">
            {t.projects.title}
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {filterButtons.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveFilter(item.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 cursor-pointer ${
                activeFilter === item.id
                  ? 'bg-[#ff0000] text-white font-semibold shadow-sm'
                  : 'bg-[#181818] hover:bg-[#222222] text-gray-400 hover:text-white border border-white/[0.05]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((project) => (
          <article
            key={project.id}
            className="group rounded-2xl bg-[#131313] border border-white/[0.06] hover:border-white/[0.12] p-6 sm:p-7 flex flex-col justify-between transition-colors duration-150"
          >
            <div>
              {/* Top metadata */}
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
                  {project.category}
                </span>
                {project.stats && (
                  <span className="text-[11px] font-mono font-medium text-[#ff4d4d] px-2.5 py-0.5 rounded-full bg-[#181818] border border-[#ff0000]/25">
                    {project.stats}
                  </span>
                )}
              </div>

              {/* Title & Desc */}
              <h3 className="text-xl font-bold text-white mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 font-normal">
                {project.description}
              </p>
            </div>

            <div>
              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {(project.tags || []).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-[#181818] text-gray-300 font-mono border border-white/[0.04]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Links */}
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                <a
                  href={project.github || `https://github.com/${githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>{t.projects.code}</span>
                </a>

                <a
                  href={project.demo || project.github || `https://github.com/${githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-[#ff4d4d] transition-colors group/link"
                >
                  <span>{t.projects.access}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover/link:text-[#ff4d4d] transition-colors" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
