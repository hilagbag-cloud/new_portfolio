import {
  writeBatch,
  doc,
  collection,
  getDocs,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { projects } from "@/data/projects";
import { milestones } from "@/data/milestones";
import { site } from "@/data/site";
import { defaultSiteMetadata } from "./cms-meta";

export async function seedInitialCmsData(forceOverwrite = false) {
  // Check if siteConfig already exists
  const siteSnap = await getDoc(doc(db, "siteConfig", "global"));
  
  const batch = writeBatch(db);

  // 1. Projects - only seed if forceOverwrite or document doesn't exist
  for (const proj of projects) {
    const ref = doc(db, "projects", proj.id);
    if (forceOverwrite) {
      batch.set(ref, {
        ...proj,
        updatedAt: new Date().toISOString(),
      });
    } else {
      batch.set(
        ref,
        {
          ...proj,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  }

  // 2. Milestones
  for (const m of milestones) {
    const ref = doc(db, "milestones", m.id);
    if (forceOverwrite) {
      batch.set(ref, {
        ...m,
        updatedAt: new Date().toISOString(),
      });
    } else {
      batch.set(
        ref,
        {
          ...m,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  }

  // 3. Site Config - if already exists and not forceOverwrite, do NOT overwrite custom settings!
  if (!siteSnap.exists() || forceOverwrite) {
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
  }

  await batch.commit();
}

