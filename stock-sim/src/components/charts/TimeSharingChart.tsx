import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

interface Point { time: string; price: number; avg: number; volume: number }

interface Props {
  points: Point[];
  previousClose?: number; // 昨日收盘价
  limitPercent?: number; // 涨跌停幅度
}

export const TimeSharingChart: React.FC<Props> = ({ points, previousClose, limitPercent = 0.1 }) => {
  const option = useMemo(() => {
    // 计算Y轴的最大值和最小值
    let yMin: number | undefined;
    let yMax: number | undefined;
    let scale = true;
    
    if (previousClose) {
      yMax = Number((previousClose * (1 + limitPercent)).toFixed(2));
      yMin = Number((previousClose * (1 - limitPercent)).toFixed(2));
      scale = false; // 使用固定范围时不需要scale
    }
    
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
      yAxis: [
        { scale, min: yMin, max: yMax }, 
        { scale: true, gridIndex: 1 }
      ],
      series: [
        { type: 'line', name: '价格', data: points.map((p) => p.price), showSymbol: false, smooth: true },
        { type: 'line', name: '均价', data: points.map((p) => p.avg), showSymbol: false, smooth: true },
        { type: 'bar', name: '成交量', xAxisIndex: 1, yAxisIndex: 1, data: points.map((p) => p.volume) },
      ],
    };
  }, [points, previousClose, limitPercent]);
  return <ReactECharts option={option} style={{ height: 300, width: '100%' }} />;
};


