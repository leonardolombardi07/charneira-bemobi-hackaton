import { doc, setDoc } from "firebase/firestore";
import { getCollections } from "../../utils";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { UsersCol } from "../../../types";

const { usersCol } = getCollections();

function useFirestoreUser(uid: string | undefined) {
  const [item, isLoading, error] = useDocumentData(
    doc(usersCol, uid || "forceError")
  );
  return [item, isLoading, error] as const;
}

async function updateUser(userId: string, data: Partial<UsersCol.Doc>) {
  await setDoc(
    doc(usersCol, userId),
    {
      ...data,
    },
    { merge: true }
  );
}

export { useFirestoreUser, updateUser };
export * from "./avatar";
