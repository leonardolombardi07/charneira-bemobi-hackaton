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

export namespace ConversationsCol {
  export interface Doc {
    id: ConversationId;
    title: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    membersIds: UserId[];
    lastPart: PartsSubCol.Doc;
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

export type CollectionName = "users" | "conversations";
