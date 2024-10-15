import { doc, setDoc } from "firebase/firestore";
import { OrganizationsCol } from "@/modules/api/types";
import { getOrganizationSubcollections } from "../../utils";
import { UpdateProductData } from "../products";

type CreateProductData = Omit<OrganizationsCol.ProductsSubCol.Doc, "id">;

function createProduct(data: CreateProductData) {
  const { productsCol } = getOrganizationSubcollections(data.orgId);
  const pDoc = doc(productsCol);
  setDoc(pDoc, { id: pDoc.id, ...data }, { merge: true });
  return {
    id: pDoc.id,
  };
}

function updateProduct(id: string, data: UpdateProductData) {
  const { productsCol } = getOrganizationSubcollections(data.orgId);
  const pDoc = doc(productsCol, id);
  setDoc(pDoc, { updatedAt: Date.now(), ...data }, { merge: true });
}

export { createProduct, updateProduct };
