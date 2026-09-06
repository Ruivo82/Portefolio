'use client';

import { Code2, Layers, Globe, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Skills() {
  const { t } = useLanguage();
  const { skills } = t;

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/[0.08]">
      {/* Header */}
      <div className="mb-10">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#ff4d4d]">
          {skills.tag}
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1">
          {skills.title}
        </h2>
        <p className="text-sm text-gray-400 mt-1 max-w-xl font-light">
          {skills.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Core Stack (2 cols) */}
        <div className="md:col-span-2 rounded-2xl bg-[#131313] border border-white/[0.06] p-6 sm:p-7">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/[0.06]">
            <Code2 className="w-4 h-4 text-[#ff0000]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-200 font-mono">
              {skills.languagesHeader}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.languagesList.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-lg bg-[#181818] text-xs font-medium text-gray-300 border border-white/[0.04] hover:bg-[#202020] transition-colors duration-150 font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Idiomas (1 col) */}
        <div className="rounded-2xl bg-[#131313] border border-white/[0.06] p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/[0.06]">
              <Globe className="w-4 h-4 text-[#ff0000]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-200 font-mono">
                {skills.idiomasHeader}
              </h3>
            </div>
            <div className="space-y-3">
              {skills.idiomasList.map((item) => (
                <div key={item.language} className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-sm font-medium text-white">{item.language}</span>
                  <span className="text-xs text-[#ff4d4d] font-mono px-2 py-0.5 rounded-full bg-[#181818] border border-white/[0.06] font-medium">
                    {item.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 pt-3 text-[11px] text-gray-500 font-mono">
            {skills.idiomasFootnote}
          </div>
        </div>

        {/* Especialidades FiveM, Discord e Desktop */}
        <div className="md:col-span-3 rounded-2xl bg-[#131313] border border-white/[0.06] p-6 sm:p-7">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/[0.06]">
            <Layers className="w-4 h-4 text-[#ff0000]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-200 font-mono">
              {skills.specialtiesHeader}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {skills.specialtiesList.map((spec) => (
              <div
                key={spec}
                className="p-3 rounded-xl bg-[#181818] border border-white/[0.04] text-xs font-medium text-gray-300 flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ff0000] shrink-0" />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
