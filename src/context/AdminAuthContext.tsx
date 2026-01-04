import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  username: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ error?: string }>;
  register: (username: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  checkRegistrationEnabled: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const verifyToken = useCallback(async (storedToken: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'verify', token: storedToken },
      });

      if (error || !data?.valid) {
        localStorage.removeItem('admin_token');
        setUser(null);
        setToken(null);
        return false;
      }

      setUser(data.user);
      setToken(storedToken);
      return true;
    } catch {
      localStorage.removeItem('admin_token');
      setUser(null);
      setToken(null);
      return false;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('admin_token');
      if (storedToken) {
        await verifyToken(storedToken);
      }
      setIsLoading(false);
    };

    initAuth();
  }, [verifyToken]);

  const login = async (username: string, password: string): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'login', username, password },
      });

      if (error) {
        return { error: error.message };
      }

      if (data?.error) {
        return { error: data.error };
      }

      if (data?.success && data?.token) {
        localStorage.setItem('admin_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return {};
      }

      return { error: 'Unbekannter Fehler beim Login' };
    } catch (err) {
      return { error: 'Verbindungsfehler' };
    }
  };

  const register = async (username: string, password: string): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'register', username, password },
      });

      if (error) {
        return { error: error.message };
      }

      if (data?.error) {
        return { error: data.error };
      }

      if (data?.success && data?.token) {
        localStorage.setItem('admin_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return {};
      }

      return { error: 'Unbekannter Fehler bei der Registrierung' };
    } catch (err) {
      return { error: 'Verbindungsfehler' };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
    setToken(null);
  };

  const checkRegistrationEnabled = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'check-registration' },
      });

      if (error) {
        console.error('Error checking registration:', error);
        return false;
      }

      return data?.enabled === true;
    } catch {
      return false;
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        checkRegistrationEnabled,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
