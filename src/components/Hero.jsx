'use client';

import { ArrowRight, ArrowUpRight, FileText, Mail, MapPin } from 'lucide-react';
import { GithubIcon, TebexIcon, TikTokIcon, InstagramIcon, YoutubeIcon, DiscordIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t, shared } = useLanguage();

  return (
    <section id="sobre" className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Profile Intro */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
        <div className="relative shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-white/10 bg-[#1a1a1a] shadow-2xl relative group">
            <img
              src={shared.avatar}
              alt={shared.name}
              className="w-full h-full object-cover"
            />
            {/* Subtle inner highlight */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
          </div>
          {/* Status Indicator Dot */}
          <span
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#ff0000] border-2 border-[#222222] shadow-[0_0_8px_rgba(255,0,0,0.6)]"
            title={t.hero.status}
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono font-semibold text-[#ff4d4d] bg-[#ff0000]/10 border border-[#ff0000]/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {shared.brand}
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#ff0000]" />
              {t.hero.location}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            {shared.name}
          </h1>
          <p className="text-base sm:text-lg text-gray-400 mt-1 font-medium">
            {t.hero.role}
          </p>
        </div>
      </div>

      {/* Main Pitch / Bio */}
      <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-3xl mb-8">
        {t.hero.bio}
      </p>

      {/* Primary Actions Row */}
      <div className="flex flex-wrap items-center gap-3 mb-10">
        <a
          href="#projetos"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff0000] text-white text-sm font-semibold hover:bg-[#e00000] active:scale-95 transition-all duration-150 shadow-[0_4px_16px_rgba(255,0,0,0.2)]"
        >
          <span>{t.hero.viewProjects}</span>
          <ArrowRight className="w-4 h-4" />
        </a>

        <a
          href={shared.tebex}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] text-white text-sm font-medium border border-white/[0.06] transition-colors duration-150 group"
        >
          <TebexIcon className="w-4 h-4 text-[#ff0000]" />
          <span>{t.hero.tebexStore}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
        </a>

        <a
          href={shared.cvLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] text-gray-200 hover:text-white text-sm font-medium border border-white/[0.06] transition-colors duration-150"
        >
          <FileText className="w-4 h-4 text-gray-400" />
          <span>{t.hero.cv}</span>
        </a>
      </div>

      {/* Social Links Row — Solid, clean buttons */}
      <div className="flex flex-wrap items-center gap-2.5 pt-4 text-gray-400">
        <span className="text-xs font-mono uppercase tracking-wider text-gray-500 mr-2">{t.hero.channels}</span>
        <a
          href={shared.github}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] text-gray-400 hover:text-white transition-colors duration-150 border border-white/[0.06]"
          title="GitHub (Ruivo82)"
        >
          <GithubIcon className="w-4 h-4" />
        </a>
        <a
          href={shared.discord}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] text-gray-400 hover:text-white transition-colors duration-150 border border-white/[0.06]"
          title="Discord (discord.me/rvstudios)"
        >
          <DiscordIcon className="w-4 h-4" />
        </a>
        <a
          href={shared.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] text-gray-400 hover:text-white transition-colors duration-150 border border-white/[0.06]"
          title="YouTube (@rvstudios.82)"
        >
          <YoutubeIcon className="w-4 h-4" />
        </a>
        <a
          href={shared.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] text-gray-400 hover:text-white transition-colors duration-150 border border-white/[0.06]"
          title="Instagram (@rvstudios.82)"
        >
          <InstagramIcon className="w-4 h-4" />
        </a>
        <a
          href={shared.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] text-gray-400 hover:text-white transition-colors duration-150 border border-white/[0.06]"
          title="TikTok (@rv.studios82)"
        >
          <TikTokIcon className="w-4 h-4" />
        </a>
        <a
          href={`mailto:${shared.email}`}
          className="p-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] text-gray-400 hover:text-white transition-colors duration-150 border border-white/[0.06]"
          title={`Email: ${shared.email}`}
        >
          <Mail className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
