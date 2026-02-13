import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import type { CryptoEvent } from '../../types';
import styles from './AssetLineChart.module.css';
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent';

type Props = {
  symbol: string;
  events: CryptoEvent[];
}

const AssetLineChart: React.FC<Props> = ({ symbol, events }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [displayedEvents, setDisplayedEvents] = useState<CryptoEvent[]>(events);

  // Use a ref to always have access to the latest events prop without re-running effects
  const latestEventsRef = useRef(events);
  useEffect(() => {
    latestEventsRef.current = events;
  }, [events]);

  // Synchronize local state with the ref every 3 seconds (unless paused)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setDisplayedEvents(latestEventsRef.current);
    }, 1500);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Format data for Recharts (ensuring time is formatted for display)
  const chartData = useMemo(() => {
    return displayedEvents.slice(-140).map(event => ({
      ...event,
      displayTime: event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    }));
  }, [displayedEvents]);

  const formatter = (value: ValueType | undefined) => {
    if (!value) return [];
    if (typeof value !== 'string') return [];
    const numberValue = parseFloat(value);
    return [`$${numberValue.toFixed(2)}`, 'Precio'];
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>
        <div className={styles.controls}>
          <span className={`${styles.statusIndicator} ${isPaused ? styles.statusPaused : styles.statusLive}`} />
          <span>Tendencia de precio</span>
          <button
            className={styles.pauseButton}
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? '▶ Reanudar' : '⏸ Pausar'}
          </button>
        </div>
        <span className={styles.symbolBadge}>{symbol}</span>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--color-outline-variant)"
            opacity={0.5}
          />
          <XAxis
            dataKey="displayTime"
            stroke="var(--color-on-surface-variant)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            minTickGap={30}
          />
          <YAxis
            domain={['auto', 'auto']}
            stroke="var(--color-on-surface-variant)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-surface-container-highest)',
              border: '1px solid var(--color-outline-variant)',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
              color: 'var(--color-on-surface)'
            }}
            itemStyle={{ color: 'var(--color-primary)' }}
            labelStyle={{ color: 'var(--color-on-surface)' }}
            formatter={formatter}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="var(--color-primary)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPrice)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AssetLineChart;
