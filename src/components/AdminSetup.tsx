import React, { useState } from 'react';
import { AlertCircle, CheckCircle, User, Mail } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface AdminSetupProps {
  onSetupComplete: () => void;
}

export default function AdminSetup({ onSetupComplete }: AdminSetupProps) {
  const { theme } = useTheme();
  const [step, setStep] = useState(1);

  const steps = [
    {
      title: 'Supabase সংযোগ',
      description: 'প্রথমে "Connect to Supabase" বাটনে ক্লিক করুন',
      icon: <AlertCircle className="w-6 h-6" />,
    },
    {
      title: 'অ্যাডমিন ইউজার তৈরি',
      description: 'Supabase Auth এ একটি ইউজার তৈরি করুন',
      icon: <User className="w-6 h-6" />,
    },
    {
      title: 'অ্যাডমিন অ্যাক্সেস',
      description: 'ইউজারকে অ্যাডমিন হিসেবে যোগ করুন',
      icon: <Mail className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className={`rounded-2xl p-8 border ${
          theme === 'dark' 
            ? 'bg-dark-800 border-dark-700' 
            : 'bg-white border-gray-200 shadow-lg'
        }`}>
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              অ্যাডমিন সেটআপ
            </h1>
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              অ্যাডমিন ড্যাশবোর্ড ব্যবহার করার জন্য নিচের ধাপগুলো অনুসরণ করুন
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((stepItem, index) => (
              <div
                key={index}
                className={`flex items-start space-x-4 p-4 rounded-lg border ${
                  step > index + 1
                    ? theme === 'dark'
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-green-50 border-green-200'
                    : step === index + 1
                    ? theme === 'dark'
                      ? 'bg-primary-500/10 border-primary-500/20'
                      : 'bg-primary-50 border-primary-200'
                    : theme === 'dark'
                    ? 'bg-dark-700 border-dark-600'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  step > index + 1
                    ? 'bg-green-500 text-white'
                    : step === index + 1
                    ? 'bg-primary-500 text-white'
                    : theme === 'dark'
                    ? 'bg-dark-600 text-gray-400'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > index + 1 ? <CheckCircle className="w-6 h-6" /> : stepItem.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {index + 1}. {stepItem.title}
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {stepItem.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <div className={`p-4 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-dark-700 border-dark-600' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <h4 className={`font-medium mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                বিস্তারিত নির্দেশনা:
              </h4>
              <ol className={`text-sm space-y-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <li>1. উপরের ডানদিকে "Connect to Supabase" বাটনে ক্লিক করুন</li>
                <li>2. Supabase প্রজেক্ট সেটআপ করুন এবং মাইগ্রেশন রান করুন</li>
                <li>3. Supabase Dashboard এ যান → Authentication → Users</li>
                <li>4. "Add user" ক্লিক করে admin@golpohub.com (পাসওয়ার্ড: admin123) দিয়ে ইউজার তৈরি করুন</li>
                <li>5. SQL Editor এ গিয়ে এই কমান্ড রান করুন:</li>
              </ol>
              
              <div className={`mt-3 p-3 rounded border font-mono text-xs ${
                theme === 'dark' 
                  ? 'bg-dark-800 border-dark-600 text-gray-300' 
                  : 'bg-gray-100 border-gray-300 text-gray-700'
              }`}>
                SELECT add_admin_user('admin@golpohub.com');
              </div>
            </div>

            <button
              onClick={onSetupComplete}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
            >
              সেটআপ সম্পন্ন, লগইন পেজে যান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}