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
  return Math.random().toString(36).substring(16);
}

function ChatAppProvider({ children, context, app_id }: ChatAppProviderProps) {
  const conversationId = React.useRef<string>(generateRandomId());

  const [parts, setParts] = React.useState<
    OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc[]
  >([]);

  const [organization, isLoadingOrganization, loadingOrganizationError] =
    useOrganizationById(app_id);

  const [agent, isLoadingAgent, loadingAgentError] = useChatAgent({ app_id });
  const [products = [], isLoadingProducts, loadingProductsError] =
    useOrgProducts(app_id);

  const initializationStatus =
    isLoadingAgent || isLoadingProducts || isLoadingOrganization
      ? "loading"
      : "idle";

  const initializationError =
    loadingAgentError || loadingProductsError || loadingOrganizationError;

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

        const userPart: OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc = {
          id: "user-temporary",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          notifiedAt: Date.now(),
          author: {
            id: user.id,
            type: "user",
            name: user.name,
            photoURL: user.photoURL,
          },
          replyOptions: [],
          type: "comment",
          body: message,
        };
        setParts((prev) => [...prev, userPart]);

        setSendLoadingStatus("loading_ai_response");
        let aiPart: OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc = {
          id: "ai-temporary",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          notifiedAt: Date.now(),
          author: {
            id: agent.id,
            name: agent.name,
            type: "bot",
            photoURL: "",
          },
          replyOptions: [],
          type: "comment",
          body: "",
        };
        setParts((prev) => [...prev, aiPart]);

        const agentAsModel = getAgentAsModel({
          systemInstruction: getSystemInstructionFromContext({
            organization,
            agent,
            context,
            products,
          }),
          safetySettings: DEFAULT_SAFE_SETTINGS,
          history: [
            ...parts
              .filter((p) => Boolean(p.body))
              .map((p) => ({
                role: authorTypeToGoogleGenAIRole(p.author.type),
                parts: [{ text: p.body || "" }],
              })),
          ],
        });
        const result = await agentAsModel.sendMessageStream(message);
        for await (const chunk of result.stream) {
          aiPart = {
            ...aiPart,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            notifiedAt: Date.now(),
            body: (aiPart.body || "") + chunk.text(),
          };
          setParts((prev) => [...prev.slice(0, prev.length - 1), aiPart]);
        }

        await createConversationParts(organization.id, conversationId.current, [
          userPart,
          aiPart,
        ]);
      } catch (error: any) {
        setSendError(error?.message || "Erro ao enviar mensagem");
      } finally {
        setSendLoadingStatus("idle");
      }
    },
    [
      user,
      agent,
      setSendError,
      setSendLoadingStatus,
      setParts,
      sendStatus,
      parts,
      loadingProductsError,
      products,
      organization,
      initializationStatus,
      context,
    ]
  );

  return (
    <ReactChatAppContext.Provider
      value={{
        parts,
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

function getSystemInstructionFromContext({
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

export default ChatAppProvider;
export { useChatApp };
