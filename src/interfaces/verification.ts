export interface Verification {
    UserID: bigint | number,
    GuildID: bigint | number,
    MessageID?: bigint | number,
    ChannelID?: bigint | number,
    JoinTime: number
}

export interface LockdownInput {
    MessageID?: bigint | number,
    ChannelID?: bigint | number
}
