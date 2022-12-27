export interface Verification {
  UserID: string;
  GuildID: string;
  MessageID?: string;
  ChannelID?: string;
  JoinTime: string;
}

export interface LockdownInput {
  MessageID?: string;
  ChannelID?: string;
}
