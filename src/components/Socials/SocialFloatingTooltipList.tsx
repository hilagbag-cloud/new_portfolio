"use client";

import { useCmsSiteConfig } from "@/lib/cms-hooks";
import {
  MessageCircle,
  Send,
  Linkedin,
  Github,
  Dribbble,
  Twitter,
  Instagram,
  Facebook,
  Mail,
  Calendar,
  Phone,
  Globe,
  Youtube,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

interface SocialItem {
  id: string;
  name: string;
  url: string;
  dataSocial: string;
  icon: LucideIcon;
}

export function SocialFloatingTooltipList({ className = "" }: { className?: string }) {
  const cmsConfig = useCmsSiteConfig();

  const socials = cmsConfig?.socials || {};
  const contactChannels = cmsConfig?.contactChannels || {};
  const visibility = cmsConfig?.socialVisibility || {};

  const isPublic = (id: string, defaultVal = true) =>
    visibility[id] !== undefined ? Boolean(visibility[id]) : defaultVal;

  // Build complete list of configured channels dynamically
  const items: SocialItem[] = [];

  // WhatsApp
  const whatsappVal = contactChannels.whatsapp || socials.whatsapp;
  if (whatsappVal && isPublic("whatsapp", true)) {
    const cleanWa = whatsappVal.startsWith("http")
      ? whatsappVal
      : `https://wa.me/${whatsappVal.replace(/[^0-9]/g, "")}`;
    items.push({
      id: "whatsapp",
      name: "WhatsApp",
      url: cleanWa,
      dataSocial: "whatsapp",
      icon: MessageCircle,
    });
  }

  // Telegram
  const telegramVal = contactChannels.telegram || socials.telegram;
  if (telegramVal && isPublic("telegram", true)) {
    const cleanTg = telegramVal.startsWith("http")
      ? telegramVal
      : `https://t.me/${telegramVal.replace("@", "")}`;
    items.push({
      id: "telegram",
      name: "Telegram",
      url: cleanTg,
      dataSocial: "telegram",
      icon: Send,
    });
  }

  // LinkedIn
  const linkedinVal = contactChannels.linkedin || socials.linkedin || "https://linkedin.com/in/hilarus-gbagoule-6a926b426";
  if (linkedinVal && isPublic("linkedin", true)) {
    items.push({
      id: "linkedin",
      name: "LinkedIn",
      url: linkedinVal,
      dataSocial: "linkedin",
      icon: Linkedin,
    });
  }

  // GitHub
  const githubVal = contactChannels.github || socials.github;
  if (githubVal && isPublic("github", true)) {
    items.push({
      id: "github",
      name: "GitHub",
      url: githubVal,
      dataSocial: "github",
      icon: Github,
    });
  }

  // Twitter / X
  const twitterVal = contactChannels.twitter || socials.twitter;
  if (twitterVal && isPublic("twitter", true)) {
    items.push({
      id: "twitter",
      name: "Twitter / X",
      url: twitterVal,
      dataSocial: "twitter",
      icon: Twitter,
    });
  }

  // Instagram
  const instagramVal = contactChannels.instagram || socials.instagram;
  if (instagramVal && isPublic("instagram", true)) {
    items.push({
      id: "instagram",
      name: "Instagram",
      url: instagramVal,
      dataSocial: "instagram",
      icon: Instagram,
    });
  }

  // Facebook
  const facebookVal = contactChannels.facebook || socials.facebook;
  if (facebookVal && isPublic("facebook", true)) {
    items.push({
      id: "facebook",
      name: "Facebook",
      url: facebookVal,
      dataSocial: "facebook",
      icon: Facebook,
    });
  }

  // Threads
  const threadsVal = contactChannels.threads || socials.threads;
  if (threadsVal && isPublic("threads", true)) {
    items.push({
      id: "threads",
      name: "Threads",
      url: threadsVal,
      dataSocial: "threads",
      icon: Globe,
    });
  }

  // YouTube
  const youtubeVal = contactChannels.youtube || socials.youtube;
  if (youtubeVal && isPublic("youtube", false)) {
    items.push({
      id: "youtube",
      name: "YouTube",
      url: youtubeVal,
      dataSocial: "youtube",
      icon: Youtube,
    });
  }

  // Discord
  const discordVal = contactChannels.discord || socials.discord;
  if (discordVal && isPublic("discord", false)) {
    items.push({
      id: "discord",
      name: "Discord",
      url: discordVal,
      dataSocial: "discord",
      icon: MessageSquare,
    });
  }

  // TikTok
  const tiktokVal = contactChannels.tiktok || socials.tiktok;
  if (tiktokVal && isPublic("tiktok", false)) {
    items.push({
      id: "tiktok",
      name: "TikTok",
      url: tiktokVal,
      dataSocial: "tiktok",
      icon: Globe,
    });
  }

  // Dribbble
  const dribbbleVal = socials.dribbble;
  if (dribbbleVal && isPublic("dribbble", true)) {
    items.push({
      id: "dribbble",
      name: "Dribbble",
      url: dribbbleVal,
      dataSocial: "dribbble",
      icon: Dribbble,
    });
  }

  // Behance
  const behanceVal = socials.behance;
  if (behanceVal && isPublic("behance", true)) {
    items.push({
      id: "behance",
      name: "Behance",
      url: behanceVal,
      dataSocial: "behance",
      icon: Globe,
    });
  }

  // Calendly / Cal.com
  const calendlyVal = contactChannels.calendly;
  if (calendlyVal && isPublic("calendly", true)) {
    items.push({
      id: "calendly",
      name: "Calendly",
      url: calendlyVal,
      dataSocial: "calendly",
      icon: Calendar,
    });
  }

  // Téléphone
  const phoneVal = contactChannels.phone;
  if (phoneVal && isPublic("phone", true)) {
    const cleanPhone = phoneVal.replace(/[^0-9+]/g, "");
    items.push({
      id: "phone",
      name: "Téléphone",
      url: `tel:${cleanPhone}`,
      dataSocial: "phone",
      icon: Phone,
    });
  }

  // Email direct
  const emailVal = contactChannels.email || cmsConfig?.contactEmail;
  if (emailVal && isPublic("email", true)) {
    items.push({
      id: "email",
      name: "Email direct",
      url: `mailto:${emailVal}`,
      dataSocial: "email",
      icon: Mail,
    });
  }

  if (items.length === 0) return null;

  return (
    <ul className={`social-floating-list ${className}`}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.id} className="icon-content">
            <span className="tooltip">{item.name}</span>
            <a
              href={item.url}
              target={item.url.startsWith("mailto:") ? "_self" : "_blank"}
              rel="noreferrer"
              data-social={item.dataSocial}
              aria-label={item.name}
              className="link focus-ring"
            >
              <Icon size={20} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
