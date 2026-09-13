-- ==============================================================================
-- SKEMA SQL TABEL SUBMISSIONS UNTUK CVPINTAR ID
-- Jalankan query ini di SQL Editor dashboard Supabase jika belum membuat tabel
-- ==============================================================================

-- 1. Buat ekstensi pgcrypto jika belum aktif (untuk gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Buat tabel submissions
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    paket TEXT NOT NULL CHECK (paket IN ('cv', 'surat_lamaran')),
    data_form JSONB NOT NULL,
    status_pembayaran TEXT NOT NULL DEFAULT 'pending',
    midtrans_order_id TEXT
);

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- 4. Kebijakan akses (Policy): Izinkan anon/public untuk melakukan INSERT
CREATE POLICY "Izinkan insert anonim untuk pengajuan data"
    ON submissions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 5. Kebijakan akses (Policy): Izinkan anon/public membaca submissions jika diperlukan
CREATE POLICY "Izinkan baca submissions"
    ON submissions
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 6. Indeks untuk query status pembayaran dan midtrans_order_id
CREATE INDEX IF NOT EXISTS idx_submissions_midtrans_order_id ON submissions(midtrans_order_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
