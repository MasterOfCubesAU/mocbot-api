export interface Settings {
  [Setting: string]: boolean | string | number | object;
}

export interface SettingsReturn {
  GuildID: number;
  SettingsData: Settings;
}
