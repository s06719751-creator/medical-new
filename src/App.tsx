/* eslint-disable react-hooks/immutability, react-hooks/purity */
import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DbProvider } from './context/DbContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingChat } from './components/FloatingChat';
import { Toast } from './components/Toast';
import type { ToastMessage } from './components/Toast';

// Page Views
import { Home } from './pages/Home';
import { Features } from './pages/Features';
import { Doctors } from './pages/Doctors';
import { HowItWorks } from './pages/HowItWorks';
import { Pricing } from './pages/Pricing';
import { Blog } from './pages/Blog';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { BookAppointment } from './pages/BookAppointment';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Admin } from './pages/Admin';
import { AIChat } from './pages/AIChat';

const AppContent: React.FC = () => {
  
  // Custom Hash Router State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Sync state with URL window hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash) {
        setActiveTab(hash);
      } else {
        setActiveTab('home');
      }
      window.scrollTo(0, 0);
    };

    // Run on initial load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tabId: string) => {
    window.location.hash = `#/${tabId}`;
  };

  const showNotification = (text: string, type: ToastMessage['type']) => {
    setToast({ id: Math.random().toString(), text, type });
  };

  // Render active component dynamically
  const renderActivePage = () => {
    switch (activeTab) {
      case 'chat':
        return <AIChat />;
      case 'home':
        return <Home onTabChange={handleTabChange} />;
      case 'features':
        return <Features onTabChange={handleTabChange} />;
      case 'doctors':
        return <Doctors onTabChange={handleTabChange} />;
      case 'how-it-works':
        return <HowItWorks onTabChange={handleTabChange} />;
      case 'pricing':
        return <Pricing onTabChange={handleTabChange} />;
      case 'blog':
        return <Blog />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'book-appointment':
        return (
          <BookAppointment 
            onSuccess={() => {
              showNotification('Video consultation requested successfully!', 'success');
              handleTabChange('dashboard');
            }} 
          />
        );
      case 'login':
        return (
          <Auth 
            onSuccess={() => {
              showNotification('Welcome back to the care portal!', 'success');
              handleTabChange('dashboard');
            }} 
          />
        );
      case 'dashboard':
        return <Dashboard />;
      case 'admin':
        return <Admin />;
      default:
        return <Home onTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#f0fdfa] text-[#134e4a]">
      {/* Soft teal ambient blobs */}
      <div className="absolute top-[10%] left-[5%] w-[350px] h-[350px] bg-teal-200/30 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-[40%] right-[5%] w-[300px] h-[300px] bg-emerald-200/30 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] bg-sky-100/40 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Premium Navbar */}
      <Navbar currentTab={activeTab} onTabChange={handleTabChange} />

      {/* Core Workspace Page View */}
      <main className="flex-grow w-full relative z-10 flex items-center justify-center">
        {renderActivePage()}
      </main>

      {/* Modern Multi-Column Footer */}
      <Footer onTabChange={handleTabChange} />

      {/* Floating Chatbot Assistant Component (Always present bottom right) */}
      <FloatingChat onNavigate={handleTabChange} />

      {/* Global Notifications Alert Layer */}
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DbProvider>
        <AppContent />
      </DbProvider>
    </AuthProvider>
  );
}
