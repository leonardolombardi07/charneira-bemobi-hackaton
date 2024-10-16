"use client";

import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import ConversationPart from "@/components/modules/conversation/ConversationPart";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import FilledInput from "@mui/material/FilledInput";
import InputAdornment from "@mui/material/InputAdornment";
import { OrganizationsCol } from "@/modules/api/types";
import { useUser } from "@/app/_layout/UserProvider";
import GoogleGenAI, {
  Content,
  HarmBlockThreshold,
  HarmCategory,
} from "@/modules/google-generative-ai";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useOrgProducts } from "@/modules/api/client";
import { useParams } from "next/navigation";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

function createSystemInstruction({
  agent,
  user,
  orgProducts,
}: {
  agent: OrganizationsCol.AgentsSubCol.Doc;
  user: {
    name: string;
  };
  orgProducts: OrganizationsCol.ProductsSubCol.Doc[];
}): Content {
  const AGENT_PROMPT = `Você é um agente de atendimento chamado "${agent.name}", com a seguinte descrição: "${agent.description}".
        Instruções adicionais para você: ${agent.instructions}`;

  const PRODUCTS_PROMPT = `Você tem acesso aos seguintes produtos (enviados em formato JSON) e deve se limitar a falar apenas sobre eles: ${JSON.stringify(
    orgProducts
  )}.`;

  const USER_PROMPT = `O nome do usuário com quem você está conversando é "${user.name}". Certifique-se de usar esse nome em suas respostas para criar uma interação mais pessoal.`;

  return {
    role: "system",
    parts: [
      { text: AGENT_PROMPT },
      { text: PRODUCTS_PROMPT },
      { text: USER_PROMPT },
    ],
  };
}

