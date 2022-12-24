export interface UserXP {
  UserGuildID: number;
  XP: number;
  Level: number;
  XPLock: number;
  VoiceChannelXPLock: number;
}

export interface CreateUserXPInput {
  UserGuildID?: number;
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
