import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import localConfig from "../../firebase-applet-config.json";

// Support both local JSON configuration and Vercel environment variables
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || localConfig?.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || localConfig?.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || localConfig?.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || localConfig?.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || localConfig?.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || localConfig?.appId,
  firestoreDatabaseId: process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID || localConfig?.firestoreDatabaseId,
};

const app = !getApps().length ? initializeApp(config) : getApp();
const db = config.firestoreDatabaseId
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);
const auth = getAuth(app);

export { app, db, auth, config as resolvedFirebaseConfig };

