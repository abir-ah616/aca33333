import React, { useState, useEffect } from 'react';
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
  ToggleRight,
  ChevronDown,
  ChevronUp,
  LogOut,
  BarChart3,
  TrendingUp,
  Award,
  Hash,
  Bold,
  Italic,
  Quote,
  Type,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useStories } from '../hooks/useStories';
import { useAuthors } from '../hooks/useAuthors';
import { useTheme } from '../contexts/ThemeContext';
import { formatNumber } from '../lib/supabase';

type Tab = 'overview' | 'stories' | 'authors' | 'categories' | 'create-story' | 'create-author';

interface StoryFormData {
  title: string;
  slug: string;
  author_id: string;
  cover_image: string;
  categories: string[];
  is_featured: boolean;
  parts: { title: string; content: string }[];
}

interface AuthorFormData {
  username: string;
  display_name: string;
  bio: string;
  avatar: string;
}

export default function AdminDashboard() {
  const { theme } = useTheme();
  const { signOut } = useAuth();
  const { 
    stories, 
    categories, 
    loading: storiesLoading, 
    createStory, 
    updateStory, 
    deleteStory,
    createStoryPart,
    updateStoryPart,
    deleteStoryPart,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchStories
  } = useStories();
  const { 
    authors, 
    loading: authorsLoading, 
    createAuthor, 
    updateAuthor, 
    deleteAuthor 
  } = useAuthors();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [editingStory, setEditingStory] = useState<any>(null);
  const [editingAuthor, setEditingAuthor] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [expandedParts, setExpandedParts] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [storyForm, setStoryForm] = useState<StoryFormData>({
    title: '',
    slug: '',
    author_id: '',
    cover_image: '',
    categories: [],
    is_featured: false,
    parts: [{ title: 'Part 1', content: '' }]
  });

  const [authorForm, setAuthorForm] = useState<AuthorFormData>({
    username: '',
    display_name: '',
    bio: '',
    avatar: ''
  });

  const [categoryForm, setCategoryForm] = useState({
    name: ''
  });

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: BarChart3 },
    { id: 'stories' as Tab, label: 'Manage Stories', icon: BookOpen },
    { id: 'authors' as Tab, label: 'Manage Authors', icon: Users },
    { id: 'categories' as Tab, label: 'Manage Categories', icon: Hash },
    { id: 'create-story' as Tab, label: 'Create Story', icon: Plus },
    { id: 'create-author' as Tab, label: 'Create Author', icon: Plus },
  ];

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  // Text formatting functions
  const insertFormatting = (format: string, textarea: HTMLTextAreaElement) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let replacement = '';

    switch (format) {
      case 'bold':
        replacement = selectedText ? `**${selectedText}**` : '**Bold Text**';
        break;
      case 'italic':
        replacement = selectedText ? `*${selectedText}*` : '*Italic Text*';
        break;
      case 'light':
        replacement = selectedText ? `~${selectedText}~` : '~Light Text~';
        break;
      case 'quote':
        replacement = selectedText ? `> ${selectedText}` : '> Quote Text';
        break;
      case 'heading':
        replacement = selectedText ? `# ${selectedText}` : '# Heading Text';
        break;
    }

    const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    textarea.value = newValue;
    
    // Update the form state
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
    
    // Set cursor position
    const newCursorPos = start + replacement.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
  };

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await createStory({
        title: storyForm.title,
        slug: storyForm.slug,
        author_id: storyForm.author_id,
        cover_image: storyForm.cover_image,
        is_featured: storyForm.is_featured,
        categoryIds: storyForm.categories,
        parts: storyForm.parts
      });

      if (error) {
        showMessage('error', error);
      } else {
        showMessage('success', 'Story created successfully!');
        setStoryForm({
          title: '',
          slug: '',
          author_id: '',
          cover_image: '',
          categories: [],
          is_featured: false,
          parts: [{ title: 'Part 1', content: '' }]
        });
        setActiveTab('stories');
      }
    } catch (err) {
      showMessage('error', 'Failed to create story');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;

    setLoading(true);
    try {
      const { error } = await updateStory(editingStory.id, {
        title: editingStory.title,
        slug: editingStory.slug,
        author_id: editingStory.author_id,
        cover_image: editingStory.cover_image,
        is_featured: editingStory.is_featured
      });

      if (error) {
        showMessage('error', error);
      } else {
        showMessage('success', 'Story updated successfully!');
        setEditingStory(null);
      }
    } catch (err) {
      showMessage('error', 'Failed to update story');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPart = async (storyId: string) => {
    if (!editingStory) return;

    setLoading(true);
    try {
      const newPartNumber = (editingStory.parts?.length || 0) + 1;
      const { error } = await createStoryPart(storyId, {
        title: `Part ${newPartNumber}`,
        content: '',
        part_number: newPartNumber
      });

      if (error) {
        showMessage('error', error);
      } else {
        showMessage('success', 'Part added successfully!');
        // Refresh the stories to get the updated parts
        await fetchStories();
        // Find the updated story
        const updatedStories = await fetchStories();
        const updatedStory = stories.find(s => s.id === storyId);
        if (updatedStory) {
          setEditingStory(updatedStory);
          // Expand the new part
          setExpandedParts(prev => new Set([...prev, newPartNumber - 1]));
        }
      }
    } catch (err) {
      showMessage('error', 'Failed to add part');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePart = async (partId: string, updates: any) => {
    setLoading(true);
    try {
      const { error } = await updateStoryPart(partId, updates);

      if (error) {
        showMessage('error', error);
      } else {
        showMessage('success', 'Part updated successfully!');
        // Refresh the editing story
        await fetchStories();
        const updatedStory = stories.find(s => s.id === editingStory?.id);
        if (updatedStory) {
          setEditingStory(updatedStory);
        }
      }
    } catch (err) {
      showMessage('error', 'Failed to update part');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePart = async (partId: string) => {
    if (!confirm('Are you sure you want to delete this part?')) return;

    setLoading(true);
    try {
      const { error } = await deleteStoryPart(partId);

      if (error) {
        showMessage('error', error);
      } else {
        showMessage('success', 'Part deleted successfully!');
        // Refresh the editing story
        await fetchStories();
        const updatedStory = stories.find(s => s.id === editingStory?.id);
        if (updatedStory) {
          setEditingStory(updatedStory);
        }
      }
    } catch (err) {
      showMessage('error', 'Failed to delete part');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await createAuthor(authorForm);

      if (error) {
        showMessage('error', error);
      } else {
        showMessage('success', 'Author created successfully!');
        setAuthorForm({
          username: '',
          display_name: '',
          bio: '',
          avatar: ''
        });
        setActiveTab('authors');
      }
    } catch (err) {
      showMessage('error', 'Failed to create author');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAuthor) return;

    setLoading(true);
    try {
      const { error } = await updateAuthor(editingAuthor.id, editingAuthor);

      if (error) {
        showMessage('error', error);
      } else {
        showMessage('success', 'Author updated successfully!');
        setEditingAuthor(null);
      }
    } catch (err) {
      showMessage('error', 'Failed to update author');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;

    setLoading(true);
    try {
      const { error } = await deleteStory(id);

      if (error) {
        showMessage('error', error);
      } else {
        showMessage('success', 'Story deleted successfully!');
      }
    } catch (err) {
      showMessage('error', 'Failed to delete story');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAuthor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this author?')) return;

    setLoading(true);
    try {
      const { error } = await deleteAuthor(id);

      if (error) {
        showMessage('error', error);
      } else {
        showMessage('success', 'Author deleted successfully!');
      }
    } catch (err) {
      showMessage('error', 'Failed to delete author');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await createCategory(categoryForm);

      if (error) {
        showMessage('error', error);
      } else {
        showMessage('success', 'Category created successfully!');
        setCategoryForm({ name: '' });
      }
    } catch (err) {
      showMessage('error', 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    setLoading(true);
    try {
      const { error } = await updateCategory(editingCategory.id, { name: editingCategory.name });

      if (error) {
        showMessage('error', error);
      } else {
        showMessage('success', 'Category updated successfully!');
        setEditingCategory(null);
      }
    } catch (err) {
      showMessage('error', 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    setLoading(true);
    try {
      const { error } = await deleteCategory(id);

      if (error) {
        showMessage('error', error);
      } else {
        showMessage('success', 'Category deleted successfully!');
      }
    } catch (err) {
      showMessage('error', 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const togglePartExpansion = (index: number) => {
    setExpandedParts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.author?.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAuthors = authors.filter(author =>
    author.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalViews = stories.reduce((sum, story) => sum + story.views, 0);
  const recentStories = stories.slice(0, 5);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Admin Dashboard
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Manage your stories, authors, and content
            </p>
          </div>
          
          <button
            onClick={signOut}
            className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors mt-4 sm:mt-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div className={`rounded-2xl p-4 mb-8 border transition-all duration-300 ${
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
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white'
                      : theme === 'dark'
                      ? 'bg-dark-700 text-gray-300 hover:bg-primary-500/20'
                      : 'bg-gray-100 text-gray-700 hover:bg-primary-500/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className={`rounded-2xl p-4 md:p-6 border transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-dark-800 border-dark-700' 
            : 'bg-white border-gray-200 shadow-lg'
        }`}>
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Dashboard Overview
              </h2>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-6 rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-dark-700 border-dark-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary-500/20">
                      <BookOpen className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {stories.length}
                      </p>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Total Stories
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-dark-700 border-dark-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary-500/20">
                      <Users className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {authors.length}
                      </p>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Total Authors
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-dark-700 border-dark-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary-500/20">
                      <Hash className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {categories.length}
                      </p>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Categories
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-dark-700 border-dark-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary-500/20">
                      <Eye className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {formatNumber(totalViews)}
                      </p>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Total Views
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Stories */}
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Recent Stories
                </h3>
                
                <div className="space-y-3">
                  {recentStories.map((story) => (
                    <div
                      key={story.id}
                      className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                        theme === 'dark' 
                          ? 'bg-dark-700 border-dark-600' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={story.cover_image || 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400'}
                          alt={story.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className={`font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {story.title}
                          </h4>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            by {story.author?.display_name} • {formatNumber(story.views)} views
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const updatedStory = { ...story, is_featured: !story.is_featured };
                            updateStory(story.id, updatedStory);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            story.is_featured
                              ? 'bg-primary-500 text-white'
                              : theme === 'dark'
                              ? 'bg-dark-600 text-gray-400 hover:bg-primary-500/20'
                              : 'bg-gray-200 text-gray-600 hover:bg-primary-500/10'
                          }`}
                          title={story.is_featured ? 'Remove from featured' : 'Add to featured'}
                        >
                          {story.is_featured ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        
                        <button
                          onClick={() => setEditingStory(story)}
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Manage Stories */}
          {activeTab === 'stories' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Manage Stories
                </h2>
                
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
                    theme === 'dark'
                      ? 'bg-dark-700 text-white placeholder-gray-400 border-dark-600'
                      : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                  }`}
                />
              </div>

              {/* Stories Grid */}
              <div className="grid grid-cols-1 gap-4">
                {filteredStories.map((story) => (
                  <div
                    key={story.id}
                    className={`p-4 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-dark-700 border-dark-600' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Story Info */}
                      <div className="flex items-center space-x-4 flex-1">
                        <img
                          src={story.cover_image || 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400'}
                          alt={story.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold truncate ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {story.title}
                          </h3>
                          <p className={`text-sm truncate ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            by {story.author?.display_name}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`text-xs ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              {story.parts?.length || 0} parts
                            </span>
                            <span className={`text-xs ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              {formatNumber(story.views)} views
                            </span>
                            {story.is_featured && (
                              <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const updatedStory = { ...story, is_featured: !story.is_featured };
                            updateStory(story.id, updatedStory);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            story.is_featured
                              ? 'bg-primary-500 text-white'
                              : theme === 'dark'
                              ? 'bg-dark-600 text-gray-400 hover:bg-primary-500/20'
                              : 'bg-gray-200 text-gray-600 hover:bg-primary-500/10'
                          }`}
                          title={story.is_featured ? 'Remove from featured' : 'Add to featured'}
                        >
                          {story.is_featured ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        
                        <button
                          onClick={() => setEditingStory(story)}
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manage Authors */}
          {activeTab === 'authors' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Manage Authors
                </h2>
                
                <input
                  type="text"
                  placeholder="Search authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
                    theme === 'dark'
                      ? 'bg-dark-700 text-white placeholder-gray-400 border-dark-600'
                      : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                  }`}
                />
              </div>

              {/* Authors Grid */}
              <div className="grid grid-cols-1 gap-4">
                {filteredAuthors.map((author) => (
                  <div
                    key={author.id}
                    className={`p-4 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-dark-700 border-dark-600' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={author.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'}
                          alt={author.display_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className={`font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {author.display_name}
                          </h3>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            @{author.username}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`text-xs ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              {author.story_count} stories
                            </span>
                            <span className={`text-xs ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              {formatNumber(author.total_reads)} reads
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingAuthor(author)}
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manage Categories */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Manage Categories
              </h2>

              {/* Create Category Form */}
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Category name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ name: e.target.value })}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
                      theme === 'dark'
                        ? 'bg-dark-700 text-white placeholder-gray-400 border-dark-600'
                        : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                    }`}
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200"
                  >
                    Add Category
                  </button>
                </div>
              </form>

              {/* Categories List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => {
                  const storyCount = stories.filter(story => 
                    story.categories?.some(cat => cat.id === category.id)
                  ).length;

                  return (
                    <div
                      key={category.id}
                      className={`p-4 rounded-lg border ${
                        theme === 'dark' 
                          ? 'bg-dark-700 border-dark-600' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {editingCategory?.id === category.id ? (
                        <form onSubmit={handleUpdateCategory} className="space-y-3">
                          <input
                            type="text"
                            value={editingCategory.name}
                            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                            className={`w-full px-3 py-2 rounded border ${
                              theme === 'dark'
                                ? 'bg-dark-600 text-white border-dark-500'
                                : 'bg-white text-gray-900 border-gray-300'
                            }`}
                            required
                          />
                          <div className="flex space-x-2">
                            <button
                              type="submit"
                              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-sm py-2 rounded"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCategory(null)}
                              className={`flex-1 text-sm py-2 rounded ${
                                theme === 'dark'
                                  ? 'bg-dark-600 text-gray-300 hover:bg-dark-500'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`font-medium ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {category.name}
                            </h3>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => setEditingCategory(category)}
                                className={`p-1 rounded transition-colors ${
                                  theme === 'dark'
                                    ? 'text-gray-400 hover:text-primary-400'
                                    : 'text-gray-600 hover:text-primary-600'
                                }`}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className={`p-1 rounded transition-colors ${
                                  theme === 'dark'
                                    ? 'text-gray-400 hover:text-red-400'
                                    : 'text-gray-600 hover:text-red-600'
                                }`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {storyCount} stories
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Create Story */}
          {activeTab === 'create-story' && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Create New Story
              </h2>
              
              <form onSubmit={handleCreateStory} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Story Title *
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
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
                        theme === 'dark'
                          ? 'bg-dark-700 text-white placeholder-gray-400 border-dark-600'
                          : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                      }`}
                      placeholder="Enter story title"
                    />
                  </div>
                  
                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={storyForm.slug}
                      onChange={(e) => setStoryForm({ ...storyForm, slug: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
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
                      Author *
                    </label>
                    <select
                      required
                      value={storyForm.author_id}
                      onChange={(e) => setStoryForm({ ...storyForm, author_id: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
                        theme === 'dark'
                          ? 'bg-dark-700 text-white border-dark-600'
                          : 'bg-white text-gray-900 border-gray-300'
                      }`}
                    >
                      <option value="">Select Author</option>
                      {authors.map((author) => (
                        <option key={author.id} value={author.id}>
                          {author.display_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={storyForm.cover_image}
                      onChange={(e) => setStoryForm({ ...storyForm, cover_image: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
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
                    Categories
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={storyForm.categories.includes(category.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setStoryForm({
                                ...storyForm,
                                categories: [...storyForm.categories, category.id]
                              });
                            } else {
                              setStoryForm({
                                ...storyForm,
                                categories: storyForm.categories.filter(c => c !== category.id)
                              });
                            }
                          }}
                          className="rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500"
                        />
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={storyForm.is_featured}
                    onChange={(e) => setStoryForm({ ...storyForm, is_featured: e.target.checked })}
                    className="rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500"
                  />
                  <label htmlFor="featured" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    Featured Story
                  </label>
                </div>

                {/* Story Parts */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className={`block font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Story Parts *
                    </label>
                    <button
                      type="button"
                      onClick={() => setStoryForm({
                        ...storyForm,
                        parts: [...storyForm.parts, { title: `Part ${storyForm.parts.length + 1}`, content: '' }]
                      })}
                      className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white text-sm px-4 py-2 rounded-lg transition-all duration-200"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Part</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {storyForm.parts.map((part, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg ${
                          theme === 'dark' ? 'border-dark-600' : 'border-gray-300'
                        }`}
                      >
                        <div
                          className={`flex items-center justify-between p-4 cursor-pointer ${
                            theme === 'dark' ? 'bg-dark-700' : 'bg-gray-50'
                          }`}
                          onClick={() => togglePartExpansion(index)}
                        >
                          <h4 className={`font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {part.title || `Part ${index + 1}`}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {storyForm.parts.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setStoryForm({
                                    ...storyForm,
                                    parts: storyForm.parts.filter((_, i) => i !== index)
                                  });
                                }}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                            {expandedParts.has(index) ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </div>
                        </div>

                        {expandedParts.has(index) && (
                          <div className="p-4 space-y-4">
                            <div>
                              <label className={`block text-sm font-medium mb-2 ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                Part Title
                              </label>
                              <input
                                type="text"
                                value={part.title}
                                onChange={(e) => {
                                  const newParts = [...storyForm.parts];
                                  newParts[index].title = e.target.value;
                                  setStoryForm({ ...storyForm, parts: newParts });
                                }}
                                className={`w-full px-3 py-2 rounded border ${
                                  theme === 'dark'
                                    ? 'bg-dark-600 text-white border-dark-500'
                                    : 'bg-white text-gray-900 border-gray-300'
                                }`}
                                placeholder={`Part ${index + 1}`}
                              />
                            </div>

                            <div>
                              <label className={`block text-sm font-medium mb-2 ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                Content
                              </label>
                              
                              {/* Formatting Toolbar */}
                              <div className={`flex flex-wrap gap-2 p-2 border rounded-t-lg ${
                                theme === 'dark' ? 'bg-dark-600 border-dark-500' : 'bg-gray-50 border-gray-300'
                              }`}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const textarea = document.getElementById(`content-${index}`) as HTMLTextAreaElement;
                                    if (textarea) insertFormatting('bold', textarea);
                                  }}
                                  className={`p-2 rounded transition-colors ${
                                    theme === 'dark'
                                      ? 'hover:bg-dark-500 text-gray-300'
                                      : 'hover:bg-gray-200 text-gray-700'
                                  }`}
                                  title="Bold (**text**)"
                                >
                                  <Bold className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const textarea = document.getElementById(`content-${index}`) as HTMLTextAreaElement;
                                    if (textarea) insertFormatting('italic', textarea);
                                  }}
                                  className={`p-2 rounded transition-colors ${
                                    theme === 'dark'
                                      ? 'hover:bg-dark-500 text-gray-300'
                                      : 'hover:bg-gray-200 text-gray-700'
                                  }`}
                                  title="Italic (*text*)"
                                >
                                  <Italic className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const textarea = document.getElementById(`content-${index}`) as HTMLTextAreaElement;
                                    if (textarea) insertFormatting('light', textarea);
                                  }}
                                  className={`p-2 rounded transition-colors ${
                                    theme === 'dark'
                                      ? 'hover:bg-dark-500 text-gray-300'
                                      : 'hover:bg-gray-200 text-gray-700'
                                  }`}
                                  title="Light Text (~text~)"
                                >
                                  <Lightbulb className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const textarea = document.getElementById(`content-${index}`) as HTMLTextAreaElement;
                                    if (textarea) insertFormatting('quote', textarea);
                                  }}
                                  className={`p-2 rounded transition-colors ${
                                    theme === 'dark'
                                      ? 'hover:bg-dark-500 text-gray-300'
                                      : 'hover:bg-gray-200 text-gray-700'
                                  }`}
                                  title="Quote (> text)"
                                >
                                  <Quote className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const textarea = document.getElementById(`content-${index}`) as HTMLTextAreaElement;
                                    if (textarea) insertFormatting('heading', textarea);
                                  }}
                                  className={`p-2 rounded transition-colors ${
                                    theme === 'dark'
                                      ? 'hover:bg-dark-500 text-gray-300'
                                      : 'hover:bg-gray-200 text-gray-700'
                                  }`}
                                  title="Heading (# text)"
                                >
                                  <Type className="w-4 h-4" />
                                </button>
                              </div>

                              <textarea
                                id={`content-${index}`}
                                value={part.content}
                                onChange={(e) => {
                                  const newParts = [...storyForm.parts];
                                  newParts[index].content = e.target.value;
                                  setStoryForm({ ...storyForm, parts: newParts });
                                }}
                                className={`w-full px-3 py-2 rounded-b-lg border-t-0 border resize-none h-64 ${
                                  theme === 'dark'
                                    ? 'bg-dark-600 text-white border-dark-500'
                                    : 'bg-white text-gray-900 border-gray-300'
                                }`}
                                placeholder="Write your story content here..."
                                required
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStoryForm({
                        title: '',
                        slug: '',
                        author_id: '',
                        cover_image: '',
                        categories: [],
                        is_featured: false,
                        parts: [{ title: 'Part 1', content: '' }]
                      });
                      setExpandedParts(new Set());
                    }}
                    className={`px-6 py-3 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-dark-600 text-gray-300 hover:bg-dark-500'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Creating...' : 'Create Story'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Create Author */}
          {activeTab === 'create-author' && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Create New Author
              </h2>
              
              <form onSubmit={handleCreateAuthor} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Display Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={authorForm.display_name}
                      onChange={(e) => setAuthorForm({ ...authorForm, display_name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
                        theme === 'dark'
                          ? 'bg-dark-700 text-white placeholder-gray-400 border-dark-600'
                          : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                      }`}
                      placeholder="Author's display name"
                    />
                  </div>
                  
                  <div>
                    <label className={`block font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={authorForm.username}
                      onChange={(e) => setAuthorForm({ ...authorForm, username: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
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
                    Bio
                  </label>
                  <textarea
                    value={authorForm.bio}
                    onChange={(e) => setAuthorForm({ ...authorForm, bio: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none h-24 ${
                      theme === 'dark'
                        ? 'bg-dark-700 text-white placeholder-gray-400 border-dark-600'
                        : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                    }`}
                    placeholder="Author's bio..."
                  />
                </div>

                <div>
                  <label className={`block font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={authorForm.avatar}
                    onChange={(e) => setAuthorForm({ ...authorForm, avatar: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${
                      theme === 'dark'
                        ? 'bg-dark-700 text-white placeholder-gray-400 border-dark-600'
                        : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                    }`}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setAuthorForm({
                      username: '',
                      display_name: '',
                      bio: '',
                      avatar: ''
                    })}
                    className={`px-6 py-3 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-dark-600 text-gray-300 hover:bg-dark-500'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Creating...' : 'Create Author'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Edit Story Modal */}
        {editingStory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border ${
              theme === 'dark' 
                ? 'bg-dark-800 border-dark-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Edit Story
                  </h3>
                  <button
                    onClick={() => setEditingStory(null)}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-dark-700 text-gray-400'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateStory} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Title
                      </label>
                      <input
                        type="text"
                        value={editingStory.title}
                        onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                        className={`w-full px-3 py-2 rounded border ${
                          theme === 'dark'
                            ? 'bg-dark-700 text-white border-dark-600'
                            : 'bg-white text-gray-900 border-gray-300'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Slug
                      </label>
                      <input
                        type="text"
                        value={editingStory.slug}
                        onChange={(e) => setEditingStory({ ...editingStory, slug: e.target.value })}
                        className={`w-full px-3 py-2 rounded border ${
                          theme === 'dark'
                            ? 'bg-dark-700 text-white border-dark-600'
                            : 'bg-white text-gray-900 border-gray-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Author
                      </label>
                      <select
                        value={editingStory.author_id}
                        onChange={(e) => setEditingStory({ ...editingStory, author_id: e.target.value })}
                        className={`w-full px-3 py-2 rounded border ${
                          theme === 'dark'
                            ? 'bg-dark-700 text-white border-dark-600'
                            : 'bg-white text-gray-900 border-gray-300'
                        }`}
                      >
                        {authors.map((author) => (
                          <option key={author.id} value={author.id}>
                            {author.display_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Cover Image URL
                      </label>
                      <input
                        type="url"
                        value={editingStory.cover_image || ''}
                        onChange={(e) => setEditingStory({ ...editingStory, cover_image: e.target.value })}
                        className={`w-full px-3 py-2 rounded border ${
                          theme === 'dark'
                            ? 'bg-dark-700 text-white border-dark-600'
                            : 'bg-white text-gray-900 border-gray-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-featured"
                      checked={editingStory.is_featured}
                      onChange={(e) => setEditingStory({ ...editingStory, is_featured: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="edit-featured" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      Featured Story
                    </label>
                  </div>

                  {/* Story Parts Management */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Story Parts ({editingStory.parts?.length || 0})
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleAddPart(editingStory.id)}
                        className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white text-sm px-4 py-2 rounded-lg transition-all duration-200"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Part</span>
                      </button>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {editingStory.parts?.map((part: any, index: number) => (
                        <div
                          key={part.id}
                          className={`border rounded-lg ${
                            theme === 'dark' ? 'border-dark-600' : 'border-gray-300'
                          }`}
                        >
                          <div
                            className={`flex items-center justify-between p-3 cursor-pointer ${
                              theme === 'dark' ? 'bg-dark-700' : 'bg-gray-50'
                            }`}
                            onClick={() => togglePartExpansion(index)}
                          >
                            <div className="flex items-center space-x-3">
                              <span className={`text-sm font-medium ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                Part {part.part_number}
                              </span>
                              <h5 className={`font-medium ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {part.title}
                              </h5>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePart(part.id);
                                }}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              {expandedParts.has(index) ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </div>
                          </div>

                          {expandedParts.has(index) && (
                            <div className="p-4 space-y-4">
                              <div>
                                <label className={`block text-sm font-medium mb-2 ${
                                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  Part Title
                                </label>
                                <input
                                  type="text"
                                  value={part.title}
                                  onChange={(e) => {
                                    const updatedPart = { ...part, title: e.target.value };
                                    handleUpdatePart(part.id, updatedPart);
                                  }}
                                  className={`w-full px-3 py-2 rounded border ${
                                    theme === 'dark'
                                      ? 'bg-dark-600 text-white border-dark-500'
                                      : 'bg-white text-gray-900 border-gray-300'
                                  }`}
                                />
                              </div>

                              <div>
                                <label className={`block text-sm font-medium mb-2 ${
                                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  Content
                                </label>
                                
                                {/* Formatting Toolbar */}
                                <div className={`flex flex-wrap gap-2 p-2 border rounded-t-lg ${
                                  theme === 'dark' ? 'bg-dark-600 border-dark-500' : 'bg-gray-50 border-gray-300'
                                }`}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const textarea = document.getElementById(`edit-content-${index}`) as HTMLTextAreaElement;
                                      if (textarea) insertFormatting('bold', textarea);
                                    }}
                                    className={`p-2 rounded transition-colors ${
                                      theme === 'dark'
                                        ? 'hover:bg-dark-500 text-gray-300'
                                        : 'hover:bg-gray-200 text-gray-700'
                                    }`}
                                    title="Bold (**text**)"
                                  >
                                    <Bold className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const textarea = document.getElementById(`edit-content-${index}`) as HTMLTextAreaElement;
                                      if (textarea) insertFormatting('italic', textarea);
                                    }}
                                    className={`p-2 rounded transition-colors ${
                                      theme === 'dark'
                                        ? 'hover:bg-dark-500 text-gray-300'
                                        : 'hover:bg-gray-200 text-gray-700'
                                    }`}
                                    title="Italic (*text*)"
                                  >
                                    <Italic className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const textarea = document.getElementById(`edit-content-${index}`) as HTMLTextAreaElement;
                                      if (textarea) insertFormatting('light', textarea);
                                    }}
                                    className={`p-2 rounded transition-colors ${
                                      theme === 'dark'
                                        ? 'hover:bg-dark-500 text-gray-300'
                                        : 'hover:bg-gray-200 text-gray-700'
                                    }`}
                                    title="Light Text (~text~)"
                                  >
                                    <Lightbulb className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const textarea = document.getElementById(`edit-content-${index}`) as HTMLTextAreaElement;
                                      if (textarea) insertFormatting('quote', textarea);
                                    }}
                                    className={`p-2 rounded transition-colors ${
                                      theme === 'dark'
                                        ? 'hover:bg-dark-500 text-gray-300'
                                        : 'hover:bg-gray-200 text-gray-700'
                                    }`}
                                    title="Quote (> text)"
                                  >
                                    <Quote className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const textarea = document.getElementById(`edit-content-${index}`) as HTMLTextAreaElement;
                                      if (textarea) insertFormatting('heading', textarea);
                                    }}
                                    className={`p-2 rounded transition-colors ${
                                      theme === 'dark'
                                        ? 'hover:bg-dark-500 text-gray-300'
                                        : 'hover:bg-gray-200 text-gray-700'
                                    }`}
                                    title="Heading (# text)"
                                  >
                                    <Type className="w-4 h-4" />
                                  </button>
                                </div>

                                <textarea
                                  id={`edit-content-${index}`}
                                  value={part.content}
                                  onChange={(e) => {
                                    const updatedPart = { ...part, content: e.target.value };
                                    handleUpdatePart(part.id, updatedPart);
                                  }}
                                  className={`w-full px-3 py-2 rounded-b-lg border-t-0 border resize-none h-48 ${
                                    theme === 'dark'
                                      ? 'bg-dark-600 text-white border-dark-500'
                                      : 'bg-white text-gray-900 border-gray-300'
                                  }`}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setEditingStory(null)}
                      className={`px-4 py-2 rounded transition-colors ${
                        theme === 'dark'
                          ? 'bg-dark-600 text-gray-300 hover:bg-dark-500'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white px-4 py-2 rounded transition-all duration-200"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Author Modal */}
        {editingAuthor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border ${
              theme === 'dark' 
                ? 'bg-dark-800 border-dark-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Edit Author
                  </h3>
                  <button
                    onClick={() => setEditingAuthor(null)}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-dark-700 text-gray-400'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateAuthor} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={editingAuthor.display_name}
                        onChange={(e) => setEditingAuthor({ ...editingAuthor, display_name: e.target.value })}
                        className={`w-full px-3 py-2 rounded border ${
                          theme === 'dark'
                            ? 'bg-dark-700 text-white border-dark-600'
                            : 'bg-white text-gray-900 border-gray-300'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Username
                      </label>
                      <input
                        type="text"
                        value={editingAuthor.username}
                        onChange={(e) => setEditingAuthor({ ...editingAuthor, username: e.target.value })}
                        className={`w-full px-3 py-2 rounded border ${
                          theme === 'dark'
                            ? 'bg-dark-700 text-white border-dark-600'
                            : 'bg-white text-gray-900 border-gray-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Bio
                    </label>
                    <textarea
                      value={editingAuthor.bio || ''}
                      onChange={(e) => setEditingAuthor({ ...editingAuthor, bio: e.target.value })}
                      className={`w-full px-3 py-2 rounded border resize-none h-24 ${
                        theme === 'dark'
                          ? 'bg-dark-700 text-white border-dark-600'
                          : 'bg-white text-gray-900 border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      value={editingAuthor.avatar || ''}
                      onChange={(e) => setEditingAuthor({ ...editingAuthor, avatar: e.target.value })}
                      className={`w-full px-3 py-2 rounded border ${
                        theme === 'dark'
                          ? 'bg-dark-700 text-white border-dark-600'
                          : 'bg-white text-gray-900 border-gray-300'
                      }`}
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setEditingAuthor(null)}
                      className={`px-4 py-2 rounded transition-colors ${
                        theme === 'dark'
                          ? 'bg-dark-600 text-gray-300 hover:bg-dark-500'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white px-4 py-2 rounded transition-all duration-200"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}