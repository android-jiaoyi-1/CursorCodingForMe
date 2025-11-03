import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts/core';
import { CandlestickChart, BarChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, DataZoomComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { KLineData } from '@/types/stock';

echarts.use([CandlestickChart, BarChart, LineChart, GridComponent, TooltipComponent, DataZoomComponent, LegendComponent, CanvasRenderer]);

interface Props { data: KLineData[] }

export function KLineChart({ data }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.EChartsType | null>(null);

  const seriesData = useMemo(() => {
    const category = data.map(d => d.date);
    const kdata = data.map(d => [d.open, d.close, d.low, d.high]);
    const vol = data.map(d => d.volume);

    function MA(day: number) {
      const result: number[] = [];
      for (let i = 0; i < data.length; i++) {
        if (i < day) { result.push(NaN); continue; }
        let sum = 0;
        for (let j = 0; j < day; j++) sum += data[i - j].close;
        result.push(Number((sum / day).toFixed(2)));
      }
      return result;
    }

    return { category, kdata, vol, ma5: MA(5), ma10: MA(10), ma20: MA(20) };
  }, [data]);

  useEffect(() => {
    if (!ref.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(ref.current);
      window.addEventListener('resize', () => chartRef.current?.resize());
    }
    chartRef.current.setOption({
      legend: { data: ['K线', 'MA5', 'MA10', 'MA20'] },
      tooltip: { trigger: 'axis' },
      grid: [{ left: 50, right: 20, height: 220 }, { left: 50, right: 20, top: 300, height: 80 }],
      xAxis: [
        { type: 'category', data: seriesData.category, boundaryGap: false, axisLine: { onZero: false } },
        { type: 'category', gridIndex: 1, data: seriesData.category, axisLabel: { show: false } }
      ],
      yAxis: [ { scale: true }, { gridIndex: 1 } ],
      dataZoom: [ { type: 'inside', start: 60, end: 100 }, { start: 60, end: 100 } ],
      series: [
        { name: 'K线', type: 'candlestick', data: seriesData.kdata },
        { name: 'MA5', type: 'line', data: seriesData.ma5, smooth: true, showSymbol: false },
        { name: 'MA10', type: 'line', data: seriesData.ma10, smooth: true, showSymbol: false },
        { name: 'MA20', type: 'line', data: seriesData.ma20, smooth: true, showSymbol: false },
        { name: '成交量', type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: seriesData.vol }
      ]
    });
  }, [seriesData]);

  return <div className="chart-container" ref={ref} />;
}


