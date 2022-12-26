export interface Verification {
  UserID: string;
  GuildID: string;
  MessageID?: string;
  ChannelID?: string;
  JoinTime: string;
}

export interface LockdownInput {
  MessageID?: bigint | number;
  ChannelID?: bigint | number;
}
