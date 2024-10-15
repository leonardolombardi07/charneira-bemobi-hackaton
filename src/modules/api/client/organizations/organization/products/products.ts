import { doc, writeBatch } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getServices } from "@/modules/api/client/services";
import { OrganizationsCol } from "@/modules/api/types";
import { getOrganizationSubcollections } from "../utils";

const { firestore } = getServices();

function useOrgProducts(orgId: string) {
  const { productsCol } = getOrganizationSubcollections(orgId);
  return useCollectionData(productsCol);
}

export type UpdateProductData =
  Partial<OrganizationsCol.ConversationsSubCol.Doc> & {
    orgId: string;
  };

function updateProducts(data: UpdateProductData[]) {
  const batch = writeBatch(firestore);
  for (const item of data) {
    const { productsCol } = getOrganizationSubcollections(item.orgId);
    const cDoc = doc(productsCol, item.id);
    batch.set(cDoc, { ...item }, { merge: true });
  }
  return batch.commit();
}

export { useOrgProducts, updateProducts };
