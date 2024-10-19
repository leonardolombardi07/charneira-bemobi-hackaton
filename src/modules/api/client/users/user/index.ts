import { doc, setDoc } from "firebase/firestore";
import { getCollections } from "../../utils";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { getServices } from "../../services";
import { UsersCol } from "../../../types";

const { auth } = getServices();
const { usersCol } = getCollections();

function useFirestoreUser() {
  const userId = auth.currentUser?.uid;
  const [item, isLoading, error] = useDocumentData(
    doc(usersCol, userId || "forceError")
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
