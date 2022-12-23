export interface Warning {
    WarningID: string,
    UserGuildID: number,
    Reason: string,
    Time: string,
    AdminID: bigint | number
}
export interface WarningResult {
    WarningID: string,
    UserGuildID: number,
    Reason: string,
    Time: number,
    AdminID: bigint | number
}
