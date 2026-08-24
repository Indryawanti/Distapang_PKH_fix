import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vnhywtvcqtvytidbmizb.supabase.co';
const supabaseAnonKey = 'sb_publishable_HvQWTHYt1NUwSWwxJ5EiSA_24gZcB94';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
