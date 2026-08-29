"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AdminLogin } from "@/components/Admin/AdminLogin";
import { AnalyticsDashboard } from "@/components/Admin/AnalyticsDashboard";
import { ProjectsManager } from "@/components/Admin/ProjectsManager";
import { MilestonesManager } from "@/components/Admin/MilestonesManager";
import { MessagesManager } from "@/components/Admin/MessagesManager";
import { SiteSettingsManager } from "@/components/Admin/SiteSettingsManager";
import {
  BarChart3,
  FolderKanban,
  Compass,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";

type Tab = "analytics" | "projects" | "milestones" | "messages" | "settings";

export default function AdminPage() {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("analytics");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070908] text-text">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <span className="font-mono text-xs text-muted">Chargement de la session...</span>
        </div>
      </div>
    );
  }

  // Not signed in -> Show Login
  if (!user) {
    return <AdminLogin />;
  }

  const tabs = [
    { id: "analytics" as Tab, label: "Statistiques & Live Trafic", icon: BarChart3 },
    { id: "projects" as Tab, label: "Projets & Travaux", icon: FolderKanban },
    { id: "milestones" as Tab, label: "Trajectoire (Milestones)", icon: Compass },
    { id: "messages" as Tab, label: "Boîte de réception", icon: MessageSquare },
    { id: "settings" as Tab, label: "Paramètres du Site", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#070908] text-text flex flex-col">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-[#0d110e]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 text-accent">
              <Shield size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm sm:text-base text-text">
                  Hilarus CMS Suite
                </span>
                <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent">
                  my.domainname.site
                </span>
              </div>
              <p className="text-[11px] text-muted hidden sm:block">
                Connecté en tant que <span className="text-text">{user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-text hover:border-accent hover:text-accent transition-colors"
            >
              <span>Voir le Portfolio</span>
              <ExternalLink size={13} />
            </Link>

            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:py-8">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-border/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "border border-accent/80 bg-accent/15 text-accent shadow-[0_0_12px_rgba(168,243,90,0.12)]"
                    : "border border-border/80 bg-surface/60 text-muted hover:border-border hover:text-text"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Stage */}
        <main className="mt-8 flex-1">
          {activeTab === "analytics" && <AnalyticsDashboard />}
          {activeTab === "projects" && <ProjectsManager />}
          {activeTab === "milestones" && <MilestonesManager />}
          {activeTab === "messages" && <MessagesManager />}
          {activeTab === "settings" && <SiteSettingsManager />}
        </main>
      </div>
    </div>
  );
}
