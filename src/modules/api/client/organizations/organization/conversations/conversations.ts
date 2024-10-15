import { doc, writeBatch } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getServices } from "@/modules/api/client/services";
import { OrganizationsCol } from "@/modules/api/types";
import { getOrganizationSubcollections } from "../utils";

const { firestore } = getServices();

function useOrgConversations(id: string) {
  const { conversationsCol } = getOrganizationSubcollections(id);
  return useCollectionData(conversationsCol);
}

type UpdateConversationData =
  Partial<OrganizationsCol.ConversationsSubCol.Doc> & {
    orgId: string;
  };

function updateConversations(data: UpdateConversationData[]) {
  const batch = writeBatch(firestore);
  for (const item of data) {
    const { conversationsCol } = getOrganizationSubcollections(item.orgId);
    const cDoc = doc(conversationsCol, item.id);
    batch.set(cDoc, { ...item }, { merge: true });
  }
  return batch.commit();
}

export { useOrgConversations, updateConversations };
