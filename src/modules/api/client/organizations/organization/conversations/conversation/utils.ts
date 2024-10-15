import { OrganizationsCol } from "@/modules/api/types";
import { CollectionReference, collection } from "firebase/firestore";
import { getOrganizationSubcollections } from "../../utils";

function getConversationSubCollections({
  orgId,
  conversationId,
}: {
  orgId: string;
  conversationId: string;
}) {
  const { conversationsCol } = getOrganizationSubcollections(orgId);

  const partsCol = collection(
    conversationsCol,
    conversationId,
    "parts"
  ) as CollectionReference<OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc>;

  return { partsCol };
}

export { getConversationSubCollections };
