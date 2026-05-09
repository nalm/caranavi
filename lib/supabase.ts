import { createClient } from '@supabase/supabase-js';

export type Reading = {
  id: string;
  nickname: string;
  birth_year: number;
  birth_month: number;
  birth_day: number;
  result_code: number;
  animal: string;
  nature: string;
  personality: string;
  created_at: string;
};

type Database = {
  public: {
    Tables: {
      readings: {
        Row: Reading;
        Insert: Omit<Reading, 'id' | 'created_at'>;
        Update: Partial<Omit<Reading, 'id' | 'created_at'>>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

let _client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabase() {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Supabase env vars are not set');
    _client = createClient<Database>(url, key);
  }
  return _client;
}
