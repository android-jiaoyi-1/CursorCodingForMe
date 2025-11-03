import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { KLineData } from '../../types/stock';

interface Props {
  data: KLineData[];
}

function calcMA(data: number[], dayCount: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < dayCount) {
      result.push(NaN);
      continue;
    }
    const slice = data.slice(i - dayCount + 1, i + 1);
    result.push(+(
      slice.reduce((sum, v) => sum + v, 0) / dayCount
    ).toFixed(2));
  }
  return result;
}

export const KLineChart: React.FC<Props> = ({ data }) => {
  const option = useMemo(() => {
    const categoryData = data.map((d) => d.date);
    const values = data.map((d) => [d.open, d.close, d.low, d.high]);
    const closeSeries = data.map((d) => d.close);
    const ma5 = calcMA(closeSeries, 5);
    const ma10 = calcMA(closeSeries, 10);
    const ma20 = calcMA(closeSeries, 20);

    return {
      animation: false,
      tooltip: { trigger: 'axis' },
      axisPointer: { type: 'cross' },
      grid: [
        { left: 10, right: 10, top: 20, height: '60%' },
        { left: 10, right: 10, top: '72%', height: '20%' },
      ],
      xAxis: [
        { type: 'category', data: categoryData, boundaryGap: false, axisLine: { onZero: false } },
        { type: 'category', gridIndex: 1, data: categoryData, boundaryGap: false, axisLine: { onZero: false } },
      ],
      yAxis: [
        { scale: true },
        { scale: true, gridIndex: 1 },
      ],
      dataZoom: [
        { type: 'inside', xAxisIndex: [0, 1], start: 50, end: 100 },
        { show: true, xAxisIndex: [0, 1], type: 'slider', bottom: 0, start: 50, end: 100 },
      ],
      series: [
        { type: 'candlestick', name: 'K', data: values },
        { type: 'line', name: 'MA5', data: ma5, smooth: true, showSymbol: false },
        { type: 'line', name: 'MA10', data: ma10, smooth: true, showSymbol: false },
        { type: 'line', name: 'MA20', data: ma20, smooth: true, showSymbol: false },
        { type: 'bar', name: 'Volume', xAxisIndex: 1, yAxisIndex: 1, data: data.map((d) => d.volume) },
      ],
    } as any;
  }, [data]);

  return <ReactECharts option={option} style={{ height: 360, width: '100%' }} />;
};


