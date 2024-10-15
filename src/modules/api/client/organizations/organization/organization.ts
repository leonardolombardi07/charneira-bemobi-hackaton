import { doc, setDoc } from "firebase/firestore";
import { OrganizationsCol } from "@/modules/api/types";
import { getCollections } from "../../utils";

const { organizationsCol } = getCollections();

type CreateOrganizationData = Omit<OrganizationsCol.Doc, "id">;

function createOrganization(data: CreateOrganizationData) {
  const oDoc = doc(organizationsCol);
  setDoc(oDoc, { id: oDoc.id, ...data }, { merge: true });
  return {
    id: oDoc.id,
  };
}

export { createOrganization };
