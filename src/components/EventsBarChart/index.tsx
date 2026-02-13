import React from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import styles from './EventsBarChart.module.css';
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent';

type Props = {
  data: { symbol: string, count: number }[],
}

const EventsBarChart: React.FC<Props> = ({ data }) => {
  const tooltipFormatter = (value: ValueType | undefined) => {
    return [value, 'Eventos'];
  }

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={1} />
              <stop offset="100%" stopColor="var(--color-primary-container)" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="symbol"
            stroke="var(--color-on-surface-variant)"
            fontSize={14}
            tickLine={false}
            axisLine={false}
            dy={10}
            tickFormatter={(value) => (value as string).slice(0, 3)}
          />
          <YAxis
            stroke="var(--color-on-surface-variant)"
            fontSize={14}
            tickLine={false}
            axisLine={false}
            dx={-10}
          />
          <Tooltip
            cursor={{ fill: 'var(--color-surface-container-high)', opacity: 0.4 }}
            contentStyle={{
              backgroundColor: 'var(--color-surface-container-highest)',
              border: '1px solid var(--color-outline-variant)',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
              color: 'var(--color-on-surface)'
            }}
            itemStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
            labelStyle={{ color: 'var(--color-on-surface)', marginBottom: '4px' }}
            formatter={tooltipFormatter}
            labelFormatter={(value) => typeof value === 'string' ? value.slice(0, 3) : value}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '20px' }}
            formatter={() => 'Eventos'}
          />
          <Bar
            dataKey="count"
            fill="url(#barGradient)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default EventsBarChart;
