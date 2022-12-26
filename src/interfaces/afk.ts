export interface AFK {
  UserID: string;
  GuildID: string;
  MessageID: string;
  ChannelID: string;
  OldName: string;
  Reason: string;
}

export interface AFKInput {
  MessageID?: bigint | number;
  ChannelID?: bigint | number;
  OldName?: string;
  Reason?: string;
}
