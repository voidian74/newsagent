import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const hasSupabaseConfig = supabaseUrl !== '' && supabaseKey !== '';

export const supabase = hasSupabaseConfig 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export interface NewsArticle {
  id?: string;
  source: string;
  category: 'domestic' | 'global' | 'crypto';
  title: string;
  link: string;
  date: string;
  summary: string;
  tags: string[];
}
