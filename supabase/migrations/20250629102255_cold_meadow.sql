/*
  # Fix Admin User Setup

  1. Remove the placeholder admin user entry
  2. Create a proper setup for admin users
  3. Add instructions for manual admin user creation
*/

-- Remove the placeholder admin user that causes foreign key constraint error
DELETE FROM admin_users WHERE id = '00000000-0000-0000-0000-000000000000';

-- Create a function to add admin users safely
CREATE OR REPLACE FUNCTION add_admin_user(user_email text)
RETURNS void AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  -- If user exists, add them to admin_users
  IF user_id IS NOT NULL THEN
    INSERT INTO admin_users (id, email) 
    VALUES (user_id, user_email)
    ON CONFLICT (email) DO NOTHING;
  ELSE
    RAISE EXCEPTION 'User with email % not found in auth.users', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data for testing (authors, categories, stories)
-- Sample Authors
INSERT INTO authors (username, display_name, bio, avatar) VALUES
  ('snigdha-hossain-mona', 'স্নিগ্ধা হোসেন মোনা', 'বাংলা সাহিত্যের অনুরাগী একজন লেখক। ভালোবাসি মানুষের গল্প বলতে।', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'),
  ('mir-ashraf-ria', 'মীর আশরাফ রিয়া', 'থ্রিলার এবং রহস্য গল্প লিখতে পছন্দ করি।', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'),
  ('inal-bahunia-rose-queen', 'আইনাল বহুনিয়া (Rose Queen)', 'রোমান্টিক গল্পের জগতে বিচরণ করি।', 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150'),
  ('shamrita', 'শামরিতা', 'সামাজিক বিষয় নিয়ে গল্প লিখি। মানুষের জীবনের ছোট ছোট ঘটনা নিয়ে কাজ করি।', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150')
ON CONFLICT (username) DO NOTHING;

-- Get author IDs for stories
DO $$
DECLARE
  author1_id uuid;
  author2_id uuid;
  author3_id uuid;
  author4_id uuid;
  romantic_id uuid;
  thriller_id uuid;
  social_id uuid;
  comedy_id uuid;
  story1_id uuid;
  story2_id uuid;
  story3_id uuid;
BEGIN
  -- Get author IDs
  SELECT id INTO author1_id FROM authors WHERE username = 'snigdha-hossain-mona';
  SELECT id INTO author2_id FROM authors WHERE username = 'mir-ashraf-ria';
  SELECT id INTO author3_id FROM authors WHERE username = 'inal-bahunia-rose-queen';
  SELECT id INTO author4_id FROM authors WHERE username = 'shamrita';
  
  -- Get category IDs
  SELECT id INTO romantic_id FROM categories WHERE name = 'রোমান্টিক';
  SELECT id INTO thriller_id FROM categories WHERE name = 'থ্রিলার';
  SELECT id INTO social_id FROM categories WHERE name = 'সামাজিক';
  SELECT id INTO comedy_id FROM categories WHERE name = 'কমেডি';
  
  -- Insert sample stories
  INSERT INTO stories (title, slug, author_id, cover_image, is_featured, views, comments) VALUES
    ('লাঞ্চের নাকি ভিলেন', 'lancer-naki-villain', author1_id, 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400', true, 10000, 25),
    ('ভোগাকে', 'bhogake', author2_id, 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400', true, 827, 12),
    ('আমি পড়ুজা', 'ami-poruza', author3_id, 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=400', true, 7300, 45),
    ('সামাজিক বন্ধন', 'samajik-bondhon', author4_id, 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=400', false, 3200, 18)
  ON CONFLICT (slug) DO NOTHING;
  
  -- Get story IDs
  SELECT id INTO story1_id FROM stories WHERE slug = 'lancer-naki-villain';
  SELECT id INTO story2_id FROM stories WHERE slug = 'bhogake';
  SELECT id INTO story3_id FROM stories WHERE slug = 'ami-poruza';
  
  -- Add story categories
  INSERT INTO story_categories (story_id, category_id) VALUES
    (story1_id, romantic_id),
    (story1_id, comedy_id),
    (story2_id, romantic_id),
    (story2_id, thriller_id),
    (story3_id, romantic_id),
    (story3_id, social_id)
  ON CONFLICT DO NOTHING;
  
  -- Add sample story parts
  INSERT INTO story_parts (story_id, part_number, title, content, views) VALUES
    (story1_id, 1, 'প্রথম পর্ব', 'এটি "লাঞ্চের নাকি ভিলেন" গল্পের প্রথম পর্ব। এখানে গল্পের মূল বিষয়বস্তু শুরু হয়েছে। লেখক এই পর্বে চরিত্রগুলোর পরিচয় এবং প্রাথমিক পরিস্থিতি তুলে ধরেছেন।

এই গল্পে আমরা দেখতে পাই কীভাবে একটি সাধারণ লাঞ্চের ঘটনা থেকে শুরু হয় এক অসাধারণ প্রেমের গল্প। প্রতিটি চরিত্র তাদের নিজস্ব স্বপ্ন এবং সংগ্রাম নিয়ে এগিয়ে চলেছে।

গল্পের এই অংশে লেখক পাঠকদের সাথে একটি আবেগময় সংযোগ স্থাপন করেছেন। প্রতিটি বাক্য, প্রতিটি শব্দ পাঠকের মনে গভীর প্রভাব ফেলে।

"জীবনটা অনেক সুন্দর হতে পারত, যদি আমরা একটু বেশি ভালোবাসতে পারতাম।" - এই লাইনটি গল্পের মূল বার্তা প্রকাশ করে।', 450),
    (story1_id, 2, 'দ্বিতীয় পর্ব', 'গল্পের দ্বিতীয় পর্বে আমরা দেখি কীভাবে মূল চরিত্রগুলোর মধ্যে সম্পর্ক গড়ে উঠতে শুরু করে। এখানে কমেডি এবং রোমান্সের সুন্দর মিশ্রণ রয়েছে।', 380),
    (story2_id, 1, 'শুরুর কথা', 'ভোগাকে গল্পের প্রথম পর্ব। এটি একটি রহস্যময় এবং রোমান্টিক গল্প যা পাঠকদের মুগ্ধ করবে।', 290),
    (story3_id, 1, 'আমি পড়ুজা - প্রথম অধ্যায়', 'এই গল্পটি একটি পারিবারিক নাটক যেখানে ভালোবাসা, ত্যাগ এবং সামাজিক বিষয়গুলো নিয়ে আলোচনা করা হয়েছে।', 520)
  ON CONFLICT (story_id, part_number) DO NOTHING;
END $$;