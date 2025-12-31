
import React, { useState, useMemo } from 'react';
import { BlogPost } from '../types';

interface BlogPageProps {
  onReadPost: (post: BlogPost) => void;
  posts: BlogPost[];
}

const BlogPage: React.FC<BlogPageProps> = ({ onReadPost, posts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = useMemo(() => ['Todos', ...Array.from(new Set(posts.map(p => p.category)))], [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'Todos' || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, posts]);

  const featuredPost = useMemo(() => posts.find(p => p.isFeatured) || posts[0], [posts]);
  const latestPosts = useMemo(() => posts.slice(0, 5), [posts]);

  return (
    <div className="bg-white min-h-screen">
      {/* Blog Hero */}
      <div className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <span className="inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6">Editorial Empreende 2026</span>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">O Guia Definitivo do Empreendedor</h1>
              <p className="text-xl text-gray-400 leading-relaxed mb-8">Análises profundas, guias práticos e atualizações em tempo real sobre o mercado e legislação para o seu negócio prosperar.</p>
              
              <div className="relative max-w-md">
                <input 
                  type="text" 
                  placeholder="Buscar guias, prazos ou impostos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-600 outline-none transition"
                />
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
              </div>
            </div>
            {featuredPost && (
                <div className="md:w-1/2 group cursor-pointer" onClick={() => onReadPost(featuredPost)}>
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <img src={featuredPost.image || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800'} alt={featuredPost.title} className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                    <span className="text-blue-400 font-bold text-xs uppercase mb-2 block">{featuredPost.category}</span>
                    <h3 className="text-2xl font-black mb-2">{featuredPost.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                        <span>{featuredPost.author || 'Redação'}</span>
                        <span>•</span>
                        <span>{featuredPost.readTime || '5 min'} de leitura</span>
                    </div>
                    </div>
                </div>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 h-16">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm font-bold whitespace-nowrap transition-colors uppercase tracking-widest ${activeCategory === cat ? 'text-blue-600 border-b-2 border-blue-600 h-full px-2' : 'text-gray-400 hover:text-gray-900'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Posts List */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center">
              {activeCategory === 'Todos' ? 'Artigos Recentes' : `Publicações em ${activeCategory}`}
              <span className="ml-4 h-px bg-gray-100 flex-grow"></span>
            </h2>
            
            <div className="space-y-12">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <article 
                    key={post.id} 
                    onClick={() => onReadPost(post)}
                    className="flex flex-col md:flex-row gap-8 group cursor-pointer"
                  >
                    <div className="md:w-1/3 h-56 rounded-3xl overflow-hidden shadow-lg">
                      <img src={post.image || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800'} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="md:w-2/3 flex flex-col justify-center">
                      <div className="flex items-center space-x-3 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">
                        <span>{post.category}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-400">{post.readTime || '5 min'}</span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">{post.title}</h3>
                      <p className="text-gray-500 mb-6 line-clamp-2 leading-relaxed italic">"{post.excerpt}"</p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <span className="text-sm font-bold text-gray-900">{post.author || 'Equipe Editorial'}</span>
                        <span className="text-xs text-gray-400">{post.date}</span>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-[3rem]">
                  <i className="fas fa-search text-4xl text-gray-200 mb-4"></i>
                  <p className="text-gray-500">Nenhum artigo encontrado para sua busca ou categoria.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-12">
            {/* Popular Posts */}
            <div>
              <h4 className="text-lg font-black text-gray-900 mb-6 flex items-center">
                <i className="fas fa-fire-alt text-amber-500 mr-2"></i>
                Mais Lidos
              </h4>
              <div className="space-y-6">
                {latestPosts.map((post, i) => (
                  <div 
                    key={post.id} 
                    onClick={() => onReadPost(post)}
                    className="flex items-start space-x-4 group cursor-pointer"
                  >
                    <span className="text-3xl font-black text-gray-100 group-hover:text-blue-100 transition-colors">0{i+1}</span>
                    <div>
                      <h5 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-1">{post.title}</h5>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{post.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
