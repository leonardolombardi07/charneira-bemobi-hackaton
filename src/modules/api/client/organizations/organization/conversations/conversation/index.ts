import { doc, setDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { OrganizationsCol } from "@/modules/api/types";
import { getOrganizationSubcollections } from "../../utils";

function useConversation({
  orgId,
  conversationId,
}: {
  orgId: string;
  conversationId: string;
}) {
  const { conversationsCol } = getOrganizationSubcollections(orgId);
  return useDocumentData(doc(conversationsCol, conversationId));
}

type CreateConversationData = Omit<
  OrganizationsCol.ConversationsSubCol.Doc,
  "id"
>;

function createConversation(data: CreateConversationData) {
  const { conversationsCol } = getOrganizationSubcollections(data.orgId);
  const cDoc = doc(conversationsCol);
  setDoc(cDoc, { id: cDoc.id, ...data }, { merge: true });
  return {
    id: cDoc.id,
  };
}

type UpdateConversationData =
  Partial<OrganizationsCol.ConversationsSubCol.Doc> & {
    orgId: string;
  };

function updateConversation(id: string, data: UpdateConversationData) {
  const { conversationsCol } = getOrganizationSubcollections(data.orgId);
  const cDoc = doc(conversationsCol, id);
  setDoc(cDoc, { updatedAt: Date.now(), ...data }, { merge: true });
}

export { useConversation, createConversation, updateConversation };
export * from "./parts";
