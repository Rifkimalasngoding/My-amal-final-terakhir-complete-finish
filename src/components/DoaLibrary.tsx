import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Star, Copy, Check, ChevronRight, X, Sparkles, BookOpen, Volume2 } from 'lucide-react';
import { Doa } from '../types';
import { PRAYERS_DATA } from '../data/prayers';

export default function DoaLibrary() {
  const [prayers] = useState<Doa[]>(PRAYERS_DATA);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [activePrayer, setActivePrayer] = useState<Doa | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [arabicFontSize, setArabicFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  // Load favorites from LocalStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('doa_favorites');
    if (savedFavorites) {
      try {
        setFavoriteIds(JSON.parse(savedFavorites));
      } catch (e) {
        setFavoriteIds([]);
      }
    }
  }, []);

  // Save favorites to LocalStorage
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updatedFavorites = [...favoriteIds];
    if (updatedFavorites.includes(id)) {
      updatedFavorites = updatedFavorites.filter(favId => favId !== id);
    } else {
      updatedFavorites.push(id);
    }
    setFavoriteIds(updatedFavorites);
    localStorage.setItem('doa_favorites', JSON.stringify(updatedFavorites));
  };

  // Copy prayer contents to clipboard
  const handleCopy = (prayer: Doa, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const textToCopy = `✨ ${prayer.title} ✨\n\n[Arab]\n${prayer.arabic}\n\n[Latin]\n${prayer.latin}\n\n[Artinya]\n"${prayer.translation}"\n\nSumber: ${prayer.source || 'Harian'}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(prayer.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Filter prayers based on search and category
  const filteredPrayers = prayers.filter(prayer => {
    const matchesSearch = 
      prayer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prayer.latin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prayer.translation.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'Semua') {
      return matchesSearch;
    } else if (selectedCategory === 'Favorit') {
      return matchesSearch && favoriteIds.includes(prayer.id);
    } else {
      return matchesSearch && prayer.category === selectedCategory;
    }
  });

  // Unique categories
  const categories = ['Semua', 'Favorit', 'Harian', 'Shalat', 'Masjid & Wudhu', 'Perjalanan', 'Perlindungan', 'Kebaikan'];

  // Font size classes
  const fontSizes = {
    sm: 'text-xl sm:text-2xl leading-loose',
    md: 'text-2xl sm:text-3xl leading-[2.2]',
    lg: 'text-3xl sm:text-4xl leading-[2.5]',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="doa-library-section">
      {/* KIRI: Daftar Doa */}
      <div className={`${activePrayer ? 'lg:col-span-6' : 'lg:col-span-12'} flex flex-col space-y-6 transition-all duration-300`}>
        
        {/* Kontrol Pencarian & Filter */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              id="search-doa-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari doa harian, lafal, atau arti..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800 font-medium placeholder:text-slate-400"
            />
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-200">
            {categories.map(cat => {
              const count = cat === 'Semua' 
                ? prayers.length 
                : cat === 'Favorit' 
                ? favoriteIds.length 
                : prayers.filter(p => p.category === cat).length;

              return (
                <button
                  key={cat}
                  id={`doa-category-${cat}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm shadow-emerald-700/10'
                      : 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {cat === 'Favorit' && <Star className="w-3.5 h-3.5 fill-current" />}
                  {cat}
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-200/60 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Daftar Doa Grid */}
        <div className={`grid gap-4 ${activePrayer ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
          <AnimatePresence mode="popLayout">
            {filteredPrayers.length > 0 ? (
              filteredPrayers.map((prayer) => {
                const isFavorite = favoriteIds.includes(prayer.id);
                const isActive = activePrayer?.id === prayer.id;
                
                return (
                  <motion.div
                    key={prayer.id}
                    id={`doa-card-${prayer.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                    onClick={() => setActivePrayer(prayer)}
                    className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                      isActive
                        ? 'bg-emerald-50/30 border-emerald-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        {/* Kategori Badge */}
                        <span className="text-[10px] bg-slate-50 text-emerald-800 font-extrabold border border-slate-200/40 px-2 py-0.5 rounded uppercase tracking-wider">
                          {prayer.category}
                        </span>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            id={`btn-fav-${prayer.id}`}
                            onClick={(e) => toggleFavorite(prayer.id, e)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                            title="Simpan ke Favorit"
                          >
                            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                          </button>
                          <button
                            id={`btn-copy-${prayer.id}`}
                            onClick={(e) => handleCopy(prayer, e)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer relative"
                            title="Salin Doa"
                          >
                            {copiedId === prayer.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-800 text-base tracking-tight group-hover:text-emerald-700 transition-colors">
                        {prayer.title}
                      </h3>
                      
                      <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                        {prayer.translation}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-emerald-700 font-bold group">
                      <span>Baca Selengkapnya</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-16 bg-white border border-slate-200 rounded-2xl flex flex-col items-center text-center p-6 shadow-sm"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
                  <BookOpen className="w-5 h-5 text-slate-400" />
                </div>
                <h4 className="font-bold text-slate-700 text-base">Tidak Ada Doa Ditemukan</h4>
                <p className="text-sm text-slate-400 mt-1 max-w-sm">
                  Coba sesuaikan kata kunci pencarian atau pilih kategori lain.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* KANAN: Detail Doa Aktif */}
      <AnimatePresence>
        {activePrayer && (
          <motion.div
            key={activePrayer.id}
            id="active-prayer-detail-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-fit sticky top-6 gap-6"
          >
            {/* Header Detail */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] bg-slate-50 text-emerald-800 font-extrabold border border-slate-200/40 px-2 py-0.5 rounded uppercase tracking-wider">
                  {activePrayer.category}
                </span>
                <h2 className="font-extrabold text-slate-800 text-lg sm:text-xl mt-1 tracking-tight">
                  {activePrayer.title}
                </h2>
              </div>
              <button
                id="btn-close-prayer-detail"
                onClick={() => setActivePrayer(null)}
                className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
                title="Tutup Detail"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Arabic Font-Size Controller */}
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl text-xs text-slate-500 font-semibold border border-slate-100">
              <span className="flex items-center gap-1.5 pl-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Ukuran Huruf Arab:
              </span>
              <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200/60">
                {(['sm', 'md', 'lg'] as const).map(size => (
                  <button
                    key={size}
                    id={`btn-font-size-${size}`}
                    onClick={() => setArabicFontSize(size)}
                    className={`px-3 py-1 rounded text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                      arabicFontSize === size
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {size === 'sm' ? 'Kecil' : size === 'md' ? 'Sedang' : 'Besar'}
                  </button>
                ))}
              </div>
            </div>

            {/* Lafal Arab */}
            <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-6 flex flex-col items-end text-right">
              {/* Arabic script font stack for maximum compatibility and clarity */}
              <p 
                dir="rtl" 
                className={`w-full text-slate-900 font-normal tracking-wide leading-relaxed font-arabic ${fontSizes[arabicFontSize]}`}
                style={{ fontFamily: "'Scheherazade New', 'Amiri', 'Traditional Arabic', system-ui, sans-serif" }}
              >
                {activePrayer.arabic}
              </p>
            </div>

            {/* Lafal Latin & Arti */}
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Lafal Latin
                </span>
                <p className="text-sm text-slate-700 italic leading-relaxed font-medium bg-slate-50 border border-slate-200/30 p-4 rounded-xl">
                  {activePrayer.latin}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Arti Terjemahan
                </span>
                <p className="text-sm text-slate-800 leading-relaxed font-normal bg-slate-50 border border-slate-200/30 p-4 rounded-xl">
                  "{activePrayer.translation}"
                </p>
              </div>

              {activePrayer.benefit && (
                <div className="border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Keutamaan / Fadhilah
                  </span>
                  <p className="text-xs text-emerald-800 leading-relaxed bg-emerald-50/35 p-3.5 rounded-xl border border-emerald-100/35 font-semibold">
                    {activePrayer.benefit}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Detail (Actions & Source) */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400 font-semibold mt-auto flex-wrap gap-3">
              <span>Sumber: {activePrayer.source || 'Harian'}</span>
              
              <div className="flex gap-2">
                <button
                  id="btn-detail-fav"
                  onClick={() => toggleFavorite(activePrayer.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                    favoriteIds.includes(activePrayer.id)
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${favoriteIds.includes(activePrayer.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
                  {favoriteIds.includes(activePrayer.id) ? 'Favorit' : 'Tambah Favorit'}
                </button>
                <button
                  id="btn-detail-copy"
                  onClick={() => handleCopy(activePrayer)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-700/10 transition-colors cursor-pointer"
                >
                  {copiedId === activePrayer.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Salin Lengkap
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
