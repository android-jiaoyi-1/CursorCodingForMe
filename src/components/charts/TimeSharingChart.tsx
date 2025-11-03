import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { TimePoint } from '@/types/stock';

echarts.use([LineChart, BarChart, GridComponent, TooltipComponent, DataZoomComponent, CanvasRenderer]);

interface Props { 
  data: TimePoint[];
  previousClose?: number; // 昨日收盘价
  limitPercent?: number; // 涨跌停幅度
}

export function TimeSharingChart({ data, previousClose, limitPercent = 0.1 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.EChartsType | null>(null);

  const seriesData = useMemo(() => data, [data]);

  // 计算Y轴的最大值和最小值
  const { yMin, yMax } = useMemo(() => {
    if (previousClose) {
      return {
        yMax: Number((previousClose * (1 + limitPercent)).toFixed(2)),
        yMin: Number((previousClose * (1 - limitPercent)).toFixed(2))
      };
    }
    // 如果没有提供昨日收盘价，则使用自动计算
    return { yMin: undefined, yMax: undefined };
  }, [previousClose, limitPercent]);

  useEffect(() => {
    if (!ref.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(ref.current);
      window.addEventListener('resize', () => chartRef.current?.resize());
    }
    const option: echarts.EChartsCoreOption = {
      tooltip: { trigger: 'axis' },
      grid: [{ left: 50, right: 20, height: 220 }, { left: 50, right: 20, top: 300, height: 80 }],
      xAxis: [
        { type: 'category', data: seriesData.map(p => p.time), boundaryGap: false },
        { type: 'category', gridIndex: 1, data: seriesData.map(p => p.time), axisLabel: { show: false } }
      ],
      yAxis: [ 
        { min: yMin, max: yMax, scale: !previousClose }, 
        { gridIndex: 1 } 
      ],
      series: [
        { name: '价格', type: 'line', data: seriesData.map(p => p.price), smooth: true, showSymbol: false, lineStyle: { color: '#1677ff' } },
        { name: '均价', type: 'line', data: seriesData.map(p => p.avg), smooth: true, showSymbol: false, lineStyle: { color: '#fadb14' } },
        { name: '成交量', type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: seriesData.map(p => p.vol) }
      ]
    };
    chartRef.current.setOption(option, true);
  }, [seriesData, yMin, yMax, previousClose]);

  return <div className="chart-container" ref={ref} />;
}


