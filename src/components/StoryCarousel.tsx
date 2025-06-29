import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStories } from '../hooks/useStories';
import { useTheme } from '../contexts/ThemeContext';

export default function StoryCarousel() {
  const { theme } = useTheme();
  const { getFeaturedStories } = useStories();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const featuredStories = getFeaturedStories();

  // Auto-play functionality
  useEffect(() => {
    if (featuredStories.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredStories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredStories.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredStories.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredStories.length) % featuredStories.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Only show if there are featured stories
  if (featuredStories.length === 0) {
    return (
      <div className={`h-full rounded-2xl flex items-center justify-center ${
        theme === 'dark' ? 'bg-dark-800' : 'bg-gray-100'
      }`}>
        <p className={`text-center ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          কোনো ফিচার্ড গল্প নেই
        </p>
      </div>
    );
  }

  const currentStory = featuredStories[currentSlide];

  return (
    <div className="relative w-full h-full max-w-2xl mx-auto">
      {/* Main Carousel Container - Landscape Format */}
      <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl group">
        {/* Background Image - Full Container */}
        <div className="absolute inset-0">
          <img
            src={currentStory.cover_image || 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={currentStory.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 opacity-0 group-hover:opacity-100"
          aria-label="Previous story"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 opacity-0 group-hover:opacity-100"
          aria-label="Next story"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Content Overlay - Positioned on Image */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
          {/* Top Section - Logo */}
          <div className="flex justify-end">
            <div className="text-lg font-bold">
              <span className="text-white">গল্প</span>
              <span className="text-primary-500 bg-primary-500/20 px-2 py-1 rounded-md ml-1">Hub</span>
            </div>
          </div>

          {/* Bottom Section - Story Info */}
          <div className="space-y-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {currentStory.categories?.slice(0, 3).map((category, index) => {
                const categoryName = typeof category === 'string' ? category : category.name;
                return (
                  <span
                    key={index}
                    className="bg-primary-500/20 text-primary-400 text-sm px-3 py-1 rounded-full border border-primary-500/30 backdrop-blur-sm"
                  >
                    {categoryName}
                  </span>
                );
              })}
            </div>

            {/* Story Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {currentStory.title}
            </h2>

            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={currentStory.author?.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'}
                  alt={currentStory.author?.display_name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                />
                <div>
                  <p className="text-sm text-gray-300">by</p>
                  <Link
                    to={`/author/${currentStory.author?.username}`}
                    className="font-medium text-white hover:text-primary-400 transition-colors"
                  >
                    {currentStory.author?.display_name}
                  </Link>
                </div>
              </div>

              {/* Read Button */}
              <Link
                to={`/story/${currentStory.slug}`}
                className="inline-flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
              >
                <Play className="w-4 h-4" />
                <span>বিস্তারিত দেখুন</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Slider with Dots - Below the carousel with proper spacing */}
      <div className="mt-8 flex items-center justify-center space-x-3">
        {featuredStories.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative transition-all duration-300 ${
              index === currentSlide ? 'w-8' : 'w-3'
            } h-3 rounded-full overflow-hidden`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {/* Background */}
            <div className={`absolute inset-0 rounded-full ${
              theme === 'dark' ? 'bg-dark-600' : 'bg-gray-300'
            }`} />
            
            {/* Active indicator */}
            <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-primary-500 scale-100' 
                : 'bg-transparent scale-0'
            }`} />
            
            {/* Progress bar for current slide */}
            {index === currentSlide && (
              <div 
                className="absolute inset-0 bg-primary-600 rounded-full origin-left"
                style={{
                  animation: 'scaleX 5s linear infinite',
                  transformOrigin: 'left center'
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}