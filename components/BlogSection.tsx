
import React, { useMemo } from 'react';
import { BLOG_POSTS } from '../constants';
import { BlogPost } from '../types';

interface BlogSectionProps {
  onReadPost: (post: BlogPost) => void;
}

const BlogSection: React.FC<BlogSectionProps> = ({ onReadPost }) => {
  const urgentPost = useMemo(() => BLOG_POSTS.find(p => p.isUrgent), []);
  const regularPosts = useMemo(() => BLOG_POSTS.filter(p => !p.isUrgent), []);

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">Edição da Semana</span>
              <span className="text-gray-400 text-xs">• Atualizado toda segunda-feira</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 leading-tight">Painel de Informação 2026</h2>
            <p className="mt-2 text-lg text-gray-500">O que é essencial para seu negócio não parar.</p>
          </div>
          <button className="hidden md:flex items-center text-blue-600 font-bold hover:text-blue-800 transition">
            Ver Arquivo Completo <i className="fas fa-chevron-right ml-2 text-xs"></i>
          </button>
        </div>

        {/* ÁREA DE DESTAQUE URGENTE */}
        {urgentPost && (
          <div className="mb-12 group">
            <div 
              onClick={() => onReadPost(urgentPost)}
              className="bg-red-50 border-2 border-red-200 rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-xl shadow-red-100 hover:shadow-red-200 transition-all cursor-pointer relative"
            >
              <div className="absolute top-4 left-4 z-10">
                <span className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase animate-pulse">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>URGENTE: ATENÇÃO AO PRAZO</span>
                </span>
              </div>
              
              <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img 
                  src={urgentPost.image} 
                  alt={urgentPost.title} 
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              
              <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
                <span className="text-red-600 font-bold text-xs uppercase mb-2 tracking-widest">{urgentPost.category}</span>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 group-hover:text-red-700 transition-colors">
                  {urgentPost.title}
                </h3>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  {urgentPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                   <span className="text-gray-400 text-sm font-medium">{urgentPost.date}</span>
                   <span className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold text-sm">Resolver Agora</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GRID DE ARTIGOS REGULARES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col group">
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className={`absolute top-4 left-4 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${post.isFeatured ? 'bg-amber-500' : 'bg-blue-600'}`}>
                  {post.isFeatured ? 'Destaque' : post.category}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center text-gray-400 text-[10px] font-bold uppercase mb-3">
                   <i className="far fa-calendar-alt mr-2"></i>
                   {post.date}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-8 flex-1 leading-relaxed italic">
                  "{post.excerpt}"
                </p>
                <button 
                  onClick={() => onReadPost(post)}
                  className="w-full py-3 bg-gray-50 text-gray-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 border border-gray-100"
                >
                  Abrir Conteúdo
                </button>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default BlogSection;
