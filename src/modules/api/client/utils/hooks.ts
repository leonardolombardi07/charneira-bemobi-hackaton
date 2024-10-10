import { DocumentData, Query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

export function useCollectionDataWithIds<T = DocumentData>(
  query: Query<T> | null | undefined,
  options?: Parameters<typeof useCollection>[1]
): [(T & { id: string })[] | undefined, boolean, Error | undefined] {
  const [snap, loading, error] = useCollection(query, options);

  const dataWithIds = snap?.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return [dataWithIds, loading, error] as const;
}
