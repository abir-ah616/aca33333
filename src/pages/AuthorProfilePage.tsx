import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Eye, MessageCircle, Calendar, ArrowLeft } from 'lucide-react';
import { useAuthors } from '../hooks/useAuthors';
import { useStories } from '../hooks/useStories';
import StoryCard from '../components/StoryCard';
import { useTheme } from '../contexts/ThemeContext';
import { formatNumber } from '../lib/supabase';

export default function AuthorProfilePage() {
  const { theme } = useTheme();
  const { username } = useParams<{ username: string }>();
  const { getAuthorByUsername } = useAuthors();
  const { getStoriesByAuthor } = useStories();
  
  const author = username ? getAuthorByUsername(username) : null;
  const authorStories = username ? getStoriesByAuthor(username) : [];

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            লেখক পাওয়া যায়নি
          </h1>
          <p className={`mb-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            দুঃখিত, এই লেখকের প্রোফাইল খুঁজে পাওয়া যায়নি।
          </p>
          <Link
            to="/authors"
            className="btn-primary"
          >
            সব লেখক দেখুন
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/authors"
          className={`inline-flex items-center space-x-2 transition-colors mb-8 ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-primary-400'
              : 'text-gray-600 hover:text-primary-600'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সব লেখকে ফিরে যান</span>
        </Link>

        {/* Author Profile Header */}
        <div className={`rounded-2xl p-8 mb-12 border transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-dark-800 border-dark-700' 
            : 'bg-white border-gray-200 shadow-lg'
        }`}>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Image */}
            <img
              src={author.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'}
              alt={author.display_name}
              className="w-32 h-32 rounded-full object-cover ring-4 ring-primary-500/20"
            />

            {/* Author Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {author.display_name}
              </h1>
              <p className="text-primary-400 text-lg mb-4">
                @{author.username}
              </p>
              
              {author.bio && (
                <p className={`text-lg mb-6 max-w-2xl ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {author.bio}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-8 mb-6">
                <div className="text-center">
                  <div className={`flex items-center justify-center space-x-2 text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <BookOpen className="w-6 h-6 text-primary-500" />
                    <span>{author.story_count}</span>
                  </div>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>মোট গল্প</p>
                </div>
                
                <div className="text-center">
                  <div className={`flex items-center justify-center space-x-2 text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Eye className="w-6 h-6 text-primary-500" />
                    <span>{formatNumber(author.total_reads)}</span>
                  </div>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>মোট পড়া</p>
                </div>
                
                <div className="text-center">
                  <div className={`flex items-center justify-center space-x-2 text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <MessageCircle className="w-6 h-6 text-primary-500" />
                    <span>{author.total_comments}</span>
                  </div>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>মোট মন্তব্য</p>
                </div>
              </div>

              {/* Join Date */}
              <div className={`flex items-center justify-center md:justify-start space-x-2 text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                <Calendar className="w-4 h-4" />
                <span>
                  যুক্ত হয়েছেন {new Date(author.joined_date).toLocaleDateString('bn-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Author's Stories */}
        <div>
          <h2 className={`text-2xl md:text-3xl font-bold mb-8 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {author.display_name} এর গল্পসমূহ
          </h2>

          {authorStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {authorStories.map((story) => (
                <StoryCard key={story.id} story={story} showAuthor={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className={`text-xl font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                এখনো কোনো গল্প নেই
              </h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                এই লেখক এখনো কোনো গল্প প্রকাশ করেননি।
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}