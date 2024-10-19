"use client";

import React from "react";
import { OrganizationsCol, UsersCol } from "@/modules/api";
import GoogleGenAI, {
  Content,
  HarmBlockThreshold,
  HarmCategory,
  SafetySetting,
  StartChatParams,
} from "@/modules/google-generative-ai";
import {
  createConversationParts,
  updateConversation,
  useConversationParts,
  useOrgAgents,
  useOrganizationById,
  useOrgProducts,
} from "@/modules/api/client";

/* IMPORTANT INFO:
Leo: This is a bit confusing code. I was having ideas while coding and implementing them.

My idea here is that an organization has many agents and many apps.
Each app has a context, which is a way to pass information from the moment the user opens the chat until the moment the user closes it.

Right now, app_id and org_id are equivalent.
But in the future, we might have multiple apps per organization.
*/

type ChatAppContext = {
  parts: OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc[];

  initializationStatus: "idle" | "loading";
  initializationError: string | null;

  sendStatus: "idle" | "sending_user_message" | "loading_ai_response";
  sendError: string | null;
  send: (message: string) => Promise<void>;
};

const ReactChatAppContext = React.createContext<ChatAppContext | null>(null);

type AppContext = {
  // Context is a way to passing information from the moment the user opens the
  // chat until the moment the user closes it

  // Leo: Right now we are hardcoding this. But I would like to make an
  // architecture where we can somehow transform "templates" of contexts into
  // structured data
  user: UsersCol.Doc;
};

export interface ChatAppInput {
  app_id: string;
  context: AppContext;
}

export type ChatAppProviderProps = ChatAppInput & {
  children: React.ReactNode;
};

function generateRandomId() {
  return Math.random().toString(36).substring(7);
}

function ChatAppProvider({ children, context, app_id }: ChatAppProviderProps) {
  const conversationIdRef = React.useRef<string>(generateRandomId());
  const conversationId = conversationIdRef.current;
  const orgId = app_id;

  const [parts = [], isLoadingParts, loadingPartsError] = useConversationParts({
    orgId,
    conversationId,
  });
  const [temporaryParts, setTemporaryParts] = React.useState<
    OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc[]
  >([]);

  const [organization, isLoadingOrganization, loadingOrganizationError] =
    useOrganizationById(orgId);

  const [agent, isLoadingAgent, loadingAgentError] = useChatAgent({
    app_id: orgId,
  });
  const [products = [], isLoadingProducts, loadingProductsError] =
    useOrgProducts(orgId);

  const initializationStatus =
    isLoadingAgent ||
    isLoadingProducts ||
    isLoadingOrganization ||
    isLoadingParts
      ? "loading"
      : "idle";

  const initializationError =
    loadingAgentError ||
    loadingProductsError ||
    loadingOrganizationError ||
    loadingPartsError;

  const [sendStatus, setSendLoadingStatus] = React.useState<
    "idle" | "sending_user_message" | "loading_ai_response"
  >("idle");
  const [sendError, setSendError] = React.useState<string | null>(null);

  const user = getUserFromAppContext(context);

  const send = React.useCallback(
    async function (message: string) {
      if (sendStatus !== "idle") {
        return;
      }

      // TODO
      // Leo: Of course we would fallback to other chat interactions in this case... think about this later

      if (initializationStatus === "loading") {
        return setSendError(
          "Os dados estão sendo inicializados... Aguarde um momento."
        );
      }

      if (loadingProductsError) {
        return setSendError(
          "Algum erro ocorreu ao carregar os dados necessários para essa conversa."
        );
      }

      if (!organization) return setSendError("Organização não encontrada");
      if (!agent) return setSendError("Agente não encontrado");

      setSendError(null);

      try {
        setSendLoadingStatus("sending_user_message");
        setTemporaryParts(parts);

        const userPart = createCommentPart({
          author: {
            id: user.id,
            type: "user",
            name: user.name,
            photoURL: user.photoURL,
          },
          body: message,
        });
        setTemporaryParts((prev) => [...prev, userPart]);

        setSendLoadingStatus("loading_ai_response");

        let aiPart = createCommentPart({
          author: {
            id: agent.id,
            name: agent.name,
            type: "bot",
            photoURL: "",
          },
          body: "",
        });
        setTemporaryParts((prev) => [...prev, aiPart]);

        const isFirstPart = parts.length === 0;

        const baseConversationData: Partial<OrganizationsCol.ConversationsSubCol.Doc> & {
          orgId: string;
        } = {
          id: conversationId,
          orgId,
          members: {
            [user.id]: {
              id: user.id,
              type: "user",
              name: user.name,
              photoURL: user.photoURL,
            },
            [agent.id]: {
              id: agent.id,
              type: "bot",
              name: agent.name,
              photoURL: "",
            },
          },
        };

        if (isFirstPart) {
          await updateConversation(conversationId, baseConversationData);
        }

        const agentAsModel = getAgentAsModel({
          systemInstruction: getSystemInstruction({
            organization,
            agent,
            context,
            products,
          }),
          safetySettings: DEFAULT_SAFE_SETTINGS,
          history: partsToHistory(parts),
        });

        const result = await agentAsModel.sendMessageStream(message);
        for await (const chunk of result.stream) {
          aiPart = {
            ...aiPart,
            updatedAt: Date.now(),
            notifiedAt: Date.now(),
            body: (aiPart.body || "") + chunk.text(),
          };
          setTemporaryParts((prev) => [
            ...prev.slice(0, prev.length - 1),
            aiPart,
          ]);
        }

        // Heads up: we need this await, otherwise the parts state
        // will not be updated after this function runs and the UI
        // will rollback to the previous state
        await createConversationParts(orgId, conversationId, [
          userPart,
          aiPart,
        ]);

        if (!isFirstPart) {
          // We don't need the user to know we are doing background work after here
          // If it is the first part, its important to update the conversation
          setSendLoadingStatus("idle");
        }

        const ASK_FOR_TITLE_PROMPT = `Baseado nas mensagens anteriores dessa conversa, responda com APENAS UM bom título com no máximo 10 palavras. Mas realmente tente dar um título - como, se for uma conversa vaga ou estranha, tente dar um título que capture isso. Não responda com coisas como "Por favor, me forneça mais contexto"`;

        const updatedAgentAsModel = getAgentAsModel({
          systemInstruction: getSystemInstruction({
            organization,
            agent,
            context,
            products,
          }),
          safetySettings: DEFAULT_SAFE_SETTINGS,
          history: [
            ...partsToHistory([...parts, userPart, aiPart]),
            {
              role: "model",
              parts: [{ text: ASK_FOR_TITLE_PROMPT }],
            },
          ],
        });

        const titleResult = await updatedAgentAsModel.sendMessage("");

        updateConversation(conversationId, {
          ...baseConversationData,
          title: titleResult.response.text(),
          lastPart: aiPart,
        });
      } catch (error: any) {
        setSendError(error?.message || "Erro ao enviar mensagem");
      } finally {
        setSendLoadingStatus("idle");
        setTemporaryParts([]);
      }
    },
    [
      user,
      agent,
      setSendError,
      setSendLoadingStatus,
      sendStatus,
      parts,
      loadingProductsError,
      products,
      organization,
      initializationStatus,
      context,
      setTemporaryParts,
      conversationId,
      orgId,
    ]
  );

  const partsToUse =
    sendStatus === "loading_ai_response" ? temporaryParts : parts;

  return (
    <ReactChatAppContext.Provider
      value={{
        parts: partsToUse,
        initializationStatus,
        initializationError: initializationError?.message || null,
        sendStatus,
        sendError,
        send,
      }}
    >
      {children}
    </ReactChatAppContext.Provider>
  );
}

