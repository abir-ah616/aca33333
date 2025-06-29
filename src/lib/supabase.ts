import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Author {
  id: string;
  username: string;
  display_name: string;
  bio?: string;
  avatar?: string;
  joined_date: string;
  story_count: number;
  total_reads: number;
  total_comments: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  author_id: string;
  cover_image?: string;
  is_featured: boolean;
  published_date: string;
  views: number;
  comments: number;
  created_at: string;
  updated_at: string;
  author?: Author;
  categories?: Category[];
  parts?: StoryPart[];
}

export interface StoryPart {
  id: string;
  story_id: string;
  part_number: number;
  title: string;
  content: string;
  published_date: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

// Helper functions
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

export const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};