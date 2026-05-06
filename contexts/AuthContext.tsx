"use client";
import { createContext, useContext, useEffect, useState } from "react";
// ---> IMPORT DO NOSSO SERVIÇO LIMPO <---
import { authService } from "@/infrastructure/auth/FirebaseAuthService";
import { UserData } from "@/core/domain/services/IAuthService";

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // O Context não sabe que é Firebase, só passa o callback
    const unsubscribe = authService.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);