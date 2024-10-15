import { query, orderBy, doc, writeBatch } from "firebase/firestore";
import { getConversationSubCollections } from "../utils";
import { OrganizationsCol } from "@/modules/api/types";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getServices } from "@/modules/api/client/services";

const { firestore } = getServices();

function useConversationParts(ids: { orgId: string; conversationId: string }) {
  const { partsCol } = getConversationSubCollections(ids);
  return useCollectionData(query(partsCol, orderBy("updatedAt", "asc")));
}

type CreateConversationPartData = Omit<
  OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc,
  "id"
>;

async function createConversationParts(
  orgId: string,
  conversationId: string,
  data: CreateConversationPartData[]
) {
  const { partsCol } = getConversationSubCollections({
    orgId: orgId,
    conversationId: conversationId,
  });
  const batch = writeBatch(firestore);
  for (const part of data) {
    const pDoc = doc(partsCol);
    batch.set(pDoc, {
      ...part,
      id: pDoc.id,
    });
  }
  await batch.commit();
}

export { useConversationParts, createConversationParts };
