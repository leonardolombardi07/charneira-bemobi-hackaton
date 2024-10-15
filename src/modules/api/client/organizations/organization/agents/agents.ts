import { doc, writeBatch } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getServices } from "@/modules/api/client/services";
import { OrganizationsCol } from "@/modules/api/types";
import { getOrganizationSubcollections } from "../utils";

const { firestore } = getServices();

function useOrgAgents(id: string) {
  const { agentsCol } = getOrganizationSubcollections(id);
  return useCollectionData(agentsCol);
}

type UpdateAgentData = Partial<OrganizationsCol.AgentsSubCol.Doc> & {
  orgId: string;
};

function updateAgents(data: UpdateAgentData[]) {
  const batch = writeBatch(firestore);
  for (const item of data) {
    const { agentsCol } = getOrganizationSubcollections(item.orgId);
    const cDoc = doc(agentsCol, item.id);
    batch.set(cDoc, { ...item }, { merge: true });
  }
  return batch.commit();
}

export { useOrgAgents, updateAgents };
