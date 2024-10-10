import { doc, orderBy, query, where, writeBatch } from "firebase/firestore";
import { getCollections } from "../utils";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getServices } from "../services";
import { ConversationsCol } from "../../types";

const { firestore } = getServices();
const { conversationsCol } = getCollections();

function useUserConversations(uid: string) {
  const q = query(
    conversationsCol,
    where("membersIds", "array-contains", uid),
    orderBy("lastPart.updatedAt", "desc")
  );
  return useCollectionData(q);
}

function updateConversations(data: Partial<ConversationsCol.Doc>[]) {
  const batch = writeBatch(firestore);
  for (const item of data) {
    const cDoc = doc(conversationsCol, item.id);
    batch.set(cDoc, { ...item }, { merge: true });
  }
  return batch.commit();
}

export { useUserConversations, updateConversations };
