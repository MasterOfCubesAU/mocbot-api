export interface AFK {
  UserID: string;
  GuildID: string;
  MessageID: string;
  ChannelID: string;
  OldName: string;
  Reason: string;
}

export interface AFKInput {
  MessageID?: string;
  ChannelID?: string;
  OldName?: string;
  Reason?: string;
}
