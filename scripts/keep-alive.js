import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('HATA: Supabase URL veya Key bulunamadı.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function pingSupabase() {
  console.log('Supabase uyandırılıyor...');
  
 
  const { data, error } = await supabase
    .from('subscriptions')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Ping Başarısız:', error.message);
    process.exit(1);
  } else {
    console.log('Ping Başarılı! Veritabanı uyanık.');
  }
}

pingSupabase();