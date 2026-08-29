import {
  writeBatch,
  doc,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { projects } from "@/data/projects";
import { milestones } from "@/data/milestones";
import { site } from "@/data/site";
import { defaultSiteMetadata } from "./cms-meta";

export async function seedInitialCmsData(forceOverwrite = false) {
  const batch = writeBatch(db);

  // 1. Projects
  projects.forEach((proj) => {
    const ref = doc(db, "projects", proj.id);
    batch.set(
      ref,
      {
        ...proj,
        updatedAt: new Date().toISOString(),
      },
      { merge: !forceOverwrite }
    );
  });

  // 2. Milestones
  milestones.forEach((m) => {
    const ref = doc(db, "milestones", m.id);
    batch.set(
      ref,
      {
        ...m,
        updatedAt: new Date().toISOString(),
      },
      { merge: !forceOverwrite }
    );
  });

  // 3. Site Config
  const siteRef = doc(db, "siteConfig", "global");
  batch.set(
    siteRef,
    {
      ...defaultSiteMetadata,
      brand: site.nav.brand,
      positioning: site.hero.positioning,
      tags: site.hero.tags,
      contactText: site.contact.text,
      socials: {
        ...defaultSiteMetadata.socials,
        ...site.footer.socials,
      },
      updatedAt: new Date().toISOString(),
    },
    { merge: !forceOverwrite }
  );

  await batch.commit();
}
