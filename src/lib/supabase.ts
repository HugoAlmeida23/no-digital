import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://chmwewvqdomtzmssceyn.supabase.co';
const supabaseKey = 'sb_publishable_owAbi190JRoicXSVWA-oSA_HmjuOh-6';

export const supabase = createClient(supabaseUrl, supabaseKey);
