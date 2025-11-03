import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

interface Point { time: string; price: number; avg: number; volume: number }

interface Props {
  points: Point[];
}

export const TimeSharingChart: React.FC<Props> = ({ points }) => {
  const option = useMemo(() => {
    return {
      animation: false,
      grid: [
        { left: 10, right: 10, top: 10, height: '65%' },
        { left: 10, right: 10, top: '75%', height: '20%' },
      ],
      tooltip: { trigger: 'axis' },
      xAxis: [
        { type: 'category', data: points.map((p) => p.time), boundaryGap: false },
        { type: 'category', gridIndex: 1, data: points.map((p) => p.time), boundaryGap: false },
      ],
      yAxis: [{ scale: true }, { scale: true, gridIndex: 1 }],
      series: [
        { type: 'line', name: '价格', data: points.map((p) => p.price), showSymbol: false, smooth: true },
        { type: 'line', name: '均价', data: points.map((p) => p.avg), showSymbol: false, smooth: true },
        { type: 'bar', name: '成交量', xAxisIndex: 1, yAxisIndex: 1, data: points.map((p) => p.volume) },
      ],
    };
  }, [points]);
  return <ReactECharts option={option} style={{ height: 300, width: '100%' }} />;
};


