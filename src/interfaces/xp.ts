export interface UserXP {
  UserID: string;
  GuildID: string;
  XP: string;
  Level: string;
  XPLock: string;
  VoiceChannelXPLock: string;
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
