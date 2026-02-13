export type CryptoEvent = {
    time: Date;
    price: number;
}

export type CryptoInfo = {
    events: CryptoEvent[];
}

export type CryptoData = {
    [symbol: string]: CryptoInfo;
}
