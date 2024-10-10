import { query, where, documentId, getDocs } from "firebase/firestore";
import { useCollectionDataWithIds } from "../utils/hooks";
import { getCollections } from "../utils";
import { UsersCol } from "../../types";

const { usersCol } = getCollections();

async function getUsers(ids: string[]) {
  const snap = await getDocs(query(usersCol, where(documentId(), "in", ids)));
  if (snap.empty) {
    throw new Error("Not found");
  }

  if (snap.size !== ids.length) {
    throw new Error("Some not found");
  }

  return snap.docs.map((d) => ({ ...d.data() }));
}

function useUsers(
  userIds: string[]
): [(UsersCol.Doc & { id: string })[] | undefined, boolean, Error | undefined] {
  // This way we don't generate a new array every time we change the order of user ids
  const orderedSet = Array.from(new Set(userIds)).sort();

  const q =
    orderedSet.length === 0
      ? null
      : query(usersCol, where(documentId(), "in", orderedSet));

  return useCollectionDataWithIds(q);
}

export { useUsers, getUsers };
