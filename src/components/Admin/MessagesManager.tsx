"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  Archive,
  User,
  MessageSquare,
} from "lucide-react";
import { ConfirmWriteModal, type PendingFirestoreWrite } from "./ConfirmWriteModal";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  projectType: string;
  message: string;
  status: "unread" | "read" | "archived" | "replied";
  createdAt: string;
}

export function MessagesManager() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  // Manual confirmation state
  const [pendingWrite, setPendingWrite] = useState<PendingFirestoreWrite | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "messages"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as MessageItem[];
      // Sort most recent first
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setMessages(list);
    });
    return () => unsub();
  }, []);

  const handleSelect = async (msg: MessageItem) => {
    setSelectedMessage(msg);
    if (msg.status === "unread") {
      try {
        await updateDoc(doc(db, "messages", msg.id), { status: "read" });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = (id: string) => {
    const target = messages.find((m) => m.id === id);
    setPendingWrite({
      title: `Suppression du message de ${target?.name || id}`,
      description: "Validation requise. Cette action supprimera définitivement le message de Firestore.",
      collection: "messages",
      docId: id,
      payload: { action: "delete_message", id },
      actionType: "deleteDoc",
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, "messages", id));
          if (selectedMessage?.id === id) setSelectedMessage(null);
        } catch (err) {
          console.error(err);
          alert("Erreur lors de la suppression du message sur Firestore.");
        }
      },
    });

    setIsConfirmModalOpen(true);
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === "unread") return m.status === "unread";
    if (filter === "read") return m.status === "read";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-text">
            Boîte de Réception & Leads ({messages.length})
          </h2>
          <p className="text-xs text-muted">
            Consultez les demandes de devis et prises de contact reçues via le portfolio.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              filter === "all" ? "bg-accent/20 text-accent font-semibold" : "text-muted hover:text-text"
            }`}
          >
            Tous ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              filter === "unread" ? "bg-accent/20 text-accent font-semibold" : "text-muted hover:text-text"
            }`}
          >
            Non lus ({messages.filter((m) => m.status === "unread").length})
          </button>
        </div>
      </div>

      {/* Main split view */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Messages List (5 cols) */}
        <div className="space-y-3 lg:col-span-5 max-h-[650px] overflow-y-auto pr-1 scrollbar-none">
          {filteredMessages.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-surface/30 p-8 text-center text-muted">
              <MessageSquare size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Aucun message pour le moment</p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              const isUnread = msg.status === "unread";

              return (
                <div
                  key={msg.id}
                  onClick={() => handleSelect(msg)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                    isSelected
                      ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(168,243,90,0.08)]"
                      : isUnread
                      ? "border-border bg-surface/90 hover:border-accent/40"
                      : "border-border/60 bg-surface/40 hover:border-border"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isUnread && (
                        <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                      )}
                      <span className="font-semibold text-sm text-text truncate">
                        {msg.name || "Visiteur anonyme"}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-muted">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                          })
                        : "Récent"}
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center gap-2 text-xs text-muted">
                    <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-accent">
                      {msg.projectType || "Projet"}
                    </span>
                    <span className="truncate">{msg.email}</span>
                  </div>

                  <p className="mt-2 text-xs text-text/80 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Message Details (7 cols) */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="rounded-2xl border border-border bg-surface/70 p-6 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl font-bold text-text">
                      {selectedMessage.name}
                    </h3>
                    <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-xs text-accent">
                      {selectedMessage.projectType}
                    </span>
                  </div>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="mt-1 inline-flex items-center gap-1.5 text-xs text-accent font-mono hover:underline"
                  >
                    <Mail size={13} />
                    <span>{selectedMessage.email}</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="rounded-xl border border-border p-2.5 text-muted hover:border-red-500 hover:text-red-400"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-3">
                <span className="eyebrow text-muted text-xs">Message complet</span>
                <div className="rounded-xl border border-border/80 bg-[#070908] p-4 sm:p-5 text-sm text-text/90 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Quick Reply Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="font-mono text-xs text-muted">
                  Reçu le {new Date(selectedMessage.createdAt).toLocaleString("fr-FR")}
                </span>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Suite à votre message - Hilarus Gbagoule&body=Bonjour ${selectedMessage.name},%0D%0A%0D%0AMerci pour votre message concernant le projet ${selectedMessage.projectType}.`}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-bg hover:scale-105 transition-transform"
                >
                  <Mail size={14} />
                  <span>Répondre par Email</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center text-muted">
              <p className="text-sm">Sélectionnez un message à gauche pour lire les détails</p>
            </div>
          )}
        </div>
      </div>

      {/* Manual Confirmation Modal before any Firestore write */}
      <ConfirmWriteModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setPendingWrite(null);
        }}
        pendingWrite={pendingWrite}
      />
    </div>
  );
}
