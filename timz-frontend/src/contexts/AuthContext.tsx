import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (formData: SignupFormData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

interface SignupFormData {
  email: string;
  password: string;
  full_name: string;
  roles: Role[];
  phone?: string;
  business_name?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  };
}

const AuthContext = createContext<AuthContextType | null>(null);

const BASE_URL = 'http://127.0.0.1:8000/api/v1/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupération du token/user depuis le localStorage
  useEffect(() => {
    const saved = localStorage.getItem('auth');
    if (saved) {
      const parsed = JSON.parse(saved);
      setToken(parsed.token);
      setUser(parsed.user);
    }
  }, []);

  // Stocke token/user dans localStorage
  useEffect(() => {
    if (token && user) {
      localStorage.setItem('auth', JSON.stringify({ token, user }));
    }
  }, [token, user]);

  const login = useCallback(async (email: string, password: string) => {
  try {
    setIsLoading(true);
    setError(null);

    const formData = new URLSearchParams();
    formData.append("username", email); // ⚠️ FastAPI attend "username"
    formData.append("password", password);

    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString(),
    });

    if (!response.ok) throw new Error("Invalid credentials");

    const data = await response.json();
    setToken(data.access_token);

    const user: User = {
      id: data.user_id,
      email,
      full_name: "", // à compléter avec /me plus tard
      roles: data.roles,
    };
    setUser(user);
    console.log("Login success. Token:", data.access_token);
    console.log("User:", user);
  } catch (err) {
    setError(err instanceof Error ? err.message : "An error occurred");
    throw err;
  } finally {
    setIsLoading(false);
  }

}, []);

  const signup = useCallback(async (formData: SignupFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();

      setToken(data.access_token);
      const user: User = {
        id: data.user_id,
        email: formData.email,
        full_name: formData.full_name,
        roles: data.roles
      };
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('auth');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        isLoading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
