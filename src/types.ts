export interface Deed {
  id: string;
  title: string;
  description: string;
  category: 'Wajib' | 'Sunnah' | 'Dzikir' | 'Al-Qur\'an';
  target: string;
}

export interface DayProgress {
  date: string; // YYYY-MM-DD
  completedIds: string[];
}

export interface Doa {
  id: string;
  title: string;
  category: 'Harian' | 'Shalat' | 'Masjid & Wudhu' | 'Perjalanan' | 'Perlindungan' | 'Kebaikan';
  arabic: string;
  latin: string;
  translation: string;
  source?: string;
  benefit?: string;
}

export interface UserStats {
  streak: number;
  lastCompletedDate: string | null;
  history: { [date: string]: number }; // date -> completion percentage
}
