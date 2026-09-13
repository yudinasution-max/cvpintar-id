import React, { useState } from 'react';
import {
  FileText,
  MailCheck,
  Check,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

interface PricingPageProps {
  onBack?: () => void;
  onSelectPackage?: (packageName: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onBack,
  onSelectPackage,
}) => {
  const [selectedNotice, setSelectedNotice] = useState<string | null>(null);

  const handleSelect = (packageName: string) => {
    // Mandated requirement: console.log nama paket yang dipilih
    console.log(packageName);

    if (onSelectPackage) {
      onSelectPackage(packageName);
    }

    // Interactive user feedback
    setSelectedNotice(packageName);
    setTimeout(() => {
      setSelectedNotice(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Header / Navbar Kecil */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            id="pricing-brand-logo"
            className="flex items-center gap-2 cursor-pointer"
            onClick={onBack}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-2xs">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              CVPintar <span className="text-blue-600">ID</span>
            </span>
          </div>

          {/* Back Navigation Button */}
          {onBack && (
            <button
              id="back-to-landing-btn"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col justify-center">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h1
            id="pricing-title"
            className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3"
          >
            Pilih Paket Dokumen Karir Anda
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Dapatkan dokumen karir berkualitas tinggi dengan proses cepat dan praktis.
          </p>
        </div>

        {/* Feedback Alert if Package Selected */}
        {selectedNotice && (
          <div
            id="selected-package-alert"
            className="max-w-xl mx-auto w-full mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Paket <strong>{selectedNotice}</strong> dipilih! (Tercatat di console.log)
              </span>
            </div>
            <button
              onClick={() => setSelectedNotice(null)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Tutup
            </button>
          </div>
        )}

        {/* 2-Column Grid on Desktop, Stack on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto w-full">
          {/* KARTU 1 — Buat CV */}
          <div
            id="card-paket-cv"
            className="bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all flex flex-col p-6 sm:p-8 relative"
          >
            {/* Header / Package Name */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Paket 1
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">
                    Buat CV
                  </h2>
                </div>
              </div>
            </div>

            {/* Deskripsi Singkat */}
            <p className="text-sm text-slate-600 mb-6 min-h-[40px]">
              CV profesional siap pakai untuk melamar kerja
            </p>

            {/* HARGA BESAR & JELAS */}
            <div className="mb-4 pb-4 border-b border-slate-100">
              <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Rp25.000
              </div>
              {/* Badge Kecil di Bawah Harga */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>+ Portofolio GRATIS</span>
              </div>
            </div>

            {/* Fitur Utama */}
            <div className="space-y-2.5 mb-8 flex-1">
              <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Format ramah ATS &amp; tata letak modern</span>
              </div>
              <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Unduh file PDF resolusi tinggi instan</span>
              </div>
              <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Fitur Portofolio online terintegrasi</span>
              </div>
            </div>

            {/* Tombol CTA */}
            <button
              id="btn-pilih-cv"
              onClick={() => handleSelect('Buat CV')}
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm sm:text-base shadow-xs hover:shadow-md transition-all text-center cursor-pointer"
            >
              Pilih Paket Ini
            </button>
          </div>

          {/* KARTU 2 — Buat Surat Lamaran Kerja */}
          <div
            id="card-paket-surat-lamaran"
            className="bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all flex flex-col p-6 sm:p-8 relative"
          >
            {/* Header / Package Name */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MailCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Paket 2
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">
                    Buat Surat Lamaran Kerja
                  </h2>
                </div>
              </div>
            </div>

            {/* Deskripsi Singkat */}
            <p className="text-sm text-slate-600 mb-6 min-h-[40px]">
              Surat lamaran kerja yang menarik perhatian HRD
            </p>

            {/* HARGA BESAR & JELAS */}
            <div className="mb-4 pb-4 border-b border-slate-100">
              <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Rp25.000
              </div>
              {/* Badge Kecil di Bawah Harga */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>+ Portofolio GRATIS</span>
              </div>
            </div>

            {/* Fitur Utama */}
            <div className="space-y-2.5 mb-8 flex-1">
              <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Bahasa baku, persuasif &amp; profesional</span>
              </div>
              <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Format siap cetak dan siap kirim email</span>
              </div>
              <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Fitur Portofolio online terintegrasi</span>
              </div>
            </div>

            {/* Tombol CTA */}
            <button
              id="btn-pilih-surat-lamaran"
              onClick={() => handleSelect('Buat Surat Lamaran Kerja')}
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm sm:text-base shadow-xs hover:shadow-md transition-all text-center cursor-pointer"
            >
              Pilih Paket Ini
            </button>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-5">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} <strong className="font-semibold text-slate-700">CVPintar ID</strong>. Hak Cipta Dilindungi.
        </div>
      </footer>
    </div>
  );
};
