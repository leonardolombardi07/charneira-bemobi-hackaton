import type {
  CollectionReference,
  DocumentData,
  Firestore,
} from "firebase/firestore";
import { collection } from "firebase/firestore";
import { getServices } from "../services";
import {
  UsersCol,
  ConversationsCol,
  CollectionName,
} from "@/modules/api/types";

const { firestore } = getServices();

function getTypedCollection<T = DocumentData>(
  firestore: Firestore,
  name: CollectionName
) {
  return collection(firestore, name) as CollectionReference<T>;
}

function getCollections() {
  const usersCol = getTypedCollection<UsersCol.Doc>(firestore, "users");
  const conversationsCol = getTypedCollection<ConversationsCol.Doc>(
    firestore,
    "conversations"
  );
  return { usersCol, conversationsCol };
}

export { getCollections };
