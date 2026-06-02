import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ShieldAlert, LogOut, LayoutDashboard, Activity } from 'lucide-react';

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
    <nav className="sticky top-0 z-[100] w-full px-6 py-3.5 bg-white/85 backdrop-blur-xl border-b border-teal-100 shadow-sm shadow-teal-100/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 p-[1.5px] shadow-[0_4px_14px_rgba(13,148,136,0.35)] group-hover:scale-105 group-hover:shadow-[0_6px_20px_rgba(13,148,136,0.5)] transition-all duration-300">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <svg className="w-5 h-5 text-teal-600 group-hover:text-emerald-600 transition-colors" viewBox="0 0 24 24" fill="none">
                <path d="M12 3 C7 3 3.5 6 3.5 10.5 C3.5 15.5 8 19 12 22 C16 19 20.5 15.5 20.5 10.5 C20.5 6 17 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12 L10.5 14.5 L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight font-sans bg-clip-text text-transparent bg-gradient-to-r from-teal-700 to-emerald-600 leading-tight">
              Medora AI
            </span>
            <span className="text-[9px] font-semibold text-teal-400 uppercase tracking-widest font-mono leading-none">Clinical Intelligence</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-0.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-300 nav-link-hover ${
                currentTab === item.id
                  ? 'text-teal-700 bg-teal-50/70 font-semibold shadow-sm shadow-teal-100/10'
                  : 'text-slate-500 hover:text-teal-700 hover:bg-teal-50/30'
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
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-3 rounded-full bg-white border border-teal-100 hover:border-teal-300 shadow-sm transition-all"
              >
                <span className="text-xs font-semibold text-slate-600 max-w-[100px] truncate">{user.fullName}</span>
                <img src={user.avatarUrl} alt={user.fullName} className="w-8 h-8 rounded-full border-2 border-teal-200 object-cover" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl p-2 border border-teal-100 shadow-[0_15px_40px_rgba(13,148,136,0.12)] z-20 animate-[slideIn_0.2s_ease-out]">
                    {user.role === 'admin' && (
                      <button
                        onClick={() => { handleNavClick('admin'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-3 text-xs font-semibold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        Admin Terminal
                      </button>
                    )}
                    <button
                      onClick={() => { handleNavClick('dashboard'); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-4 py-3 text-xs font-medium text-slate-700 hover:bg-teal-50 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-teal-500" />
                      User Dashboard
                    </button>
                    <hr className="my-1 border-teal-50" />
                    <button
                      onClick={() => { signOut(); setProfileDropdownOpen(false); handleNavClick('home'); }}
                      className="w-full text-left px-4 py-3 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-2"
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
                className="px-5 py-2.5 rounded-full text-sm font-medium text-teal-700 hover:text-teal-900 border border-teal-200 hover:border-teal-400 transition-all hover:bg-teal-50"
              >
                Login
              </button>
              <button
                onClick={() => handleNavClick('book-appointment')}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-[0_4px_14px_rgba(13,148,136,0.4)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.55)] hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5" />
                Get Started Free
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-teal-700 p-2 rounded-xl border border-teal-100 hover:bg-teal-50 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed left-0 right-0 top-[72px] bottom-0 bg-white/97 backdrop-blur-xl border-b border-teal-100 z-50 p-6 flex flex-col justify-between animate-[slideIn_0.25s_ease-out]">
          <div className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-5 py-3.5 rounded-2xl text-base font-semibold transition-all ${
                  currentTab === item.id
                    ? 'text-teal-700 bg-teal-50 border-l-4 border-teal-500 pl-4'
                    : 'text-slate-500 hover:bg-teal-50 hover:text-teal-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 mt-6 border-t border-teal-100 pt-6">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <img src={user.avatarUrl} alt={user.fullName} className="w-10 h-10 rounded-full object-cover border-2 border-teal-200" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{user.fullName}</h4>
                    <span className="text-xs text-teal-500">{user.email}</span>
                  </div>
                </div>
                {user.role === 'admin' && (
                  <button onClick={() => handleNavClick('admin')} className="w-full py-3 px-5 text-sm font-semibold text-center rounded-2xl bg-rose-50 text-rose-500 border border-rose-100">
                    Admin Terminal
                  </button>
                )}
                <button onClick={() => handleNavClick('dashboard')} className="w-full py-3 px-5 text-sm font-semibold text-center rounded-2xl bg-teal-50 text-teal-700 border border-teal-200">
                  My Dashboard
                </button>
                <button onClick={() => { signOut(); handleNavClick('home'); }} className="w-full py-3 text-sm font-semibold text-center text-slate-400 hover:text-slate-600">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleNavClick('login')} className="w-full py-3 text-sm font-semibold text-center rounded-2xl border border-teal-200 text-teal-700">
                  Login
                </button>
                <button onClick={() => handleNavClick('book-appointment')} className="w-full py-3 text-sm font-semibold text-center rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg">
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
