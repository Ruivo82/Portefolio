'use client';

import { useState } from 'react';
import { Mail, Copy, Check, Send, MapPin } from 'lucide-react';
import { GithubIcon, TikTokIcon, InstagramIcon, YoutubeIcon, DiscordIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const { t, shared } = useLanguage();
  const { contact } = t;

  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const copyEmail = () => {
    navigator.clipboard.writeText(shared.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contacto" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/[0.08]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Info (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#ff4d4d]">
              {contact.tag}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1 mb-4">
              {contact.title}
            </h2>
            <p className="text-sm text-gray-400 font-light leading-relaxed mb-8">
              {contact.description}
            </p>

            {/* Email card */}
            <div className="p-5 rounded-2xl bg-[#131313] border border-white/[0.06] mb-4">
              <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#ff0000]" />
                <span>{contact.officialEmail}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <a
                  href={`mailto:${shared.email}`}
                  className="text-sm sm:text-base font-semibold text-white hover:text-[#ff4d4d] transition-colors truncate"
                >
                  {shared.email}
                </a>
                <button
                  onClick={copyEmail}
                  className="px-3.5 py-1.5 rounded-full bg-[#181818] hover:bg-[#222222] text-white text-xs font-medium transition-colors duration-150 shrink-0 flex items-center gap-1.5 border border-white/[0.06] cursor-pointer"
                  title={contact.copy}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{contact.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                      <span>{contact.copy}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Location */}
            <div className="p-5 rounded-2xl bg-[#131313] border border-white/[0.06] mb-8">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-mono flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#ff0000]" />
                  {contact.locationLabel}
                </span>
                <span className="text-gray-200 font-medium">{t.hero.location}</span>
              </div>
            </div>
          </div>

          {/* Social Platforms */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-gray-500 block mb-3">
              {contact.officialChannels}
            </span>
            <div className="flex flex-wrap gap-2">
              <a
                href={shared.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-[#181818] hover:bg-[#222222] text-xs font-medium text-gray-300 hover:text-white border border-white/[0.06] transition-colors duration-150 flex items-center gap-2"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href={shared.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-[#181818] hover:bg-[#222222] text-xs font-medium text-gray-300 hover:text-white border border-white/[0.06] transition-colors duration-150 flex items-center gap-2"
              >
                <DiscordIcon className="w-4 h-4" />
                <span>Discord</span>
              </a>
              <a
                href={shared.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-[#181818] hover:bg-[#222222] text-xs font-medium text-gray-300 hover:text-white border border-white/[0.06] transition-colors duration-150 flex items-center gap-2"
              >
                <YoutubeIcon className="w-4 h-4" />
                <span>YouTube</span>
              </a>
              <a
                href={shared.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-[#181818] hover:bg-[#222222] text-xs font-medium text-gray-300 hover:text-white border border-white/[0.06] transition-colors duration-150 flex items-center gap-2"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Instagram</span>
              </a>
              <a
                href={shared.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-[#181818] hover:bg-[#222222] text-xs font-medium text-gray-300 hover:text-white border border-white/[0.06] transition-colors duration-150 flex items-center gap-2"
              >
                <TikTokIcon className="w-4 h-4" />
                <span>TikTok</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-7 rounded-2xl bg-[#131313] border border-white/[0.06] p-6 sm:p-8">
          {sent ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-[#181818] text-[#ff4d4d] border border-[#ff0000]/30 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{contact.form.successTitle}</h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto">
                {contact.form.successDesc}
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-6 px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#222222] text-xs font-medium text-white transition-colors duration-150 border border-white/[0.06] cursor-pointer"
              >
                {contact.form.sendAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                  {contact.form.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={contact.form.namePlaceholder}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/[0.06] focus:border-[#ff0000]/60 text-white text-sm outline-none transition-colors placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                  {contact.form.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  placeholder={contact.form.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/[0.06] focus:border-[#ff0000]/60 text-white text-sm outline-none transition-colors placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                  {contact.form.messageLabel}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={contact.form.messagePlaceholder}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/[0.06] focus:border-[#ff0000]/60 text-white text-sm outline-none transition-colors placeholder:text-gray-600 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#ff0000] hover:bg-[#e00000] text-white text-sm font-semibold transition-colors duration-150 shadow-[0_4px_16px_rgba(255,0,0,0.2)] flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>{contact.form.submitBtn}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
