import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Mail } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer className={`border-t mt-20 transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-dark-900 border-dark-800' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-xl font-bold">
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>গল্প</span>
                <span className="text-primary-500 bg-primary-500/10 px-2 py-1 rounded-md ml-1">
                  Hub
                </span>
              </div>
            </div>
            <p className={`text-sm mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              প্রতিটি বাঙালী পাঠকের হৃদয় ছুঁয়ে যাওয়া গল্পের সংগ্রহ। আমার সাহিত্য আপনার স্বপ্নের জগত, অনুভূতিগুলো এবং ভাবনার দীপিত করুন।
            </p>
            <div className="flex space-x-3">
              <a href="#" className={`transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-primary-500' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}>
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className={`transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-primary-500' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}>
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className={`transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-primary-500' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}>
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className={`text-sm transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-primary-500' 
                    : 'text-gray-600 hover:text-primary-600'
                }`}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className={`text-sm transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-primary-500' 
                    : 'text-gray-600 hover:text-primary-600'
                }`}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className={`text-sm transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-primary-500' 
                    : 'text-gray-600 hover:text-primary-600'
                }`}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className={`text-sm transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-primary-500' 
                    : 'text-gray-600 hover:text-primary-600'
                }`}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className={`font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className={`text-sm transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-primary-500' 
                    : 'text-gray-600 hover:text-primary-600'
                }`}>
                  Fantasy
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-primary-500' 
                    : 'text-gray-600 hover:text-primary-600'
                }`}>
                  Science Fiction
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-primary-500' 
                    : 'text-gray-600 hover:text-primary-600'
                }`}>
                  Mystery
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-primary-500' 
                    : 'text-gray-600 hover:text-primary-600'
                }`}>
                  Romance
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-primary-500' 
                    : 'text-gray-600 hover:text-primary-600'
                }`}>
                  Horror
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-primary-500' 
                    : 'text-gray-600 hover:text-primary-600'
                }`}>
                  Historical
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className={`font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Stay Updated</h3>
            <p className={`text-sm mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Subscribe to our newsletter to receive the latest updates and featured stories
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className={`w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
                  theme === 'dark'
                    ? 'bg-dark-800 text-white placeholder-gray-400 border-dark-600'
                    : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                }`}
              />
              <button className="w-full btn-primary text-sm py-2">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className={`border-t mt-8 pt-8 text-center ${
          theme === 'dark' ? 'border-dark-800' : 'border-gray-200'
        }`}>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            © 2023 Golpo Hub - All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}