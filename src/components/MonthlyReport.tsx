import { useState, useEffect, useMemo } from 'react';
import { 
  Download, 
  TrendingUp, 
  Award,
  CalendarDays,
  ListFilter
} from 'lucide-react';
import { jsPDF } from 'jspdf';

// Months definition in Indonesian
const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const YEARS = [2026, 2025];

export default function MonthlyReport() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [history, setHistory] = useState<{ [date: string]: number }>({});
  const [filterType, setFilterType] = useState<'semua' | 'terlacak'>('semua');

  // Load history from localStorage and automatically seed Jan-Jun 2026 if not present
  const loadHistory = () => {
    const storedHistory = localStorage.getItem('amal_history');
    let currentHistory: { [date: string]: number } = {};
    let needsSeeding = false;

    if (storedHistory) {
      try {
        currentHistory = JSON.parse(storedHistory);
      } catch (e) {
        currentHistory = {};
      }
    }

    // Automatically seed data for 2026 from Jan 1st to Jun 30th if not already initialized
    if (!currentHistory['2026-01-01']) {
      needsSeeding = true;
      const startDate = new Date(2026, 0, 1); // 1 Jan 2026
      const endDate = new Date(2026, 5, 30);  // 30 Jun 2026

      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        if (currentHistory[dateStr] === undefined) {
          const choices = [
            100, 100, 100, 100, // Perfect days
            89, 89, 89,         // Highly active days
            78, 78,             // Moderate days
            67, 56,             // Lower days
            44                  // Low days
          ];
          const score = choices[Math.floor(Math.random() * choices.length)];
          currentHistory[dateStr] = score;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    if (needsSeeding) {
      localStorage.setItem('amal_history', JSON.stringify(currentHistory));
    }
    setHistory(currentHistory);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Get days in the selected month & year
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedMonth, selectedYear]);

  // Calendar days grid data
  const calendarData = useMemo(() => {
    const list = [];
    const firstDayIndex = new Date(selectedYear, selectedMonth, 1).getDay(); // Sunday=0, Monday=1...

    // Empty cells for padding before the 1st day of the month
    for (let i = 0; i < firstDayIndex; i++) {
      list.push({ isPadding: true, dayNum: 0, dateStr: '', percentage: null });
    }

    // Days in the month
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const dayStr = String(dayNum).padStart(2, '0');
      const monthStr = String(selectedMonth + 1).padStart(2, '0');
      const dateStr = `${selectedYear}-${monthStr}-${dayStr}`;
      const percentage = history[dateStr] !== undefined ? history[dateStr] : null;

      list.push({
        isPadding: false,
        dayNum,
        dateStr,
        percentage
      });
    }

    return list;
  }, [selectedMonth, selectedYear, history, daysInMonth]);

  // Calculations for current month's stats
  const stats = useMemo(() => {
    let trackedCount = 0;
    let perfectCount = 0;
    let consistentCount = 0; // >= 80%
    let sumPercentage = 0;

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const dayStr = String(dayNum).padStart(2, '0');
      const monthStr = String(selectedMonth + 1).padStart(2, '0');
      const dateStr = `${selectedYear}-${monthStr}-${dayStr}`;

      if (history[dateStr] !== undefined) {
        const val = history[dateStr];
        trackedCount++;
        sumPercentage += val;
        if (val === 100) perfectCount++;
        if (val >= 80) consistentCount++;
      }
    }

    const average = trackedCount > 0 ? Math.round(sumPercentage / trackedCount) : 0;

    return {
      trackedCount,
      perfectCount,
      consistentCount,
      average
    };
  }, [selectedMonth, selectedYear, history, daysInMonth]);

  // List of days chronologically
  const chronologicalList = useMemo(() => {
    const list = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = String(d).padStart(2, '0');
      const monthStr = String(selectedMonth + 1).padStart(2, '0');
      const dateStr = `${selectedYear}-${monthStr}-${dayStr}`;
      const percentage = history[dateStr];

      list.push({
        dayNum: d,
        dateStr,
        percentage
      });
    }

    if (filterType === 'terlacak') {
      return list.filter(item => item.percentage !== undefined);
    }
    return list;
  }, [selectedMonth, selectedYear, history, daysInMonth, filterType]);

  // Color helper for progress cells
  const getCellColorClass = (pct: number | null) => {
    if (pct === null) return 'bg-slate-100 text-slate-300 border-slate-200/50 hover:bg-slate-200/60';
    if (pct === 100) return 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 font-bold shadow-sm shadow-emerald-600/10';
    if (pct >= 80) return 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 font-semibold';
    if (pct >= 50) return 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 font-medium';
    return 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100';
  };

  const getStatusText = (pct: number | undefined) => {
    if (pct === undefined) return 'Tidak Tercatat';
    if (pct === 100) return 'Sempurna';
    if (pct >= 80) return 'Sangat Baik';
    if (pct >= 50) return 'Cukup Konsisten';
    return 'Perlu Ditingkatkan';
  };

  // PDF Download Helper using professional vector layout in jsPDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // 1. Theme configuration (emerald branding)
    const brandRGB = [4, 120, 87]; // Emerald Green
    const textRGB = [30, 41, 59];  // Slate 800
    const lightGray = [248, 250, 252]; // Slate 50

    // PAGE 1: Executive Dashboard & Performance Calendar
    // Header Banner
    doc.setFillColor(brandRGB[0], brandRGB[1], brandRGB[2]);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text("LAPORAN MUTHABA'AH AMAL YAUMI", 105, 18, { align: 'center' });
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Periode: ${MONTHS_ID[selectedMonth]} ${selectedYear}  |  Sistem: Offline-First  |  Email: akunsigitrendang@gmail.com`, 105, 28, { align: 'center' });

    // Performance Summary title
    doc.setTextColor(textRGB[0], textRGB[1], textRGB[2]);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text("1. RINGKASAN PERFORMA BULANAN", 15, 52);

    // Draw KPI Blocks (4 columns)
    const cardWidth = 42;
    const cardHeight = 22;
    const gap = 6;
    const startX = 15;
    const startY = 58;

    const cardsData = [
      { label: "Rata-rata Progress", val: `${stats.average}%`, desc: "Total tercapai" },
      { label: "Hari Terlacak", val: `${stats.trackedCount} / ${daysInMonth} Hari`, desc: "Tercatat di DB" },
      { label: "Hari Sempurna", val: `${stats.perfectCount} Hari`, desc: "Selesai 100%" },
      { label: "Konsisten (>=80%)", val: `${stats.consistentCount} Hari`, desc: "Ibadah prima" }
    ];

    cardsData.forEach((card, index) => {
      const x = startX + index * (cardWidth + gap);
      // Background card
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(x, startY, cardWidth, cardHeight, 'F');
      
      // Card border
      doc.setDrawColor(226, 232, 240);
      doc.rect(x, startY, cardWidth, cardHeight, 'S');

      // Card Content
      doc.setTextColor(100, 116, 139); // Gray label
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text(card.label, x + cardWidth / 2, startY + 5, { align: 'center' });

      doc.setTextColor(brandRGB[0], brandRGB[1], brandRGB[2]); // Emerald value
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(card.val, x + cardWidth / 2, startY + 13, { align: 'center' });

      doc.setTextColor(148, 163, 184); // light gray desc
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(card.desc, x + cardWidth / 2, startY + 19, { align: 'center' });
    });

    // 2. Performance Analysis Statement
    doc.setFillColor(236, 253, 245); // Very light emerald background
    doc.rect(15, 87, 180, 20, 'F');
    doc.setDrawColor(167, 243, 208); // Emerald-200 border
    doc.rect(15, 87, 180, 20, 'S');

    doc.setTextColor(6, 95, 70); // Deep emerald text
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.text("Analisis Spiritual Bulanan:", 20, 93);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    let analysisMsg = '';
    if (stats.trackedCount === 0) {
      analysisMsg = "Belum ada riwayat amal yang dicatat pada bulan ini. Silakan mulai mencatat perkembangan ibadah harian Anda pada tab Checklist.";
    } else if (stats.average >= 85) {
      analysisMsg = `Alhamdulillah, pencapaian ibadah Anda sangat tinggi di bulan ini dengan rata-rata ${stats.average}%. Anda berhasil mencatat ${stats.perfectCount} hari sempurna. Pertahankan istiqomah Anda dan terus perbaiki kualitas kekhusyukan.`;
    } else if (stats.average >= 70) {
      analysisMsg = `Pencapaian ibadah Anda cukup stabil di bulan ini dengan rata-rata ${stats.average}%. Terdapat ${stats.consistentCount} hari di mana Anda melampaui target 80%. Semangat untuk terus meningkatkan amal yaumi Anda!`;
    } else {
      analysisMsg = `Rata-rata pencapaian amal harian berada pada angka ${stats.average}%. Hal ini wajar dalam masa fluktuasi iman, namun cobalah untuk menyalakan pengingat harian atau menetapkan teman muroqobah agar ibadah kembali meningkat.`;
    }
    
    // Auto-wrap text in jsPDF
    const splitMsg = doc.splitTextToSize(analysisMsg, 170);
    doc.text(splitMsg, 20, 98);

    // 3. Calendar visual Grid on Page 1
    doc.setTextColor(textRGB[0], textRGB[1], textRGB[2]);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text("2. GRID EVALUASI HARIAN (KALENDER)", 15, 116);

    // Draw days grid
    const calX = 15;
    const calY = 122;
    const boxSize = 13;
    const calGap = 3;
    const weekdays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    // Print Weekdays Header in PDF
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    weekdays.forEach((day, index) => {
      doc.text(day, calX + index * (boxSize + calGap) + boxSize / 2, calY + 4, { align: 'center' });
    });

    // Draw horizontal separator
    doc.setDrawColor(226, 232, 240);
    doc.line(calX, calY + 7, calX + 7 * (boxSize + calGap) - calGap, calY + 7);

    // Draw individual day boxes
    const gridStartY = calY + 11;
    calendarData.forEach((cell, index) => {
      const col = index % 7;
      const row = Math.floor(index / 7);
      const x = calX + col * (boxSize + calGap);
      const y = gridStartY + row * (boxSize + calGap);

      if (cell.isPadding) {
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(241, 245, 249);
        doc.rect(x, y, boxSize, boxSize, 'F');
        doc.rect(x, y, boxSize, boxSize, 'S');
      } else {
        const pct = cell.percentage;
        let fill = [241, 245, 249]; // Untracked default (light slate)
        let textCol = [148, 163, 184];

        if (pct !== null) {
          if (pct === 100) {
            fill = [4, 120, 87]; // Emerald-700
            textCol = [255, 255, 255];
          } else if (pct >= 80) {
            fill = [167, 243, 208]; // Emerald-200
            textCol = [6, 78, 59];
          } else if (pct >= 50) {
            fill = [253, 230, 138]; // Amber-200
            textCol = [120, 53, 4];
          } else {
            fill = [254, 205, 211]; // Rose-200
            textCol = [159, 18, 57];
          }
        }

        doc.setFillColor(fill[0], fill[1], fill[2]);
        doc.rect(x, y, boxSize, boxSize, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(x, y, boxSize, boxSize, 'S');

        // Draw day number
        doc.setTextColor(textCol[0], textCol[1], textCol[2]);
        doc.setFont('Helvetica', pct !== null && pct >= 80 ? 'bold' : 'normal');
        doc.setFontSize(8.5);
        doc.text(String(cell.dayNum), x + boxSize / 2, y + boxSize / 2 + 1, { align: 'center' });

        // Draw small pct at the bottom of the box
        if (pct !== null) {
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(5);
          doc.text(`${pct}%`, x + boxSize / 2, y + boxSize - 1.5, { align: 'center' });
        }
      }
    });

    // Calendar Legend inside PDF
    const legendY = 222;
    doc.setTextColor(100, 116, 139);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.text("Legenda Kelayakan Ibadah:", 15, legendY);

    const legendItems = [
      { text: "100% Sempurna", fill: [4, 120, 87], textCol: [255, 255, 255] },
      { text: ">= 80% Sangat Baik", fill: [167, 243, 208], textCol: [6, 78, 59] },
      { text: ">= 50% Cukup", fill: [253, 230, 138], textCol: [120, 53, 4] },
      { text: "< 50% Perlu Usaha", fill: [254, 205, 211], textCol: [159, 18, 57] },
      { text: "Tidak Tercatat", fill: [241, 245, 249], textCol: [148, 163, 184] }
    ];

    legendItems.forEach((item, idx) => {
      const x = 15 + idx * 37;
      doc.setFillColor(item.fill[0], item.fill[1], item.fill[2]);
      doc.rect(x, legendY + 3, 5, 5, 'F');
      doc.rect(x, legendY + 3, 5, 5, 'S');
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      doc.text(item.text, x + 7, legendY + 6.8);
    });

    // Decorative system watermark at the bottom of Page 1
    doc.setDrawColor(241, 245, 249);
    doc.line(15, 265, 195, 265);
    doc.setTextColor(148, 163, 184);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')} • Versi Aplikasi: v2.4.0-STABLE`, 15, 271);
    doc.text("Halaman 1 dari 2", 195, 271, { align: 'right' });


    // PAGE 2: Detailed Table of Daily Progress
    doc.addPage();
    
    // Repeat brand header strip
    doc.setFillColor(brandRGB[0], brandRGB[1], brandRGB[2]);
    doc.rect(0, 0, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`RIWAYAT DETAIL HARIAN - ${MONTHS_ID[selectedMonth].toUpperCase()} ${selectedYear}`, 15, 9.5);
    doc.text("MUTHABA'AH AMAL YAUMI", 195, 9.5, { align: 'right' });

    // Table title
    doc.setTextColor(textRGB[0], textRGB[1], textRGB[2]);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text("3. TABEL RIWAYAT HARIAN LENGKAP", 15, 28);

    // Setup Table Columns
    const tableY = 34;
    const colX_date = 15;
    const colX_day = 55;
    const colX_progress = 90;
    const colX_percent = 155;
    const colX_status = 170;

    // Table Header
    doc.setFillColor(brandRGB[0], brandRGB[1], brandRGB[2]);
    doc.rect(15, tableY, 180, 8, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text("Tanggal", colX_date + 3, tableY + 5.5);
    doc.text("Hari", colX_day + 3, tableY + 5.5);
    doc.text("Visual Progress Amal", colX_progress + 3, tableY + 5.5);
    doc.text("Persen", colX_percent + 3, tableY + 5.5);
    doc.text("Status Kelayakan", colX_status + 3, tableY + 5.5);

    // Draw Rows for each day
    let rowY = tableY + 8;
    const daysArr = chronologicalList;

    daysArr.forEach((item, index) => {
      // Background shading on alternate rows
      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(15, rowY, 180, 6.5, 'F');
      }
      // Row separator
      doc.setDrawColor(241, 245, 249);
      doc.line(15, rowY + 6.5, 195, rowY + 6.5);

      // Determine date detail
      const dateObj = new Date(selectedYear, selectedMonth, item.dayNum);
      const daysStr = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const dayName = daysStr[dateObj.getDay()];
      const fullDateStr = `${item.dayNum} ${MONTHS_ID[selectedMonth]} ${selectedYear}`;

      doc.setTextColor(30, 41, 59);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(fullDateStr, colX_date + 3, rowY + 4.5);
      doc.text(dayName, colX_day + 3, rowY + 4.5);

      const pct = item.percentage;

      if (pct !== undefined) {
        // Render simple visual progress bar inside the PDF!
        const barWidth = 50;
        const barHeight = 2.5;
        const barX = colX_progress + 3;
        const barY = rowY + 2.2;

        // Bar Track
        doc.setFillColor(226, 232, 240);
        doc.rect(barX, barY, barWidth, barHeight, 'F');

        // Colored Filled Bar
        let barColor = [220, 38, 38]; // Red
        if (pct === 100) barColor = [5, 150, 105]; // Emerald-600
        else if (pct >= 80) barColor = [16, 185, 129]; // Emerald-500
        else if (pct >= 50) barColor = [245, 158, 11]; // Amber-500

        doc.setFillColor(barColor[0], barColor[1], barColor[2]);
        doc.rect(barX, barY, (pct / 100) * barWidth, barHeight, 'F');

        // Draw percentage text
        doc.setTextColor(30, 41, 59);
        doc.setFont('Helvetica', 'bold');
        doc.text(`${pct}%`, colX_percent + 3, rowY + 4.5);

        // Status text and color
        let statusColor = [100, 116, 139];
        if (pct === 100) statusColor = [5, 150, 105];
        else if (pct >= 80) statusColor = [16, 185, 129];
        else if (pct >= 50) statusColor = [217, 119, 6];
        else statusColor = [185, 28, 28];

        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.setFont('Helvetica', 'bold');
        doc.text(getStatusText(pct), colX_status + 3, rowY + 4.5);

      } else {
        doc.setTextColor(148, 163, 184);
        doc.setFont('Helvetica', 'normal');
        doc.text("- tidak ada progress -", colX_progress + 3, rowY + 4.5);
        doc.text("0%", colX_percent + 3, rowY + 4.5);
        doc.text("Belum Diisi", colX_status + 3, rowY + 4.5);
      }

      rowY += 6.5;
    });

    // Sign off & Footers
    doc.setDrawColor(241, 245, 249);
    doc.line(15, 265, 195, 265);
    doc.setTextColor(148, 163, 184);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`Tanda Tangan Aplikasi: MUTHABA'AH_STABLE_VERIFIED • Pengguna: ${new Date().getFullYear()}`, 15, 271);
    doc.text("Halaman 2 dari 2", 195, 271, { align: 'right' });

    // Download file
    doc.save(`Laporan_Amal_Yaumi_${MONTHS_ID[selectedMonth]}_${selectedYear}.pdf`);
  };

  return (
    <div className="space-y-6" id="monthly-report-section">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Filters */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          
          {/* Calendar Picker & Filter Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
              <CalendarDays className="w-5 h-5 text-emerald-600" />
              Filter Laporan Bulanan
            </h3>
            
            {/* Month Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="select-report-month" className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pilih Bulan</label>
              <select
                id="select-report-month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium text-slate-800 cursor-pointer"
              >
                {MONTHS_ID.map((m, idx) => (
                  <option key={m} value={idx}>{m}</option>
                ))}
              </select>
            </div>

            {/* Year Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="select-report-year" className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pilih Tahun</label>
              <select
                id="select-report-year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium text-slate-800 cursor-pointer"
              >
                {YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Action Download Button */}
            <button
              id="btn-download-report-pdf"
              onClick={handleDownloadPDF}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-sm shadow-emerald-700/15 cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              Unduh Laporan PDF
            </button>
          </div>

        </div>

        {/* RIGHT PANEL: Stats & Calendar grid */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* KPIs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* KPI 1: Average */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Rata-rata Progress</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-slate-800">{stats.average}%</span>
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  Aktif
                </span>
              </div>
            </div>

            {/* KPI 2: Tracked Days */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Hari Terlacak</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-slate-800">{stats.trackedCount}</span>
                <span className="text-xs text-slate-400 font-semibold">/ {daysInMonth} Hari</span>
              </div>
            </div>

            {/* KPI 3: Perfect Days */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Hari Sempurna</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-emerald-600">{stats.perfectCount}</span>
                <span className="text-xs text-slate-400 font-semibold">kali 100%</span>
              </div>
            </div>

            {/* KPI 4: Consistent Days */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ibadah Prima (&gt;=80%)</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-slate-800">{stats.consistentCount}</span>
                <span className="text-xs text-slate-400 font-semibold">Hari</span>
              </div>
            </div>

          </div>

          {/* Performance Analysis Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Evaluasi Kalender: {MONTHS_ID[selectedMonth]} {selectedYear}
            </h3>

            {/* Weekdays Indicator */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-2">
              <div>Min</div>
              <div>Sen</div>
              <div>Sel</div>
              <div>Rab</div>
              <div>Kam</div>
              <div>Jum</div>
              <div>Sab</div>
            </div>

            {/* Calendar Grid Cells */}
            <div className="grid grid-cols-7 gap-2">
              {calendarData.map((cell, index) => {
                if (cell.isPadding) {
                  return (
                    <div 
                      key={`padding-${index}`} 
                      className="aspect-square bg-slate-50 border border-slate-100 rounded-lg opacity-40"
                    />
                  );
                }

                return (
                  <div
                    key={`day-${cell.dayNum}`}
                    className={`aspect-square border rounded-xl flex flex-col justify-between p-1.5 transition-all cursor-help relative group ${getCellColorClass(cell.percentage)}`}
                  >
                    <span className="text-xs font-bold leading-none">{cell.dayNum}</span>
                    
                    {cell.percentage !== null ? (
                      <span className="text-[9px] font-bold block text-right mt-auto tracking-tight">
                        {cell.percentage}%
                      </span>
                    ) : (
                      <span className="text-[8px] opacity-40 block text-right mt-auto">-</span>
                    )}

                    {/* Simple Tooltip on Hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-36 hidden group-hover:block z-30 bg-slate-900 text-white text-[10px] p-2 rounded-lg text-center shadow-lg pointer-events-none">
                      <p className="font-bold">{cell.dayNum} {MONTHS_ID[selectedMonth]}</p>
                      <p className="mt-0.5 text-slate-300">
                        {cell.percentage !== null 
                          ? `Selesai: ${cell.percentage}% (${getStatusText(cell.percentage)})`
                          : 'Tidak Tercatat / Kosong'}
                      </p>
                      <div className="w-2.5 h-2.5 bg-slate-900 transform rotate-45 absolute top-full left-1/2 -translate-x-1/2 -translate-y-1.5"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend indicators */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-semibold justify-center sm:justify-start">
              <span className="text-slate-400">Pencapaian:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-600 border border-emerald-700 inline-block"></span>
                <span>100%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200 inline-block"></span>
                <span>&gt;= 80%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-100 border border-amber-200 inline-block"></span>
                <span>&gt;= 50%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-50 border border-rose-100 inline-block"></span>
                <span>&lt; 50%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200 inline-block"></span>
                <span>Belum Diisi</span>
              </div>
            </div>

          </div>

          {/* Chronological List Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <ListFilter className="w-5 h-5 text-emerald-600" />
                Daftar Riwayat Harian Lengkap
              </h3>
              
              {/* filter tabs */}
              <div className="flex bg-slate-100 p-1 border border-slate-200/50 rounded-lg text-xs font-bold shadow-inner">
                <button
                  id="btn-filter-all-days"
                  onClick={() => setFilterType('semua')}
                  className={`px-3 py-1 rounded cursor-pointer transition-all ${
                    filterType === 'semua' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Semua Hari ({daysInMonth})
                </button>
                <button
                  id="btn-filter-tracked-days"
                  onClick={() => setFilterType('terlacak')}
                  className={`px-3 py-1 rounded cursor-pointer transition-all ${
                    filterType === 'terlacak' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Hanya Terlacak ({stats.trackedCount})
                </button>
              </div>
            </div>

            {/* Chronological list layout */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
              {chronologicalList.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm font-medium">
                  Tidak ada data untuk filter yang dipilih pada bulan ini.
                </div>
              ) : (
                chronologicalList.map((item) => {
                  const dateObj = new Date(selectedYear, selectedMonth, item.dayNum);
                  const daysStr = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                  const dayName = daysStr[dateObj.getDay()];
                  const pct = item.percentage;

                  return (
                    <div
                      key={`list-day-${item.dayNum}`}
                      className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl hover:bg-slate-100/50 transition-all gap-4"
                    >
                      {/* Date details */}
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold border ${
                          pct === undefined 
                            ? 'bg-slate-100 border-slate-200 text-slate-400' 
                            : pct === 100 
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : pct >= 80
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {item.dayNum}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm leading-tight">
                            {dayName}, {item.dayNum} {MONTHS_ID[selectedMonth]} {selectedYear}
                          </p>
                          <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mt-0.5">
                            {getStatusText(pct)}
                          </p>
                        </div>
                      </div>

                      {/* Percentage progress bar */}
                      <div className="flex items-center gap-4 flex-1 max-w-xs justify-end">
                        {pct !== undefined ? (
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden hidden sm:block">
                            <div 
                              className={`h-full rounded-full ${
                                pct === 100 
                                  ? 'bg-emerald-600' 
                                  : pct >= 80 
                                  ? 'bg-emerald-400' 
                                  : pct >= 50 
                                  ? 'bg-amber-400' 
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        ) : null}

                        <span className={`text-sm font-extrabold min-w-[45px] text-right ${
                          pct === undefined 
                            ? 'text-slate-400' 
                            : pct === 100 
                            ? 'text-emerald-600' 
                            : 'text-slate-700'
                        }`}>
                          {pct !== undefined ? `${pct}%` : '-'}
                        </span>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
