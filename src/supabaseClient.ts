import { createClient } from '@supabase/supabase-js';

// Ganti nilai di bawah ini dengan Project URL & Anon Key dari Dashboard Supabase Anda,
// atau gunakan environment variable VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://zxpvrwsnqbzsewvopvww.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_kV6QxmFlahbqRqWSaQfkvA_ScmuHrH6';

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  !supabaseUrl.includes('GANTI_DENGAN') &&
  Boolean(supabaseAnonKey) &&
  !supabaseAnonKey.includes('GANTI_DENGAN') &&
  !supabaseAnonKey.includes('PASTE PUBLISHABLE KEY');

// Format URL yang valid agar tidak menimbulkan error URL runtime
const formattedUrl =
  supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://')
    ? supabaseUrl
    : `https://${supabaseUrl}`;

export const supabase = createClient(formattedUrl, supabaseAnonKey);
