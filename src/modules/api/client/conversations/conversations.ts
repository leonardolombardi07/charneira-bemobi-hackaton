import { query, where } from "firebase/firestore";
import { getCollections } from "../utils";
import { useCollectionData } from "react-firebase-hooks/firestore";

const { conversationsCol } = getCollections();

function useUserConversations(uid: string) {
  const q = query(conversationsCol, where("membersIds", "array-contains", uid));
  return useCollectionData(q);
}

export { useUserConversations };
