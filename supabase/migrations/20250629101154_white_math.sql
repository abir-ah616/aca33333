/*
  # Initial Schema for Golpo Hub

  1. New Tables
    - `authors`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `display_name` (text)
      - `bio` (text, optional)
      - `avatar` (text, optional)
      - `joined_date` (timestamp)
      - `story_count` (integer, default 0)
      - `total_reads` (integer, default 0)
      - `total_comments` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamp)

    - `stories`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `author_id` (uuid, foreign key to authors)
      - `cover_image` (text, optional)
      - `is_featured` (boolean, default false)
      - `published_date` (timestamp)
      - `views` (integer, default 0)
      - `comments` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `story_categories`
      - `story_id` (uuid, foreign key to stories)
      - `category_id` (uuid, foreign key to categories)
      - Primary key: (story_id, category_id)

    - `story_parts`
      - `id` (uuid, primary key)
      - `story_id` (uuid, foreign key to stories)
      - `part_number` (integer)
      - `title` (text)
      - `content` (text)
      - `published_date` (timestamp)
      - `views` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `admin_users`
      - `id` (uuid, primary key, foreign key to auth.users)
      - `email` (text, unique)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for admin write access
    - Add policies for authenticated admin access

  3. Functions
    - Auto-update story counts for authors
    - Auto-generate slugs
    - Update timestamps
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create authors table
CREATE TABLE IF NOT EXISTS authors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  bio text,
  avatar text,
  joined_date timestamptz DEFAULT now(),
  story_count integer DEFAULT 0,
  total_reads integer DEFAULT 0,
  total_comments integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  author_id uuid REFERENCES authors(id) ON DELETE CASCADE,
  cover_image text,
  is_featured boolean DEFAULT false,
  published_date timestamptz DEFAULT now(),
  views integer DEFAULT 0,
  comments integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create story_categories junction table
CREATE TABLE IF NOT EXISTS story_categories (
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (story_id, category_id)
);

-- Create story_parts table
CREATE TABLE IF NOT EXISTS story_parts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE,
  part_number integer NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  published_date timestamptz DEFAULT now(),
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(story_id, part_number)
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Authors are viewable by everyone"
  ON authors FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Stories are viewable by everyone"
  ON stories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Story categories are viewable by everyone"
  ON story_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Story parts are viewable by everyone"
  ON story_parts FOR SELECT
  TO public
  USING (true);

-- Create policies for admin access
CREATE POLICY "Admins can manage authors"
  ON authors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage stories"
  ON stories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage story categories"
  ON story_categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage story parts"
  ON story_parts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admin users can view themselves"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON authors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_story_parts_updated_at BEFORE UPDATE ON story_parts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update author story count
CREATE OR REPLACE FUNCTION update_author_story_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE authors 
    SET story_count = story_count + 1 
    WHERE id = NEW.author_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE authors 
    SET story_count = story_count - 1 
    WHERE id = OLD.author_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for story count
CREATE TRIGGER update_author_story_count_trigger
  AFTER INSERT OR DELETE ON stories
  FOR EACH ROW EXECUTE FUNCTION update_author_story_count();

-- Insert default categories
INSERT INTO categories (name) VALUES
  ('রোমান্টিক'),
  ('থ্রিলার'),
  ('সামাজিক'),
  ('হরর'),
  ('কমেডি'),
  ('নাটক'),
  ('পারিবারিক'),
  ('ঐতিহাসিক'),
  ('ফ্যান্টাসি'),
  ('সায়েন্স ফিকশন'),
  ('রহস্য'),
  ('ভৌতিক')
ON CONFLICT (name) DO NOTHING;