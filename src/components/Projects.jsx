'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './Icons';
import { portfolioData } from '../data/portfolioData';

export default function Projects() {
  const { projects } = portfolioData;
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filters = ['Todos', 'FiveM / Lua', 'FiveM / Node.js', 'Loja & FiveM'];

  const filtered = activeFilter === 'Todos'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="projetos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/[0.08]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#ff4d4d]">
            Portfólio de Trabalho
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1">
            Projetos & Recursos
          </h2>
        </div>

        {/* Filter Pills — Solid, clean buttons */}
        <div className="flex flex-wrap gap-1.5">
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setActiveFilter(item)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 ${
                activeFilter === item
                  ? 'bg-[#ff0000] text-white font-semibold shadow-sm'
                  : 'bg-[#181818] hover:bg-[#222222] text-gray-400 hover:text-white border border-white/[0.05]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid — Clean solid cards without excessive borders or glowing hairlines */}
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
              {/* Tech tags — Solid chips */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.tags.map((tag, idx) => (
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
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>Código</span>
                </a>

                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-[#ff4d4d] transition-colors group/link"
                >
                  <span>Aceder</span>
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
