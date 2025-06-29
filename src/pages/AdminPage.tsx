import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload,
  Calendar,
  Eye,
  MessageCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { authors, stories, categories, Author, Story } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';

type Tab = 'stories' | 'authors' | 'create-story' | 'create-author';

export default function AdminPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('stories');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [storyForm, setStoryForm] = useState({
    title: '',
    slug: '',
    authorId: '',
    coverImage: '',
    categories: [] as string[],
    isFeatured: false,
    content: '',
    partsCount: 1,
    publishedDate: new Date().toISOString().split('T')[0]
  });

  const [authorForm, setAuthorForm] = useState({
    username: '',
    displayName: '',
    bio: '',
    avatar: '',
    joinedDate: new Date().toISOString().split('T')[0]
  });

  const tabs = [
    { id: 'stories' as Tab, label: 'গল্প পরিচালনা', icon: BookOpen },
    { id: 'authors' as Tab, label: 'লেখক পরিচালনা', icon: Users },
    { id: 'create-story' as Tab, label: 'নতুন গল্প', icon: Plus },
    { id: 'create-author' as Tab, label: 'নতুন লেখক', icon: Plus },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleDeleteStory = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই গল্পটি মুছে ফেলতে চান?')) {
      // In a real app, this would call an API
      console.log('Deleting story:', id);
    }
  };

  const handleDeleteAuthor = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই লেখককে মুছে ফেলতে চান?')) {
      // In a real app, this would call an API
      console.log('Deleting author:', id);
    }
  };

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log('Creating story:', storyForm);
    alert('গল্প সফলভাবে তৈরি হয়েছে!');
    setStoryForm({
      title: '',
      slug: '',
      authorId: '',
      coverImage: '',
      categories: [],
      isFeatured: false,
      content: '',
      partsCount: 1,
      publishedDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleCreateAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log('Creating author:', authorForm);
    alert('লেখক সফলভাবে তৈরি হয়েছে!');
    setAuthorForm({
      username: '',
      displayName: '',
      bio: '',
      avatar: '',
      joinedDate: new Date().toISOString().split('T')[0]
    });
  };

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            অ্যাডমিন ড্যাশবোর্ড
          </h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            গল্প এবং লেখক পরিচালনা করুন
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={`rounded-2xl p-6 mb-8 border transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-dark-800 border-dark-700' 
            : 'bg-white border-gray-200 shadow-lg'
        }`}>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white'
                      : theme === 'dark'
                      ? 'bg-dark-700 text-gray-300 hover:bg-primary-500/20'
                      : 'bg-gray-100 text-gray-700 hover:bg-primary-500/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className={`rounded-2xl p-6 border transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-dark-800 border-dark-700' 
            : 'bg-white border-gray-200 shadow-lg'
        }`}>
          {/* Manage Stories */}
          {activeTab === 'stories' && (
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                গল্প পরিচালনা
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${
                      theme === 'dark' ? 'border-dark-700' : 'border-gray-200'
                    }`}>
                      <th className={`text-left py-3 font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>শিরোনাম</th>
                      <th className={`text-left py-3 font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>লেখক</th>
                      <th className={`text-left py-3 font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>ফিচার্ড</th>
                      <th className={`text-left py-3 font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>ক্যাটেগরি</th>
                      <th className={`text-left py-3 font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>প্রকাশিত</th>
                      <th className={`text-left py-3 font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>দেখা</th>
                      <th className={`text-left py-3 font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stories.map((story) => (
                      <tr key={story.id} className={`border-b ${
                        theme === 'dark' ? 'border-dark-700/50' : 'border-gray-100'
                      }`}>
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={story.coverImage}
                              alt={story.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className={`font-medium ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {story.title}
                              </p>
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {story.parts.length} পর্ব
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={`py-4 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {story.author.displayName}
                        </td>
                        <td className="py-4">
                          {story.isFeatured ? (
                            <ToggleRight className="w-5 h-5 text-primary-500" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-gray-400" />
                          )}
                        </td>
                        <td className="py-4">
                          <div className="flex flex-wrap gap-1">
                            {story.categories.map((cat, idx) => (
                              <span
                                key={idx}
                                className="bg-primary-500/20 text-primary-400 text-xs px-2 py-1 rounded"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className={`py-4 text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {new Date(story.publishedDate).toLocaleDateString('bn-BD')}
                        </td>
                        <td className={`py-4 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {formatNumber(story.views)}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setEditingItem(story)}
                              className={`p-2 rounded-lg transition-colors ${
                                theme === 'dark'
                                  ? 'bg-dark-600 hover:bg-primary-500 text-gray-300 hover:text-white'
                                  : 'bg-gray-200 hover:bg-primary-500 text-gray-700 hover:text-white'
                              }`}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStory(story.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                theme === 'dark'
                                  ? 'bg-dark-600 hover:bg-red-500 text-gray-300 hover:text-white'
                                  : 'bg-gray-200 hover:bg-red-500 text-gray-700 hover:text-white'
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Manage Authors */}
          {activeTab === 'authors' && (
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                লেখক পরিচালনা
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${
                      theme === 'dark' ? 'border-dark-700' : 'border-gray-200'
                    }`}>
                      <th className={`text-left py-3 font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>লেখক</th>
                      <th className={`text-left py-3 font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>গল্প সংখ্যা</th>
                      <th className={`text-left py-3 font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>মোট পড়া</th>
                      <th className={`text-left py-3 font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>যুক্ত হয়েছেন</th>
                      <th className={`text-left py-3 font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authors.map((author) => (
                      <tr key={author.id} className={`border-b ${
                        theme === 'dark' ? 'border-dark-700/50' : 'border-gray-100'
                      }`}>
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={author.avatar}
                              alt={author.displayName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className={`font-medium ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {author.displayName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={`py-4 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {author.storyCount}
                        </td>
                        <td className={`py-4 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {formatNumber(author.totalReads)}
                        </td>
                        <td className={`py-4 text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {new Date(author.joinedDate).toLocaleDateString('bn-BD')}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setEditingItem(author)}
                              className={`p-2 rounded-lg transition-colors ${
                                theme === 'dark'
                                  ? 'bg-dark-600 hover:bg-primary-500 text-gray-300 hover:text-white'
                                  : 'bg-gray-200 hover:bg-primary-500 text-gray-700 hover:text-white'
                              }`}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAuthor(author.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                theme === 'dark'
                                  ? 'bg-dark-600 hover:bg-red-500 text-gray-300 hover:text-white'
                                  : 'bg-gray-200 hover:bg-red-500 text-gray-700 hover:text-white'
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Create Story */}
          {activeTab === 'create-story' && (
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                নতুন গল্প তৈরি করুন
              </h2>
              
              <form onSubmit={handleCreateStory} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      গল্পের শিরোনাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={storyForm.title}
                      onChange={(e) => {
                        setStoryForm({
                          ...storyForm,
                          title: e.target.value,
                          slug: generateSlug(e.target.value)
                        });
                      }}
                      className={`input-field ${
                        theme === 'dark'
                          ? 'bg-dark-700 text-white placeholder-gray-400 border-dark-600'
                          : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                      }`}
                      placeholder="গল্পের শিরোনাম লিখুন"
                    />
                  </div>
                  
                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      স্লাগ *
                    </label>
                    <input
                      type="text"
                      required
                      value={storyForm.slug}
                      onChange={(e) => setStoryForm({ ...storyForm, slug: e.target.value })}
                      className={`input-field ${
                        theme === 'dark'
                          ? 'bg-dark-700 text-white placeholder-gray-400 border-dark-600'
                          : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                      }`}
                      placeholder="story-slug"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      লেখক *
                    </label>
                    <select
                      required
                      value={storyForm.authorId}
                      onChange={(e) => setStoryForm({ ...storyForm, authorId: e.target.value })}
                      className={`input-field ${
                        theme === 'dark'
                          ? 'bg-dark-700 text-white border-dark-600'
                          : 'bg-white text-gray-900 border-gray-300'
                      }`}
                    >
                      <option value="">লেখক নির্বাচন করুন</option>
                      {authors.map((author) => (
                        <option key={author.id} value={author.id}>
                          {author.displayName}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      কভার ইমেজ URL
                    </label>
                    <input
                      type="url"
                      value={storyForm.coverImage}
                      onChange={(e) => setStoryForm({ ...storyForm, coverImage: e.target.value })}
                      className={`input-field ${
                        theme === 'dark'
                          ? 'bg-dark-700 text-white placeholder-gray-400 border-dark-600'
                          : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                      }`}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    ক্যাটেগরি
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={storyForm.categories.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setStoryForm({
                                ...storyForm,
                                categories: [...storyForm.categories, category]
                              });
                            } else {
                              setStoryForm({
                                ...storyForm,
                                categories: storyForm.categories.filter(c => c !== category)
                              });
                            }
                          }}
                          className="rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500"
                        />
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      পর্ব সংখ্যা
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={storyForm.partsCount}
                      onChange={(e) => setStoryForm({ ...storyForm, partsCount: parseInt(e.target.value) })}
                      className={`input-field ${
                        theme === 'dark'
                          ? 'bg-dark-700 text-white border-dark-600'
                          : 'bg-white text-gray-900 border-gray-300'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      প্রকাশের তারিখ
                    </label>
                    <input
                      type="date"
                      value={storyForm.publishedDate}
                      onChange={(e) => setStoryForm({ ...storyForm, publishedDate: e.target.value })}
                      className={`input-field ${
                        theme === 'dark'
                          ? 'bg-dark-700 text-white border-dark-600'
                          : 'bg-white text-gray-900 border-gray-300'
                      }`}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-8">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={storyForm.isFeatured}
                      onChange={(e) => setStoryForm({ ...storyForm, isFeatured: e.target.checked })}
                      className="rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500"
                    />
                    <label htmlFor="featured" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      ফিচার্ড গল্প
                    </label>
                  </div>
                </div>

                <div>
                  <label className={`block font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    গল্পের বিষয়বস্তু *
                  </label>
                  <textarea
                    required
                    value={storyForm.content}
                    onChange={(e) => setStoryForm({ ...storyForm, content: e.target.value })}
                    className={`input-field h-64 resize-none ${
                      theme === 'dark'
                        ? 'bg-dark-700 text-white placeholder-gray-400 border-dark-600'
                        : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                    }`}
                    placeholder="এখানে গল্পের বিষয়বস্তু লিখুন..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setStoryForm({
                      title: '',
                      slug: '',
                      authorId: '',
                      coverImage: '',
                      categories: [],
                      isFeatured: false,
                      content: '',
                      partsCount: 1,
                      publishedDate: new Date().toISOString().split('T')[0]
                    })}
                    className={`px-6 py-3 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-dark-600 text-gray-300 hover:bg-dark-500'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    রিসেট
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>গল্প সংরক্ষণ করুন</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Create Author */}
          {activeTab === 'create-author' && (
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                নতুন লেখক তৈরি করুন
              </h2>
              
              <form onSubmit={handleCreateAuthor} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={authorForm.displayName}
                      onChange={(e) => setAuthorForm({ ...authorForm, displayName: e.target.value })}
                      className={`input-field ${
                        theme === 'dark'
                          ? 'bg-dark-700 text-white placeholder-gray-400 border-dark-600'
                          : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                      }`}
                      placeholder="লেখকের নাম"
                    />
                  </div>
                  
                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      ইউজারনেম *
                    </label>
                    <input
                      type="text"
                      required
                      value={authorForm.username}
                      onChange={(e) => setAuthorForm({ ...authorForm, username: e.target.value })}
                      className={`input-field ${
                        theme === 'dark'
                          ? 'bg-dark-700 text-white placeholder-gray-400 border-dark-600'
                          : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                      }`}
                      placeholder="username"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    জীবনী
                  </label>
                  <textarea
                    value={authorForm.bio}
                    onChange={(e) => setAuthorForm({ ...authorForm, bio: e.target.value })}
                    className={`input-field h-24 resize-none ${
                      theme === 'dark'
                        ? 'bg-dark-700 text-white placeholder-gray-400 border-dark-600'
                        : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                    }`}
                    placeholder="লেখকের সংক্ষিপ্ত জীবনী..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      প্রোফাইল ছবি URL
                    </label>
                    <input
                      type="url"
                      value={authorForm.avatar}
                      onChange={(e) => setAuthorForm({ ...authorForm, avatar: e.target.value })}
                      className={`input-field ${
                        theme === 'dark'
                          ? 'bg-dark-700 text-white placeholder-gray-400 border-dark-600'
                          : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                      }`}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  
                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      যোগদানের তারিখ
                    </label>
                    <input
                      type="date"
                      value={authorForm.joinedDate}
                      onChange={(e) => setAuthorForm({ ...authorForm, joinedDate: e.target.value })}
                      className={`input-field ${
                        theme === 'dark'
                          ? 'bg-dark-700 text-white border-dark-600'
                          : 'bg-white text-gray-900 border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setAuthorForm({
                      username: '',
                      displayName: '',
                      bio: '',
                      avatar: '',
                      joinedDate: new Date().toISOString().split('T')[0]
                    })}
                    className={`px-6 py-3 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-dark-600 text-gray-300 hover:bg-dark-500'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    রিসেট
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>লেখক সংরক্ষণ করুন</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}