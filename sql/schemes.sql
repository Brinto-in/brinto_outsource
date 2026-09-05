CREATE TABLE IF NOT EXISTS schemes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  tag TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  bg_color TEXT NOT NULL,
  badge_text TEXT NOT NULL,
  badge_color TEXT NOT NULL,
  form_id TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  state TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_schemes_state ON schemes (state);
CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes (category);
CREATE INDEX IF NOT EXISTS idx_schemes_tag ON schemes (tag);

INSERT OR IGNORE INTO schemes (
  title, subtitle, tag, category, icon, color, bg_color,
  badge_text, badge_color, form_id, slug, state
) VALUES
  ('Subhadra Yojana', '₹50,000 financial assistance for women in 5 years (₹10k/yr)', 'Subhadra', 'Women Empowerment', 'volunteer_activism_rounded', '#E11D48', '#FFE4E6', 'Active • High Demand', '#E11D48', 'subhadra-yojana-2024', 'subhadra-yojana-6a92890ea0a6ba64feff744c', 'odisha'),
  ('KALIA Yojana (Krushak Assistance)', 'Financial aid for small & marginal farmers & landless cultivators', 'Farmers (KALIA)', 'Agriculture & Farmers', 'agriculture_rounded', '#16A34A', '#DCFCE7', '₹10,000 / Year', '#16A34A', 'kalia-scheme-assistance', 'kalia-yojana', 'odisha'),
  ('Biju Swasthya Kalyan Yojana (BSKY)', 'Cashless health coverage up to ₹5 Lakh (₹10 Lakh for women)', 'Health (BSKY)', 'Healthcare & Insurance', 'health_and_safety_rounded', '#0284C7', '#E0F2FE', 'Cashless Hospitalization', '#0284C7', 'bsky-card-services', 'biju-swasthya-kalyan', 'odisha'),
  ('Madhu Babu Pension Yojana (MBPY)', 'Monthly pension for elderly, widows, persons with disabilities', 'Pension', 'Social Security', 'elderly_rounded', '#7C3AED', '#F3E8FF', 'Monthly Aid', '#7C3AED', 'madhu-babu-pension', 'madhu-babu-pension-yojana', 'odisha'),
  ('Sujal - Drink from Tap Mission', '24x7 quality potable piped drinking water supply connection', 'Women & Youth', 'Water & Sanitation', 'water_drop_rounded', '#0D9488', '#CCFBF1', 'Urban Odisha', '#0D9488', 'sujal-tap-water-connection', 'sujal-drink-from-tap', 'odisha'),
  ('Biju Yuva Sashaktikaran Yojana', 'Free laptops & digital skill assistance for meritorious students', 'Women & Youth', 'Education & Youth', 'laptop_chromebook_rounded', '#EA580C', '#FFEDD5', 'Students & Youth', '#EA580C', 'biju-yuva-sashaktikaran', 'biju-yuva-sashaktikaran', 'odisha'),
  ('Mo Ghara Yojana', 'Credit linked housing scheme for rural households in Odisha', 'All', 'Housing & Shelter', 'cottage_rounded', '#475569', '#F1F5F9', 'Subsidized Loan', '#475569', 'mo-ghara-housing-scheme', 'mo-ghara-yojana', 'odisha'),
  ('Balaram Yojana', 'Credit support for landless farmers through Joint Liability Groups', 'Farmers (KALIA)', 'Agriculture Credit', 'eco_rounded', '#15803D', '#E7FEE7', 'Credit Linkage', '#15803D', 'balaram-yojana-credit', 'balaram-yojana', 'odisha');
