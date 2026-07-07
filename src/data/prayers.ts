import { Doa } from '../types';

export const PRAYERS_DATA: Doa[] = [
  {
    id: 'doa-sebelum-tidur',
    title: 'Doa Sebelum Tidur',
    category: 'Harian',
    arabic: 'بِاسْمِكَ اللّٰهُمَّ اَحْيَا وَاَمُوْتُ',
    latin: 'Bismika Allahumma ahya wa amut.',
    translation: 'Dengan nama-Mu ya Allah aku hidup dan aku mati.',
    source: 'HR. Bukhari & Muslim',
    benefit: 'Perlindungan dari gangguan setan saat tidur dan kepasrahan jiwa kepada Allah.'
  },
  {
    id: 'doa-bangun-tidur',
    title: 'Doa Bangun Tidur',
    category: 'Harian',
    arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِىْ اَحْيَانَا بَعْدَ مَا اَمَاتَنَا وَاِلَيْهِ النُّشُوْرُ',
    latin: 'Alhamdulillahil-ladzi ahyana ba’da ma amatana wa ilaihin-nusyur.',
    translation: 'Segala puji bagi Allah yang telah menghidupkan kami kembali setelah mematikan kami (tidur) dan hanya kepada-Nya kami kembali.',
    source: 'HR. Bukhari',
    benefit: 'Ungkapan rasa syukur yang mendalam atas kesempatan hidup baru yang diberikan Allah.'
  },
  {
    id: 'doa-sebelum-makan',
    title: 'Doa Sebelum Makan',
    category: 'Harian',
    arabic: 'اَللّٰهُمَّ بَارِكْ لَنَا فِيْمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
    latin: 'Allahumma barik lana fima razaqtana wa qina ‘adzaban-nar.',
    translation: 'Ya Allah, berkahilah kami atas rezeki yang telah Engkau limpahkan kepada kami dan peliharalah kami dari siksa api neraka.',
    source: 'HR. Ibnu Sunni',
    benefit: 'Menghadirkan berkah pada makanan dan menghindarkan setan ikut serta menyantap rezeki kita.'
  },
  {
    id: 'doa-setelah-makan',
    title: 'Doa Setelah Makan',
    category: 'Harian',
    arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِيْ اَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِيْنَ',
    latin: 'Alhamdulillahil-ladzi ath’amana wa saqana wa ja’alana muslimin.',
    translation: 'Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami termasuk golongan orang-orang muslim.',
    source: 'HR. Abu Dawud & Tirmidzi',
    benefit: 'Menyempurnakan kenikmatan makanan dengan pujian syukur kepada Allah.'
  },
  {
    id: 'doa-masuk-kamar-mandi',
    title: 'Doa Masuk Kamar Mandi (WC)',
    category: 'Harian',
    arabic: 'اَللّٰهُمَّ اِنِّىْ اَعُوْذُبِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    latin: 'Allahumma inni a’udzu bika minal khubutsi wal khaba’its.',
    translation: 'Ya Allah, sesungguhnya aku berlindung kepada-Mu dari godaan setan laki-laki dan setan perempuan.',
    source: 'HR. Bukhari & Muslim',
    benefit: 'Perlindungan dari jin dan setan yang gemar tinggal di tempat-tempat kotor.'
  },
  {
    id: 'doa-keluar-kamar-mandi',
    title: 'Doa Keluar Kamar Mandi (WC)',
    category: 'Harian',
    arabic: 'غُفْرَانَكَ الْحَمْدُ لِلّٰهِ الَّذِىْ اَذْهَبَ عَنِّى الْاَذٰى وَعَافَانِىْ',
    latin: 'Ghufranakal-hamdulillahil-ladzi adzhaba ‘annil adza wa ‘afani.',
    translation: 'Aku memohon ampunan-Mu. Segala puji bagi Allah yang telah menghilangkan penyakit dari tubuhku dan menjaga kesehatanku.',
    source: 'HR. Abu Dawud & Ibnu Majah',
    benefit: 'Rasa syukur atas kesehatan fisik dan hilangnya ampas makanan dari tubuh.'
  },
  {
    id: 'doa-masuk-masjid',
    title: 'Doa Masuk Masjid',
    category: 'Masjid & Wudhu',
    arabic: 'اَللّٰهُمَّ افْتَحْ لِيْ اَبْوَابَ رَحْمَتِكَ',
    latin: 'Allahummaftah li abwaba rahmatik.',
    translation: 'Ya Allah, bukakanlah bagiku pintu-pintu rahmat-Mu.',
    source: 'HR. Muslim',
    benefit: 'Memohon curahan rahmat rohani saat melangkahkan kaki ke dalam rumah Allah.'
  },
  {
    id: 'doa-keluar-masjid',
    title: 'Doa Keluar Masjid',
    category: 'Masjid & Wudhu',
    arabic: 'اَللّٰهُمَّ اِنِّىْ اَسْأَلُكَ مِنْ فَضْلِكَ',
    latin: 'Allahumma inni as’aluka min fadhlik.',
    translation: 'Ya Allah, sesungguhnya aku memohon keutamaan/karunia dari-Mu.',
    source: 'HR. Muslim',
    benefit: 'Memohon keberkahan rezeki halal saat kembali beraktivitas di luar masjid.'
  },
  {
    id: 'doa-setelah-wudhu',
    title: 'Doa Setelah Wudhu',
    category: 'Masjid & Wudhu',
    arabic: 'أَشْهَدُ أَنْ لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُوْلُهُ. اَللّٰهُمَّ اجْعَلْنِيْ مِنَ التَّوَّابِيْنَ وَاجْعَلْنِيْ مِنَ الْمُتَطَهِّرِيْنَ',
    latin: 'Asyhadu alla ilaha illallah wahdahu la syarika lahu, wa asyhadu anna Muhammadan ‘abduhu wa rasuluhu. Allahummaj-’alni minat-tawwabina waj-’alni minal-mutathahhirin.',
    translation: 'Aku bersaksi bahwa tiada Tuhan selain Allah yang Maha Esa, tiada sekutu bagi-Nya. Dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya. Ya Allah, jadikanlah aku termasuk golongan orang yang bertaubat dan jadikanlah aku termasuk golongan orang yang bersuci.',
    source: 'HR. Tirmidzi & Muslim',
    benefit: 'Dibukakan delapan pintu surga bagi yang membacanya dengan khusyuk setelah berwudhu.'
  },
  {
    id: 'doa-keluar-rumah',
    title: 'Doa Keluar Rumah',
    category: 'Perjalanan',
    arabic: 'بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ، لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللهِ',
    latin: 'Bismillahi tawakkaltu ‘alallah, la hawla wala quwwata illa billah.',
    translation: 'Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan kekuatan kecuali dengan pertolongan Allah.',
    source: 'HR. Abu Dawud & Tirmidzi',
    benefit: 'Diberikan kecukupan perlindungan, petunjuk, dan setan pun menjauh selama perjalanan.'
  },
  {
    id: 'doa-naik-kendaraan',
    title: 'Doa Naik Kendaraan',
    category: 'Perjalanan',
    arabic: 'سُبْحَانَ الَّذِيْ سَخَّرَ لَنَا هٰذَا وَمَا كُنَّا لَهُ مُقْرِنِيْنَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُوْنَ',
    latin: 'Subhanal-ladzi sakh-khara lana hadza wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun.',
    translation: 'Maha Suci Allah yang telah menundukkan kendaraan ini bagi kami, padahal sebelumnya kami tidak mampu menguasainya. Dan sesungguhnya kepada Tuhan kamilah, kami akan kembali.',
    source: 'QS. Az-Zukhruf: 13-14',
    benefit: 'Menghadirkan keselamatan, menjauhkan dari mara bahaya, serta mengingat hari akhir.'
  },
  {
    id: 'doa-kedua-orang-tua',
    title: 'Doa untuk Kedua Orang Tua',
    category: 'Kebaikan',
    arabic: 'رَبِّ اغْفِرْ لِيْ وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِيْ صَغِيْرًا',
    latin: 'Rabbighfir li waliwalidayya warhamhuma kama rabbayani shaghira.',
    translation: 'Wahai Tuhanku, ampunilah aku dan kedua orang tuaku, dan sayangilah mereka berdua sebagaimana mereka berdua telah mendidikku di waktu kecil.',
    source: 'QS. Al-Isra: 24',
    benefit: 'Bentuk bakti anak (birrul walidain) yang mengalirkan pahala tak terputus bagi orang tua.'
  },
  {
    id: 'doa-sapu-jagat',
    title: 'Doa Kebaikan Dunia Akhirat (Sapu Jagat)',
    category: 'Kebaikan',
    arabic: 'رَبَّنَا اٰتِنَا فِى الدُّنْيَا حَسَنَةً وَّفِى الْاٰخِرَةِ حَسَنَةً وَّقِنَا عَذَابَ النَّارِ',
    latin: 'Rabbana atina fid-dunya hasanatah, wa fil-akhirati hasanatah, wa qina ‘adzaban-nar.',
    translation: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari siksa api neraka.',
    source: 'QS. Al-Baqarah: 201',
    benefit: 'Doa paling komprehensif mencakup seluruh kebaikan hidup, ketentraman jiwa, dan keselamatan akhirat.'
  },
  {
    id: 'doa-ketika-hujan',
    title: 'Doa Ketika Turun Hujan',
    category: 'Perlindungan',
    arabic: 'اَللّٰهُمَّ صَيِّبًا نَافِعًا',
    latin: 'Allahumma shayyiban nafi’an.',
    translation: 'Ya Allah, turunkanlah hujan yang membawa manfaat (kebaikan).',
    source: 'HR. Bukhari',
    benefit: 'Mengubah air hujan menjadi keberkahan dan memohon perlindungan dari musibah banjir.'
  },
  {
    id: 'doa-memohon-kemudahan',
    title: 'Doa Memohon Kemudahan & Kelapangan Dada',
    category: 'Kebaikan',
    arabic: 'رَبِّ اشْرَحْ لِيْ صَدْرِيْ وَيَسِّرْ لِيْ أَمْرِيْ وَاحْلُلْ عُقْدَةً مِنْ لِسَانِيْ يَفْقَهُوْا قَوْلِيْ',
    latin: 'Rabbisy-syrah li sadri, wa yassir li amri, wahlul ‘uqdatam-mil-lisani yafqahu qauli.',
    translation: 'Ya Tuhanku, lapangkanlah dadaku, mudahkanlah urusanku, dan lepaskanlah kekakuan lidahku agar mereka mengerti perkataanku.',
    source: 'QS. Thaha: 25-28',
    benefit: 'Sangat baik dibaca sebelum ujian, wawancara kerja, presentasi, atau menghadapi kesulitan hidup.'
  },
  {
    id: 'doa-terhindar-dari-musibah',
    title: 'Doa Memohon Perlindungan dari Musibah',
    category: 'Perlindungan',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    latin: 'Bismillahil-ladzi la yadhurru ma’as-mihi syai’un fil-ardhi wala fis-sama’i wa Huwas-Sami’ul-’Alim.',
    translation: 'Dengan nama Allah yang bila nama-Nya disebut, segala sesuatu di bumi dan langit tidak akan berbahaya, dan Dia-lah yang Maha Mendengar lagi Maha Mengetahui.',
    source: 'HR. Abu Dawud & Tirmidzi',
    benefit: 'Diriwayatkan dibaca 3 kali di pagi hari dan petang agar terlindung dari bahaya mendadak.'
  }
];
