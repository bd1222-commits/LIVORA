const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envText = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envText.match(/VITE_SUPABASE_URL\s*=\s*"(.*)"/);
const keyMatch = envText.match(/VITE_SUPABASE_PUBLISHABLE_KEY\s*=\s*"(.*)"/);

const url = urlMatch[1].trim();
const key = keyMatch[1].trim();

const supabase = createClient(url, key);

async function checkHeroSlides() {
  const { data, error } = await supabase.from('hero_slides').select('*');
  console.log('Hero Slides:', JSON.stringify(data, null, 2));
  console.log('Error:', error);
}

checkHeroSlides();
