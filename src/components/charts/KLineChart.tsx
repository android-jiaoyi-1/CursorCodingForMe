import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts/core';
import { CandlestickChart, BarChart, LineChart, ScatterChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, DataZoomComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { KLineData, BSPoint } from '@/types/stock';

echarts.use([CandlestickChart, BarChart, LineChart, ScatterChart, GridComponent, TooltipComponent, DataZoomComponent, LegendComponent, CanvasRenderer]);

interface Props { 
  data: KLineData[];
  bsPoints?: BSPoint[]; // BS点数据
  stockCode?: string; // 当前股票代码
}

export function KLineChart({ data, bsPoints = [], stockCode }: Props) {
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

    // 处理BS点数据：匹配到对应的日期索引
    const buyPoints: (number | null)[] = [];
    const sellPoints: (number | null)[] = [];
    
    if (stockCode && bsPoints.length > 0) {
      const currentBSPoints = bsPoints.filter(p => p.stockCode === stockCode && p.date);
      currentBSPoints.forEach(point => {
        const index = category.findIndex(d => d === point.date);
        if (index >= 0) {
          if (point.type === 'buy') {
            buyPoints[index] = point.price;
          } else {
            sellPoints[index] = point.price;
          }
        }
      });
    }

    return { category, kdata, vol, ma5: MA(5), ma10: MA(10), ma20: MA(20), buyPoints, sellPoints };
  }, [data, bsPoints, stockCode]);

  useEffect(() => {
    if (!ref.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(ref.current);
      window.addEventListener('resize', () => chartRef.current?.resize());
    }
    const series: any[] = [
      { name: 'K线', type: 'candlestick', data: seriesData.kdata },
      { name: 'MA5', type: 'line', data: seriesData.ma5, smooth: true, showSymbol: false },
      { name: 'MA10', type: 'line', data: seriesData.ma10, smooth: true, showSymbol: false },
      { name: 'MA20', type: 'line', data: seriesData.ma20, smooth: true, showSymbol: false },
      { name: '成交量', type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: seriesData.vol }
    ];

    // 添加BS点
    if (seriesData.buyPoints.some(p => p !== null)) {
      series.push({
        name: '买入点(B)',
        type: 'scatter',
        data: seriesData.buyPoints.map((p, i) => p !== null ? [i, p] : null).filter((p: any) => p !== null),
        symbol: 'triangle',
        symbolSize: 15,
        itemStyle: { color: '#f5222d' },
        label: { show: true, position: 'top', formatter: 'B', color: '#fff', fontSize: 10 }
      });
    }
    if (seriesData.sellPoints.some(p => p !== null)) {
      series.push({
        name: '卖出点(S)',
        type: 'scatter',
        data: seriesData.sellPoints.map((p, i) => p !== null ? [i, p] : null).filter((p: any) => p !== null),
        symbol: 'triangle',
        symbolSize: 15,
        symbolRotate: 180,
        itemStyle: { color: '#52c41a' },
        label: { show: true, position: 'bottom', formatter: 'S', color: '#fff', fontSize: 10 }
      });
    }

    chartRef.current.setOption({
      legend: { data: ['K线', 'MA5', 'MA10', 'MA20', '买入点(B)', '卖出点(S)'].filter(name => {
        if (name === '买入点(B)') return seriesData.buyPoints.some(p => p !== null);
        if (name === '卖出点(S)') return seriesData.sellPoints.some(p => p !== null);
        return true;
      }) },
      tooltip: { trigger: 'axis' },
      grid: [{ left: 50, right: 20, height: 220 }, { left: 50, right: 20, top: 300, height: 80 }],
      xAxis: [
        { type: 'category', data: seriesData.category, boundaryGap: false, axisLine: { onZero: false } },
        { type: 'category', gridIndex: 1, data: seriesData.category, axisLabel: { show: false } }
      ],
      yAxis: [ { scale: true }, { gridIndex: 1 } ],
      dataZoom: [ { type: 'inside', start: 60, end: 100 }, { start: 60, end: 100 } ],
      series
    });
  }, [seriesData]);

  return <div className="chart-container" ref={ref} />;
}


