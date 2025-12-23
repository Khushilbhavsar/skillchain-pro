import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const mockUsers: Record<UserRole, User> = {
  tpo: {
    id: 'tpo-1',
    email: 'tpo@college.edu',
    name: 'Dr. Rajesh Kumar',
    role: 'tpo',
    avatar: undefined,
  },
  student: {
    id: 'student-1',
    email: 'student@college.edu',
    name: 'Rahul Sharma',
    role: 'student',
    avatar: undefined,
  },
  company: {
    id: 'company-1',
    email: 'hr@techcorp.com',
    name: 'TechCorp HR',
    role: 'company',
    avatar: undefined,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((role: UserRole) => {
    setUser(mockUsers[role]);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setUser(mockUsers[role]);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
