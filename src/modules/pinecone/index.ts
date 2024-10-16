"use server";

import { Pinecone, RecordMetadata } from "@pinecone-database/pinecone";

const PINECONE_DEVELOPMENT_INDEX_NAME = "TODO";
const PINECONE_PRODUCTION_INDEX_NAME = "TODO";

const pinecone = new Pinecone({
  apiKey: "TODO",
});

function getPineconeIndex<T extends RecordMetadata = RecordMetadata>() {
  return pinecone.index<T>(
    process.env.NODE_ENV === "production"
      ? PINECONE_PRODUCTION_INDEX_NAME
      : PINECONE_DEVELOPMENT_INDEX_NAME
  );
}

export { getPineconeIndex };
export * from "@pinecone-database/pinecone";
export default pinecone;
