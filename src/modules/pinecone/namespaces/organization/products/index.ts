import { getPineconeIndex, QueryOptions } from "@/modules/pinecone";

type ProductNamespaceRecordMetadata = {
  id: string;
};

function getOrgProductsIndexNamespace(orgId: string) {
  return getPineconeIndex<ProductNamespaceRecordMetadata>().namespace(
    `${orgId}-products`
  );
}

async function updateOrgProductEmbedding(orgId: string, productId: string) {
  return getOrgProductsIndexNamespace(orgId).update({
    id: productId,
    // TODO
  });
}

async function deleteOrgProductEmbedding(orgId: string, productId: string) {
  return getOrgProductsIndexNamespace(orgId).deleteOne(productId);
}

async function createOrgProductEmbedding(orgId: string, productId: string) {
  return getOrgProductsIndexNamespace(orgId).upsert([
    {
      id: productId,
      values: [],
      metadata: {},
      // TODO
    },
  ]);
}

async function queryOrgProductEmbeddings(orgId: string, options: QueryOptions) {
  return getOrgProductsIndexNamespace(orgId).query(options);
}

export {
  updateOrgProductEmbedding,
  deleteOrgProductEmbedding,
  createOrgProductEmbedding,
  queryOrgProductEmbeddings,
};
