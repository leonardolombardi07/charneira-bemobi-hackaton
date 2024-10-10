import { query, orderBy, doc, setDoc, writeBatch } from "firebase/firestore";
import { getConversationSubCollections } from "../utils";
import { ConversationsCol } from "../../../../types";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getServices } from "../../../services";

const { firestore } = getServices();

function useConversationParts(id: string) {
  const { partsCol } = getConversationSubCollections(id);
  return useCollectionData(query(partsCol, orderBy("updatedAt", "asc")));
}

type CreateConversationPartData = Omit<ConversationsCol.PartsSubCol.Doc, "id">;

async function createConversationParts(
  id: string,
  data: CreateConversationPartData[]
) {
  const { partsCol } = getConversationSubCollections(id);
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
