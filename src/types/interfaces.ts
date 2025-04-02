export interface CandleData {
    openTime: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface PriceData {
    current: number;
    oneMinuteAgo: number;
}
