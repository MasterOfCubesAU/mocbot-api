export interface GuildLobby {
  GuildID: string;
  LobbyName: string;
  VoiceChannelID: string;
  TextChannelID: string;
  RoleID: string;
  LeaderID: string;
  InviteOnly: boolean;
}

export interface GuildLobbyInput {
  LobbyName?: string;
  VoiceChannelID?: string;
  TextChannelID?: string;
  RoleID?: string;
  LeaderID?: string;
  InviteOnly?: boolean;
}

export interface LobbyUsersInput {
  Users?: string[];
}

export interface LobbyUsers {
  Users: string[];
}
