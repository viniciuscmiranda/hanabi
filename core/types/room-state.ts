export type RoomState = {
  players: {
    name: string;
    isMe: boolean;
    ready: boolean;
  }[];
};
