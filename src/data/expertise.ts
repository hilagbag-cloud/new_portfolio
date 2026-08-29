export type ExpertiseCategory = {
  id: string;
  title: string;
  items: string[];
};

export const expertise: ExpertiseCategory[] = [
  {
    id: "design",
    title: "Design",
    items: ["UI", "UX", "Web Design", "Visual Systems"],
  },
  {
    id: "software",
    title: "Software",
    items: ["Web Applications", "PWA", "Product Development"],
  },
  {
    id: "ai-data",
    title: "AI / Data",
    items: ["Artificial Intelligence", "Data Science", "Automation"],
  },
];
