export interface UserXP {
  UserID: number;
  GuildID: number;
  XP: number;
  Level: number;
  XPLock: number;
  VoiceChannelXPLock: number;
}

export interface UserXPReturn {
  UserID: string;
  GuildID: string;
  XP: number;
  Level: number;
  XPLock: number;
  VoiceChannelXPLock: number;
}

export interface UserXPInternal {
  UserGuildID: number;
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
