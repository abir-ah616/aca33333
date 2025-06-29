import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Heart, Star, TrendingUp, Award, Eye, ArrowRight, Sparkles } from 'lucide-react';
import StoryCarousel from '../components/StoryCarousel';
import StoryCard from '../components/StoryCard';
import { useStories } from '../hooks/useStories';
import { useAuthors } from '../hooks/useAuthors';
import { useTheme } from '../contexts/ThemeContext';

export default function HomePage() {
  const { theme } = useTheme();
  const { stories } = useStories();
  const { authors } = useAuthors();
  
  const latestStories = stories.slice(0, 6);
  const topAuthors = authors.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Completely Redesigned */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, ${theme === 'dark' ? '#F59E0B' : '#F59E0B'} 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-primary-500/10 text-primary-600 px-4 py-2 rounded-full border border-primary-500/20">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">বাংলা গল্পের নতুন ঠিকানা</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    মন ছুঁয়ে যাওয়া
                  </span>
                  <span className="block text-primary-500 relative">
                    গল্পের জগত
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-300 rounded-full transform scale-x-0 animate-[scaleX_1s_ease-out_0.5s_forwards] origin-left" />
                  </span>
                </h1>
                
                <p className={`text-lg md:text-xl leading-relaxed max-w-lg ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  আবিষ্কার করুন অসাধারণ সব গল্প, যুক্ত হন প্রতিভাবান লেখকদের সাথে এবং নিজের কল্পনার জগতকে ভাগ করে নিন সবার সাথে।
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://fb.com/mahean"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl group"
                >
                  <BookOpen className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>গল্প লিখুন</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <Link
                  to="/series"
                  className={`inline-flex items-center justify-center space-x-2 font-semibold px-8 py-4 rounded-xl transition-all duration-200 transform hover:-translate-y-1 border-2 ${
                    theme === 'dark'
                      ? 'border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white'
                      : 'border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>গল্প পড়ুন</span>
                </Link>
              </div>
            </div>

            {/* Right Content - Story Carousel - Perfectly Centered with proper spacing */}
            <div className="flex items-center justify-center pt-8">
              <div className="relative w-full max-w-lg">
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/10 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-500/5 rounded-full blur-xl" />
                
                {/* Carousel Container - Centered with proper spacing */}
                <div className="relative">
                  <StoryCarousel />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-10 w-4 h-4 bg-primary-500/30 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-32 w-2 h-2 bg-primary-500/50 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-10 w-3 h-3 bg-primary-500/40 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
      </section>

      {/* Featured Stories Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 text-primary-600 px-4 py-2 rounded-full border border-primary-500/20 mb-6">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">জনপ্রিয় গল্প</span>
            </div>
            
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              আলোচিত গল্পগুলো
            </h2>
            <p className={`max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              আমাদের সেরা এবং সবচেয়ে জনপ্রিয় গল্পগুলো আবিষ্কার করুন যা সারা পৃথিবীর পাঠকদের মন জয় করেছে।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/series"
              className="inline-flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <span>সব গল্প দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className={`py-20 px-4 ${
        theme === 'dark' ? 'bg-dark-900/50' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 text-primary-600 px-4 py-2 rounded-full border border-primary-500/20 mb-6">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">কেন আমাদের সাথে</span>
            </div>
            
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              কেন Golpo Hub এ যুক্ত হবেন?
            </h2>
            <p className={`max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Golpo Hub এ যুক্ত হয়ে আবিষ্কার করুন অসীম সম্ভাবনার জগত, যেখানে প্রতিটি গল্প একটি নতুন অভিজ্ঞতা।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* For Readers */}
            <div className={`rounded-2xl p-8 backdrop-blur-sm border transition-all duration-300 hover:shadow-xl ${
              theme === 'dark' 
                ? 'bg-dark-800/50 border-dark-700 hover:bg-dark-800/70' 
                : 'bg-white border-gray-200 shadow-lg hover:shadow-2xl'
            }`}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-full bg-primary-500/20">
                  <BookOpen className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className={`text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  পাঠকদের জন্য
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className={`font-medium mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      বিশাল গল্পের ভান্ডার
                    </h4>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      হাজারো গল্প পড়ুন বিভিন্ন ক্যাটেগরি থেকে এবং উপভোগ করুন অসাধারণ সব কাহিনী।
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className={`font-medium mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      নতুন আবিষ্কার
                    </h4>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      প্রতিদিন নতুন গল্প এবং লেখকের সাথে পরিচিত হন এবং গড়ে তুলুন নতুন বন্ধুত্ব।
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/series"
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 text-center block"
                >
                  গল্প পড়া শুরু করুন
                </Link>
              </div>
            </div>

            {/* For Writers */}
            <div className={`rounded-2xl p-8 backdrop-blur-sm border transition-all duration-300 hover:shadow-xl ${
              theme === 'dark' 
                ? 'bg-dark-800/50 border-dark-700 hover:bg-dark-800/70' 
                : 'bg-white border-gray-200 shadow-lg hover:shadow-2xl'
            }`}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-full bg-primary-500/20">
                  <Users className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className={`text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  লেখকদের জন্য
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className={`font-medium mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      বিশ্বস্ত পাঠক
                    </h4>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      আপনার গল্প পৌঁছে দিন হাজারো পাঠকের কাছে এবং পান তাৎক্ষণিক প্রতিক্রিয়া।
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className={`font-medium mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      সম্প্রদায়ের সহায়তা
                    </h4>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      অন্যান্য লেখক এবং পাঠকদের সাথে যুক্ত হয়ে উন্নত করুন আপনার লেখার দক্ষতা।
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="https://fb.com/mahean"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full font-medium py-3 px-6 rounded-lg transition-all duration-200 text-center block border-2 ${
                    theme === 'dark'
                      ? 'border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white'
                      : 'border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white'
                  }`}
                >
                  আজই লেখা শুরু করুন
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Authors Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 text-primary-600 px-4 py-2 rounded-full border border-primary-500/20 mb-6">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">প্রতিভাবান লেখক</span>
            </div>
            
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              লেখক স্পটলাইট
            </h2>
            <p className={`max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              আমাদের প্রতিভাবান লেখকদের সাথে পরিচিত হন যারা অনন্য কাহিনী লিখে লক্ষ লক্ষ পাঠকের মন জয় করেছেন।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topAuthors.map((author) => (
              <Link
                key={author.id}
                to={`/author/${author.username}`}
                className="group"
              >
                <div className={`rounded-2xl p-6 text-center transition-all duration-300 transform hover:-translate-y-2 border h-64 flex flex-col ${
                  theme === 'dark'
                    ? 'bg-dark-800 hover:bg-dark-700 border-dark-700'
                    : 'bg-white hover:bg-gray-50 border-gray-200 shadow-lg hover:shadow-xl'
                }`}>
                  <div className="relative mb-4">
                    <img
                      src={author.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'}
                      alt={author.display_name}
                      className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-primary-500/20 group-hover:ring-primary-500/40 transition-all duration-300"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className={`font-semibold mb-3 transition-colors h-12 flex items-center justify-center ${
                        theme === 'dark'
                          ? 'text-white group-hover:text-primary-400'
                          : 'text-gray-900 group-hover:text-primary-600'
                      }`}>
                        <span className="line-clamp-2 text-center">
                          {author.display_name}
                        </span>
                      </h3>
                      
                      <div className={`flex justify-center space-x-4 text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{author.story_count}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{(author.total_reads / 1000).toFixed(0)}k</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/authors"
              className={`inline-flex items-center space-x-2 font-semibold px-8 py-3 rounded-lg transition-all duration-200 border-2 ${
                theme === 'dark'
                  ? 'border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white'
                  : 'border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white'
              }`}
            >
              <span>আরো লেখক দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}