import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, MessageCircle, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { useStories } from '../hooks/useStories';
import { useTheme } from '../contexts/ThemeContext';
import { formatNumber } from '../lib/supabase';

// Function to render formatted text
const renderFormattedText = (text: string) => {
  // Replace formatting markers with HTML
  let formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/~(.*?)~/g, '<span style="opacity: 0.7; color: #9CA3AF;">$1</span>') // Light text
    .replace(/^> (.*$)/gm, '<blockquote style="border-left: 3px solid #F59E0B; padding-left: 12px; margin: 16px 0; opacity: 0.8; font-style: italic;">$1</blockquote>') // Quote
    .replace(/^# (.*$)/gm, '<h3 style="font-size: 1.3em; font-weight: bold; margin: 20px 0 12px 0; color: #F59E0B;">$1</h3>') // Heading
    .replace(/\n/g, '<br>'); // Line breaks

  return { __html: formattedText };
};

export default function StoryPage() {
  const { theme } = useTheme();
  const { slug, partNumber } = useParams<{ slug: string; partNumber?: string }>();
  const { getStoryBySlug, incrementViews } = useStories();
  const [showPartsList, setShowPartsList] = useState(false);
  
  const story = slug ? getStoryBySlug(slug) : null;
  const currentPartNumber = partNumber ? parseInt(partNumber) : 1;
  const currentPart = story?.parts?.find(part => part.part_number === currentPartNumber);

  // Increment views when component mounts
  useEffect(() => {
    if (story && currentPart) {
      incrementViews(story.id, currentPart.id);
    }
  }, [story?.id, currentPart?.id]);

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            গল্প পাওয়া যায়নি
          </h1>
          <p className={`mb-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            দুঃখিত, এই গল্পটি খুঁজে পাওয়া যায়নি।
          </p>
          <Link to="/series" className="btn-primary">
            সব গল্প দেখুন
          </Link>
        </div>
      </div>
    );
  }

  if (!currentPart) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            পর্ব পাওয়া যায়নি
          </h1>
          <p className={`mb-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            এই গল্পের পর্ব {currentPartNumber} পাওয়া যায়নি।
          </p>
          <Link to={`/story/${story.slug}`} className="btn-primary">
            প্রথম পর্বে যান
          </Link>
        </div>
      </div>
    );
  }

  const nextPart = story.parts?.find(part => part.part_number === currentPartNumber + 1);
  const prevPart = story.parts?.find(part => part.part_number === currentPartNumber - 1);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/series"
          className={`inline-flex items-center space-x-2 transition-colors mb-8 ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-primary-400'
              : 'text-gray-600 hover:text-primary-600'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সব গল্পে ফিরে যান</span>
        </Link>

        {/* Story Header */}
        <div className={`rounded-2xl overflow-hidden mb-8 border transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-dark-800 border-dark-700' 
            : 'bg-white border-gray-200 shadow-lg'
        }`}>
          <div className="relative h-64 md:h-80">
            <img
              src={story.cover_image || 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400'}
              alt={story.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
            
            {/* Story Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="text-right">
                <div className="flex flex-wrap gap-2 mb-4">
                  {story.categories?.map((category, index) => {
                    const categoryName = typeof category === 'string' ? category : category.name;
                    return (
                      <span
                        key={index}
                        className="bg-primary-500/20 text-primary-400 text-sm px-3 py-1 rounded-full border border-primary-500/30"
                      >
                        {categoryName}
                      </span>
                    );
                  })}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {story.title}
                </h1>
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <Link
                      to={`/author/${story.author?.username}`}
                      className="flex items-center space-x-3 group"
                    >
                      <img
                        src={story.author?.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'}
                        alt={story.author?.display_name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/20 group-hover:ring-primary-500/40 transition-all duration-300"
                      />
                      <div>
                        <p className="text-white font-medium group-hover:text-primary-400 transition-colors">
                          {story.author?.display_name}
                        </p>
                        <p className="text-gray-400 text-sm">@{story.author?.username}</p>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-300">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(story.published_date).toLocaleDateString('bn-BD')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{formatNumber(story.views)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{story.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Part Navigation */}
        <div className={`rounded-2xl p-6 mb-8 border transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-dark-800 border-dark-700' 
            : 'bg-white border-gray-200 shadow-lg'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {currentPart.title} ({currentPartNumber}/{story.parts?.length || 0})
            </h2>
            
            <button
              onClick={() => setShowPartsList(!showPartsList)}
              className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>সব পর্ব</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showPartsList ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Parts List */}
          {showPartsList && (
            <div className={`border-t pt-4 ${
              theme === 'dark' ? 'border-dark-700' : 'border-gray-200'
            }`}>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                {story.parts?.map((part) => (
                  <Link
                    key={part.id}
                    to={`/story/${story.slug}/part/${part.part_number}`}
                    className={`p-2 rounded-lg text-center text-sm transition-colors ${
                      part.part_number === currentPartNumber
                        ? 'bg-primary-500 text-white'
                        : theme === 'dark'
                        ? 'bg-dark-700 text-gray-300 hover:bg-primary-500/20'
                        : 'bg-gray-100 text-gray-700 hover:bg-primary-500/10'
                    }`}
                  >
                    পর্ব {part.part_number}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Story Content */}
        <div className={`rounded-2xl p-8 mb-8 border transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-dark-800 border-dark-700' 
            : 'bg-white border-gray-200 shadow-lg'
        }`}>
          <div className="prose prose-lg max-w-none">
            <div 
              className={`leading-relaxed text-lg ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
              dangerouslySetInnerHTML={renderFormattedText(currentPart.content)}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className={`flex justify-between items-center rounded-2xl p-6 border transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-dark-800 border-dark-700' 
            : 'bg-white border-gray-200 shadow-lg'
        }`}>
          {prevPart ? (
            <Link
              to={`/story/${story.slug}/part/${prevPart.part_number}`}
              className={`flex items-center space-x-2 font-medium px-6 py-3 rounded-lg transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-dark-700 hover:bg-primary-500 text-gray-300 hover:text-white'
                  : 'bg-gray-100 hover:bg-primary-500 text-gray-700 hover:text-white'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>পূর্ববর্তী পর্ব</span>
            </Link>
          ) : (
            <div></div>
          )}

          {nextPart ? (
            <Link
              to={`/story/${story.slug}/part/${nextPart.part_number}`}
              className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200"
            >
              <span>পরবর্তী পর্ব</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              শেষ পর্ব
            </div>
          )}
        </div>

        {/* Story Stats */}
        <div className="mt-8 text-center">
          <div className={`inline-flex items-center space-x-6 px-6 py-3 rounded-lg border ${
            theme === 'dark' 
              ? 'bg-dark-800 border-dark-700' 
              : 'bg-white border-gray-200 shadow-lg'
          }`}>
            <div className={`flex items-center space-x-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <Eye className="w-4 h-4" />
              <span className="text-sm">{formatNumber(currentPart.views)} পড়া</span>
            </div>
            <div className={`flex items-center space-x-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(currentPart.published_date).toLocaleDateString('bn-BD')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}