function useChatApp() {
  const context = React.useContext(ReactChatAppContext);
  if (context === null) {
    throw new Error("useChatApp must be used within a ChatAppProvider");
  }
  return context;
}

function getUserFromAppContext({
  user,
}: ChatAppInput["context"]): UsersCol.Doc {
  // In the future, the context might not have a user
  return user;
}

function getAgentAsModel(startChatParams: StartChatParams) {
  const model = GoogleGenAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  const chat = model.startChat(startChatParams);
  return chat;
}

function getSystemInstruction({
  organization,
  agent,
  context,
  products,
}: {
  organization: OrganizationsCol.Doc;
  agent: OrganizationsCol.AgentsSubCol.Doc;
  context: AppContext;
  products: OrganizationsCol.ProductsSubCol.Doc[];
}): Content {
  const AGENT_PROMPT = `Você é um agente de atendimento chamado "${agent.name}", com a seguinte descrição: "${agent.description}".
        Instruções adicionais para você: ${agent.instructions}`;

  const ORG_PROMPT = `Você está conversando com um cliente da organização "${organization.name}".`;

  const PRODUCTS_PROMPT = `Você tem acesso aos seguintes produtos (enviados em formato JSON) e deve se limitar a falar apenas sobre eles: ${JSON.stringify(
    products
  )}. Se não souber sobre um produto, você pode dizer que não tem informações sobre ele.`;

  const user = getUserFromAppContext(context);
  const CONTEXT_PROMPT = `O nome do usuário com quem você está conversando é "${user.name}". Certifique-se de usar esse nome em suas respostas para criar uma interação mais pessoal.`;

  return {
    role: "system",
    parts: [
      { text: AGENT_PROMPT },
      { text: ORG_PROMPT },
      { text: PRODUCTS_PROMPT },
      { text: CONTEXT_PROMPT },
    ],
  };
}

function useChatAgent({ app_id }: { app_id: ChatAppInput["app_id"] }) {
  const [agents, isLoading, error] = useOrgAgents(app_id);
  return [agents ? agents[0] : undefined, isLoading, error] as const;
}

function createCommentPart(
  data: Omit<
    OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc,
    "id" | "createdAt" | "updatedAt" | "notifiedAt" | "replyOptions" | "type"
  >
): OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc {
  return {
    id: generateRandomId(),
    type: "comment",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    notifiedAt: Date.now(),
    replyOptions: [],
    ...data,
  };
}

const DEFAULT_SAFE_SETTINGS: SafetySetting[] = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

type GoogleGenAIRole = "user" | "model" | "function" | "system";

function authorTypeToGoogleGenAIRole(
  type: OrganizationsCol.ConversationsSubCol.PartsSubCol.ConversationPartAuthor["type"]
): GoogleGenAIRole {
  switch (type) {
    case "user":
      return "user";
    case "bot":
      return "model";
    default:
      return "system";
  }
}

function partsToHistory(
  parts: OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc[]
): Content[] {
  return parts.filter(Boolean).map((part) => ({
    role: authorTypeToGoogleGenAIRole(part.author.type),
    parts: [{ text: part.body || "" }],
  }));
}

export default ChatAppProvider;
export { useChatApp };
