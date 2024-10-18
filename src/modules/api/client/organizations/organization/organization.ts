import { doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { OrganizationsCol } from "@/modules/api/types";
import { getCollectionGroups, getCollections } from "../../utils";
import { useDocumentData } from "react-firebase-hooks/firestore";

const { organizationsCol } = getCollections();
const { membersColGroup } = getCollectionGroups();

type CreateOrganizationData = Omit<OrganizationsCol.Doc, "id">;

async function createOrganization(data: CreateOrganizationData) {
  const oDoc = doc(organizationsCol);
  await setDoc(oDoc, { id: oDoc.id, ...data }, { merge: true });
  return {
    id: oDoc.id,
  };
}

async function getUserOrgId(uid: string) {
  const snaps = await getDocs(query(membersColGroup, where("id", "==", uid)));
  if (snaps.empty) {
    throw new Error("User not found");
  }

  const user = snaps.docs[0].data();
  return user.orgId;
}

function useOrganizationById(orgId: string) {
  return useDocumentData(doc(organizationsCol, orgId));
}

export { createOrganization, getUserOrgId, useOrganizationById };
