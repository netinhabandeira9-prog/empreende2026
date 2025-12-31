
import React, { useMemo } from 'react';
import { BlogPost } from '../types';

interface BlogSectionProps {
  onReadPost: (post: BlogPost) => void;
  posts: BlogPost[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ onReadPost, posts }) => {
  const urgentPost = useMemo(() => posts.find(p => p.isUrgent), [posts]);
  const regularPosts = useMemo(() => posts.filter(p => !p.isUrgent).slice(0, 6), [posts]);

  return (
    <section id="blog" className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Editorial 2026</span>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-tighter">• Informação Técnica Oficial</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 leading-tight">Artigos em Destaque</h2>
            <p className="mt-3 text-lg text-gray-500 max-w-lg">Conteúdo exclusivo da NB Empreende para guiar seu negócio na transição tributária.</p>
          </div>
          <button onClick={() => window.location.hash = 'blog'} className="hidden md:flex items-center text-blue-700 font-black text-xs uppercase tracking-widest hover:text-blue-900 transition mt-6 md:mt-0">
            Ver Todo o Blog <i className="fas fa-arrow-right ml-3"></i>
          </button>
        </header>

        {/* POST URGENTE SEMÂNTICO */}
        {urgentPost && (
          <article className="mb-16 group">
            <div 
              onClick={() => onReadPost(urgentPost)}
              className="bg-white border border-red-100 rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-red-900/5 hover:shadow-red-900/10 transition-all cursor-pointer relative"
            >
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 animate-pulse">
                  <i className="fas fa-fire"></i> LEITURA OBRIGATÓRIA
                </span>
              </div>
              
              <div className="md:w-1/2 h-72 md:h-auto overflow-hidden">
                <img 
                  src={urgentPost.image || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800'} 
                  alt={urgentPost.title} 
                  loading="lazy"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              
              <div className="p-10 md:p-16 flex-1 flex flex-col justify-center">
                <span className="text-red-600 font-black text-[10px] uppercase mb-4 tracking-[0.2em]">{urgentPost.category}</span>
                <h3 className="text-2xl md:text-4xl font-black text-gray-900 mb-6 group-hover:text-red-600 transition-colors leading-tight">
                  {urgentPost.title}
                </h3>
                <p className="text-gray-500 text-lg mb-8 leading-relaxed line-clamp-3">
                  {urgentPost.excerpt}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                   <time className="text-gray-400 text-xs font-bold uppercase">{urgentPost.date}</time>
                   <span className="text-red-600 font-black text-xs uppercase tracking-widest">Abrir Guia <i className="fas fa-chevron-right ml-2 text-[8px]"></i></span>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* GRID SEMÂNTICO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col group">
              <div className="h-60 overflow-hidden relative" onClick={() => onReadPost(post)} style={{cursor: 'pointer'}}>
                <img 
                  src={post.image || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800'} 
                  alt={post.title} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className={`absolute bottom-4 left-4 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${post.isFeatured ? 'bg-amber-500 shadow-lg shadow-amber-500/30' : 'bg-blue-700 shadow-lg shadow-blue-700/30'}`}>
                  {post.isFeatured ? 'Destaque' : post.category}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <time className="text-gray-400 text-[10px] font-bold uppercase mb-4 tracking-tighter">
                   <i className="far fa-calendar-alt mr-2 text-blue-700"></i> {post.date}
                </time>
                <h3 className="text-xl font-black text-gray-900 mb-4 leading-tight group-hover:text-blue-700 transition-colors cursor-pointer" onClick={() => onReadPost(post)}>
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-8 flex-1 leading-relaxed italic">
                  "{post.excerpt}"
                </p>
                <button 
                  onClick={() => onReadPost(post)}
                  className="w-full py-4 bg-gray-50 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 hover:text-white transition-all active:scale-95 border border-gray-100"
                >
                  Ler Artigo Completo
                </button>
              </div>
            </article>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default BlogSection;
