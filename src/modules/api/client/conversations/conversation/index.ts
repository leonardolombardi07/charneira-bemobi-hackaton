import { doc, setDoc } from "firebase/firestore";
import { getCollections } from "../../utils";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { ConversationsCol } from "../../../types";

const { conversationsCol } = getCollections();

function useConversation(id: string) {
  return useDocumentData(doc(conversationsCol, id));
}

async function createConversation(data: Partial<ConversationsCol.Doc>) {
  const cDoc = doc(conversationsCol);
  await setDoc(
    cDoc,
    {
      id: cDoc.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...data,
    },
    { merge: true }
  );
}

export { useConversation, createConversation };
export * from "./parts";
