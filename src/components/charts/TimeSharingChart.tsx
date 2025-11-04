import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { TimePoint } from '@/types/stock';

echarts.use([LineChart, BarChart, GridComponent, TooltipComponent, DataZoomComponent, CanvasRenderer]);

interface Props { data: TimePoint[] }

export function TimeSharingChart({ data }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.EChartsType | null>(null);

  const seriesData = useMemo(() => data, [data]);

  useEffect(() => {
    if (!ref.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(ref.current);
      window.addEventListener('resize', () => chartRef.current?.resize());
    }
    const option = {
      tooltip: { trigger: 'axis' },
      grid: [{ left: 50, right: 20, height: 220 }, { left: 50, right: 20, top: 300, height: 80 }],
      xAxis: [
        { type: 'category', data: seriesData.map(p => p.time), boundaryGap: false },
        { type: 'category', gridIndex: 1, data: seriesData.map(p => p.time), axisLabel: { show: false } }
      ],
      yAxis: [{}, { gridIndex: 1 }],
      series: [
        { name: '价格', type: 'line', data: seriesData.map(p => p.price), smooth: true, showSymbol: false, lineStyle: { color: '#1677ff' } },
        { name: '均价', type: 'line', data: seriesData.map(p => p.avg), smooth: true, showSymbol: false, lineStyle: { color: '#fadb14' } },
        { name: '成交量', type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: seriesData.map(p => p.vol) }
      ]
    };
    chartRef.current.setOption(option, true);
  }, [seriesData]);

  return <div className="chart-container" ref={ref} />;
}


