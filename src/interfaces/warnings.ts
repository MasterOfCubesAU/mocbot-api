export interface Warning {
  WarningID: string;
  UserID: bigint | number;
  GuildID: bigint | number;
  Reason: string;
  Time: number;
  AdminID: bigint | number;
}
