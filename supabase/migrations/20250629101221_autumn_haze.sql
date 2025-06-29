/*
  # Insert Sample Data

  1. Sample Authors
  2. Sample Stories
  3. Sample Story Parts
  4. Sample Story Categories
*/

-- Insert sample authors
INSERT INTO authors (username, display_name, bio, avatar, joined_date) VALUES
  ('snigdha-hossain-mona', 'স্নিগ্ধা হোসেন মোনা', 'বাংলা সাহিত্যের অনুরাগী একজন লেখক। ভালোবাসি মানুষের গল্প বলতে।', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150', '2023-01-15'),
  ('mir-ashraf-ria', 'মীর আশরাফ রিয়া', 'থ্রিলার এবং রহস্য গল্প লিখতে পছন্দ করি।', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150', '2023-02-20'),
  ('inal-bahunia-rose-queen', 'আইনাল বহুনিয়া (Rose Queen)', 'রোমান্টিক গল্পের জগতে বিচরণ করি।', 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150', '2023-03-10'),
  ('shamrita', 'শামরিতা', 'সামাজিক বিষয় নিয়ে গল্প লিখি। মানুষের জীবনের ছোট ছোট ঘটনা নিয়ে কাজ করি।', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150', '2023-04-05'),
  ('nasrat-sultana-sejuti', 'নাসরাত সুলতানা সেজুতি', 'হরর এবং ভৌতিক গল্প লিখতে ভালোবাসি।', 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150', '2023-05-12'),
  ('lucky', 'লাকি', 'নতুন লেখক। বিভিন্ন ধরনের গল্প নিয়ে পরীক্ষা করছি।', 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150', '2023-06-18'),
  ('mushfiqur-rahman-sariraznia-siriaran', 'মুশফিকুর রহমান সারিরাজনিয়া(সিরিয়ান)', 'ঐতিহাসিক গল্প এবং পুরাণের আধুনিক রুপায়ণ নিয়ে কাজ করি।', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150', '2023-07-25'),
  ('karnini-tulukdar', 'কর্নিণী তালুকদার', 'গ্রামীণ জীবন এবং ঐতিহ্য নিয়ে গল্প লিখি।', 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150', '2023-08-14')
ON CONFLICT (username) DO NOTHING;

-- Insert sample stories
DO $$
DECLARE
  author1_id uuid;
  author2_id uuid;
  author3_id uuid;
  author4_id uuid;
  author5_id uuid;
  author7_id uuid;
  story1_id uuid;
  story2_id uuid;
  story3_id uuid;
  story4_id uuid;
  story5_id uuid;
  story6_id uuid;
  romantic_id uuid;
  comedy_id uuid;
  thriller_id uuid;
  drama_id uuid;
  family_id uuid;
  social_id uuid;
  historical_id uuid;
  horror_id uuid;
BEGIN
  -- Get author IDs
  SELECT id INTO author1_id FROM authors WHERE username = 'snigdha-hossain-mona';
  SELECT id INTO author2_id FROM authors WHERE username = 'mir-ashraf-ria';
  SELECT id INTO author3_id FROM authors WHERE username = 'inal-bahunia-rose-queen';
  SELECT id INTO author4_id FROM authors WHERE username = 'shamrita';
  SELECT id INTO author5_id FROM authors WHERE username = 'nasrat-sultana-sejuti';
  SELECT id INTO author7_id FROM authors WHERE username = 'mushfiqur-rahman-sariraznia-siriaran';

  -- Get category IDs
  SELECT id INTO romantic_id FROM categories WHERE name = 'রোমান্টিক';
  SELECT id INTO comedy_id FROM categories WHERE name = 'কমেডি';
  SELECT id INTO thriller_id FROM categories WHERE name = 'থ্রিলার';
  SELECT id INTO drama_id FROM categories WHERE name = 'নাটক';
  SELECT id INTO family_id FROM categories WHERE name = 'পারিবারিক';
  SELECT id INTO social_id FROM categories WHERE name = 'সামাজিক';
  SELECT id INTO historical_id FROM categories WHERE name = 'ঐতিহাসিক';
  SELECT id INTO horror_id FROM categories WHERE name = 'হরর';

  -- Insert stories
  INSERT INTO stories (id, title, slug, author_id, cover_image, is_featured, published_date, views, comments) VALUES
    (uuid_generate_v4(), 'লাঞ্চের নাকি ভিলেন', 'lancer-naki-villain', author1_id, 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400', true, '2023-09-01', 10000, 0),
    (uuid_generate_v4(), 'ভোগাকে', 'bhogake', author2_id, 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400', true, '2023-09-05', 827, 0),
    (uuid_generate_v4(), 'আমি পড়ুজা', 'ami-poruza', author3_id, 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=400', true, '2023-09-10', 7300, 0),
    (uuid_generate_v4(), 'পরিজান', 'porizan', author7_id, 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=400', false, '2023-09-15', 18600, 0),
    (uuid_generate_v4(), 'বাইডিজ কলন্য', 'baidiz-colony', author5_id, 'https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg?auto=compress&cs=tinysrgb&w=400', false, '2023-09-20', 28700, 0),
    (uuid_generate_v4(), 'প্রেমালিংক', 'premalink', author3_id, 'https://images.pexels.com/photos/1212693/pexels-photo-1212693.jpeg?auto=compress&cs=tinysrgb&w=400', false, '2023-09-25', 733, 0)
  RETURNING id INTO story1_id;

  -- Get story IDs for category assignments
  SELECT id INTO story1_id FROM stories WHERE slug = 'lancer-naki-villain';
  SELECT id INTO story2_id FROM stories WHERE slug = 'bhogake';
  SELECT id INTO story3_id FROM stories WHERE slug = 'ami-poruza';
  SELECT id INTO story4_id FROM stories WHERE slug = 'porizan';
  SELECT id INTO story5_id FROM stories WHERE slug = 'baidiz-colony';
  SELECT id INTO story6_id FROM stories WHERE slug = 'premalink';

  -- Insert story categories
  INSERT INTO story_categories (story_id, category_id) VALUES
    (story1_id, romantic_id),
    (story1_id, comedy_id),
    (story2_id, romantic_id),
    (story2_id, thriller_id),
    (story3_id, romantic_id),
    (story3_id, drama_id),
    (story3_id, family_id),
    (story4_id, romantic_id),
    (story4_id, social_id),
    (story4_id, historical_id),
    (story5_id, romantic_id),
    (story5_id, thriller_id),
    (story5_id, horror_id),
    (story5_id, family_id),
    (story5_id, social_id),
    (story6_id, romantic_id),
    (story6_id, thriller_id)
  ON CONFLICT DO NOTHING;

  -- Insert sample story parts for each story
  INSERT INTO story_parts (story_id, part_number, title, content, published_date, views) 
  SELECT 
    s.id,
    generate_series(1, CASE 
      WHEN s.slug = 'lancer-naki-villain' THEN 36
      WHEN s.slug = 'bhogake' THEN 40
      WHEN s.slug = 'ami-poruza' THEN 91
      WHEN s.slug = 'porizan' THEN 60
      WHEN s.slug = 'baidiz-colony' THEN 67
      WHEN s.slug = 'premalink' THEN 19
      ELSE 10
    END),
    'পর্ব ' || generate_series(1, CASE 
      WHEN s.slug = 'lancer-naki-villain' THEN 36
      WHEN s.slug = 'bhogake' THEN 40
      WHEN s.slug = 'ami-poruza' THEN 91
      WHEN s.slug = 'porizan' THEN 60
      WHEN s.slug = 'baidiz-colony' THEN 67
      WHEN s.slug = 'premalink' THEN 19
      ELSE 10
    END),
    'এটি "' || s.title || '" গল্পের ' || generate_series(1, CASE 
      WHEN s.slug = 'lancer-naki-villain' THEN 36
      WHEN s.slug = 'bhogake' THEN 40
      WHEN s.slug = 'ami-poruza' THEN 91
      WHEN s.slug = 'porizan' THEN 60
      WHEN s.slug = 'baidiz-colony' THEN 67
      WHEN s.slug = 'premalink' THEN 19
      ELSE 10
    END) || ' নম্বর পর্ব। এখানে গল্পের মূল বিষয়বস্তু থাকবে। লেখক এই পর্বে চরিত্রগুলোর মধ্যে সংলাপ, বর্ণনা, এবং ঘটনাপ্রবাহ তুলে ধরেছেন।

এই গল্পে আমরা দেখতে পাই কীভাবে মানুষের জীবনে ছোট ছোট ঘটনা বড় পরিবর্তন আনতে পারে। প্রতিটি চরিত্র তাদের নিজস্ব স্বপ্ন এবং সংগ্রাম নিয়ে এগিয়ে চলেছে।

গল্পের এই অংশে লেখক পাঠকদের সাথে একটি আবেগময় সংযোগ স্থাপন করেছেন। প্রতিটি বাক্য, প্রতিটি শব্দ পাঠকের মনে গভীর প্রভাব ফেলে।

"জীবনটা অনেক সুন্দর হতে পারত, যদি আমরা একটু বেশি ভালোবাসতে পারতাম।" - এই লাইনটি গল্পের মূল বার্তা প্রকাশ করে।

গল্পের পরবর্তী পর্বে আরও রোমাঞ্চকর ঘটনার অপেক্ষা করছে।',
    s.published_date + (generate_series(1, CASE 
      WHEN s.slug = 'lancer-naki-villain' THEN 36
      WHEN s.slug = 'bhogake' THEN 40
      WHEN s.slug = 'ami-poruza' THEN 91
      WHEN s.slug = 'porizan' THEN 60
      WHEN s.slug = 'baidiz-colony' THEN 67
      WHEN s.slug = 'premalink' THEN 19
      ELSE 10
    END) || ' days')::interval,
    floor(random() * 1000 + 100)::integer
  FROM stories s
  ON CONFLICT (story_id, part_number) DO NOTHING;

END $$;

-- Update author statistics
UPDATE authors SET 
  total_reads = (
    SELECT COALESCE(SUM(s.views), 0) 
    FROM stories s 
    WHERE s.author_id = authors.id
  ),
  total_comments = (
    SELECT COALESCE(SUM(s.comments), 0) 
    FROM stories s 
    WHERE s.author_id = authors.id
  );