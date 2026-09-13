import React, { useState } from 'react';
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { CvFormData, ExperienceItem, EducationItem, SubmissionPayload } from '../types';

interface CvFormProps {
  onBackToPricing: () => void;
  onSubmitSuccess: (submission: SubmissionPayload) => void;
}

const initialFormData: CvFormData = {
  namaLengkap: '',
  email: '',
  telepon: '',
  alamat: '',
  ringkasanProfil: '',
  pengalaman: [
    {
      id: 'exp-1',
      posisi: '',
      perusahaan: '',
      periode: '',
      deskripsi: '',
    },
  ],
  pendidikan: [
    {
      id: 'edu-1',
      institusi: '',
      jurusan: '',
      tahunLulus: '',
    },
  ],
  skills: [],
};

const SUGGESTED_SKILLS = [
  'Komunikasi',
  'Microsoft Office',
  'Manajemen Waktu',
  'Kerja Sama Tim',
  'Canva',
  'Problem Solving',
  'Kepemimpinan',
  'Analisis Data',
];

export const CvForm: React.FC<CvFormProps> = ({
  onBackToPricing,
  onSubmitSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;
  const [formData, setFormData] = useState<CvFormData>(initialFormData);
  const [skillInput, setSkillInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Helper untuk update field form data diri & ringkasan
  const handleInputChange = (
    field: keyof Omit<CvFormData, 'pengalaman' | 'pendidikan' | 'skills'>,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  // --- STEP 3: Pengalaman Kerja ---
  const handleExperienceChange = (
    id: string,
    field: keyof ExperienceItem,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      pengalaman: prev.pengalaman.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
    if (errorMessage) setErrorMessage(null);
  };

  const addExperience = () => {
    const newId = `exp-${Date.now()}`;
    setFormData((prev) => ({
      ...prev,
      pengalaman: [
        ...prev.pengalaman,
        { id: newId, posisi: '', perusahaan: '', periode: '', deskripsi: '' },
      ],
    }));
  };

  const removeExperience = (id: string) => {
    if (formData.pengalaman.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      pengalaman: prev.pengalaman.filter((item) => item.id !== id),
    }));
  };

  // --- STEP 4: Pendidikan ---
  const handleEducationChange = (
    id: string,
    field: keyof EducationItem,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      pendidikan: prev.pendidikan.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
    if (errorMessage) setErrorMessage(null);
  };

  const addEducation = () => {
    const newId = `edu-${Date.now()}`;
    setFormData((prev) => ({
      ...prev,
      pendidikan: [
        ...prev.pendidikan,
        { id: newId, institusi: '', jurusan: '', tahunLulus: '' },
      ],
    }));
  };

  const removeEducation = (id: string) => {
    if (formData.pendidikan.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      pendidikan: prev.pendidikan.filter((item) => item.id !== id),
    }));
  };

  // --- STEP 5: Skill ---
  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (formData.skills.includes(trimmed)) {
      setSkillInput('');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
    }));
    setSkillInput('');
    if (errorMessage) setErrorMessage(null);
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  // --- Validasi Per Step ---
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
        setErrorMessage('Nomor telepon/WhatsApp wajib diisi');
        return false;
      }
      if (!formData.alamat.trim()) {
        setErrorMessage('Alamat/Kota domisili wajib diisi');
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.ringkasanProfil.trim()) {
        setErrorMessage('Ringkasan profil wajib diisi');
        return false;
      }
      if (formData.ringkasanProfil.length > 300) {
        setErrorMessage('Ringkasan profil melebihi batas 300 karakter');
        return false;
      }
    } else if (currentStep === 3) {
      for (let i = 0; i < formData.pengalaman.length; i++) {
        const exp = formData.pengalaman[i];
        if (!exp.posisi.trim() || !exp.perusahaan.trim() || !exp.periode.trim() || !exp.deskripsi.trim()) {
          setErrorMessage(`Harap lengkapi semua field pada Pengalaman #${i + 1}`);
          return false;
        }
      }
    } else if (currentStep === 4) {
      for (let i = 0; i < formData.pendidikan.length; i++) {
        const edu = formData.pendidikan[i];
        if (!edu.institusi.trim() || !edu.jurusan.trim() || !edu.tahunLulus.trim()) {
          setErrorMessage(`Harap lengkapi semua field pada Pendidikan #${i + 1}`);
          return false;
        }
      }
    } else if (currentStep === 5) {
      if (formData.skills.length === 0) {
        setErrorMessage('Tambahkan minimal 1 keahlian/skill');
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
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    // 1. Generate unique midtrans_order_id
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const midtransOrderId = `CVPINTAR-${Date.now()}-${randomSuffix}`;

    // 2. Kumpulkan seluruh data jadi satu objek
    const submissionPayload: SubmissionPayload = {
      paket: 'cv',
      data_form: formData,
      status_pembayaran: 'pending',
      midtrans_order_id: midtransOrderId,
    };

    try {
      let savedId = `local-${Date.now()}`;

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('submissions')
          .insert([submissionPayload])
          .select()
          .maybeSingle();

        if (error) {
          console.error('[Supabase Insert Error]', error);
          setErrorMessage('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
          setIsSubmitting(false);
          return;
        } else if (data) {
          savedId = data.id;
          submissionPayload.id = data.id;
          submissionPayload.created_at = data.created_at;
        } else {
          submissionPayload.id = savedId;
        }
      } else {
        console.warn('Koneksi Supabase belum terkonfigurasi.');
        setErrorMessage('Terjadi kesalahan koneksi penyimpanan. Silakan coba beberapa saat lagi.');
        setIsSubmitting(false);
        return;
      }

      onSubmitSuccess(submissionPayload);
    } catch (err: any) {
      console.error('[Submission Exception]', err);
      setErrorMessage('Terjadi kesalahan saat menyimpan data. Silakan periksa koneksi Anda dan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step Title map
  const stepTitles = [
    'Data Diri',
    'Ringkasan Profil',
    'Pengalaman Kerja',
    'Riwayat Pendidikan',
    'Keahlian & Skill',
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-2xs">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div
            id="cv-form-brand"
            className="flex items-center gap-2 cursor-pointer"
            onClick={onBackToPricing}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-2xs">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              CVPintar <span className="text-blue-600">ID</span>
            </span>
          </div>

          <button
            id="btn-back-pricing-cv"
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
              <FileText className="w-3.5 h-3.5" />
              Paket: Buat CV (Rp25.000)
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
            id="form-error-alert"
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
            <div className="space-y-4 animate-in fade-in duration-200" id="step-data-diri">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-nama-lengkap"
                  type="text"
                  placeholder="Contoh: Budi Santoso, S.Kom"
                  value={formData.namaLengkap}
                  onChange={(e) => handleInputChange('namaLengkap', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Email Aktif <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-email"
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-telepon"
                    type="tel"
                    placeholder="081234567890"
                    value={formData.telepon}
                    onChange={(e) => handleInputChange('telepon', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Alamat / Kota Domisili <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-alamat"
                  type="text"
                  placeholder="Contoh: Jakarta Selatan, DKI Jakarta"
                  value={formData.alamat}
                  onChange={(e) => handleInputChange('alamat', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}

          {/* STEP 2: RINGKASAN PROFIL */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200" id="step-ringkasan-profil">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700">
                  Ringkasan Profil Singkat <span className="text-red-500">*</span>
                </label>
                <span
                  id="char-counter"
                  className={`text-xs font-mono font-medium ${
                    formData.ringkasanProfil.length > 270
                      ? 'text-amber-600'
                      : 'text-slate-500'
                  }`}
                >
                  Sisa: {300 - formData.ringkasanProfil.length} / 300
                </span>
              </div>

              <textarea
                id="textarea-ringkasan"
                rows={5}
                maxLength={300}
                placeholder="Ceritakan secara ringkas latar belakang profesional Anda, fokus keahlian, dan motivasi kerja..."
                value={formData.ringkasanProfil}
                onChange={(e) => handleInputChange('ringkasanProfil', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all leading-relaxed"
              />
              <p className="text-xs text-slate-500">
                Tip: Tuliskan 2-3 kalimat yang paling menonjol mengenai pencapaian atau peran yang Anda kuasai.
              </p>
            </div>
          )}

          {/* STEP 3: PENGALAMAN KERJA */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200" id="step-pengalaman-kerja">
              <div className="space-y-5">
                {formData.pengalaman.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/70 relative space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Pengalaman #{index + 1}
                      </span>
                      {formData.pengalaman.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(exp.id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Posisi / Jabatan <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Misal: Marketing Specialist"
                          value={exp.posisi}
                          onChange={(e) =>
                            handleExperienceChange(exp.id, 'posisi', e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Nama Perusahaan <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Misal: PT Maju Bersama"
                          value={exp.perusahaan}
                          onChange={(e) =>
                            handleExperienceChange(exp.id, 'perusahaan', e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Periode Kerja <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Misal: Jan 2022 - Sekarang (atau 2021 - 2023)"
                        value={exp.periode}
                        onChange={(e) =>
                          handleExperienceChange(exp.id, 'periode', e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Deskripsi Tugas &amp; Pencapaian <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Uraikan tanggung jawab dan hasil kerja yang Anda capai..."
                        value={exp.deskripsi}
                        onChange={(e) =>
                          handleExperienceChange(exp.id, 'deskripsi', e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                id="btn-add-experience"
                onClick={addExperience}
                className="w-full py-2.5 border-2 border-dashed border-blue-300 hover:border-blue-500 text-blue-600 hover:bg-blue-50 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Pengalaman</span>
              </button>
            </div>
          )}

          {/* STEP 4: PENDIDIKAN */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200" id="step-pendidikan">
              <div className="space-y-5">
                {formData.pendidikan.map((edu, index) => (
                  <div
                    key={edu.id}
                    className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Pendidikan #{index + 1}
                      </span>
                      {formData.pendidikan.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEducation(edu.id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Nama Institusi / Universitas / Sekolah <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Misal: Universitas Indonesia"
                        value={edu.institusi}
                        onChange={(e) =>
                          handleEducationChange(edu.id, 'institusi', e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Jurusan / Program Studi <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Misal: Manajemen Bisnis / S1 Ilmu Komputer"
                          value={edu.jurusan}
                          onChange={(e) =>
                            handleEducationChange(edu.id, 'jurusan', e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Tahun Lulus <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Misal: 2023"
                          value={edu.tahunLulus}
                          onChange={(e) =>
                            handleEducationChange(edu.id, 'tahunLulus', e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                id="btn-add-education"
                onClick={addEducation}
                className="w-full py-2.5 border-2 border-dashed border-blue-300 hover:border-blue-500 text-blue-600 hover:bg-blue-50 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Pendidikan</span>
              </button>
            </div>
          )}

          {/* STEP 5: KEAHLIAN / SKILL */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-in fade-in duration-200" id="step-keahlian">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Tambahkan Skill / Keahlian <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="input-skill-tag"
                    type="text"
                    placeholder="Ketik skill lalu tekan Enter (misal: Copywriting)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => addSkill(skillInput)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {/* Daftar Skill Chips */}
              <div>
                <span className="text-xs font-semibold text-slate-600 block mb-2">
                  Skill Terpilih ({formData.skills.length}):
                </span>
                {formData.skills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Belum ada skill yang ditambahkan.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold shadow-2xs"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:bg-blue-200 rounded-full p-0.5 text-blue-700 transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Rekomendasi Cepat */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 block mb-2">
                  Pilih cepat skill populer:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      disabled={formData.skills.includes(skill)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                        formData.skills.includes(skill)
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Portofolio Bonus Reminder */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Bonus Portofolio Gratis aktif!</span>
                  <p className="mt-0.5 text-emerald-700">
                    Setelah pembayaran diverifikasi, Anda akan otomatis mendapatkan link portofolio digital yang siap dibagikan ke HRD.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigasi Bawah Form */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              id="btn-prev-step"
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
                id="btn-next-step"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
              >
                <span>Lanjut</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                id="btn-submit-cv-form"
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
