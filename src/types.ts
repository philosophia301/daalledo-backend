export interface ChatMessage {
  id: string;
  avatar: string;
  name: string;
  badge: {
    label: string;
    variant: "local" | "visitor";
  };
  content: string;
  timestamp: number;
}

export interface UserIdentity {
  avatar: string;
  name: string;
  badge: {
    label: string;
    variant: "local" | "visitor";
  };
}

// Client → Server
export type WSClientEvent = {
  type: "send_message";
  content: string;
};

// Server → Client
export type WSServerEvent =
  | {
      type: "init";
      user: UserIdentity;
      messages: ChatMessage[];
      onlineCount: number;
    }
  | {
      type: "new_message";
      message: ChatMessage;
    }
  | {
      type: "online_count";
      count: number;
    };
