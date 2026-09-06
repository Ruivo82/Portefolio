'use client';

import { useState } from 'react';
import { Briefcase, GraduationCap, ArrowUpRight, CheckCircle2, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Experience() {
  const { t, shared } = useLanguage();
  const { experience } = t;
  const [activeTab, setActiveTab] = useState('experiencia');

  return (
    <section id="trajetoria" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/[0.08]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#ff4d4d]">
            {experience.tag}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1">
            {experience.title}
          </h2>
          <p className="text-sm text-gray-400 mt-1 max-w-xl font-light">
            {experience.description}
          </p>
        </div>

        <a
          href={shared.cvLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#222222] text-white text-xs font-medium border border-white/[0.06] transition-colors duration-150 shrink-0"
        >
          <span>{experience.viewFullCv}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
        </a>
      </div>

      {/* Segmented Switcher Tabs */}
      <div className="flex gap-1.5 p-1 bg-[#141414] border border-white/[0.06] rounded-full mb-8 w-fit">
        <button
          onClick={() => setActiveTab('experiencia')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors duration-150 cursor-pointer ${
            activeTab === 'experiencia'
              ? 'bg-[#ff0000] text-white font-semibold shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-[#1e1e1e]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>{experience.tabExperience}</span>
        </button>

        <button
          onClick={() => setActiveTab('educacao')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors duration-150 cursor-pointer ${
            activeTab === 'educacao'
              ? 'bg-[#ff0000] text-white font-semibold shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-[#1e1e1e]'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>{experience.tabEducation}</span>
        </button>
      </div>

      {/* Tab 1: Experiência Profissional RV Studios */}
      {activeTab === 'experiencia' && (
        <div className="space-y-6">
          {experience.experiences.map((exp, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#131313] border border-white/[0.06] p-6 sm:p-8"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/[0.06] gap-3 mb-5">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {exp.role}
                    </h3>
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#181818] text-[#ff4d4d] border border-[#ff0000]/30">
                      {exp.company}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    {exp.type}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 text-xs font-mono text-gray-300 bg-[#181818] px-3.5 py-1.5 rounded-full border border-white/[0.05] w-fit">
                  <Calendar className="w-3.5 h-3.5 text-[#ff0000]" />
                  <span>{exp.period}</span>
                </div>
              </div>

              {/* Bio summary */}
              <p className="text-sm text-gray-300 leading-relaxed mb-6 font-normal">
                {exp.description}
              </p>

              {/* Highlights */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-300 font-mono mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff0000]" />
                  {experience.highlightsTitle}
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {exp.highlights.map((point, hIdx) => (
                    <div
                      key={hIdx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-[#181818] border border-white/[0.04] text-xs text-gray-300 leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#ff0000] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech stack tags */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/[0.06]">
                <span className="text-[11px] font-mono text-gray-500 mr-1">{experience.stackLabel}</span>
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-[#181818] text-gray-300 border border-white/[0.04]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Formação Académica */}
      {activeTab === 'educacao' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {experience.educations.map((edu, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#131313] border border-white/[0.06] p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                {/* Status badge */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#181818] text-[#ff4d4d] border border-[#ff0000]/30">
                    {edu.status}
                  </span>
                  <span className="text-xs font-mono text-gray-500">
                    {edu.period}
                  </span>
                </div>

                {/* Course & Institution */}
                <h3 className="text-lg font-bold text-white mb-1">
                  {edu.course}
                </h3>
                <p className="text-xs text-gray-400 font-mono mb-4">
                  {edu.institution}
                </p>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal mb-5">
                  {edu.description}
                </p>

                {/* Highlights */}
                <div className="space-y-2 mb-6">
                  {edu.highlights.map((hl, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff0000] shrink-0 mt-1.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                {edu.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#181818] text-gray-300 border border-white/[0.04]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
