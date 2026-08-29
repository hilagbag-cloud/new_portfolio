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
  ExternalLink,
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

  // Build complete list of configured channels dynamically
  const items: SocialItem[] = [];

  // WhatsApp
  const whatsappVal = contactChannels.whatsapp || socials.whatsapp;
  if (whatsappVal) {
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
  if (telegramVal) {
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
  if (linkedinVal) {
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
  if (githubVal) {
    items.push({
      id: "github",
      name: "GitHub",
      url: githubVal,
      dataSocial: "github",
      icon: Github,
    });
  }

  // Dribbble
  const dribbbleVal = socials.dribbble;
  if (dribbbleVal) {
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
  if (behanceVal) {
    items.push({
      id: "behance",
      name: "Behance",
      url: behanceVal,
      dataSocial: "behance",
      icon: Globe,
    });
  }

  // Twitter / X
  const twitterVal = contactChannels.twitter || socials.twitter;
  if (twitterVal) {
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
  if (instagramVal) {
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
  if (facebookVal) {
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
  if (threadsVal) {
    items.push({
      id: "threads",
      name: "Threads",
      url: threadsVal,
      dataSocial: "threads",
      icon: Globe,
    });
  }

  // Calendly / Cal.com
  const calendlyVal = contactChannels.calendly;
  if (calendlyVal) {
    items.push({
      id: "calendly",
      name: "Calendly",
      url: calendlyVal,
      dataSocial: "calendly",
      icon: Calendar,
    });
  }

  // Email direct
  const emailVal = contactChannels.email || cmsConfig?.contactEmail;
  if (emailVal) {
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
