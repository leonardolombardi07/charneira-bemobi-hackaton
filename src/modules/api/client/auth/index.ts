import type { NextOrObserver, User } from "firebase/auth";
import {
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  createUserWithEmailAndPassword,
  UserCredential,
  updateProfile,
  updatePassword as firebaseUpdatePassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  _signInAnonymously,
  _signInWithPopup,
  _linkWithPopup,
  _linkWithCredential,
} from "./internal";
import { getServices } from "../services";
import { getCollections } from "../utils";
import { UsersCol } from "../../types";

const { auth } = getServices();
const { usersCol } = getCollections();

interface SignUpWithEmailAndPasswordForm {
  name: string;
  email: string;
  password: string;
}

async function signUp(
  provider: "google" | "anonymous"
): Promise<UserCredential>;
async function signUp(
  provider: "email/password",
  { name, email, password }: SignUpWithEmailAndPasswordForm
): Promise<UserCredential>;

async function signUp(
  provider: "email/password" | "google" | "anonymous",
  form?: SignUpWithEmailAndPasswordForm
) {
  let userCredential: UserCredential | null = null;

  if (provider === "google") {
    userCredential = await _signInWithPopup({ provider: "google" });
  } else if (provider === "anonymous") {
    userCredential = await _signInAnonymously();
  } else if (provider === "email/password") {
    throwErrorIfNoForm(form);
    userCredential = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );
    await updateProfile(userCredential.user, { displayName: form.name });
  } else {
    throw new Error("Provider not supported");
  }

  const { user } = userCredential;
  await createUserOnFirestoreIfDoesNotExist(user.uid, {
    name: user.displayName || "",
    photoURL: user.photoURL || "",
  });

  return userCredential;
}

interface EmailAndPasswordForm {
  email: string;
  password: string;
}

async function signIn(
  provider: "google" | "anonymous"
): Promise<UserCredential>;
async function signIn(
  provider: "email/password",
  { email, password }: EmailAndPasswordForm
): Promise<UserCredential>;

async function signIn(
  provider: "email/password" | "google" | "anonymous",
  form?: EmailAndPasswordForm
) {
  let userCredential: UserCredential | null = null;

  if (provider === "google") {
    userCredential = await _signInWithPopup({ provider: "google" });
  } else if (provider === "anonymous") {
    userCredential = await _signInAnonymously();
  } else if (provider === "email/password") {
    throwErrorIfNoForm(form);
    userCredential = await firebaseSignInWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );
  } else {
    throw new Error("Provider not supported");
  }

  const { user } = userCredential;
  await createUserOnFirestoreIfDoesNotExist(user.uid, {
    name: user.displayName || "",
    photoURL: user.photoURL || "",
  });
  return userCredential;
}

function throwErrorIfNoForm<T>(form: T): asserts form is NonNullable<T> {
  // TODO: we probably can create function signatures that makes Typescript understand that form is required and not nullable
  if (!form) {
    throw new Error("Form is required");
  }
}

async function createUserOnFirestoreIfDoesNotExist(
  userId: string,
  data: Omit<UsersCol.Doc, "id" | "createdAt" | "updatedAt">
) {
  const userDoc = doc(usersCol, userId);

  const snap = await getDoc(userDoc);
  if (!snap.exists()) {
    setDoc(userDoc, {
      id: userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...data,
    });
  }
}

async function signOut() {
  return firebaseSignOut(auth);
}

function onAuthStateChanged(nextOrObserver: NextOrObserver<User>) {
  return firebaseOnAuthStateChanged(auth, nextOrObserver);
}

function sendPasswordResetEmail(email: string) {
  return firebaseSendPasswordResetEmail(auth, email);
}

function updatePassword(newPassword: string) {
  if (!auth.currentUser) {
    throw new Error("User not found");
  }

  return firebaseUpdatePassword(auth.currentUser, newPassword);
}

async function linkAnonymousUser(
  provider: "google" | "email/password"
): Promise<UserCredential>;
async function linkAnonymousUser(
  provider: "email/password",
  { email, password }: EmailAndPasswordForm
): Promise<UserCredential>;
async function linkAnonymousUser(
  provider: "google" | "email/password",
  form?: EmailAndPasswordForm
) {
  let userCredential: UserCredential | null = null;
  if (provider === "google") {
    userCredential = await _linkWithPopup({ provider });
  } else if (provider === "email/password") {
    throwErrorIfNoForm(form);
    userCredential = await _linkWithCredential(form.email, form.password);
  } else {
    throw new Error("Provider not supported");
  }

  // Update user on Firestore
  const { user } = userCredential;
  const providerData = user.providerData[0];
  await updateUser(user.uid, {
    name: providerData.displayName || "",
    photoURL: providerData.photoURL || "",
  });
  return userCredential;
}

async function updateUser(uid: string, data: Partial<UsersCol.Doc>) {
  const userDoc = doc(usersCol, uid);
  await setDoc(userDoc, data, { merge: true });
}

export {
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signIn,
  signUp,
  updatePassword,
  linkAnonymousUser,
};
