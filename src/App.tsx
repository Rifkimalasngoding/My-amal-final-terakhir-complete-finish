import { useState, useEffect } from 'react';
import { BookOpen, CheckSquare, Heart, Sparkles, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AmalTracker from './components/AmalTracker';
import DoaLibrary from './components/DoaLibrary';

// Inspirational Quranic Verses / Hadiths
const INSPIRATIONS = [
  {
    text: "Maka berlomba-lombalah kamu dalam kebaikan.",
    source: "QS. Al-Baqarah: 148"
  },
  {
    text: "Amalan yang paling dicintai oleh Allah adalah amalan yang kontinu (istiqamah) walaupun sedikit.",
    source: "HR. Bukhari"
  },
  {
    text: "Berdoalah kepada-Ku, niscaya akan Aku perkenankan bagimu.",
    source: "QS. Ghafir: 60"
  },
  {
    text: "Siapa yang menempuh jalan untuk mencari ilmu, maka Allah akan mudahkan baginya jalan menuju surga.",
    source: "HR. Muslim"
  },
  {
    text: "Ingatlah, hanya dengan mengingati Allah-lah hati menjadi tenteram.",
    source: "QS. Ar-Ra'd: 28"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'amal' | 'doa'>('amal');
  const [inspirationIdx, setInspirationIdx] = useState(0);

  // Rotate inspiration quotes every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setInspirationIdx((prev) => (prev + 1) % INSPIRATIONS.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col justify-between" id="main-app-container">
      
      <div>
        {/* Top Header Navigation */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-6" id="app-header">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Logo & Branding */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-700 rounded-xl flex items-center justify-center shadow-md shadow-emerald-700/20 text-white relative">
                <Moon className="w-6 h-6 text-emerald-100" />
                <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-emerald-800 tracking-tight flex items-center gap-2">
                  Muthaba’ah <span className="text-emerald-700">Amal Yaumi</span>
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                  Evaluasi Ibadah Harian & Pustaka Doa Terlengkap
                </p>
              </div>
            </div>

            {/* Tab Controller Segmented Style */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto self-start md:self-center border border-slate-200/50 shadow-inner">
              <button
                id="tab-btn-amal"
                onClick={() => setActiveTab('amal')}
                className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'amal'
                    ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/40'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <CheckSquare className={`w-4 h-4 ${activeTab === 'amal' ? 'text-emerald-600' : ''}`} />
                Amal Yaumi
              </button>
              <button
                id="tab-btn-doa"
                onClick={() => setActiveTab('doa')}
                className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'doa'
                    ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/40'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <BookOpen className={`w-4 h-4 ${activeTab === 'doa' ? 'text-emerald-600' : ''}`} />
                Pustaka Doa
              </button>
            </div>

          </div>
        </header>

        {/* Rotating Inspiration Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 mb-6" id="inspiration-banner">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden flex items-center gap-4 min-h-[72px]">
            <div className="hidden sm:flex w-9 h-9 bg-emerald-50 rounded-lg items-center justify-center text-emerald-600 flex-shrink-0 border border-emerald-100/30">
              <Heart className="w-4.5 h-4.5 fill-current" />
            </div>
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={inspirationIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-slate-700 font-medium text-sm sm:text-base italic leading-relaxed">
                    "{INSPIRATIONS[inspirationIdx].text}"
                  </p>
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
                    — {INSPIRATIONS[inspirationIdx].source}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 pb-16" id="app-main-content">
          <AnimatePresence mode="wait">
            {activeTab === 'amal' ? (
              <motion.div
                key="amal-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <AmalTracker />
              </motion.div>
            ) : (
              <motion.div
                key="doa-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DoaLibrary />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer Status Bar with "Professional Polish" design */}
      <footer className="bg-slate-800 text-slate-400 px-4 sm:px-8 py-3.5 text-xs flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-slate-700/30" id="app-footer">
        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Sistem Aktif
          </span>
          <span className="text-slate-500">|</span>
          <span>Perangkat Lokal: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span className="text-slate-500">|</span>
          <span className="flex items-center gap-1">
            Waktu Reset: 00:00 Waktu Lokal <Sparkles className="w-3 h-3 text-amber-400" />
          </span>
        </div>
        <div className="font-mono text-[10px] tracking-wider uppercase text-slate-500">v2.4.0-STABLE • OFFLINE FIRST</div>
      </footer>

    </div>
  );
}
