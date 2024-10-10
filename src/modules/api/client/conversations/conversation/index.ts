import { doc, setDoc } from "firebase/firestore";
import { getCollections } from "../../utils";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { ConversationsCol } from "../../../types";

const { conversationsCol } = getCollections();

function useConversation(id: string) {
  return useDocumentData(doc(conversationsCol, id));
}

function createConversation(data: Partial<ConversationsCol.Doc>) {
  const cDoc = doc(conversationsCol);
  setDoc(
    cDoc,
    {
      id: cDoc.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...data,
    },
    { merge: true }
  );

  return {
    id: cDoc.id,
  };
}

function updateConversation(id: string, data: Partial<ConversationsCol.Doc>) {
  const cDoc = doc(conversationsCol, id);
  setDoc(
    cDoc,
    {
      updatedAt: Date.now(),
      ...data,
    },
    { merge: true }
  );
}

export { useConversation, createConversation, updateConversation };
export * from "./parts";
