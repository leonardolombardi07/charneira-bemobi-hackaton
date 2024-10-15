import {
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  UserCredential,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  _signInAnonymously,
  _signInWithPopup,
  _linkWithPopup,
  _linkWithCredential,
} from "../internal";
import { getServices } from "@/modules/api/client/services";
import { OrganizationsCol, UsersCol } from "@/modules/api/types";
import { getOrganizationSubcollections } from "../../organizations/organization/utils";
import { findUserOrgId } from "../../organizations";

const { auth } = getServices();

interface SignUpWithEmailAndPasswordForm {
  name: string;
  email: string;
  password: string;
}

async function signUpOrgMember(
  provider: "google" | "anonymous",
  orgId: string
): Promise<UserCredential>;
async function signUpOrgMember(
  provider: "email/password",
  orgId: string,
  { name, email, password }: SignUpWithEmailAndPasswordForm
): Promise<UserCredential>;

async function signUpOrgMember(
  provider: "email/password" | "google" | "anonymous",
  orgId: string,
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
  await createOrgMemberOnFirestoreIfDoesNotExist(user.uid, orgId, {
    name: user.displayName || "",
    photoURL: user.photoURL || "",
  });

  return userCredential;
}

interface EmailAndPasswordForm {
  email: string;
  password: string;
}

interface SignInReturn extends UserCredential {
  orgId: string;
}

async function signInOrgMember(
  provider: "google" | "anonymous"
): Promise<SignInReturn>;
async function signInOrgMember(
  provider: "email/password",
  { email, password }: EmailAndPasswordForm
): Promise<SignInReturn>;

async function signInOrgMember(
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

  // TODO: find user in some organization
  const orgId = await findUserOrgId(userCredential.user.uid);
  return {
    ...userCredential,
    orgId,
  };
}

function throwErrorIfNoForm<T>(form: T): asserts form is NonNullable<T> {
  // TODO: we probably can create function signatures that makes Typescript understand that form is required and not nullable
  if (!form) {
    throw new Error("Form is required");
  }
}

async function createOrgMemberOnFirestoreIfDoesNotExist(
  userId: string,
  orgId: string,
  data: Omit<UsersCol.Doc, "id" | "createdAt" | "updatedAt">
) {
  const { membersCol } = getOrganizationSubcollections(orgId);
  const memberDoc = doc(membersCol, userId);
  const snap = await getDoc(memberDoc);
  if (!snap.exists()) {
    setDoc(memberDoc, {
      id: userId,
      orgId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      role: "member",
      ...data,
    });
  }
}

async function linkAnonymousOrgMember(
  provider: "google" | "email/password",
  orgId: string
): Promise<UserCredential>;
async function linkAnonymousOrgMember(
  provider: "email/password",
  orgId: string,
  { email, password }: EmailAndPasswordForm
): Promise<UserCredential>;
async function linkAnonymousOrgMember(
  provider: "google" | "email/password",
  orgId: string,
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
  await updateOrgMember(user.uid, {
    name: providerData.displayName || "",
    photoURL: providerData.photoURL || "",
    orgId,
  });
  return userCredential;
}

async function updateOrgMember(
  uid: string,
  data: Partial<OrganizationsCol.MembersSubCol.Doc> & {
    orgId: string;
  }
) {
  const { membersCol } = getOrganizationSubcollections(data.orgId);
  const userDoc = doc(membersCol, uid);
  await setDoc(userDoc, data, { merge: true });
}

export { signInOrgMember, signUpOrgMember, linkAnonymousOrgMember };
