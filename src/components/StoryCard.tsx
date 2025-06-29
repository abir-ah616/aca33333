import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, MessageCircle, Calendar } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Author {
  id: string;
  username: string;
  display_name: string;
  avatar?: string;
}

interface StoryPart {
  id: string;
  part_number: number;
  title: string;
}

interface Story {
  id: string;
  title: string;
  slug: string;
  author?: Author;
  cover_image?: string;
  categories?: { name: string }[] | string[];
  is_featured: boolean;
  published_date: string;
  views: number;
  comments: number;
  parts?: StoryPart[];
}

interface StoryCardProps {
  story: Story;
  showAuthor?: boolean;
}

// Function to render formatted text
const renderFormattedText = (text: string) => {
  // Replace formatting markers with HTML
  let formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/~(.*?)~/g, '<span style="opacity: 0.7;">$1</span>') // Light text
    .replace(/^> (.*$)/gm, '<blockquote style="border-left: 3px solid #F59E0B; padding-left: 12px; margin: 8px 0; opacity: 0.8;">$1</blockquote>') // Quote
    .replace(/^# (.*$)/gm, '<h3 style="font-size: 1.2em; font-weight: bold; margin: 12px 0;">$1</h3>'); // Heading

  return { __html: formattedText };
};

export default function StoryCard({ story, showAuthor = true }: StoryCardProps) {
  const { theme } = useTheme();
  
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle both old and new category formats
  const categoryNames = story.categories?.map(cat => 
    typeof cat === 'string' ? cat : cat.name
  ) || [];

  return (
    <div className={`card group overflow-hidden ${
      theme === 'dark' ? 'bg-dark-800' : 'bg-white border border-gray-200'
    }`}>
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={story.cover_image || 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={story.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
        
        {/* Featured Badge */}
        {story.is_featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              ফিচার্ড
            </span>
          </div>
        )}

        {/* Category Tags */}
        <div className="absolute bottom-3 left-3">
          <div className="flex flex-wrap gap-1">
            {categoryNames.map((category, index) => (
              <span
                key={index}
                className="bg-dark-700/80 backdrop-blur-sm text-primary-400 text-xs px-2 py-1 rounded-full border border-primary-500/30"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Author Info */}
        {showAuthor && story.author && (
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={story.author.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'}
              alt={story.author.display_name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <Link
                to={`/author/${story.author.username}`}
                className={`text-sm transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-primary-400'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {story.author.display_name}
              </Link>
            </div>
          </div>
        )}

        {/* Title */}
        <Link to={`/story/${story.slug}`}>
          <h3 className={`text-xl font-semibold mb-4 transition-colors line-clamp-2 ${
            theme === 'dark'
              ? 'text-white group-hover:text-primary-400'
              : 'text-gray-900 group-hover:text-primary-600'
          }`}>
            {story.title}
          </h3>
        </Link>

        {/* Stats */}
        <div className={`flex items-center justify-between text-xs ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
        }`}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{story.parts?.length || 0} পর্ব</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{formatNumber(story.views)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-3 h-3" />
              <span>{story.comments}</span>
            </div>
          </div>
          <div className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
            {formatDate(story.published_date)}
          </div>
        </div>
      </div>

      {/* Read More Button */}
      <div className="px-6 pb-6">
        <Link
          to={`/story/${story.slug}`}
          className={`w-full font-medium py-2 px-4 rounded-lg transition-all duration-200 text-center block text-sm ${
            theme === 'dark'
              ? 'bg-dark-700 hover:bg-primary-500 text-gray-300 hover:text-white'
              : 'bg-gray-100 hover:bg-primary-500 text-gray-700 hover:text-white'
          }`}
        >
          বিস্তারিত দেখুন
        </Link>
      </div>
    </div>
  );
}