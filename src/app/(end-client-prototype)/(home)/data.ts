import { OrganizationsCol } from "@/modules/api";

export const PRODUCTS: OrganizationsCol.ProductsSubCol.Doc[] = [
  {
    id: "1",
    name: "Vivo Controle 8GB",
    description:
      "Plano Vivo Controle com 8GB de internet e ligações ilimitadas.",
    category: "Celular",
    createdAt: 1630512000000,
    updatedAt: 1630512000000,
    orgId: "1",
    prices: [
      {
        unit_amount: 49.9,
        currency: "BRL",
        type: "recurring",
        recurring: {
          interval: "month",
          interval_count: 1,
        },
      },
    ],
    features: [
      "8GB de internet",
      "Ligações ilimitadas",
      "WhatsApp sem consumir dados",
      "SMS ilimitado",
    ],
  },
  {
    id: "2",
    name: "Vivo Fibra 200MB",
    description: "Internet Vivo Fibra com 200MB de velocidade para sua casa.",
    category: "Internet",
    createdAt: 1630512000000,
    updatedAt: 1630512000000,
    orgId: "1",
    prices: [
      {
        unit_amount: 99.9,
        currency: "BRL",
        type: "recurring",
        recurring: {
          interval: "month",
          interval_count: 1,
        },
      },
    ],
    features: [
      "200MB de velocidade",
      "Wi-Fi grátis",
      "Instalação rápida",
      "Suporte técnico 24h",
    ],
  },
  {
    id: "3",
    name: "Vivo TV HD",
    description:
      "Plano Vivo TV com canais em alta definição e conteúdo on-demand.",
    category: "TV",
    createdAt: 1630512000000,
    updatedAt: 1630512000000,
    orgId: "1",
    prices: [
      {
        unit_amount: 79.9,
        currency: "BRL",
        type: "recurring",
        recurring: {
          interval: "month",
          interval_count: 1,
        },
      },
    ],
    features: [
      "Canais em HD",
      "Conteúdo on-demand",
      "Gravação de programas",
      "Suporte via app",
    ],
  },
  {
    id: "4",
    name: "Vivo Combo TV + Internet",
    description: "Plano combo com Vivo TV e internet fibra de 300MB.",
    category: "Internet",
    createdAt: 1630512000000,
    updatedAt: 1630512000000,
    orgId: "1",
    prices: [
      {
        unit_amount: 159.9,
        currency: "BRL",
        type: "recurring",
        recurring: {
          interval: "month",
          interval_count: 1,
        },
      },
    ],
    features: [
      "300MB de internet",
      "Canais em HD",
      "Gravação de programas",
      "Wi-Fi grátis",
    ],
  },
  {
    id: "5",
    name: "Vivo Controle 15GB",
    description:
      "Plano Vivo Controle com 15GB de internet e benefícios exclusivos.",
    category: "Celular",
    createdAt: 1630512000000,
    updatedAt: 1630512000000,
    orgId: "1",
    prices: [
      {
        unit_amount: 69.9,
        currency: "BRL",
        type: "recurring",
        recurring: {
          interval: "month",
          interval_count: 1,
        },
      },
    ],
    features: [
      "15GB de internet",
      "Ligações ilimitadas",
      "WhatsApp sem consumir dados",
      "SMS ilimitado",
    ],
  },
];
