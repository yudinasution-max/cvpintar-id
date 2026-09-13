export interface ExperienceItem {
  id: string;
  posisi: string;
  perusahaan: string;
  periode: string;
  deskripsi: string;
}

export interface EducationItem {
  id: string;
  institusi: string;
  jurusan: string;
  tahunLulus: string;
}

export interface CvFormData {
  // Step 1: Data Diri
  namaLengkap: string;
  email: string;
  telepon: string;
  alamat: string;
  // Step 2: Ringkasan Profil
  ringkasanProfil: string;
  // Step 3: Pengalaman Kerja
  pengalaman: ExperienceItem[];
  // Step 4: Pendidikan
  pendidikan: EducationItem[];
  // Step 5: Skill
  skills: string[];
}

export interface CoverLetterFormData {
  // Step 1: Data Diri
  namaLengkap: string;
  email: string;
  telepon: string;
  // Step 2: Info Lamaran
  posisiDilamar: string;
  perusahaanTujuan: string;
  // Step 3: Pengalaman Relevan
  pengalamanRelevan: string;
  // Step 4: Penutup
  penutup: string;
}

export type SelectedPackageType = 'cv' | 'surat_lamaran';

export interface SubmissionPayload {
  id?: string;
  created_at?: string;
  paket: 'cv' | 'surat_lamaran';
  data_form: CvFormData | CoverLetterFormData;
  status_pembayaran: string;
  midtrans_order_id: string;
}
