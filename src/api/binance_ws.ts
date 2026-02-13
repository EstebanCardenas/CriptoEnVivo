export class BinanceWs {
    private ws: WebSocket | undefined;
    private symbols: string[];

    constructor(symbols: string[]) {
        this.symbols = symbols;
    }

    connect(onMessage: (data: {[key: string]: unknown}) => void) {
        const streams = this.symbols.map(asset => `${asset.toLowerCase()}usdt@aggTrade`);
        this.ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streams.join('/')}`);
        this.ws.addEventListener('open', () => {
            console.log('Connected to Binance WebSocket');
        });
        this.ws.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });
        this.ws.addEventListener('message', (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        });
        this.ws.addEventListener('close', () => {
            console.log('WebSocket closed');
        });
    }

    close() {
        this.ws?.close();
    }
}
