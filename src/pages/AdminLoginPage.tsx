import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import AdminSetup from '../components/AdminSetup';

export default function AdminLoginPage() {
  const { user, isAdmin, signIn } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState('admin@golpohub.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);

  // Redirect if already authenticated as admin
  if (user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Show setup instructions if requested
  if (showSetup) {
    return <AdminSetup onSetupComplete={() => setShowSetup(false)} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('ইমেইল বা পাসওয়ার্ড ভুল। অথবা অ্যাডমিন ইউজার তৈরি করা হয়নি।');
        } else {
          setError(error.message);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full ${
              theme === 'dark' ? 'bg-dark-800' : 'bg-gray-100'
            }`}>
              <Lock className="w-8 h-8 text-primary-500" />
            </div>
          </div>
          <h2 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            অ্যাডমিন লগইন
          </h2>
          <p className={`mt-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন
          </p>
        </div>

        {/* Login Form */}
        <div className={`rounded-2xl p-8 border ${
          theme === 'dark' 
            ? 'bg-dark-800 border-dark-700' 
            : 'bg-white border-gray-200 shadow-lg'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-start space-x-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-500 text-sm">{error}</p>
                  {error.includes('অ্যাডমিন ইউজার তৈরি') && (
                    <button
                      type="button"
                      onClick={() => setShowSetup(true)}
                      className="text-red-400 hover:text-red-300 text-xs underline mt-1"
                    >
                      সেটআপ নির্দেশনা দেখুন
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                ইমেইল
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
                    theme === 'dark'
                      ? 'bg-dark-700 text-white placeholder-gray-400 border-dark-600'
                      : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                  }`}
                  placeholder="আপনার ইমেইল ঠিকানা"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
                    theme === 'dark'
                      ? 'bg-dark-700 text-white placeholder-gray-400 border-dark-600'
                      : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                  }`}
                  placeholder="আপনার পাসওয়ার্ড"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <span>লগইন হচ্ছে...</span>
                </div>
              ) : (
                'লগইন করুন'
              )}
            </button>
          </form>

          {/* Setup Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowSetup(true)}
              className={`inline-flex items-center space-x-2 text-sm transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-primary-400'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>সেটআপ নির্দেশনা</span>
            </button>
          </div>

          {/* Demo Credentials */}
          <div className={`mt-6 p-4 rounded-lg border ${
            theme === 'dark' 
              ? 'bg-dark-700 border-dark-600' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <p className={`text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              ডিফল্ট অ্যাডমিন অ্যাকাউন্ট:
            </p>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              ইমেইল: admin@golpohub.com<br />
              পাসওয়ার্ড: admin123
            </p>
            <p className={`text-xs mt-2 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              * প্রথমে Supabase এ ইউজার তৈরি করতে হবে
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}