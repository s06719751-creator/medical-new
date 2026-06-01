/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isDemoMode } from '../services/supabase';

// =====================================================================
// AUTH INTERFACES
// =====================================================================

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: 'user' | 'admin';
  heartRate: number;
  healthScore: number;
  sleepQuality: number;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, pass: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =====================================================================
// AUTH CONTEXT PROVIDER
// =====================================================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const syncUserProfile = async (uid: string, email: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();
        
      if (!error && data) {
        setUser({
          id: data.id,
          email: data.email || email,
          fullName: data.full_name || 'Medora Member',
          avatarUrl: data.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + data.id,
          role: (data.role as 'user' | 'admin') || 'user',
          heartRate: data.heart_rate || 72,
          healthScore: data.health_score || 92,
          sleepQuality: data.sleep_quality || 75
        });
      } else {
        // Fallback profile if database row not ready
        setUser({
          id: uid,
          email,
          fullName: 'Medora Member',
          avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + uid,
          role: 'user',
          heartRate: 72,
          healthScore: 92,
          sleepQuality: 75
        });
      }
    } catch (err) {
      console.warn('Sync profile error:', err);
    }
  };

  const initializeSupabaseAuth = async () => {
    if (!supabase) return;
    try {
      // 1. Check active session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await syncUserProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
      }
      
      // 2. Set listener for changes
      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          await syncUserProfile(session.user.id, session.user.email || '');
        } else {
          setUser(null);
        }
        setLoading(false);
      });
    } catch (err) {
      console.error('Supabase Auth error:', err);
      setLoading(false);
    }
  };

  // Seed default credentials in local storage to allow seamless reviews
  useEffect(() => {
    if (isDemoMode) {
      const activeSession = localStorage.getItem('medora_active_session');
      if (activeSession) {
        setUser(JSON.parse(activeSession));
      }
      setLoading(false);
    } else {
      initializeSupabaseAuth();
    }
  }, []);

  // =====================================================================
  // AUTHENTICATION METHODS
  // =====================================================================

  const signIn = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (isDemoMode) {
      // 1. Seed demo logins
      const lowerEmail = email.toLowerCase();
      if (lowerEmail === 'admin@medora.ai' && pass === 'admin') {
        const adminUser: UserProfile = {
          id: 'mock_admin_123',
          email: 'admin@medora.ai',
          fullName: 'Administrator Vance',
          avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
          role: 'admin',
          heartRate: 68,
          healthScore: 98,
          sleepQuality: 82
        };
        setUser(adminUser);
        localStorage.setItem('medora_active_session', JSON.stringify(adminUser));
        return { success: true };
      }
      
      if (lowerEmail === 'patient@medora.ai' && pass === 'patient') {
        const standardUser: UserProfile = {
          id: 'mock_patient_456',
          email: 'patient@medora.ai',
          fullName: 'Jonathan Pierce',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
          role: 'user',
          heartRate: 72,
          healthScore: 92,
          sleepQuality: 75
        };
        setUser(standardUser);
        localStorage.setItem('medora_active_session', JSON.stringify(standardUser));
        return { success: true };
      }

      interface RegisteredUser {
        id: string;
        email: string;
        password?: string;
        fullName: string;
        avatarUrl: string;
      }
      const registeredUsers = JSON.parse(localStorage.getItem('medora_registered_users') || '[]') as RegisteredUser[];
      const found = registeredUsers.find((u) => u.email === lowerEmail && u.password === pass);
      if (found) {
        const normalUser: UserProfile = {
          id: found.id,
          email: found.email,
          fullName: found.fullName,
          avatarUrl: found.avatarUrl,
          role: 'user',
          heartRate: 72,
          healthScore: 90,
          sleepQuality: 78
        };
        setUser(normalUser);
        localStorage.setItem('medora_active_session', JSON.stringify(normalUser));
        return { success: true };
      }

      return { success: false, error: 'Invalid medical credentials. Try admin@medora.ai / admin or patient@medora.ai / patient' };
    }

    if (!supabase) return { success: false, error: 'Supabase client is not initialized.' };
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown network authentication error.';
      return { success: false, error: msg };
    }
  };

  const signUp = async (email: string, pass: string, fullName: string): Promise<{ success: boolean; error?: string }> => {
    if (isDemoMode) {
      const lowerEmail = email.toLowerCase();
      interface RegisteredUser {
        id: string;
        email: string;
        password?: string;
        fullName: string;
        avatarUrl: string;
      }
      const registeredUsers = JSON.parse(localStorage.getItem('medora_registered_users') || '[]') as RegisteredUser[];
      
      const exists = registeredUsers.some((u) => u.email === lowerEmail) || lowerEmail === 'admin@medora.ai' || lowerEmail === 'patient@medora.ai';
      if (exists) {
        return { success: false, error: 'Email address already registered in the medical system.' };
      }

      const newId = 'user_' + Math.random().toString(36).substr(2, 9);
      const newUser = {
        id: newId,
        email: lowerEmail,
        password: pass,
        fullName,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${newId}`
      };

      registeredUsers.push(newUser);
      localStorage.setItem('medora_registered_users', JSON.stringify(registeredUsers));

      // Auto login
      const normalUser: UserProfile = {
        id: newId,
        email: lowerEmail,
        fullName,
        avatarUrl: newUser.avatarUrl,
        role: 'user',
        heartRate: 75,
        healthScore: 94,
        sleepQuality: 80
      };
      setUser(normalUser);
      localStorage.setItem('medora_active_session', JSON.stringify(normalUser));
      return { success: true };
    }

    if (!supabase) return { success: false, error: 'Supabase client is not initialized.' };
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: fullName,
            avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${fullName}`
          }
        }
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      return { success: false, error: msg };
    }
  };

  const signOut = async () => {
    if (isDemoMode) {
      setUser(null);
      localStorage.removeItem('medora_active_session');
    } else if (supabase) {
      await supabase.auth.signOut();
      setUser(null);
    }
  };

  const updateProfile = async (profile: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    const updated = { ...user, ...profile };
    setUser(updated);

    if (isDemoMode) {
      localStorage.setItem('medora_active_session', JSON.stringify(updated));
      return true;
    }

    if (!supabase) return false;
    try {
      const payload: Record<string, string | number> = {};
      if (profile.fullName) payload.full_name = profile.fullName;
      if (profile.avatarUrl) payload.avatar_url = profile.avatarUrl;
      if (profile.heartRate) payload.heart_rate = profile.heartRate;
      if (profile.healthScore) payload.health_score = profile.healthScore;
      if (profile.sleepQuality) payload.sleep_quality = profile.sleepQuality;
      
      const { error } = await supabase.from('profiles').update(payload).eq('id', user.id);
      return !error;
    } catch (err) {
      console.error('Profile update error:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemo: isDemoMode, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
