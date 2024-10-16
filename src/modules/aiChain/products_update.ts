import { OrganizationsCol } from "../api";

async function onOrgProductCreated(
  orgId: string,
  product: OrganizationsCol.ProductsSubCol.Doc
) {}

async function onOrgProductUpdated(
  orgId: string,
  updatedProduct: OrganizationsCol.ProductsSubCol.Doc
) {}

async function onOrgProductDeleted(orgId: string, deletedProductId: string) {}

export const VectorStore = {
  onOrgProductCreated,
  onOrgProductUpdated,
  onOrgProductDeleted,
};
