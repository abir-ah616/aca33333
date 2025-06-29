import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigation = [
    { name: 'Home', path: '/', label: 'হোম' },
    { name: 'Authors', path: '/authors', label: 'লেখকগণ' },
    { name: 'Series', path: '/series', label: 'সিরিজ' },
  ];

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-dark-950/90 border-dark-800'
        : 'bg-white/90 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-bold">
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>গল্প</span>
              <span className="text-primary-500 bg-primary-500/10 px-2 py-1 rounded-md ml-1 group-hover:bg-primary-500/20 transition-colors">
                Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-primary-500'
                    : theme === 'dark'
                    ? 'text-gray-300 hover:text-primary-400'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 w-64 rounded-lg border focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-dark-800 text-white placeholder-gray-400 border-dark-600'
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300'
                }`}
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-dark-800 text-gray-300 hover:text-primary-400'
                  : 'bg-gray-100 text-gray-600 hover:text-primary-600'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-dark-800 text-gray-300 hover:text-primary-400'
                  : 'bg-gray-100 text-gray-600 hover:text-primary-600'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-dark-800 text-gray-300 hover:text-primary-400'
                  : 'bg-gray-100 text-gray-600 hover:text-primary-600'
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 border-t ${
            theme === 'dark' ? 'border-dark-800' : 'border-gray-200'
          }`}>
            <div className="space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-2 w-full rounded-lg border focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-dark-800 text-white placeholder-gray-400 border-dark-600'
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300'
                  }`}
                />
              </div>

              {/* Mobile Nav Links */}
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'text-primary-500 bg-primary-500/10'
                        : theme === 'dark'
                        ? 'text-gray-300 hover:text-primary-400 hover:bg-dark-800'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}