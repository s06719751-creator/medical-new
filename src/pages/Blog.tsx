import React, { useState } from 'react';
import { useDb } from '../context/DbContext';
import type { BlogPost } from '../context/DbContext';
import { GlowingCard } from '../components/GlowingCard';
import { Search, Tag, Calendar, ArrowLeft, ArrowRight, ShieldCheck, Newspaper } from 'lucide-react';

export const Blog: React.FC = () => {
  const { blogs } = useDb();
  
  // Search & Tag state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  // Extract all unique tags
  const allTags = ['All'];
  blogs.forEach((b) => {
    b.tags.forEach((t) => {
      if (!allTags.includes(t)) allTags.push(t);
    });
  });

  const filteredBlogs = blogs.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag);
    const isPublished = post.status === 'published';
    
    return isPublished && matchesSearch && matchesTag;
  });

  // Render Full Article detail view
  if (activeArticle) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-12 text-left animate-[fadeIn_0.35s_ease-out]">
        <button
          onClick={() => setActiveArticle(null)}
          className="mb-8 px-4 py-2 rounded-xl glass-panel border-white/10 hover:border-purple-500/30 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all select-none hover:-translate-x-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </button>

        <article className="glass-panel rounded-3xl border-white/10 overflow-hidden shadow-2xl bg-[#070624]/60">
          {/* Cover image */}
          <div className="w-full aspect-[21/9] bg-slate-900 overflow-hidden relative">
            <img src={activeArticle.coverImage} alt={activeArticle.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-80" />
            
            {/* Tags overlay */}
            <div className="absolute bottom-5 left-5 flex gap-2">
              {activeArticle.tags.map(t => (
                <span key={t} className="px-2.5 py-1 rounded-lg bg-purple-600/90 text-white text-[9px] font-bold font-mono tracking-wider uppercase">{t}</span>
              ))}
            </div>
          </div>

          <div className="p-6 lg:p-10 space-y-6">
            {/* Author / Date Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-3">
                <img src={activeArticle.authorAvatar} alt={activeArticle.authorName} className="w-9 h-9 rounded-full object-cover border border-purple-400/20" />
                <span>Written by <strong className="text-slate-200">{activeArticle.authorName}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>{new Date(activeArticle.publishedAt).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-sans tracking-tight">
              {activeArticle.title}
            </h1>

            {/* Content paragraph markup */}
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans space-y-4 pt-2">
              {activeArticle.content.split('\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
            
            {/* Disclaimer notice inside article */}
            <div className="glass-panel border-rose-500/20 rounded-xl p-4 bg-rose-950/5 mt-8 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                IMPORTANT: Articles in this section are authored by certified specialists and reflect medical science parameters for educational clarity. They do not constitute diagnostic medical treatments or replacement clinical prescriptions.
              </p>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 text-left animate-[fadeIn_0.5s_ease-out]">
      {/* Background glow spot */}
      <div className="glow-spot w-[300px] h-[300px] bg-purple-900/10 top-0 left-20" />

      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border-purple-500/20 bg-purple-500/5 text-purple-300 text-xs font-semibold uppercase tracking-wider font-mono mb-4">
          <Newspaper className="w-3.5 h-3.5" />
          Clinical Research & Resources
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
          Healthcare Resources & <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            Preventative Digests
          </span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Stay informed with medical digests written by verified specialist physicians, covering diagnostics, longevity tracking science, and EHR database encryptions.
        </p>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources, tags, headers..."
            className="w-full glass-panel rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>

        {/* Tag selection */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <Tag className="w-4 h-4 text-purple-400 shrink-0 hidden sm:block" />
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                selectedTag === t 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'glass-panel text-slate-400 hover:text-slate-200 border-white/10 hover:bg-white/5'
              }`}
            >
              {t === 'All' ? 'All Articles' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Article Grid */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((post) => (
            <GlowingCard
              key={post.id}
              onClick={() => setActiveArticle(post)}
              glowColor="purple"
              className="flex flex-col p-0 overflow-hidden relative cursor-pointer group"
            >
              {/* Cover */}
              <div className="w-full aspect-[4/3] bg-slate-900 overflow-hidden relative">
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                {/* Category tag */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1 max-w-[80%]">
                  {post.tags.slice(0, 2).map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-purple-600/90 text-white text-[9px] font-bold font-mono uppercase tracking-wider">{t}</span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="p-5 text-left flex flex-col gap-3 flex-grow">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{new Date(post.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                
                <h3 className="font-extrabold text-slate-100 text-base leading-snug group-hover:text-purple-400 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                  <div className="flex items-center gap-2 text-[10px] text-slate-300 font-mono">
                    <img src={post.authorAvatar} alt={post.authorName} className="w-6 h-6 rounded-full object-cover border border-white/10" />
                    <span>{post.authorName}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-purple-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Read Article
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </GlowingCard>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center max-w-xl mx-auto border-white/5 flex flex-col items-center gap-4">
          <Newspaper className="w-12 h-12 text-purple-400 animate-pulse" />
          <h3 className="text-lg font-bold text-white">No Resources Found</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Adjust your tag selections or search descriptors. Check back soon for updated clinical research publications.
          </p>
        </div>
      )}
    </div>
  );
};
