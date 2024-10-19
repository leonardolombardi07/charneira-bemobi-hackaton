import { doc, writeBatch, getDocs } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getServices } from "@/modules/api/client/services";
import { OrganizationsCol } from "@/modules/api/types";
import { getOrganizationSubcollections } from "../utils";
import { getConversationSubCollections } from "./conversation/utils";

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

async function getOrgConversationsWithParts(orgId: string) {
  const { conversationsCol } = getOrganizationSubcollections(orgId);

  const docs = await getDocs(conversationsCol);
  const conversations = docs.docs.map(
    (doc) => doc.data() as OrganizationsCol.ConversationsSubCol.Doc
  );

  const conversationsWithParts = await Promise.all(
    conversations.map(async (conversation) => {
      const { partsCol } = getConversationSubCollections({
        orgId,
        conversationId: conversation.id,
      });
      const parts = await getDocs(partsCol);
      return {
        ...conversation,
        parts: parts.docs.map(
          (doc) =>
            doc.data() as OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc
        ),
      };
    })
  );

  return conversationsWithParts;
}

export {
  useOrgConversations,
  updateConversations,
  getOrgConversationsWithParts,
};
