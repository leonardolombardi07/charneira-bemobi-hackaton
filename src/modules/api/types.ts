type UserId = string;
type ConversationId = string;
type OrganizationId = string;
type ProductId = string;
type AgentId = string;
type ConversationPartId = string;
type Timestamp = number;

export namespace UsersCol {
  export interface Doc {
    id: UserId;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    name: string;
    aboutMe: string;
    photoURL: string;
  }
}

export namespace OrganizationsCol {
  export interface Doc {
    id: OrganizationId;
    name: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    photoURL: string;
  }

  export namespace MembersSubCol {
    export interface Doc {
      id: UserId;
      orgId: string;
      role: "member";
      createdAt: Timestamp;
      updatedAt: Timestamp;
      name: string;
      photoURL: string;
    }
  }

  export namespace ProductsSubCol {
    export interface Price {
      unit_amount: number;
      currency: string;
      type: "recurring" | "one_time";
      recurring?: {
        interval: "month" | "year";
        interval_count: number;
      };
    }

    export interface Doc {
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
  }

  export namespace ConversationsSubCol {
    export interface ConversationMember {
      id: UserId;
      name: string;
      photoURL: string;
    }

    export interface Doc {
      id: ConversationId;
      orgId: OrganizationId;
      title: string;
      createdAt: Timestamp;
      updatedAt: Timestamp;
      members: {
        [userId: UserId]: ConversationMember;
      };
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

  export namespace AgentsSubCol {
    export interface Doc {
      id: AgentId;
      orgId: OrganizationId;
      name: string;
      description: string;
      instructions: string;
      createdAt: Timestamp;
      updatedAt: Timestamp;
    }
  }
}

export type CollectionName = "users" | "organizations";
export type CollectionGroupName = "members" | "conversations";
