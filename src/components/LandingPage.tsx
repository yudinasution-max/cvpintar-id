import React from 'react';
import {
  FileText,
  FolderGit2,
  MailCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToPricing: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToPricing }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-xs sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-2" id="brand-logo-container">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900" id="brand-name">
              CVPintar <span className="text-blue-600">ID</span>
            </span>
          </div>

          {/* Nav Action */}
          <button
            id="nav-pricing-btn"
            onClick={onNavigateToPricing}
            className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-100"
          >
            Lihat Paket
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
          {/* Subtle Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Solusi Cepat Berkas Lamaran Kerja Profesional</span>
          </div>

          {/* Big Engaging Headline */}
          <h1
            id="hero-title"
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6"
          >
            Buat CV &amp; Surat Lamaran Kerja dengan Mudah
          </h1>

          {/* Subtitle */}
          <p
            id="hero-subtitle"
            className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
          >
            Buat CV standar industri atau Surat Lamaran Kerja menarik dalam hitungan menit, dan dapatkan bonus fitur <strong className="text-slate-800 font-semibold">Portofolio online gratis</strong> untuk meningkatkan peluang diterima kerja.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              id="cta-mulai-sekarang"
              onClick={onNavigateToPricing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base sm:text-lg rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-98 cursor-pointer"
            >
              <span>Mulai Sekarang</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Feature Highlights with Lucide Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left max-w-3xl mx-auto">
            {/* Feature 1: CV */}
            <div
              id="feature-cv"
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">CV Profesional</h3>
              <p className="text-sm text-slate-600">
                Format modern dan ramah sistem ATS, siap cetak atau kirim online.
              </p>
            </div>

            {/* Feature 2: Cover Letter */}
            <div
              id="feature-surat-lamaran"
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <MailCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Surat Lamaran Kerja</h3>
              <p className="text-sm text-slate-600">
                Tata bahasa terstruktur dan memikat yang menarik perhatian HRD.
              </p>
            </div>

            {/* Feature 3: Portfolio */}
            <div
              id="feature-portofolio"
              className="bg-white p-5 rounded-xl border border-blue-200 shadow-xs flex flex-col relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="font-bold text-slate-900 text-base">Portofolio Digital</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  Bonus Gratis
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Pamerkan hasil karya dan sertifikat Anda secara online dengan mudah.
              </p>
            </div>
          </div>

          {/* Simple trust bullets */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Praktis &amp; Siap Pakai</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Format Standar HRD</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Bonus Portofolio Terbuka</span>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} <strong className="font-semibold text-slate-700">CVPintar ID</strong>. Hak Cipta Dilindungi.
        </div>
      </footer>
    </div>
  );
};
