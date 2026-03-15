import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, ArrowLeft, Loader2, Feather, Trash2, Edit2, Save } from 'lucide-react';

// Ensure this matches the port and prefix of your FastAPI backend
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'detail', 'form'
  const [activePost, setActivePost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Unified Form State for Create/Update
  const [formData, setFormData] = useState({ title: '', content: '' });

  // Load posts initially and when returning to the list view
  useEffect(() => {
    if (currentView === 'list') {
      fetchPosts();
    }
  }, [currentView]);

  // --- CRUD: READ ALL ---
  const fetchPosts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/blog_posts/`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError('Could not connect to the backend. Ensure FastAPI is running on port 8000.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- CRUD: READ ONE ---
  const fetchSinglePost = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/blog_posts/${id}`);
      if (!response.ok) throw new Error('Post not found');
      const data = await response.json();
      setActivePost(data);
      setCurrentView('detail');
    } catch (err) {
      setError('Failed to fetch post details.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- CRUD: CREATE & UPDATE ---
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Determine if we are creating a new post or updating an existing one
    const isUpdating = activePost && activePost.id;
    const url = isUpdating 
      ? `${API_BASE_URL}/blog_posts/${activePost.id}` 
      : `${API_BASE_URL}/blog_posts/`;
    const method = isUpdating ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error(`Failed to ${isUpdating ? 'update' : 'create'} post`);
      
      // Reset and go back
      setFormData({ title: '', content: '' });
      setActivePost(null);
      setCurrentView('list');
    } catch (err) {
      setError(`Failed to save post. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- CRUD: DELETE ---
  const handleDeletePost = async (id, e) => {
    if (e) e.stopPropagation(); 
    if (!window.confirm("Are you sure you want to delete this note? This cannot be undone.")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/blog_posts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete post');
      
      if (currentView === 'detail') {
        setCurrentView('list');
      } else {
        setPosts(posts.filter(post => post.id !== id));
      }
    } catch (err) {
      setError('Failed to delete post.');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation Helpers
  const openCreateForm = () => {
    setActivePost(null);
    setFormData({ title: '', content: '' });
    setCurrentView('form');
  };

  const openEditForm = (post, e) => {
    if (e) e.stopPropagation();
    setActivePost(post);
    setFormData({ title: post.title, content: post.content });
    setCurrentView('form');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setCurrentView('list')}
          >
            <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-700 transition">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">FastNote</h1>
          </div>
          
          {currentView !== 'form' && (
            <button
              onClick={openCreateForm}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add Note
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Global Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 shadow-sm">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Global Loading Spinner */}
        {isLoading && currentView === 'list' && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-600" />
            <p>Syncing with database...</p>
          </div>
        )}

        {/* View: List All Posts */}
        {currentView === 'list' && !isLoading && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <Feather className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-semibold text-slate-900">Your Notes</h2>
            </div>
            
            {posts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No notes found</h3>
                <p className="text-slate-500 mb-6">Your database is currently empty.</p>
                <button
                  onClick={openCreateForm}
                  className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-indigo-100 transition"
                >
                  Create your first note
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {posts.map((post) => (
                  <article 
                    key={post.id} 
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full relative group"
                    onClick={() => fetchSinglePost(post.id)}
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 pr-16 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-slate-600 line-clamp-3 leading-relaxed mb-4">
                        {post.content}
                      </p>
                    </div>
                    
                    {/* Action Buttons (Show on hover) */}
                    <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => openEditForm(post, e)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                        title="Edit note"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeletePost(post.id, e)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-auto flex items-center justify-between text-sm">
                      <span className="text-indigo-600 font-medium">Read full Note &rarr;</span>
                      <span className="text-slate-400">ID: {post.id}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* View: Single Post Detail */}
        {currentView === 'detail' && activePost && (
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 relative">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
              <button
                onClick={() => setCurrentView('list')}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Homepage
              </button>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => openEditForm(activePost, e)}
                  className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-4 py-2 rounded-lg transition text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={(e) => handleDeletePost(activePost.id, e)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>

            <article className="prose prose-slate max-w-none">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                {activePost.title}
              </h1>
              <div className="text-slate-700 leading-loose whitespace-pre-wrap text-lg font-serif">
                {activePost.content}
              </div>
            </article>
          </div>
        )}

        {/* View: Shared Create/Update Form */}
        {currentView === 'form' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => setCurrentView('list')}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-semibold text-slate-900">
                {activePost ? 'Edit Note' : 'Write a New Note'}
              </h2>
            </div>

            <form onSubmit={handleSubmitForm} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition text-slate-900 placeholder-slate-400"
                    placeholder="Enter an engaging title..."
                  />
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
                    Content
                  </label>
                  <textarea
                    id="content"
                    required
                    rows="10"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition text-slate-900 placeholder-slate-400 resize-y"
                    placeholder="Share your thoughts here..."
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentView('list')}
                    className="px-6 py-3 rounded-full font-medium text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition disabled:opacity-70 shadow-sm"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isLoading ? 'Saving...' : (activePost ? 'Update Post' : 'Publish Post')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}