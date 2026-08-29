"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";

export const ALLOWED_ADMIN_EMAILS = [
  "hilagbag@gmail.com",
  "hilaruskazak@gmail.com",
  "hello@hilarus.dev",
];

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email) {
        const userEmail = currentUser.email.toLowerCase().trim();
        const hasAdminRole = ALLOWED_ADMIN_EMAILS.some(
          (email) => email.toLowerCase() === userEmail
        );
        setUser(currentUser);
        setIsAdmin(hasAdminRole);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    if (result.user?.email) {
      const email = result.user.email.toLowerCase().trim();
      const isAuthorized = ALLOWED_ADMIN_EMAILS.some((e) => e.toLowerCase() === email);
      if (!isAuthorized) {
        await fbSignOut(auth);
        throw new Error(`Accès refusé. L'adresse ${email} n'est pas autorisée en tant qu'administrateur.`);
      }
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const isAuthorized = ALLOWED_ADMIN_EMAILS.some((e) => e.toLowerCase() === cleanEmail);
    if (!isAuthorized) {
      throw new Error(`Accès refusé. L'adresse ${cleanEmail} n'est pas sur la liste des administrateurs.`);
    }
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signOut = async () => {
    await fbSignOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, loading, signInWithGoogle, signInWithEmail, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
