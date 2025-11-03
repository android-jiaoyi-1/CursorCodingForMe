import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { TimePoint } from '@/types/stock';

echarts.use([LineChart, BarChart, GridComponent, TooltipComponent, DataZoomComponent, CanvasRenderer]);

const DEFAULT_LIMIT_AMPLITUDE = 0.1;

interface Props {
  data: TimePoint[];
  previousClose?: number;
  limitAmplitude?: number;
}

export function TimeSharingChart({ data, previousClose, limitAmplitude }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.EChartsType | null>(null);

  const seriesData = useMemo(() => data, [data]);
  const priceSeries = useMemo(() => seriesData.map(p => p.price), [seriesData]);
  const avgSeries = useMemo(() => seriesData.map(p => p.avg), [seriesData]);

  type Bounds = { lower: number; upper: number } | undefined;

  const yAxisBounds = useMemo<Bounds>(() => {
    const limit = typeof limitAmplitude === 'number' ? limitAmplitude : DEFAULT_LIMIT_AMPLITUDE;
    if (previousClose && previousClose > 0 && limit > 0) {
      const upper = Number((previousClose * (1 + limit)).toFixed(2));
      const lower = Number((previousClose * (1 - limit)).toFixed(2));
      return { upper, lower };
    }
    const allValues = [...priceSeries, ...avgSeries].filter((v) => Number.isFinite(v));
    if (allValues.length === 0) {
      return undefined;
    }
    const baseMax = Math.max(...allValues);
    const baseMin = Math.min(...allValues);
    const range = baseMax - baseMin;
    const padding = range === 0 ? (baseMax || 1) * 0.05 : range * 0.1;
    return {
      upper: Number((baseMax + padding).toFixed(2)),
      lower: Number((baseMin - padding).toFixed(2)),
    };
  }, [avgSeries, limitAmplitude, previousClose, priceSeries]);

  useEffect(() => {
    if (!ref.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(ref.current);
      window.addEventListener('resize', () => chartRef.current?.resize());
    }
    const priceAxis: {
      splitNumber: number;
      axisLabel: { formatter: (value: number) => string };
      min?: number;
      max?: number;
      scale?: boolean;
    } = {
      splitNumber: 6,
      axisLabel: { formatter: (value: number) => value.toFixed(2) },
      scale: false,
    };
    if (yAxisBounds) {
      priceAxis.min = yAxisBounds.lower;
      priceAxis.max = yAxisBounds.upper;
    }
    const option = {
      tooltip: { trigger: 'axis' },
      grid: [{ left: 50, right: 20, height: 220 }, { left: 50, right: 20, top: 300, height: 80 }],
      xAxis: [
        { type: 'category', data: seriesData.map(p => p.time), boundaryGap: false },
        { type: 'category', gridIndex: 1, data: seriesData.map(p => p.time), axisLabel: { show: false } }
      ],
      yAxis: [
        priceAxis,
        { gridIndex: 1, axisLabel: { formatter: (value: number) => value.toFixed(0) } },
      ],
      series: [
        { name: '价格', type: 'line', data: seriesData.map(p => p.price), smooth: true, showSymbol: false, lineStyle: { color: '#1677ff' } },
        { name: '均价', type: 'line', data: seriesData.map(p => p.avg), smooth: true, showSymbol: false, lineStyle: { color: '#fadb14' } },
        { name: '成交量', type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: seriesData.map(p => p.vol) }
      ]
    };
    chartRef.current.setOption(option, true);
  }, [seriesData, yAxisBounds]);

  return <div className="chart-container" ref={ref} />;
}

