"use client";

import React from "react";
import {
  getOrganizationById,
  getOrgConversationsWithParts,
  getOrgProducts,
} from "@/modules/api/client";
import { useParams } from "next/navigation";
import { OrganizationsCol } from "@/modules/api";
import GoogleGenAI from "@/modules/google-generative-ai";
import z from "zod";

export default function useRecommendations() {
  const params = useParams();
  const orgId = params.orgId as string;

  const [recommendations, setRecommendations] = React.useState<
    OrganizationsCol.ProductsSubCol.Doc[]
  >([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchRecommendations = React.useCallback(async () => {
    if (isFetching) return;

    setIsFetching(true);
    setError(null);

    try {
      const recommendations = await askAIForProductRecommendations(orgId);
      setRecommendations(recommendations);
    } catch (error: any) {
      setError(error.message || "Algum erro ocorreu");
    } finally {
      setIsFetching(false);
    }
  }, [orgId]);

  React.useEffect(() => {
    fetchRecommendations();
  }, [orgId]);

  return {
    data: recommendations,
    setData: setRecommendations,
    isLoading: isFetching,
    error: error,
    fetchRecommendations,
  };
}

async function askAIForProductRecommendations(
  orgId: string
): Promise<OrganizationsCol.ProductsSubCol.Doc[]> {
  try {
    const [organization, products, conversationsWithParts] = await Promise.all([
      getOrganizationById(orgId),
      getOrgProducts(orgId),
      getOrgConversationsWithParts(orgId),
    ]);
    const PRODUCTS_AS_CSV_STRING = products
      .map((p) => {
        return `${p.name}, ${p.description}, ${p.category}`;
      })
      .join("\n");
    const CONVERSATION_DATA_AS_JSON = JSON.stringify(conversationsWithParts);

    const SYSTEM_INSTRUCTION_TEXT = `You are the best AI in the world and need to recommend products to the user.

    The user is an employee for company ${organization.name} and is looking for ideas of products to sell based on data from the company - particularly the conversations (interactions between clients and AI agents/other employees) and the catalog of products that the company has.

    The company has ${products.length} products and ${conversationsWithParts.length} conversations.

    The products are (in CSV format):
    ${PRODUCTS_AS_CSV_STRING}

    The conversations data (in JSON format):
    ${CONVERSATION_DATA_AS_JSON}

    Based on the conversations and the products the company has, recommend products in a strictly JSON format.
    It is important that the recommendations do not exist on the current products: they should be something new based on the products of the company and the conversations. 

    IMPORTANT: Return ONLY a JSON array of the recommended products. Do NOT include any additional text, explanations, or comments. The JSON should follow the structure of ProductArray as defined in Typescript types:
    ${TYPESCRIPT_TYPES_AS_STRING}

    Again: only JSON. No notes, no \`\`\`json before, just the data. 
    A valid answer would be:
    [
      {
        "id": "agua-2l",
        "orgId": "aguas-crystal",
        "name": "Água 2L",
        "description": "Perfeita para quem precisa de bastante água e gosta de praticidade.",
        "createdAt": 1729326570700,
        "updatedAt": 1729326570700,
        "category": "Água",
        "prices": [
          {
            "unit_amount": 500,
            "currency": "BRL",
            "type": "recurring",
            "recurring": {
              "interval": "month",
              "interval_count": 1
            }
          }
        ],
        "features": [
          "2 Litros",
          "Prática"
        ]
      },
      {
        "id": "agua-600ml",
        "orgId": "aguas-crystal",
        "name": "Água 600ml",
        "description": "Ideal para quem busca uma opção mais compacta, ideal para levar na bolsa ou mochila.",
        "createdAt": 1729326570700,
        "updatedAt": 1729326570700,
        "category": "Água",
        "prices": [
          {
            "unit_amount": 300,
            "currency": "BRL",
            "type": "recurring",
            "recurring": {
              "interval": "month",
              "interval_count": 1
            }
          }
        ],
        "features": [
          "600ml",
          "Compacta"
        ]
      },
      {
        "id": "agua-300ml",
        "orgId": "aguas-crystal",
        "name": "Água 300ml",
        "description": "A escolha perfeita para quem busca praticidade e quer ter sempre água fresca à mão.",
        "createdAt": 1729326570700,
        "updatedAt": 1729326570700,
        "category": "Água",
        "prices": [
          {
            "unit_amount": 200,
            "currency": "BRL",
            "type": "recurring",
            "recurring": {
              "interval": "month",
              "interval_count": 1
            }
          }
        ],
        "features": [
          "300ml",
          "Praticidade"
        ]
      }
    ]
    `;

    const model = GoogleGenAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent([SYSTEM_INSTRUCTION_TEXT]);

    const text = result.response.text();
    console.log(`AI Text response: `, text);

    const json = JSON.parse(result.response.text());

    return ProductArray.parse(json);
  } catch (error: any) {
    console.log("Error asking AI for recommendations: ", error);
    console.log(error.message);
    throw error;
  }
}

const Price = z.object({
  unit_amount: z.number(),
  currency: z.string(),
  type: z.literal("recurring"),
  recurring: z.object({
    interval: z.enum(["month", "year"]),
    interval_count: z.number(),
  }),
});

const Product = z.object({
  id: z.string(),
  orgId: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  category: z.string(),
  prices: z.array(Price),
  features: z.array(z.string()),
});

const ProductArray = z.array(Product);

const TYPESCRIPT_TYPES_AS_STRING = `
interface Price {
  unit_amount: number;
  currency: string;
  type: "recurring" ;
  recurring?: {
    interval: "month" | "year";
    interval_count: number;
  };
}

interface Product {
  id: ProductId;
  orgId: OrganizationId;
  name: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  category: string;
  prices: Price[];
  features: string[];
}

type ProductArray = Product[];
`;
