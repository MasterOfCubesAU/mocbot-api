export interface UserXP {
  UserGuildID: number;
  XP: number;
  Level: number;
  XPLock: number;
  VoiceChannelXPLock: number;
}

export interface UserXPInput {
  UserGuildID?: number;
  XP?: number;
  Level?: number;
  XPLock?: number;
  VoiceChannelXPLock?: number;
}
