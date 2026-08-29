import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { milestones } from "@/data/milestones";
import { MilestoneDetailClient } from "./MilestoneDetailClient";

interface PageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return milestones.map((m) => ({
    id: m.id,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const milestone = milestones.find((m) => m.id === params.id);
  if (!milestone) {
    return {
      title: "Étape non trouvée — Hilarus Gbagoule",
    };
  }

  return {
    title: `${milestone.shortTitle}: ${milestone.title} — Parcours Hilarus Gbagoule`,
    description: milestone.description,
    openGraph: {
      title: `${milestone.shortTitle} — ${milestone.title}`,
      description: milestone.description,
      type: "article",
    },
  };
}

export default function MilestonePage({ params }: PageProps) {
  const milestone = milestones.find((m) => m.id === params.id);

  if (!milestone) {
    notFound();
  }

  const currentIndex = milestones.findIndex((m) => m.id === milestone.id);
  const prevMilestone = currentIndex > 0 ? milestones[currentIndex - 1] : null;
  const nextMilestone =
    currentIndex < milestones.length - 1 ? milestones[currentIndex + 1] : null;

  return (
    <MilestoneDetailClient
      milestone={milestone}
      prevMilestone={prevMilestone}
      nextMilestone={nextMilestone}
      totalSteps={milestones.length}
    />
  );
}
