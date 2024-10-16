import { OrganizationsCol } from "../api";

function getAugmentedLastUserPartBody(
  lastPartBody: string,
  embeddings: Embedding[]
): string {
  const embeddingsAsString = embeddings
    .map((embedding) => embedding.embedding.join(","))
    .join(";");
  return `Baseado no contexto de embeddings ${embeddingsAsString} e na última mensagem do usuário: ${lastPartBody}, responda:`;
}

interface Embedding {
  object: string;
  index: number;
  embedding: number[];
}

async function getSimilarEmbeddingsFromVectorStore(
  embedding: Embedding
): Promise<Embedding[]> {
  return [];
}

async function createEmbeddingForConversation(
  conversationParts: OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc[]
): Promise<Embedding> {
  return {
    object: "",
    index: 0,
    embedding: [],
  };
}

async function createAugmentedLastUserPart(
  conversationParts: OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc[],
  embeddings: Embedding[]
): Promise<OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc> {
  const lastUserPart = conversationParts[conversationParts.length - 1];
  return {
    ...lastUserPart,
    body: getAugmentedLastUserPartBody(lastUserPart.body || "", embeddings),
  };
}

async function askLLM(
  conversationParts: OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc[]
): Promise<string> {
  return "";
}

async function chatAnswerRAG(
  conversationParts: OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc[]
): Promise<string> {
  const conversationEmbedding = await createEmbeddingForConversation(
    conversationParts
  );
  const similarEmbeddingsFromVectorStore =
    await getSimilarEmbeddingsFromVectorStore(conversationEmbedding);

  const augmentedLastUserPart = await createAugmentedLastUserPart(
    conversationParts,
    similarEmbeddingsFromVectorStore
  );

  const withReplacedLastUserPart = conversationParts.map((part) =>
    part.id === augmentedLastUserPart.id ? augmentedLastUserPart : part
  );

  const llmAnswer = await askLLM(withReplacedLastUserPart);
  return llmAnswer;
}

export { chatAnswerRAG };
