import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Flame, Calendar, Clock, Trophy, RefreshCw, Star, Info, Check } from 'lucide-react';
import { Deed } from '../types';
import { DEFAULT_DEEDS as INITIAL_DEEDS } from '../data/deeds';

export default function AmalTracker() {
  const [deeds] = useState<Deed[]>(INITIAL_DEEDS);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [timeLeftToReset, setTimeLeftToReset] = useState<string>('');

  // 1. Helper to get YYYY-MM-DD in local timezone
  const getLocalDateString = (date: Date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 2. Ticking clock and Midnight reset countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Calculate time until next midnight local time
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight.getTime() - now.getTime();
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeftToReset(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 3. Load state and check for daily reset
  useEffect(() => {
    const checkDailyReset = () => {
      const todayStr = getLocalDateString();
      const storedDate = localStorage.getItem('amal_last_date');
      const storedCompleted = localStorage.getItem('amal_completed_ids');
      const storedStreak = localStorage.getItem('amal_streak');
      const storedHistory = localStorage.getItem('amal_history');

      let parsedCompleted: string[] = [];
      if (storedCompleted) {
        try {
          parsedCompleted = JSON.parse(storedCompleted);
        } catch (e) {
          parsedCompleted = [];
        }
      }

      let parsedStreak = storedStreak ? parseInt(storedStreak, 10) : 0;
      let parsedHistory: { [date: string]: number } = {};
      if (storedHistory) {
        try {
          parsedHistory = JSON.parse(storedHistory);
        } catch (e) {
          parsedHistory = {};
        }
      }

      // Check if day has changed
      if (storedDate && storedDate !== todayStr) {
        // Save previous day progress to history
        const totalDeeds = INITIAL_DEEDS.length;
        const completedCount = parsedCompleted.length;
        const percentage = totalDeeds > 0 ? Math.round((completedCount / totalDeeds) * 100) : 0;
        parsedHistory[storedDate] = percentage;
        localStorage.setItem('amal_history', JSON.stringify(parsedHistory));

        // Check if yesterday's streak is maintained
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = getLocalDateString(yesterday);

        if (storedDate === yesterdayStr) {
          if (percentage >= 80) {
            // If they completed at least 80% yesterday, maintain/increment streak
            parsedStreak += 1;
          } else {
            // Didn't complete enough, reset streak
            parsedStreak = 0;
          }
        } else {
          // Gapped by more than 1 day, reset streak
          parsedStreak = 0;
        }

        localStorage.setItem('amal_streak', parsedStreak.toString());

        // Reset today's checklist
        parsedCompleted = [];
        localStorage.setItem('amal_completed_ids', JSON.stringify(parsedCompleted));
        localStorage.setItem('amal_last_date', todayStr);

        setCompletedIds([]);
        setStreak(parsedStreak);
      } else {
        // Same day or first initialization
        if (!storedDate) {
          localStorage.setItem('amal_last_date', todayStr);
        }
        setCompletedIds(parsedCompleted);
        setStreak(parsedStreak);
      }
    };

    checkDailyReset();
    
    // Check reset whenever window gains focus
    window.addEventListener('focus', checkDailyReset);
    return () => window.removeEventListener('focus', checkDailyReset);
  }, []);

  // 4. Handle check/uncheck
  const toggleDeed = (id: string) => {
    let updatedCompleted = [...completedIds];
    if (updatedCompleted.includes(id)) {
      updatedCompleted = updatedCompleted.filter(item => item !== id);
    } else {
      updatedCompleted.push(id);
    }

    setCompletedIds(updatedCompleted);
    localStorage.setItem('amal_completed_ids', JSON.stringify(updatedCompleted));

    // Calculate if they just reached 100% and update streak immediately
    const totalDeeds = INITIAL_DEEDS.length;
    if (updatedCompleted.length === totalDeeds) {
      // If completed all today, let's boost streak or update stats
      const storedStreak = localStorage.getItem('amal_streak');
      const currentStreak = storedStreak ? parseInt(storedStreak, 10) : 0;
      
      // Prevent double increment if they already got it today
      const todayStr = getLocalDateString();
      const lastCompletedDate = localStorage.getItem('amal_last_completed_date');
      
      if (lastCompletedDate !== todayStr) {
        const newStreak = currentStreak === 0 ? 1 : currentStreak; // Or increment if yesterday was completed
        setStreak(newStreak);
        localStorage.setItem('amal_streak', newStreak.toString());
        localStorage.setItem('amal_last_completed_date', todayStr);
      }
    }
  };

  // Categories
  const categories = ['Semua', 'Wajib', 'Sunnah', 'Dzikir', 'Al-Qur\'an'];
  const filteredDeeds = selectedCategory === 'Semua' 
    ? deeds 
    : deeds.filter(deed => deed.category === selectedCategory);

  const totalDeedsCount = deeds.length;
  const completedDeedsCount = completedIds.length;
  const completionPercentage = totalDeedsCount > 0 
    ? Math.round((completedDeedsCount / totalDeedsCount) * 100) 
    : 0;

  const isAllCompleted = completedDeedsCount === totalDeedsCount;

  // Format date display (Indonesian language)
  const formatIndonesianDate = (date: Date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Manual reset helper
  const handleManualReset = () => {
    if (window.confirm('Apakah Anda yakin ingin menyetel ulang semua checklist hari ini?')) {
      setCompletedIds([]);
      localStorage.setItem('amal_completed_ids', JSON.stringify([]));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="amal-tracker-section">
      {/* KIRI: Daftar Checklist */}
      <div className="lg:col-span-8 flex flex-col space-y-6">
        
        {/* Banner/Header Info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-100/40 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 text-lg">
                {formatIndonesianDate(currentTime)}
              </h2>
              <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-0.5 font-medium">
                <Clock className="w-4 h-4 text-emerald-600" />
                Pukul {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-100/50 py-1.5 px-3.5 rounded-full text-xs font-semibold shadow-sm">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            Streak: {streak} Hari
          </div>
        </div>

        {/* Kategori Filters */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`filter-btn-${cat}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm shadow-emerald-700/15'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          {completedDeedsCount > 0 && (
            <button
              id="btn-manual-reset"
              onClick={handleManualReset}
              className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1.5 transition-colors cursor-pointer font-bold uppercase tracking-wider"
              title="Reset manual untuk hari ini"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Hari Ini
            </button>
          )}
        </div>

        {/* List Checklist */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredDeeds.map((deed) => {
              const isCompleted = completedIds.includes(deed.id);
              return (
                <motion.div
                  key={deed.id}
                  id={`deed-card-${deed.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: isCompleted ? 0.7 : 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                  onClick={() => toggleDeed(deed.id)}
                  className={`group relative p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-4 ${
                    isCompleted
                      ? 'bg-slate-50 border-emerald-200 shadow-none'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  {/* Status Checkbox */}
                  <div className="mt-1 flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center text-white">
                        <Check className="w-4 h-4 stroke-[3.5]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-md border-2 border-slate-300 group-hover:border-emerald-500 transition-colors" />
                    )}
                  </div>

                  {/* Konten */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-semibold text-base transition-colors ${
                        isCompleted ? 'text-slate-500 line-through decoration-emerald-500/40' : 'text-slate-800'
                      }`}>
                        {deed.title}
                      </h3>
                      
                      {/* Badge Kategori */}
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        deed.category === 'Wajib' 
                          ? 'bg-amber-50 text-amber-800 border border-amber-100' 
                          : deed.category === 'Sunnah'
                          ? 'bg-sky-50 text-sky-800 border border-sky-100'
                          : deed.category === 'Dzikir'
                          ? 'bg-indigo-50 text-indigo-800 border border-indigo-100'
                          : 'bg-teal-50 text-teal-800 border border-teal-100'
                      }`}>
                        {deed.category}
                      </span>

                      {/* Target */}
                      <span className="text-xs text-slate-400 font-semibold">
                        • {deed.target}
                      </span>
                    </div>
                    
                    <p className={`text-sm mt-1 leading-relaxed ${
                      isCompleted ? 'text-slate-500/80' : 'text-slate-500'
                    }`}>
                      {deed.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

      {/* KANAN: Ringkasan & Timer Reset */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Progress Tracker Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
          <h3 className="font-bold text-slate-800 text-lg mb-4">Progress Hari Ini</h3>
          
          {/* Progress Ring */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Outer track */}
              <circle
                cx="72"
                cy="72"
                r="64"
                className="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Progress */}
              <circle
                cx="72"
                cy="72"
                r="64"
                className="text-emerald-500 transition-all duration-500 ease-out"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 64}
                strokeDashoffset={2 * Math.PI * 64 * (1 - completionPercentage / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            
            {/* Center Text */}
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-slate-800">
                {completionPercentage}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                {completedDeedsCount} dari {totalDeedsCount} Selesai
              </span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-3 mt-6 border-t border-slate-100 pt-5">
            <div className="text-left bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Selesai</span>
              <span className="text-lg font-bold text-emerald-600 block">{completedDeedsCount}</span>
            </div>
            <div className="text-left bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sisa Amal</span>
              <span className="text-lg font-bold text-slate-500 block">{totalDeedsCount - completedDeedsCount}</span>
            </div>
          </div>
        </div>

        {/* CELEBRATION & AUTO-RESET CARD with "Professional Polish" design */}
        <AnimatePresence>
          {isAllCompleted ? (
            <motion.div
              id="completion-celebration-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-emerald-600 text-white rounded-2xl p-8 shadow-lg shadow-emerald-200 relative overflow-hidden"
            >
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-emerald-50 mb-4 text-emerald-600 shadow">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                
                <h2 className="text-3xl font-bold mb-2">Alhamdulillah!</h2>
                <p className="text-emerald-50 text-base opacity-90 leading-relaxed mb-6 font-medium">
                  Tugas hari ini sudah selesai. Semua amal harian Anda telah tercatat.
                  Daftar ini akan direset secara otomatis setelah hari berikutnya sesuai dengan waktu lokal.
                </p>

                <div className="w-full bg-emerald-700/40 rounded-xl p-4 border border-emerald-500/35 backdrop-blur-sm">
                  <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest block mb-1">
                    Reset Otomatis Dalam
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-300 animate-pulse" />
                    <span className="font-mono text-2xl font-bold tracking-wider">
                      {timeLeftToReset || '--:--:--'}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-200/80 block mt-2 leading-relaxed">
                    Aplikasi mendeteksi pergantian tanggal secara real-time berdasarkan waktu lokal perangkat Anda.
                  </span>
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-slate-500 flex items-start gap-3.5"
            >
              <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">Informasi Auto-Reset</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Daftar amal yaumi akan direset secara otomatis saat memasuki hari berikutnya (pukul 00:00 dini hari waktu lokal). Pastikan untuk mencentang semua tugas sebelum hari berakhir!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
