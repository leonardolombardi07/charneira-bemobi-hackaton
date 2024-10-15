type UserId = string;
type ConversationId = string;
type ConversationPartId = string;
type Timestamp = number;

export namespace UsersCol {
  export interface Doc {
    id: UserId;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    name: string;
    photoURL: string;
  }
}

export namespace OrganizationsCol {
  export interface Doc {
    id: string;
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
      id: string;
      orgId: string;
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
    export interface Doc {
      id: ConversationId;
      orgId: string;
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

  export namespace AgentsSubCol {
    export interface UIConfig {
      alignment: "left" | "right";
      color: string;
      logoUrl: string | null;
      secondaryColor: string;
      verticalPadding: number;
      horizontalPadding: number;
    }

    export interface Doc {
      id: string;
      orgId: string;
      name: string;
      description: string;
      createdAt: Timestamp;
      updatedAt: Timestamp;
      prompts: string[];
      uiConfig: UIConfig;
    }
  }
}

export type CollectionName = "users" | "organizations";
export type CollectionGroupName = "members";
