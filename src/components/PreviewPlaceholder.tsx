import React from 'react';
import {
  CheckCircle2,
  FileText,
  CreditCard,
  RotateCcw,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { SubmissionPayload } from '../types';

interface PreviewPlaceholderProps {
  submission: SubmissionPayload;
  onReset: () => void;
  onBackToEdit: () => void;
}

export const PreviewPlaceholder: React.FC<PreviewPlaceholderProps> = ({
  submission,
  onReset,
  onBackToEdit,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-2xs">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              CVPintar <span className="text-blue-600">ID</span>
            </span>
          </div>

          <button
            onClick={onReset}
            className="text-xs sm:text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Halaman Utama
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Success Banner */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Data Formulir Berhasil Disimpan!
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Data submission Anda telah tersimpan dan siap diproses ke tahap preview visual serta gateway pembayaran Midtrans.
          </p>
        </div>

        {/* Card Ringkasan Submission */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-0.5">
                Paket Dipilih
              </span>
              <span className="text-base font-bold text-slate-900 capitalize">
                {submission.paket === 'cv' ? 'Paket Buat CV' : 'Paket Buat Surat Lamaran Kerja'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-0.5">
                Total Tagihan
              </span>
              <span className="text-lg font-black text-blue-600">
                Rp25.000
              </span>
            </div>
          </div>

          {/* Technical Metadata Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 font-medium block">Order ID (Midtrans):</span>
              <span className="font-mono font-bold text-slate-800 break-all select-all">
                {submission.midtrans_order_id}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Submission ID (Supabase):</span>
              <span className="font-mono font-bold text-slate-800 break-all select-all">
                {submission.id || 'Generated'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Status Pembayaran:</span>
              <span className="inline-block px-2 py-0.5 mt-0.5 rounded bg-amber-100 text-amber-800 font-semibold uppercase text-[10px]">
                {submission.status_pembayaran}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Bonus:</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3" />
                Portofolio Digital GRATIS
              </span>
            </div>
          </div>

          {/* Console Log Notice */}
          <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs">
            <Terminal className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
            <div>
              <strong>Informasi Console.log:</strong> Seluruh objek data JSON dan ID submission telah berhasil dicatat pada console browser sesuai instruksi Tahap 2. Anda dapat membuka Developer Tools (F12 &rarr; Console) untuk memeriksa rincian objek.
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                alert(
                  `Tahap 2 selesai! Order ID: ${submission.midtrans_order_id}. Integrasi pembayaran Midtrans Snap dan Preview Visual dokumen akan dibuat pada tahap berikutnya.`
                );
              }}
              className="flex-1 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Simulasi Lanjut ke Pembayaran (Tahap Berikutnya)</span>
            </button>

            <button
              onClick={onBackToEdit}
              className="py-3 px-5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ubah Data</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
