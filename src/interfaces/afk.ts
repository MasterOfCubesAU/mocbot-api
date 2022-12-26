export interface AFK {
  UserID: bigint | number;
  GuildID: bigint | number;
  MessageID: bigint | number;
  ChannelID: bigint | number;
  OldName: string;
  Reason: string;
}

export interface AFKInput {
  MessageID?: bigint | number;
  ChannelID?: bigint | number;
  OldName?: string;
  Reason?: string;
}
