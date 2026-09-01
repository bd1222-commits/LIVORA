
-- Supabase Schema for Livora Store

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  main_image TEXT NOT NULL,
  additional_images JSONB DEFAULT '[]',
  price NUMERIC NOT NULL,
  old_price NUMERIC,
  discount_percentage NUMERIC,
  short_description TEXT,
  description TEXT,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  colors JSONB DEFAULT '[]',
  sizes JSONB DEFAULT '[]',
  sku TEXT,
  display_stock_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  details JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS hero_slides (
  id TEXT PRIMARY KEY,
  image TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  cta_text TEXT,
  cta_link TEXT,
  badge TEXT,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  image TEXT,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  date TEXT
);

CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY,
  store_name TEXT NOT NULL,
  store_name_en TEXT NOT NULL,
  tagline TEXT,
  logo TEXT,
  whatsapp_number TEXT,
  instagram TEXT,
  tiktok TEXT,
  snapchat TEXT,
  store_description TEXT,
  contact_information JSONB,
  footer_text TEXT,
  default_seo JSONB,
  currency JSONB
);

-- 2. Row Level Security Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on hero_slides" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Allow public read access on testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read access on site_settings" ON site_settings FOR SELECT USING (true);

-- 3. Default Data Insertions

INSERT INTO categories (id, name, slug, image, description, display_order, active) VALUES ('cat-accessories', 'الإكسسوارات', 'accessories', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop', 'قلائد مطلية بالذهب، أساور راقية، وأقراط أنيقة صممت لتبرز جاذبيتك الفاتنة.', 1, true);
INSERT INTO categories (id, name, slug, image, description, display_order, active) VALUES ('cat-makeup', 'المكياج', 'makeup', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop', 'أحمر شفاه حريري، باليتات ظلال ساحرة، ومستحضرات تجميل أصلية 100%.', 2, true);
INSERT INTO categories (id, name, slug, image, description, display_order, active) VALUES ('cat-skincare', 'منتجات العناية', 'skincare', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop', 'سيرومات نضارة، مرطبات مكثفة، وزيوت طبيعية لنقاء وإشراقة تدوم.', 3, true);
INSERT INTO categories (id, name, slug, image, description, display_order, active) VALUES ('cat-beauty-tools', 'أدوات التجميل', 'beauty-tools', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop', 'فراشي مخملية احترافية، رول تدليك الكوارتز، وأدوات تطبيق دقيقة.', 4, true);
INSERT INTO categories (id, name, slug, image, description, display_order, active) VALUES ('cat-hair-accessories', 'إكسسوارات الشعر', 'hair-accessories', 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=800&auto=format&fit=crop', 'مشابك لؤلؤية فاخرة، أطواق حريرية مرصعة، وتيجان ناعمة لأبهى إطلالة.', 5, true);
INSERT INTO categories (id, name, slug, image, description, display_order, active) VALUES ('cat-bags', 'الحقائب', 'bags', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop', 'حقائب يد جلدية كلاسيكية وكلاتشات سهرة راقية بتفاصيل ذهبية مذهلة.', 6, true);
INSERT INTO categories (id, name, slug, image, description, display_order, active) VALUES ('cat-beauty-care', 'منتجات الجمال', 'beauty-products', 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=800&auto=format&fit=crop', 'عطور راقية وبخاخات مسك وجسم لإحساس دائم بالانتعاش والتميز.', 7, true);
INSERT INTO products (id, name, slug, main_image, additional_images, price, old_price, discount_percentage, short_description, description, category_id, colors, sizes, sku, display_stock_count, is_featured, is_best_seller, is_new, is_on_sale, rating, reviews_count, created_at, details) VALUES ('prod-1', 'عقد ذهبي مرصع بأحجار الزركون الفاخرة', 'luxury-zircon-gold-necklace', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop","https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1000&auto=format&fit=crop"]', 18500, 24000, 23, 'عقد مطلي بالذهب عيار 18 بتصميم كلاسيكي ساحر يناسب أرقى المناسبات.', 'قطعة فنية استثنائية من مجوهرات ليفورا. عقد مصنوع بعناية فائقة من الفولاذ المقاوم للصدأ ومطلي بطبقات غنية من الذهب عيار 18 مع أحجار الزركون النقية عاكسة للضوء. لا يبهت لونه ومقاوم للماء والحساسية.', 'cat-accessories', '[{"name":"ذهب أصفر","hex":"#C8A96B"},{"name":"ذهب وردي","hex":"#E0A899"},{"name":"فضة بلاتين","hex":"#E5E5E5"}]', '["45 سم (قابل للتعديل)","50 سم"]', 'LIV-ACC-001', 4, true, true, false, true, 5, 28, '2026-02-15T10:00:00Z', '{"material":"فولاذ مقاوم للصدأ مطلي بذهب عيار 18 قيراط","origin":"تصميم إيطالي حصري","careInstructions":"يحفظ في علبة ليفورا الفاخرة بعيداً عن الكحول المباشر","warranty":"ضمان ثبات اللون لمدة عام كامل"}');
INSERT INTO products (id, name, slug, main_image, additional_images, price, old_price, discount_percentage, short_description, description, category_id, colors, sizes, sku, display_stock_count, is_featured, is_best_seller, is_new, is_on_sale, rating, reviews_count, created_at, details) VALUES ('prod-2', 'مجموعة أحمر الشفاه المخملي "ريد فيلفيت كولكشن"', 'velvet-matte-lipstick-set', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop","https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop"]', 12500, 16000, 22, 'طقم يحتوي على 4 درجات مخملية ثابتة تدوم طوال اليوم دون أن تسبب جفاف الشفاه.', 'تألقي بجاذبية الشفاه الممتلئة مع تشكيلة ليفورا المخملية. تركيبة نباتية معززة بزبدة الشيا وفيتامين E لتغذية وترطيب الشفاه مع لون صبغي مركز وثبات فائق يدوم حتى 16 ساعة.', 'cat-makeup', '[{"name":"روز نود","hex":"#C27D7D"},{"name":"توت غامق","hex":"#7A1C30"},{"name":"كلاسيك ريد","hex":"#B31B1B"},{"name":"موكا دافئ","hex":"#8B5A2B"}]', '[]', 'LIV-MKP-042', 7, true, true, false, true, 4.9, 45, '2026-02-18T12:30:00Z', '{"material":"مستخلصات طبيعية 100% مع فيتامين E","origin":"فرنسا","careInstructions":"يحفظ في مكان جاف وبارد","warranty":"منتج أصلي ومضمون"}');
INSERT INTO products (id, name, slug, main_image, additional_images, price, old_price, discount_percentage, short_description, description, category_id, colors, sizes, sku, display_stock_count, is_featured, is_best_seller, is_new, is_on_sale, rating, reviews_count, created_at, details) VALUES ('prod-3', 'سيروم حمض الهيالورونيك وفيتامين C المركز للنضارة الفورية', 'hyaluronic-vitamin-c-glow-serum', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop","https://images.unsplash.com/photo-1608248597359-0a6e0df36545?q=80&w=1000&auto=format&fit=crop"]', 14000, 19000, 26, 'تركيبة فائقة النقاء تمنح بشرتك نضارة زجاجية وترطيباً عميقاً يحارب التجاعيد المبكرة.', 'أعيدي الحيوية والشباب لبشرتك مع سيروم ليفورا المركز. يحتوي على تركيز 5% من فيتامين C النقي و 2% حمض الهيالورونيك متعدد الأوزان الجزيئية لتوحيد لون البشرة وتقليل التصبغات ومقاومة علامات الإجهاد.', 'cat-skincare', '[]', '["30 مل","50 مل"]', 'LIV-SKN-105', 5, true, true, true, true, 5, 39, '2026-02-22T14:15:00Z', '{"material":"خالٍ من العطور والبارابين والكحول","origin":"كوريا الجنوبية","careInstructions":"يستخدم صباحاً ومساءً على بشرة نظيفة قبل المرطب","warranty":"مختبر سريرياً ومطابق للمواصفات العالمية"}');
INSERT INTO products (id, name, slug, main_image, additional_images, price, old_price, discount_percentage, short_description, description, category_id, colors, sizes, sku, display_stock_count, is_featured, is_best_seller, is_new, is_on_sale, rating, reviews_count, created_at, details) VALUES ('prod-4', 'حقيبة ليفورا الجلدية الفاخرة مع قفل ذهبي مميز', 'livora-signature-luxury-leather-bag', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop","https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1000&auto=format&fit=crop"]', 32000, 42000, 24, 'حقيبة كتف ويد بتصميم أيقوني من الجلد النباتي الإيطالي عالي الجودة مع حزام ذهبي قابل للتعديل.', 'رمز الفخامة والعملية في آن واحد. حقيبة ليفورا الأيقونية بحجم مثالي يتسع لجميع مقتنياتك اليومية ومكياجك وهاتفك، مع بطانة حريرية داخلية وتقسيمات منظمة وإكسسوارات معدنية مطلية بالذهب مقاومة للخدش.', 'cat-bags', '[{"name":"عاجي دافئ (Ivory)","hex":"#F6F0E8"},{"name":"أسود أونيكس (Onyx)","hex":"#171717"},{"name":"كراميل ناعم (Caramel)","hex":"#A66E38"},{"name":"برغندي ملكي","hex":"#5E1914"}]', '["المقاس الكلاسيكي: 24 × 16 × 8 سم"]', 'LIV-BAG-088', 3, true, false, true, true, 5, 19, '2026-02-25T09:00:00Z', '{"material":"جلد نباتي إيطالي فاخر من الدرجة الأولى","origin":"تصميم فلورنسي حصري","careInstructions":"تنظف بقطعة قماش ناعمة وجافة وتخزن في حقيبة الغبار المرفقة","warranty":"ضمان عام كامل على السحابات والجلود"}');
INSERT INTO products (id, name, slug, main_image, additional_images, price, old_price, discount_percentage, short_description, description, category_id, colors, sizes, sku, display_stock_count, is_featured, is_best_seller, is_new, is_on_sale, rating, reviews_count, created_at, details) VALUES ('prod-5', 'طقم فراشي المكياج المخملية من الكشمير (12 قطعة مع حقيبة)', 'luxury-cashmere-brush-set-12pcs', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=1000&auto=format&fit=crop"]', 15500, 21000, 26, 'فراشي تجميل احترافية بشعيرات ناعمة كالحرير ومقابض أنيقة بلمسات ذهبية.', 'تطبيق مكياج ناعم ومثالي كالمحترفين. يضم الطقم جميع الفراشي الأساسية للوجه والعيون والكونتور والدمج مع حقيبة ليفورا الفاخرة المدمجة المقاومة للماء والأتربة.', 'cat-beauty-tools', '[{"name":"ذهبي عاجي","hex":"#C8A96B"},{"name":"وردي شيفون","hex":"#EBB4B4"}]', '[]', 'LIV-TLS-019', 6, false, true, false, true, 4.8, 31, '2026-02-10T16:20:00Z', '{}');
INSERT INTO products (id, name, slug, main_image, additional_images, price, old_price, discount_percentage, short_description, description, category_id, colors, sizes, sku, display_stock_count, is_featured, is_best_seller, is_new, is_on_sale, rating, reviews_count, created_at, details) VALUES ('prod-6', 'طوق شعر لؤلؤي مرصع بالكريستال اللامع', 'pearl-crystal-luxury-headband', 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1000&auto=format&fit=crop"]', 6500, 9000, 28, 'إكسسوار شعر ملكي مزين بلآلئ المياه العذبة وكريستالات براقة تميز مناسباتك الخاصة.', 'تألقي بإطلالة أميرة مع طوق الشعر الاستثنائي من ليفورا. مبطن بقماش حريري فائق النعومة لمنع الضغط على الرأس ومثبت بحرفية يدوية متناهية.', 'cat-hair-accessories', '[{"name":"لؤلؤ أبيض ملكي","hex":"#FFFFFF"},{"name":"شمبانيا جولد","hex":"#DEC593"}]', '[]', 'LIV-HAR-077', 9, false, true, true, true, 5, 22, '2026-02-24T18:00:00Z', '{}');
INSERT INTO products (id, name, slug, main_image, additional_images, price, old_price, discount_percentage, short_description, description, category_id, colors, sizes, sku, display_stock_count, is_featured, is_best_seller, is_new, is_on_sale, rating, reviews_count, created_at, details) VALUES ('prod-7', 'عطر مسك الفانيليا والياسمين الليلي "LIVORA NOIR"', 'livora-noir-luxury-parfum', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop"]', 26000, 34000, 24, 'عطر نسائي شرقي غربي ساحر بمزيج المسك الأبيض وخشب الصندل ونفحات الفانيليا الملكية.', 'رائحة تأسر الحواس وتبقى عالقة في الذاكرة. عطر أو دو بارفيوم بتركيز 25% من الزيوت العطرية النقية لثبات يستمر لأكثر من 24 ساعة وفواحان يخطف الأنفاس.', 'cat-beauty-care', '[]', '["100 مل"]', 'LIV-PRF-009', 4, true, true, true, false, 5, 54, '2026-02-26T11:00:00Z', '{"material":"زيوت فرنسية نقية مع المسك الأبيض","origin":"غراس - فرنسا","careInstructions":"يرش على نقاط النبض والملابس","warranty":"ثبات وفواحان مضمون"}');
INSERT INTO products (id, name, slug, main_image, additional_images, price, old_price, discount_percentage, short_description, description, category_id, colors, sizes, sku, display_stock_count, is_featured, is_best_seller, is_new, is_on_sale, rating, reviews_count, created_at, details) VALUES ('prod-8', 'سوار ذهبي متصل مع خاتم بنمط الأرابيسك العصري', 'modern-arabesque-gold-bracelet-ring', 'https://images.unsplash.com/photo-1611591475155-42e9fba5ce55?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop"]', 16000, 20000, 20, 'سوار وخاتم مدمج بتصميم شرقي حديث مطلي بذهب عيار 18 قيراط مع نقوش هندسية دقيقة.', 'قطعة لافتة للأنظار مستوحاة من التراث العربي الأندلسي بلمسة عصرية فاخرة. مريحة في الارتداء وقابلة لتعديل المقاس لتناسب جميع معاصم اليدين.', 'cat-accessories', '[{"name":"ذهب عيار 18","hex":"#C8A96B"},{"name":"ذهب أبيض مطلي","hex":"#E5E5E5"}]', '[]', 'LIV-ACC-018', 5, true, false, true, true, 4.9, 16, '2026-02-27T15:45:00Z', '{}');
INSERT INTO products (id, name, slug, main_image, additional_images, price, old_price, discount_percentage, short_description, description, category_id, colors, sizes, sku, display_stock_count, is_featured, is_best_seller, is_new, is_on_sale, rating, reviews_count, created_at, details) VALUES ('prod-9', 'رول تدليك الوجه بحجر اليشم الأخضر وحجر الجواشا الطبيعي', 'natural-jade-roller-guasha-set', 'https://images.unsplash.com/photo-1608248597359-0a6e0df36545?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop"]', 8500, 11000, 22, 'أداة عناية صينية تقليدية لشد البشرة وتنشيط الدورة الدموية والتخلص من انتفاخ تحت العينين.', 'استرخي واستمتعي بجلسة سبا منزلية يومية. رول وحجر جواشا مصنوعان من حجر اليشم الطبيعي 100%، يساعدان على امتصاص السيرومات والزيوت بعمق ونحت الفك والخدين.', 'cat-beauty-tools', '[]', '[]', 'LIV-TLS-044', 8, false, true, false, true, 4.8, 27, '2026-02-14T08:00:00Z', '{}');
INSERT INTO products (id, name, slug, main_image, additional_images, price, old_price, discount_percentage, short_description, description, category_id, colors, sizes, sku, display_stock_count, is_featured, is_best_seller, is_new, is_on_sale, rating, reviews_count, created_at, details) VALUES ('prod-10', 'أقراط اللؤلؤ المتدلية بطلاء الذهب والزركون', 'drop-pearl-gold-zircon-earrings', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop"]', 9500, 13000, 27, 'أقراط ناعمة وأنيقة تضيف لمسة من النقاء والأنوثة لأي إطلالة يومية أو مسائية.', 'أقراط ليفورا المتدلية مصنوعة من لؤلؤ باروكي صناعي نخب أول مع قواعد ذهبية مضادة للحساسية ومريحة للأذن طوال اليوم.', 'cat-accessories', '[]', '[]', 'LIV-ACC-033', 7, false, true, true, true, 4.9, 21, '2026-02-28T09:10:00Z', '{}');
INSERT INTO hero_slides (id, image, title, subtitle, description, cta_text, cta_link, badge, active, display_order) VALUES ('hero-1', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop', 'أنوثة خالدة وفخامة تليق بك', 'تشكيلة ليفورا الجديدة لعام 2026', 'اكتشفي أرقى الإكسسوارات، المكياج الأصلي، ومنتجات العناية المختارة بعناية للمرأة اليمنية الأنيقة مع خدمة توصيل لجميع المحافظات.', 'اكتشفي التشكيلة الآن', '/products', 'تخفيضات موسمية حصرية', true, 1);
INSERT INTO hero_slides (id, image, title, subtitle, description, cta_text, cta_link, badge, active, display_order) VALUES ('hero-2', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop', 'إشراقة ساحرة ولمسات مكياج ناعمة', 'أحدث درجات الروج والباليتات الأصلية', 'ألوان تدوم طوال اليوم وتركيبات غنية تبرز جمالك الطبيعي وتمنحك الثقة في كل خطوة.', 'تسوقي المكياج', '/products?category=makeup', 'الأكثر مبيعاً', true, 2);
INSERT INTO hero_slides (id, image, title, subtitle, description, cta_text, cta_link, badge, active, display_order) VALUES ('hero-3', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop', 'بريق الذهب وأناقة المجوهرات', 'إكسسوارات مطلية بذهب عيار 18', 'تصاميم استثنائية مقاومة للماء والبهتان لتبقى ذكراك خالدة ومظهرك متألقاً دائماً.', 'تسوقي الإكسسوارات', '/products?category=accessories', 'تصاميم حصرية', true, 3);
INSERT INTO testimonials (id, name, city, text, rating, image, active, display_order, date) VALUES ('test-1', 'سارة الكبسي', 'صنعاء', 'ما شاء الله التغليف جداً راقي وفخم، والعقد الذهبي طلع أجمل بكثير من الصور على الطبيعة ولمعته تجنن! والتوصيل في صنعاء كان سريع جداً.', 5, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop', true, 1, 'منذ أسبوع');
INSERT INTO testimonials (id, name, city, text, rating, image, active, display_order, date) VALUES ('test-2', 'فاطمة باعباد', 'عدن', 'طلبت روج ريد فيلفيت وسيروم النضارة، المنتجات أصلية 100% وجودتها عالية جداً. تعامل فريق الواتساب محترم وراقي وسريعين بالرد.', 5, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop', true, 2, 'منذ أسبوعين');
INSERT INTO testimonials (id, name, city, text, rating, image, active, display_order, date) VALUES ('test-3', 'مها الصبري', 'تعز', 'حقيبة اليد الأيقونية خياطتها وتفاصيلها الجلدية تضاهي الماركات العالمية، حجمها ممتاز جداً ومناسبة للدوام والمناسبات. شكراً ليفورا!', 5, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop', true, 3, 'منذ 3 أسابيع');
INSERT INTO testimonials (id, name, city, text, rating, image, active, display_order, date) VALUES ('test-4', 'خلود النعيمي', 'المكلا', 'فراشي المكياج ناعمة جداً وما تتساقط أبداً، ووصلتني للمكلا بحالة ممتازة في بوكس ليفورا الفاخر. متجري المفضل بلا منازع.', 5, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop', true, 4, 'منذ شهر');
INSERT INTO site_settings (id, store_name, store_name_en, tagline, logo, whatsapp_number, instagram, tiktok, snapchat, store_description, contact_information, footer_text, default_seo, currency) VALUES ('main_settings', 'ليفورا | LIVORA', 'LIVORA Luxury Store', 'عالمكِ الخاص للجمال والأناقة والفخامة النسائية', '/logo.svg', '967737462144', 'https://instagram.com/livora.ye', 'https://tiktok.com/@livora.ye', 'https://snapchat.com/add/livora.ye', 'متجر ليفورا النسائي الفاخر - وجهتكِ الأولى في اليمن لأرقى الإكسسوارات والمكياج ومنتجات العناية بالبشرة والجمال.', '{"address":"الجمهورية اليمنية - التوصيل متوفر لجميع المحافظات (صنعاء، عدن، تعز، المكلا، إب وكافة المناطق)","phone":"+967 737 462 144","email":"info@livora-store.com","workingHours":"يومياً من الساعة 9:00 صباحاً حتى 11:00 مساءً"}', 'جميع الحقوق محفوظة لمتجر ليفورا © 2026 | صُمم بشغف لجمالكِ الفاخر', '{"metaTitle":"LIVORA | ليفورا - متجر نسائي فاخر","metaDescription":"تسوقي أرقى الإكسسوارات، المكياج ومنتجات العناية في اليمن عبر متجر ليفورا مع طلب مباشر عبر الواتساب."}', '{"symbol":"ر.ي","code":"YER","exchangeRateToUSD":530}');
