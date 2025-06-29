import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import AuthorsPage from './pages/AuthorsPage';
import AuthorProfilePage from './pages/AuthorProfilePage';
import SeriesPage from './pages/SeriesPage';
import StoryPage from './pages/StoryPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  const { theme } = useTheme();
  
  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-dark-950 text-white' 
          : 'bg-white text-gray-900'
      }`}>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/authors" element={<AuthorsPage />} />
            <Route path="/author/:username" element={<AuthorProfilePage />} />
            <Route path="/series" element={<SeriesPage />} />
            <Route path="/story/:slug" element={<StoryPage />} />
            <Route path="/story/:slug/part/:partNumber" element={<StoryPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;