export default function ConversationDialog({
  agent,
  onClose,
}: {
  agent: OrganizationsCol.AgentsSubCol.Doc;
  onClose: () => void;
}) {
  const params = useParams();
  const orgId = params.orgId as string;
  const { user } = useUser();
  const [orgProducts = [], isLoadingProducts, productsError] =
    useOrgProducts(orgId);

  const [data, setData] = React.useState<
    OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc[]
  >([]);

  const partsListRef = React.useRef<HTMLDivElement>(null);
  function scrollToBottomOfPartsList() {
    partsListRef.current?.scrollTo(0, partsListRef.current?.scrollHeight + 50);
  }

  const [sendLoadingStatus, setSendLoadingStatus] = React.useState<
    "idle" | "sending_user_message" | "loading_ai_response"
  >("idle");
  const [sendError, setSendError] = React.useState<string | null>(null);

  React.useEffect(
    function scrollWhenLoadingAiResponse() {
      if (sendLoadingStatus === "loading_ai_response") {
        scrollToBottomOfPartsList();
      }
    },
    [sendLoadingStatus]
  );

  async function onSend(message: string) {
    if (sendLoadingStatus !== "idle") {
      return;
    }

    if (isLoadingProducts) {
      setSendError("Carregando produtos... Por favor, aguarde.");
      return;
    }

    if (productsError) {
      setSendError("Algum erro inesperado ocorreu");
      return;
    }

    setSendError(null);

    try {
      setSendLoadingStatus("sending_user_message");

      const userPart: OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc = {
        id: "user-temporary",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        notifiedAt: Date.now(),
        author: {
          id: user.uid,
          type: "user",
          name: user.displayName || "Anônimo",
          photoURL: user.photoURL || "",
        },
        replyOptions: [],
        type: "comment",
        body: message,
      };
      setData((prev) => [...prev, userPart]);

      setSendLoadingStatus("loading_ai_response");
      const model = GoogleGenAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const chat = model.startChat({
        systemInstruction: createSystemInstruction({
          agent,
          user: {
            name: user.displayName || "Anônimo",
          },
          orgProducts,
        }),
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
        ],
        history: [
          ...data
            .filter((p) => Boolean(p.body))
            .map((p) => ({
              role: authorTypeToGoogleGenAIRole(p.author.type),
              parts: [{ text: p.body || "" }],
            })),
        ],
      });

      let aiPart: OrganizationsCol.ConversationsSubCol.PartsSubCol.Doc = {
        id: agent.id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        notifiedAt: Date.now(),
        author: {
          id: `gemini-1.5-flash`,
          name: agent.name,
          type: "bot",
          photoURL: "",
        },
        replyOptions: [],
        type: "comment",
        body: "",
      };
      setData((prev) => [...prev, aiPart]);

      const result = await chat.sendMessageStream(message);
      for await (const chunk of result.stream) {
        aiPart = {
          ...aiPart,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          notifiedAt: Date.now(),
          body: (aiPart.body || "") + chunk.text(),
        };
        setData((prev) => [...prev.slice(0, prev.length - 1), aiPart]);
      }
    } catch (error: any) {
      setSendError(error?.message || "Erro ao enviar mensagem");
    } finally {
      setSendLoadingStatus("idle");
    }
  }

  function onReply(
    replyOption: OrganizationsCol.ConversationsSubCol.PartsSubCol.ConversationPartReplyOption
  ) {
    onSend(replyOption.text);
  }

  const dataToUse = data.toReversed(); // Because we are using column-reverse

  return (
    <Dialog
      open={true}
      onClose={onClose}
      sx={
        {
          // minWidth: "400px",
        }
      }
      maxWidth="lg"
      keepMounted={false}
    >
      <DialogContent
        sx={{
          p: 0,
        }}
      >
        <Box
          sx={{
            height: 500,
            maxHeight: "100%",
            width: 600,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            // overflow: "hidden",
          }}
        >
          <Header
            agent={agent}
            onClose={onClose}
            sx={{
              position: "sticky",
              top: 0,
            }}
          />

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              marginBottom: "70px",
              display: "flex",

              // Make sure the scroll always starts at the bottom
              flexDirection: "column-reverse",
            }}
            ref={partsListRef}
          >
            {sendError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <AlertTitle>Erro</AlertTitle>
                {sendError}
              </Alert>
            )}

            {dataToUse.map((p) => (
              <ConversationPart
                key={p.id}
                part={p}
                part_type={p.type}
                onReply={onReply}
              />
            ))}

            <Box sx={{ flexGrow: 1 }} />

            <SendMessage
              onSend={onSend}
              isLoading={sendLoadingStatus !== "idle"}
              sx={{
                px: 1,
                mb: 1,
                height: "70px",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
              }}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function Header({
  agent,
  onClose,
  sx,
}: {
  agent: OrganizationsCol.AgentsSubCol.Doc;
  onClose: () => void;
  sx?: BoxProps["sx"];
}) {
  return (
    <Box
      sx={{
        ...sx,
        py: 1,
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          ...sx,
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="close"
          onClick={onClose}
          sx={{ mx: 1 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" component="div">
          {agent.name}
        </Typography>
      </Box>
    </Box>
  );
}

function SendMessage({
  onSend,
  isLoading,
  sx,
}: {
  onSend: (message: string) => void;
  isLoading: boolean;
  sx?: BoxProps["sx"];
}) {
  const [message, setMessage] = React.useState("");
  const disableSend = isLoading || message.trim().length === 0;

  function _onSend() {
    if (!disableSend) {
      onSend(message);
      setMessage("");
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        ...sx,
      }}
    >
      <FormControl sx={{ m: 1, width: "100%" }} variant="filled">
        <FilledInput
          autoFocus
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              _onSend();
            }
          }}
          multiline
          placeholder="Escrever mensagem"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                edge="end"
                disabled={disableSend}
                onClick={_onSend}
                sx={{
                  bgcolor: "background.paper",
                  mx: 0.5,
                  mb: 2.5, // For some reason, when multiline we need this to centralize the icon
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <SendIcon />
                )}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </Box>
  );
}

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
