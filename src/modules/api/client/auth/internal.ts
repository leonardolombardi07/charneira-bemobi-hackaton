import {
  signInWithPopup as firebaseSignInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signInAnonymously as firebaseSignInAnonymously,
  linkWithPopup as firebaseLinkWithPopup,
  linkWithCredential as firebaseLinkWithCredential,
  EmailAuthCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { getServices } from "../services";

const { auth } = getServices();

type SupportedProvider = "google";

async function _signInWithPopup({ provider }: { provider: SupportedProvider }) {
  if (provider === "google") {
    const provider = new GoogleAuthProvider();
    return firebaseSignInWithPopup(auth, provider);
  }

  throw new Error("Provider not supported");
}

async function _signInWithEmailAndPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  return firebaseSignInWithEmailAndPassword(auth, email, password);
}

async function _signInAnonymously() {
  return firebaseSignInAnonymously(auth);
}

async function _linkWithCredential(email: string, password: string) {
  if (!auth.currentUser) {
    throw new Error("No user signed in");
  }

  const credential = EmailAuthProvider.credential(email, password);
  return firebaseLinkWithCredential(auth.currentUser, credential);
}

async function _linkWithPopup({ provider }: { provider: SupportedProvider }) {
  if (!auth.currentUser) {
    throw new Error("No user signed in");
  }

  if (provider === "google") {
    const provider = new GoogleAuthProvider();
    return firebaseLinkWithPopup(auth.currentUser, provider);
  }

  throw new Error("Provider not supported");
}

export {
  _signInWithPopup,
  _signInWithEmailAndPassword,
  _signInAnonymously,
  _linkWithPopup,
  _linkWithCredential,
};
