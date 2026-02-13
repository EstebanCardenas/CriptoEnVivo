import type { CryptoEvent } from "../types";

export const processPayload = (data: {[key: string]: unknown}): CryptoEvent & {symbol: string} => {
    const symbol = (data.s as string).replace('USDT', '');
    const eventTime = data.E as number;
    return {
        symbol,
        time: new Date(eventTime),
        price: data.p as number
    }
}