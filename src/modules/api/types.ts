type UserId = string;
type ConversationId = string;
type ConversationPartId = string;
type Timestamp = number;

export namespace UsersCol {
  export interface Subscription {
    id: string;
    productId: string;
    price: ProductsCol.Price;
  }

  export interface Doc {
    id: UserId;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    name: string;
    photoURL: string;
    subscriptions: Subscription[];
  }
}

export namespace ProductsCol {
  export interface Price {
    id: string;
    product: string;
    unit_amount: number;
    currency: string;
    type: "recurring" | "one_time";
    recurring?: {
      interval: "month";
      interval_count: number;
    };
  }

  export interface Doc {
    id: string;
    name: string;
    description: string;
    category: string;
    prices: Price[];
    features: string[];
  }
}

export namespace ConversationsCol {
  export interface Doc {
    id: ConversationId;
    title: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    membersIds: UserId[];
    lastPart: PartsSubCol.Doc | null;
  }

  export namespace PartsSubCol {
    export interface ConversationPartAuthor {
      id: UserId;
      type: "user" | "bot";
      name: string;
      photoURL: string;
    }

    export interface ConversationPartReplyOption {
      id: string;
      text: string;
    }

    export interface Doc {
      id: ConversationPartId;
      type: "comment" | "quick_reply";
      body: string | null;
      createdAt: Timestamp;
      updatedAt: Timestamp;
      notifiedAt: Timestamp;
      author: ConversationPartAuthor;
      replyOptions: ConversationPartReplyOption[];
    }
  }
}

export type CollectionName = "users" | "conversations" | "products";
