import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import StoryCard from '../components/StoryCard';
import { useStories } from '../hooks/useStories';
import { useTheme } from '../contexts/ThemeContext';

export default function SeriesPage() {
  const { theme } = useTheme();
  const { stories, categories } = useStories();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('latest'); // latest, popular, alphabetical

  // Filter and sort stories
  const filteredStories = stories
    .filter(story => {
      const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           story.author?.display_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || story.categories?.some(cat => cat.id === selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.views - a.views;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'latest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            সব গল্প
          </h1>
          <p className={`text-lg max-w-3xl mx-auto ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            আমাদের বিশাল গল্পের সংগ্রহ থেকে আপনার পছন্দের গল্প খুঁজে নিন।
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className={`rounded-2xl p-6 mb-12 border transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-dark-800 border-dark-700' 
            : 'bg-white border-gray-200 shadow-lg'
        }`}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="গল্প বা লেখকের নাম খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
                  theme === 'dark'
                    ? 'bg-dark-700 text-white placeholder-gray-400 border-dark-600'
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300'
                }`}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 min-w-[200px] ${
                  theme === 'dark'
                    ? 'bg-dark-700 text-white border-dark-600'
                    : 'bg-gray-100 text-gray-900 border-gray-300'
                }`}
              >
                <option value="">সব ক্যাটেগরি</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-3 rounded-lg border transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 min-w-[150px] ${
                theme === 'dark'
                  ? 'bg-dark-700 text-white border-dark-600'
                  : 'bg-gray-100 text-gray-900 border-gray-300'
              }`}
            >
              <option value="latest">সর্বশেষ</option>
              <option value="popular">জনপ্রিয়</option>
              <option value="alphabetical">বর্ণমালা</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-8">
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            {filteredStories.length} টি গল্প পাওয়া গেছে
            {selectedCategory && ` "${categories.find(c => c.id === selectedCategory)?.name}" ক্যাটেগরিতে`}
            {searchQuery && ` "${searchQuery}" খোঁজার জন্য`}
          </p>

          {/* Clear Filters */}
          {(searchQuery || selectedCategory) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
              }}
              className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
            >
              ফিল্টার সাফ করুন
            </button>
          )}
        </div>

        {/* Stories Grid */}
        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              কোনো গল্প পাওয়া যায়নি
            </h3>
            <p className={`mb-6 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              অন্য কীওয়ার্ড বা ক্যাটেগরি দিয়ে চেষ্টা করুন।
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
              }}
              className="btn-primary"
            >
              সব গল্প দেখুন
            </button>
          </div>
        )}

        {/* Load More Button */}
        {filteredStories.length > 0 && (
          <div className="text-center mt-16">
            <button className={`font-medium px-8 py-3 rounded-lg transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-dark-700 hover:bg-primary-500 text-gray-300 hover:text-white'
                : 'bg-gray-100 hover:bg-primary-500 text-gray-700 hover:text-white'
            }`}>
              আরো লোড করুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
}