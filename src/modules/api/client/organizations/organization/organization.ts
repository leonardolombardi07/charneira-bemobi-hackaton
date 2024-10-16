import { doc, getDoc, setDoc } from "firebase/firestore";
import { OrganizationsCol } from "@/modules/api/types";
import { getCollectionGroups, getCollections } from "../../utils";

const { organizationsCol } = getCollections();
const { membersColGroup } = getCollectionGroups();

type CreateOrganizationData = Omit<OrganizationsCol.Doc, "id">;

function createOrganization(data: CreateOrganizationData) {
  const oDoc = doc(organizationsCol);
  setDoc(oDoc, { id: oDoc.id, ...data }, { merge: true });
  return {
    id: oDoc.id,
  };
}

async function getUserOrgId(uid: string) {
  const userSnap = await getDoc(doc(membersColGroup, uid));
  if (!userSnap.exists()) {
    throw new Error("User not found");
  }

  const user = userSnap.data() as OrganizationsCol.MembersSubCol.Doc;
  return user.orgId;
}

export { createOrganization, getUserOrgId };
