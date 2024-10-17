import type {
  CollectionReference,
  DocumentData,
  Firestore,
} from "firebase/firestore";
import { collection, collectionGroup } from "firebase/firestore";
import { getServices } from "../services";
import {
  UsersCol,
  CollectionName,
  OrganizationsCol,
  CollectionGroupName,
} from "@/modules/api/types";

const { firestore } = getServices();

function getTypedCollection<T = DocumentData>(
  firestore: Firestore,
  name: CollectionName
) {
  return collection(firestore, name) as CollectionReference<T>;
}

function getTypedCollectionGroup<T = DocumentData>(name: CollectionGroupName) {
  return collectionGroup(firestore, name) as CollectionReference<T>;
}

function getCollections() {
  const usersCol = getTypedCollection<UsersCol.Doc>(firestore, "users");

  const organizationsCol = getTypedCollection<OrganizationsCol.Doc>(
    firestore,
    "organizations"
  );

  return { usersCol, organizationsCol };
}

function getCollectionGroups() {
  const membersColGroup =
    getTypedCollectionGroup<OrganizationsCol.MembersSubCol.Doc>("members");

  const conversationsColGroup =
    getTypedCollectionGroup<OrganizationsCol.ConversationsSubCol.Doc>(
      "conversations"
    );

  return { membersColGroup, conversationsColGroup };
}

export { getCollections, getCollectionGroups };
