import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ShieldAlert, LogOut, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'blog', label: 'Resources' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-[100] w-full px-6 py-4 glass-panel border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Icon */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-cyan-400 p-[1.5px] shadow-[0_0_15px_-3px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#030014] rounded-[10px] flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400 group-hover:text-cyan-400 transition-colors" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21 C16 17 20 14.2 20 10.2 C20 6.2 16.5 4 12 4 C7.5 4 4 6.2 4 10.2 C4 14.2 8 17 12 21 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 7 L12 13 M9 10 L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-purple-300">
            Medora <span className="text-purple-400 text-glow">AI</span>
          </span>
        </div>

        {/* Desktop Menu links */}
        <div className="hidden lg:flex items-center gap-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:text-white ${
                currentTab === item.id 
                  ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20' 
                  : 'text-slate-400 border border-transparent hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Auth CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="relative">
              {/* Profile Bubble */}
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-3 rounded-full glass-panel border-white/10 hover:border-purple-500/30 transition-colors"
              >
                <span className="text-xs font-semibold text-slate-300 max-w-[100px] truncate">{user.fullName}</span>
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-full border border-purple-400/30 object-cover bg-dark-bg"
                />
              </button>

              {/* Account Dropdown */}
              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 glass-panel-heavy rounded-2xl p-2 border-white/10 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.8)] z-20 animate-[slideIn_0.2s_ease-out]">
                    {user.role === 'admin' && (
                      <button
                        onClick={() => { handleNavClick('admin'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-3 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        Admin Terminal
                      </button>
                    )}
                    <button
                      onClick={() => { handleNavClick('dashboard'); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-4 py-3 text-xs font-medium text-slate-200 hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-purple-400" />
                      User Dashboard
                    </button>
                    <hr className="my-1 border-white/5" />
                    <button
                      onClick={() => { signOut(); setProfileDropdownOpen(false); handleNavClick('home'); }}
                      className="w-full text-left px-4 py-3 text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => handleNavClick('login')}
                className="px-5 py-2.5 rounded-full text-sm font-medium text-slate-300 hover:text-white border border-white/10 hover:border-white/20 transition-all hover:bg-white/5"
              >
                Login
              </button>
              <button
                onClick={() => handleNavClick('book-appointment')}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.65)] hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-slate-300 hover:text-white p-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed left-0 right-0 top-[77px] bottom-0 bg-[#030014]/95 backdrop-blur-lg border-b border-white/5 z-50 p-6 flex flex-col justify-between animate-[slideIn_0.25s_ease-out]">
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-5 py-3 rounded-xl text-base font-semibold transition-all ${
                  currentTab === item.id 
                    ? 'text-purple-400 bg-purple-500/10 border-l-4 border-purple-500' 
                    : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 mt-6 border-t border-white/5 pt-6">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <img src={user.avatarUrl} alt={user.fullName} className="w-10 h-10 rounded-full object-cover border border-purple-400/20" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{user.fullName}</h4>
                    <span className="text-xs text-slate-400">{user.email}</span>
                  </div>
                </div>
                {user.role === 'admin' && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="w-full py-3 px-5 text-sm font-semibold text-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 transition-all"
                  >
                    Admin Terminal
                  </button>
                )}
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full py-3 px-5 text-sm font-semibold text-center rounded-xl glass-panel text-slate-200 border-white/10"
                >
                  My Dashboard
                </button>
                <button
                  onClick={() => { signOut(); handleNavClick('home'); }}
                  className="w-full py-3 text-sm font-semibold text-center text-slate-500 hover:text-slate-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-3 text-sm font-semibold text-center rounded-xl border border-white/10 text-slate-300"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick('book-appointment')}
                  className="w-full py-3 text-sm font-semibold text-center rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
