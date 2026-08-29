"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Lock, Mail, KeyRound, Sparkles, AlertCircle } from "lucide-react";

export function AdminLogin() {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message || "Erreur de connexion Google");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Veuillez saisir votre email et mot de passe");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await signInWithEmail(email, password);
    } catch (err: any) {
      setError(err?.message || "Identifiants invalides");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070908] px-4 py-12 text-text selection:bg-accent selection:text-bg">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border/80 bg-[#0d110e] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent shadow-inner">
            <Lock size={22} />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text">
            CMS & Admin Suite
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Espace de gestion & statistiques en direct — <span className="text-accent font-mono">my.domainname.site</span>
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-400">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google One-Click Sign In */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="group flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text transition-all duration-200 hover:border-accent hover:bg-surface/80 focus-ring disabled:opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1c0 2.8.7 5.4 1.9 7.8l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
            />
          </svg>
          <span>Continuer avec Google (Propriétaire)</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-border" />
          <span className="absolute bg-[#0d110e] px-3 font-mono text-[10px] uppercase text-muted tracking-widest">
            Ou par identifiants
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="eyebrow mb-1.5 block text-muted text-[11px]">
              Email Administrateur
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hilaruskazak@gmail.com"
                className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-muted/60 focus-ring focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="eyebrow mb-1.5 block text-muted text-[11px]">
              Mot de passe
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-3.5 text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-muted/60 focus-ring focus:border-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent py-3 text-xs sm:text-sm font-bold text-bg transition-transform duration-200 hover:scale-[1.02] focus-ring disabled:opacity-50"
          >
            {loading ? "Connexion en cours..." : "Accéder au tableau de bord"}
          </button>
        </form>

        <div className="pt-2 text-center">
          <p className="text-[11px] text-muted">
            Accès sécurisé réservé à Hilarus Gbagoule.
          </p>
        </div>
      </div>
    </div>
  );
}
