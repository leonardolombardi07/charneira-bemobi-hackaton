import type { FirebaseApp } from "firebase/app";
import { initializeApp, getApps } from "firebase/app";
import type { Firestore } from "firebase/firestore";
import {
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import type { Auth } from "firebase/auth";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectStorageEmulator } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";
import { getStorage } from "firebase/storage";
import { FIREBASE_CONFIG } from "./config";
import { EMULATOR_BASE_URL, EMULATOR_PORT } from "../constants";

interface FirebaseClientServices {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
}

function getRawServices(): FirebaseClientServices {
  const app = initializeApp(FIREBASE_CONFIG);
  const auth = getAuth(app);
  const firestore = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
  const storage = getStorage();
  return { app, auth, firestore, storage };
}

function getServices() {
  const initializedApp = getApps().at(0);
  if (!initializedApp) {
    const services = getRawServices();
    const { auth, firestore, storage } = services;
    if (process.env.NODE_ENV === "development") {
      connectAuthEmulator(
        auth,
        `http://${EMULATOR_BASE_URL}:${EMULATOR_PORT.AUTH}`,
        {
          disableWarnings: true,
        }
      );

      connectFirestoreEmulator(
        firestore,
        EMULATOR_BASE_URL,
        EMULATOR_PORT.FIRESTORE
      );

      connectStorageEmulator(storage, EMULATOR_BASE_URL, EMULATOR_PORT.STORAGE);
    }
    return services;
  }

  return getRawServices();
}

export { getServices };
