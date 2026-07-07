import { Deed } from '../types';

export const DEFAULT_DEEDS: Deed[] = [
  {
    id: 'shalat-fardhu',
    title: 'Shalat Fardhu 5 Waktu',
    description: 'Menjaga shalat Subuh, Dzuhur, Ashar, Maghrib, dan Isya tepat waktu.',
    category: 'Wajib',
    target: '5 kali sehari'
  },
  {
    id: 'shalat-rawatib',
    title: 'Shalat Sunnah Rawatib',
    description: 'Shalat sunnah qobliyah (sebelum) dan ba’diyah (sesudah) shalat fardhu.',
    category: 'Sunnah',
    target: 'Minimal 2-12 raka’at'
  },
  {
    id: 'shalat-tahajjud',
    title: 'Qiyamul Lail / Tahajjud',
    description: 'Mendirikan shalat malam dan ditutup dengan shalat witir.',
    category: 'Sunnah',
    target: 'Minimal 2 raka’at + witir'
  },
  {
    id: 'shalat-dhuha',
    title: 'Shalat Dhuha',
    description: 'Mendirikan shalat sunnah di pagi hari menjelang siang hari.',
    category: 'Sunnah',
    target: 'Minimal 2 raka’at'
  },
  {
    id: 'tilawah-quran',
    title: 'Tilawah Al-Qur’an',
    description: 'Membaca mushaf Al-Qur’an beserta memahami artinya jika memungkinkan.',
    category: 'Al-Qur\'an',
    target: 'Minimal 1 halaman / 1 Ain'
  },
  {
    id: 'dzikir-pagi',
    title: 'Dzikir Pagi',
    description: 'Membaca wirid atau dzikir ma’tsurat setelah shalat Subuh hingga matahari terbit.',
    category: 'Dzikir',
    target: '1 sesi (Pagi)'
  },
  {
    id: 'dzikir-petang',
    title: 'Dzikir Petang',
    description: 'Membaca wirid atau dzikir ma’tsurat setelah shalat Ashar hingga matahari terbenam.',
    category: 'Dzikir',
    target: '1 sesi (Petang)'
  },
  {
    id: 'istighfar-shalawat',
    title: 'Istighfar & Shalawat',
    description: 'Melafalkan istighfar mohon ampun dan bershalawat atas Nabi Muhammad SAW.',
    category: 'Dzikir',
    target: 'Masing-masing minimal 100x'
  },
  {
    id: 'sedekah-harian',
    title: 'Sedekah Harian',
    description: 'Berbagi rezeki baik berupa materi, makanan, atau sekadar membagikan ilmu dan senyuman.',
    category: 'Sunnah',
    target: 'Minimal 1 kali sehari'
  }
];
