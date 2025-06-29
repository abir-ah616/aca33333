import { useStories } from '../hooks/useStories';
import { useAuthors } from '../hooks/useAuthors';

// This file provides compatibility with the existing mock data structure
// while using real Supabase data

export function useSupabaseData() {
  const { stories, categories, getStoryBySlug, getStoriesByAuthor, getFeaturedStories } = useStories();
  const { authors, getAuthorByUsername } = useAuthors();

  // Transform Supabase data to match the existing interface
  const transformedStories = stories.map(story => ({
    ...story,
    author: story.author || { id: '', username: '', display_name: '', bio: '', avatar: '', joined_date: '', story_count: 0, total_reads: 0, total_comments: 0, created_at: '', updated_at: '' },
    categories: story.categories?.map(cat => cat.name) || [],
    parts: story.parts || []
  }));

  const transformedAuthors = authors.map(author => ({
    ...author,
    displayName: author.display_name,
    joinedDate: author.joined_date,
    storyCount: author.story_count,
    totalReads: author.total_reads,
    totalComments: author.total_comments
  }));

  const featuredStories = getFeaturedStories().map(story => ({
    ...story,
    author: story.author || { id: '', username: '', display_name: '', bio: '', avatar: '', joined_date: '', story_count: 0, total_reads: 0, total_comments: 0, created_at: '', updated_at: '' },
    categories: story.categories?.map(cat => cat.name) || [],
    parts: story.parts || []
  }));

  const categoryNames = categories.map(cat => cat.name);

  return {
    stories: transformedStories,
    authors: transformedAuthors,
    featuredStories,
    categories: categoryNames,
    getStoryBySlug: (slug: string) => {
      const story = getStoryBySlug(slug);
      if (!story) return undefined;
      return {
        ...story,
        author: story.author || { id: '', username: '', display_name: '', bio: '', avatar: '', joined_date: '', story_count: 0, total_reads: 0, total_comments: 0, created_at: '', updated_at: '' },
        categories: story.categories?.map(cat => cat.name) || [],
        parts: story.parts || []
      };
    },
    getAuthorByUsername: (username: string) => {
      const author = getAuthorByUsername(username);
      if (!author) return undefined;
      return {
        ...author,
        displayName: author.display_name,
        joinedDate: author.joined_date,
        storyCount: author.story_count,
        totalReads: author.total_reads,
        totalComments: author.total_comments
      };
    },
    getStoriesByAuthor: (username: string) => {
      return getStoriesByAuthor(username).map(story => ({
        ...story,
        author: story.author || { id: '', username: '', display_name: '', bio: '', avatar: '', joined_date: '', story_count: 0, total_reads: 0, total_comments: 0, created_at: '', updated_at: '' },
        categories: story.categories?.map(cat => cat.name) || [],
        parts: story.parts || []
      }));
    },
    getStoryPart: (storySlug: string, partNumber: number) => {
      const story = getStoryBySlug(storySlug);
      if (!story) return undefined;
      return story.parts?.find(part => part.part_number === partNumber);
    }
  };
}