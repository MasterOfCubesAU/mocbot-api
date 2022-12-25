export interface UserXP {
  UserID: bigint | number;
  GuildID: bigint | number;
  XP: number;
  Level: number;
  XPLock: number;
  VoiceChannelXPLock: number;
}

export interface CreateUserXPInput {
  XP?: number;
  Level?: number;
  XPLock?: number;
  VoiceChannelXPLock?: number;
}

export interface ReplaceUserXPInput {
  XP: number;
  Level: number;
  XPLock: number;
  VoiceChannelXPLock: number;
}
