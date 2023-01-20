export interface Settings {
  [Setting: string]: boolean | string | number | object;
}

export interface AllSettings {
  GuildID: string;
  SettingsData: Settings;
}
