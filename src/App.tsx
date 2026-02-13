import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './App.module.css'
import { BinanceWs } from './api/binance_ws';
import type { CryptoData, CryptoEvent } from './types';
import { processPayload } from './utils';
import { useImmer } from 'use-immer';
import EventsBarChart from './components/EventsBarChart';
import AssetLineChart from './components/AssetLineChart';

const ASSETS = ['BTC', 'ETH', 'SOL', 'LTC'];

function App() {
  const [data, setData] = useImmer<CryptoData>({});
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');

  // Buffer stores accumulated counts and the latest coin info
  const bufferRef = useRef<Record<string, { events: CryptoEvent[] }>>({});

  const barData = useMemo(() => {
    return Object.entries(data).map(([symbol, info]) => ({
      symbol,
      count: info.events.length,
    }))
  }, [data]);

  useEffect(() => {
    const ws = new BinanceWs(ASSETS);

    ws.connect((rawData) => {
      const { symbol, ...info } = processPayload(rawData);

      if (!bufferRef.current[symbol]) {
        bufferRef.current[symbol] = { events: [] };
      }

      bufferRef.current[symbol].events.push(info);
    });

    const flushInterval = setInterval(() => {
      if (Object.keys(bufferRef.current).length === 0) return;

      setData(draft => {
        Object.entries(bufferRef.current).forEach(([symbol, { events }]) => {
          if (!draft[symbol]) {
            draft[symbol] = { events: events };
          } else {
            draft[symbol].events.push(...events);
          }
        });
      });

      bufferRef.current = {};
    }, 1000); // Flush every second

    return () => {
      ws.close();
      clearInterval(flushInterval);
    };
  }, [setData]);

  return (
    <div className={styles.appContainer}>
      <header className={styles.appHeader}>
        <h1 className={styles.appTitle}>
          Latido del Mercado: Evolución Cripto en Vivo
        </h1>
        <h2 className={styles.appSubtitle}>
          Se muestra la cantidad de eventos de actualización de precio por cada criptomoneda
        </h2>
      </header>

      <EventsBarChart data={barData} />

      <div className={styles.selectorContainer}>
        <label className={styles.selectorLabel} htmlFor="asset-select">Seleccionar criptomoneda:</label>
        <select
          id="asset-select"
          className={styles.assetSelect}
          value={selectedAsset}
          onChange={(e) => setSelectedAsset(e.target.value)}
        >
          {ASSETS.map(asset => (
            <option key={asset} value={asset}>{asset}</option>
          ))}
        </select>
      </div>

      <AssetLineChart
        symbol={selectedAsset}
        events={data[selectedAsset]?.events ?? []}
      />

      <div className={styles.infoContainer}>
        <p className={styles.infoParagraph}>
          Cada cambio en el precio de una criptomoneda es como un latido: una señal de actividad que nos indica qué tan rápido está "respirando" el mercado en este preciso instante. En la gráfica de barras superior, puedes observar la intensidad de esta actividad; las barras más altas representan las monedas que están experimentando una mayor cantidad de actualizaciones, revelando dónde se concentra la atención y la energía del ecosistema digital ahora mismo.
        </p>
        <p className={styles.infoParagraph}>
          Para comprender el pulso de una moneda específica, la gráfica de líneas nos muestra su evolución en tiempo real. Al navegar entre diferentes activos, podrás ver cómo este flujo ininterrumpido de datos dibuja tendencias y movimientos de valor. Esta danza constante de información es el reflejo de una economía viva que nunca duerme, permitiéndote sentir el ritmo del mercado a través de cada pequeña fluctuación.
        </p>
      </div>
    </div>
  )
}

export default App
