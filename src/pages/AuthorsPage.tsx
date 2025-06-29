import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Eye, MessageCircle } from 'lucide-react';
import { useAuthors } from '../hooks/useAuthors';
import { useTheme } from '../contexts/ThemeContext';
import { formatNumber } from '../lib/supabase';

export default function AuthorsPage() {
  const { theme } = useTheme();
  const { authors } = useAuthors();

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            লেখক স্পটলাইট
          </h1>
          <p className={`text-lg max-w-3xl mx-auto ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            আমাদের প্রতিভাবান লেখকদের সাথে পরিচিত হন যারা অনন্য কাহিনী লিখে লক্ষ লক্ষ পাঠকের মন জয় করেছেন।
          </p>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {authors.map((author) => (
            <Link
              key={author.id}
              to={`/author/${author.username}`}
              className="group"
            >
              <div className={`card p-6 text-center group-hover:scale-105 transition-all duration-300 h-80 flex flex-col ${
                theme === 'dark' 
                  ? 'bg-dark-800' 
                  : 'bg-white border border-gray-200 shadow-lg hover:shadow-xl'
              }`}>
                {/* Profile Image */}
                <div className="relative mb-6">
                  <img
                    src={author.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'}
                    alt={author.display_name}
                    className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-primary-500/20 group-hover:ring-primary-500/40 transition-all duration-300"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center">
                    {author.story_count}
                  </div>
                </div>

                {/* Author Info - Fixed height container */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className={`text-xl font-semibold mb-6 transition-colors h-16 flex items-center justify-center ${
                      theme === 'dark'
                        ? 'text-white group-hover:text-primary-400'
                        : 'text-gray-900 group-hover:text-primary-600'
                    }`}>
                      <span className="line-clamp-2 text-center">
                        {author.display_name}
                      </span>
                    </h3>

                    {/* Stats */}
                    <div className="flex justify-center space-x-6 text-sm mb-4">
                      <div className="text-center">
                        <div className={`flex items-center justify-center space-x-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <BookOpen className="w-4 h-4" />
                          <span>{author.story_count}</span>
                        </div>
                        <p className={`text-xs mt-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}>গল্প</p>
                      </div>
                      
                      <div className="text-center">
                        <div className={`flex items-center justify-center space-x-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <Eye className="w-4 h-4" />
                          <span>{formatNumber(author.total_reads)}</span>
                        </div>
                        <p className={`text-xs mt-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}>পড়া</p>
                      </div>
                      
                      <div className="text-center">
                        <div className={`flex items-center justify-center space-x-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <MessageCircle className="w-4 h-4" />
                          <span>{author.total_comments}</span>
                        </div>
                        <p className={`text-xs mt-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}>মন্তব্য</p>
                      </div>
                    </div>
                  </div>

                  {/* Join Date - Always at bottom */}
                  <div className={`pt-4 border-t ${
                    theme === 'dark' ? 'border-dark-700' : 'border-gray-200'
                  }`}>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      যুক্ত হয়েছেন {new Date(author.joined_date).toLocaleDateString('bn-BD', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-16">
          <button className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5">
            আরো দেখুন
          </button>
        </div>
      </div>
    </div>
  );
}