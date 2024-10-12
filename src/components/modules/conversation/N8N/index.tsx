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
      initialMessages: [
        "Hi there! 👋",
        "My name is Lau. How can I assist you today?",
      ],
      i18n: {
        en: {
          title: "Fala meu amigo! 👋",
          subtitle: "Funciona maneiro?.",
          footer: "",
          getStarted: "Começa a conversa",
          inputPlaceholder: "Escreve algo...",
        },
      },
    });
  }, []);

  return <div></div>;
}
