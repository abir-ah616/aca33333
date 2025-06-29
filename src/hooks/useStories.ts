import { useState, useEffect } from 'react';
import { supabase, Story, StoryPart, Category } from '../lib/supabase';

export function useStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          author:authors(*),
          categories:story_categories(
            category:categories(*)
          ),
          parts:story_parts(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedStories = data?.map(story => ({
        ...story,
        categories: story.categories?.map((sc: any) => sc.category) || [],
        parts: story.parts?.sort((a: StoryPart, b: StoryPart) => a.part_number - b.part_number) || []
      })) || [];

      setStories(transformedStories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const createCategory = async (categoryData: { name: string }) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;
      await fetchCategories(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchCategories(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCategories(); // Refresh the list
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const createStory = async (storyData: {
    title: string;
    slug: string;
    author_id: string;
    cover_image?: string;
    is_featured: boolean;
    categoryIds: string[];
    parts: { title: string; content: string }[];
  }) => {
    try {
      // Create the story
      const { data: story, error: storyError } = await supabase
        .from('stories')
        .insert([{
          title: storyData.title,
          slug: storyData.slug,
          author_id: storyData.author_id,
          cover_image: storyData.cover_image,
          is_featured: storyData.is_featured,
        }])
        .select()
        .single();

      if (storyError) throw storyError;

      // Add categories
      if (storyData.categoryIds.length > 0) {
        const categoryInserts = storyData.categoryIds.map(categoryId => ({
          story_id: story.id,
          category_id: categoryId,
        }));

        const { error: categoryError } = await supabase
          .from('story_categories')
          .insert(categoryInserts);

        if (categoryError) throw categoryError;
      }

      // Add story parts
      if (storyData.parts.length > 0) {
        const partInserts = storyData.parts.map((part, index) => ({
          story_id: story.id,
          part_number: index + 1,
          title: part.title,
          content: part.content,
        }));

        const { error: partsError } = await supabase
          .from('story_parts')
          .insert(partInserts);

        if (partsError) throw partsError;
      }

      await fetchStories(); // Refresh the list
      return { data: story, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updateStory = async (id: string, updates: Partial<Story>) => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchStories(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deleteStory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchStories(); // Refresh the list
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const getStoryBySlug = (slug: string): Story | undefined => {
    return stories.find(story => story.slug === slug);
  };

  const getStoriesByAuthor = (username: string): Story[] => {
    return stories.filter(story => story.author?.username === username);
  };

  const getFeaturedStories = (): Story[] => {
    return stories.filter(story => story.is_featured);
  };

  const createStoryPart = async (storyId: string, partData: {
    title: string;
    content: string;
    part_number: number;
  }) => {
    try {
      const { data, error } = await supabase
        .from('story_parts')
        .insert([{
          story_id: storyId,
          ...partData,
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchStories(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updateStoryPart = async (id: string, updates: Partial<StoryPart>) => {
    try {
      const { data, error } = await supabase
        .from('story_parts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchStories(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deleteStoryPart = async (id: string) => {
    try {
      const { error } = await supabase
        .from('story_parts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchStories(); // Refresh the list
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const incrementViews = async (storyId: string, partId?: string) => {
    try {
      // Increment story views
      await supabase.rpc('increment_story_views', { story_id: storyId });
      
      // Increment part views if specified
      if (partId) {
        await supabase.rpc('increment_part_views', { part_id: partId });
      }
    } catch (err) {
      console.error('Error incrementing views:', err);
    }
  };

  useEffect(() => {
    fetchStories();
    fetchCategories();
  }, []);

  return {
    stories,
    categories,
    loading,
    error,
    fetchStories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    createStory,
    updateStory,
    deleteStory,
    getStoryBySlug,
    getStoriesByAuthor,
    getFeaturedStories,
    createStoryPart,
    updateStoryPart,
    deleteStoryPart,
    incrementViews,
  };
}