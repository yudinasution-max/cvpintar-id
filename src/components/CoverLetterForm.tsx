import React, { useState } from 'react';
import {
  MailCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { CoverLetterFormData, SubmissionPayload } from '../types';

interface CoverLetterFormProps {
  onBackToPricing: () => void;
  onSubmitSuccess: (submission: SubmissionPayload) => void;
}

const initialFormData: CoverLetterFormData = {
  namaLengkap: '',
  email: '',
  telepon: '',
  posisiDilamar: '',
  perusahaanTujuan: '',
  pengalamanRelevan: '',
  penutup: '',
};

export const CoverLetterForm: React.FC<CoverLetterFormProps> = ({
  onBackToPricing,
  onSubmitSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 4;
  const [formData, setFormData] = useState<CoverLetterFormData>(initialFormData);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (field: keyof CoverLetterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const validateCurrentStep = (): boolean => {
    setErrorMessage(null);
    if (currentStep === 1) {
      if (!formData.namaLengkap.trim()) {
        setErrorMessage('Nama lengkap wajib diisi');
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setErrorMessage('Email valid wajib diisi');
        return false;
      }
      if (!formData.telepon.trim()) {
        setErrorMessage('Nomor telepon / WhatsApp wajib diisi');
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.posisiDilamar.trim()) {
        setErrorMessage('Posisi yang dilamar wajib diisi');
        return false;
      }
      if (!formData.perusahaanTujuan.trim()) {
        setErrorMessage('Nama perusahaan tujuan wajib diisi');
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.pengalamanRelevan.trim()) {
        setErrorMessage('Pengalaman relevan wajib diisi');
        return false;
      }
      if (formData.pengalamanRelevan.trim().length < 20) {
        setErrorMessage('Jelaskan pengalaman relevan minimal 20 karakter');
        return false;
      }
    } else if (currentStep === 4) {
      if (!formData.penutup.trim()) {
        setErrorMessage('Kalimat penutup surat wajib diisi');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrev = () => {
    setErrorMessage(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onBackToPricing();
    }
  };

  // --- SUBMISSION KE SUPABASE ---
  const handleSubmit = async () => {
    // 1. Log dan alert tepat saat tombol submit diklik
    console.log('[DEBUG] Tombol submit diklik (Cover Letter)');
    alert('[DEBUG 1] Tombol submit diklik! Memulai validasi form...');

    if (!validateCurrentStep()) {
      alert(`[DEBUG 1 - GAGAL] Validasi form gagal: ${errorMessage || 'Periksa field yang belum diisi'}`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // 1. Generate unique midtrans_order_id
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const midtransOrderId = `CVPINTAR-${Date.now()}-${randomSuffix}`;

    // 2. Kumpulkan seluruh data jadi satu objek
    const submissionPayload: SubmissionPayload = {
      paket: 'surat_lamaran',
      data_form: formData,
      status_pembayaran: 'pending',
      midtrans_order_id: midtransOrderId,
    };

    // 2. Log sebelum memanggil supabase insert
    console.log('[DEBUG] Memulai insert ke Supabase (Cover Letter):', submissionPayload);
    alert(`[DEBUG 2] Memulai insert ke Supabase!\nOrder ID: ${midtransOrderId}\nNama: ${formData.namaLengkap}\nPosisi: ${formData.posisiDilamar}`);

    try {
      let savedId = `local-${Date.now()}`;

      if (isSupabaseConfigured) {
        console.log('[DEBUG] Supabase client terkonfigurasi. Mengirim query insert...');
        const { data, error } = await supabase
          .from('submissions')
          .insert([submissionPayload])
          .select()
          .maybeSingle();

        console.log('[DEBUG] Response lengkap dari Supabase insert:', { data, error });

        if (error) {
          console.error('[Supabase Insert Error]', error);
          const fullErrorDetail = `[GAGAL INSERT SUPABASE]\n\nKode: ${error.code || '-'}\nPesan: ${error.message || '-'}\nDetail: ${error.details || '-'}\nHint: ${error.hint || '-'}`;
          alert(fullErrorDetail);
          setErrorMessage(
            `Error Supabase: ${error.message} (${error.code ? `Kode: ${error.code}. ` : ''}${error.hint || error.details || 'Jalankan SQL GRANT di Supabase SQL Editor.'})`
          );
          setIsSubmitting(false);
          return;
        } else if (data) {
          savedId = data.id;
          submissionPayload.id = data.id;
          submissionPayload.created_at = data.created_at;
          console.log('[DEBUG 3 - BERHASIL] Data sukses tersimpan di Supabase:', data);
          alert(`[BERHASIL!] Data berhasil disimpan ke Supabase!\n\nID: ${data.id}\nOrder ID: ${midtransOrderId}`);
        } else {
          submissionPayload.id = savedId;
          alert(`[BERHASIL!] Data berhasil di-insert ke Supabase!\nOrder ID: ${midtransOrderId}`);
        }
      } else {
        const warningText = '[DEBUG 3 - GAGAL] isSupabaseConfigured bernilai false! Periksa URL & key di supabaseClient.ts.';
        console.warn(warningText);
        alert(warningText);
        setErrorMessage('Koneksi Supabase belum terkonfigurasi dengan benar.');
        setIsSubmitting(false);
        return;
      }

      console.log('Submission tersimpan ke Supabase:', {
        id: submissionPayload.id || savedId,
        midtrans_order_id: midtransOrderId,
        paket: 'surat_lamaran',
        data_form: formData,
        status_pembayaran: 'pending',
      });

      onSubmitSuccess(submissionPayload);
    } catch (err: any) {
      console.error('[Submission Exception]', err);
      const errMsg = err?.message || JSON.stringify(err);
      alert(`[DEBUG 3 - EXCEPTION] Terjadi exception saat menghubungi Supabase:\n\n${errMsg}`);
      setErrorMessage(`Gagal menghubungi Supabase: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    'Data Diri',
    'Info Lamaran',
    'Pengalaman Relevan',
    'Kalimat Penutup',
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-2xs">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div
            id="coverletter-form-brand"
            className="flex items-center gap-2 cursor-pointer"
            onClick={onBackToPricing}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-2xs">
              <MailCheck className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              CVPintar <span className="text-blue-600">ID</span>
            </span>
          </div>

          <button
            id="btn-back-pricing-coverletter"
            onClick={onBackToPricing}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ganti Paket</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-start">
        {/* Header Paket & Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              <MailCheck className="w-3.5 h-3.5" />
              Paket: Buat Surat Lamaran Kerja (Rp25.000)
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Langkah {currentStep} dari {totalSteps}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {stepTitles[currentStep - 1]}
          </h1>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div
            id="form-error-alert-cl"
            className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2.5 animate-in fade-in duration-150"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {/* STEP 1: DATA DIRI */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200" id="step-data-diri-cl">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nama Lengkap Anda <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-nama-lengkap-cl"
                  type="text"
                  placeholder="Contoh: Rina Anggraini, S.E."
                  value={formData.namaLengkap}
                  onChange={(e) => handleInputChange('namaLengkap', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email Aktif <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-email-cl"
                  type="email"
                  placeholder="rina.anggraini@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-telepon-cl"
                  type="tel"
                  placeholder="085712345678"
                  value={formData.telepon}
                  onChange={(e) => handleInputChange('telepon', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          )}

          {/* STEP 2: INFO LAMARAN */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200" id="step-info-lamaran-cl">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Posisi yang Dilamar <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-posisi-cl"
                  type="text"
                  placeholder="Contoh: Digital Marketing Specialist / Staff Administrasi"
                  value={formData.posisiDilamar}
                  onChange={(e) => handleInputChange('posisiDilamar', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nama Perusahaan Tujuan <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-perusahaan-cl"
                  type="text"
                  placeholder="Contoh: PT Telekomunikasi Indonesia Tbk"
                  value={formData.perusahaanTujuan}
                  onChange={(e) => handleInputChange('perusahaanTujuan', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          )}

          {/* STEP 3: PENGALAMAN RELEVAN */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200" id="step-pengalaman-relevan-cl">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Pengalaman &amp; Keunggulan Relevan <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="textarea-pengalaman-relevan-cl"
                  rows={6}
                  placeholder="Jelaskan pengalaman, keahlian, atau proyek Anda yang paling sesuai dengan kualifikasi yang dicari perusahaan..."
                  value={formData.pengalamanRelevan}
                  onChange={(e) => handleInputChange('pengalamanRelevan', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all leading-relaxed"
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  Tip: Soroti pencapaian konkret, seperti peningkatan penjualan, manajemen tim, atau efisiensi proses kerja.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: PENUTUP */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200" id="step-penutup-cl">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Kalimat Penutup Surat <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="textarea-penutup-cl"
                  rows={5}
                  placeholder="Contoh: Besar harapan saya untuk dapat menghadiri sesi wawancara guna mendiskusikan bagaimana kualifikasi saya dapat memberikan kontribusi nyata bagi perusahaan..."
                  value={formData.penutup}
                  onChange={(e) => handleInputChange('penutup', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all leading-relaxed"
                />
              </div>

              {/* Portofolio Bonus Reminder */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2 mt-4">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Bonus Portofolio Gratis aktif!</span>
                  <p className="mt-0.5 text-emerald-700">
                    Surat lamaran Anda akan dilengkapi lampiran tautan portofolio online gratis untuk memperkuat berkas Anda.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigasi Bawah Form */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              id="btn-prev-step-cl"
              onClick={handlePrev}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{currentStep === 1 ? 'Kembali ke Paket' : 'Kembali'}</span>
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                id="btn-next-step-cl"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
              >
                <span>Lanjut</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                id="btn-submit-cl-form"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm sm:text-base shadow-md transition-all cursor-pointer disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <span>Lihat Preview &amp; Lanjut ke Pembayaran</span>
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
