import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { OrganizationsCol } from "@/modules/api/types";
import { getOrganizationSubcollections } from "../../utils";

function useAgent({ orgId, agentId }: { orgId: string; agentId: string }) {
  const { agentsCol } = getOrganizationSubcollections(orgId);
  return useDocumentData(doc(agentsCol, agentId));
}

type CreateAgentData = Omit<OrganizationsCol.AgentsSubCol.Doc, "id">;

function createAgent(data: CreateAgentData) {
  const { agentsCol } = getOrganizationSubcollections(data.orgId);
  const cDoc = doc(agentsCol);
  setDoc(cDoc, { id: cDoc.id, ...data }, { merge: true });
  return {
    id: cDoc.id,
  };
}

type UpdateAgentData = Partial<OrganizationsCol.AgentsSubCol.Doc> & {
  orgId: string;
};

function updateAgent(id: string, data: UpdateAgentData) {
  const { agentsCol } = getOrganizationSubcollections(data.orgId);
  const cDoc = doc(agentsCol, id);
  return setDoc(cDoc, { updatedAt: Date.now(), ...data }, { merge: true });
}

function deleteAgent(orgId: string, agentId: string) {
  const { agentsCol } = getOrganizationSubcollections(orgId);
  const aDoc = doc(agentsCol, agentId);
  return deleteDoc(aDoc);
}

export { useAgent, createAgent, updateAgent, deleteAgent };
