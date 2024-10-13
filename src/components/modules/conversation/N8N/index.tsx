"use client";

import React from "react";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";

export default function N8NChat() {
  React.useEffect(() => {
    createChat({
      webhookUrl:
        "https://n8n.rafaelribeiro.tech/webhook/a0e065dd-e88d-49f0-a5b5-7d886338bdc1/chat",
      target: "#n8n-chat",
      mode: "window",
      chatInputKey: "chatInput",
      chatSessionKey: "sessionId",
      metadata: {},
      showWelcomeScreen: false,
      defaultLanguage: "en",
      i18n: {
        // @ts-ignore
        en: {
          title: "OmniChat™",
          subtitle: "O estado da arte em recomendações personalizadas.",
          footer: "Powered by Bemobi",
          getStarted: "Nova Conversa",
          inputPlaceholder: "Digite sua mensagem...",
        },
      },
      initialMessages: [
        "Olá! 👋",
        "Eu sou o CharnaBot. Fale sobre você e eu te ajudarei a encontrar as melhores ofertas de planos.",
      ],
    });
  }, []);

  return <div></div>;
}
