import { ConversationsCol } from "@/modules/api/types";
import { getCollections } from "../../utils";
import { CollectionReference, collection } from "firebase/firestore";

const { conversationsCol } = getCollections();

function getConversationSubCollections(cId: string) {
  const partsCol = collection(
    conversationsCol,
    cId,
    "parts"
  ) as CollectionReference<ConversationsCol.PartsSubCol.Doc>;

  return { partsCol };
}

export { getConversationSubCollections };
