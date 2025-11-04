import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts/core';
import { LineChart, BarChart, ScatterChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { TimePoint, BSPoint } from '@/types/stock';

echarts.use([LineChart, BarChart, ScatterChart, GridComponent, TooltipComponent, DataZoomComponent, CanvasRenderer]);

interface Props { 
  data: TimePoint[];
  bsPoints?: BSPoint[]; // BS点数据
  stockCode?: string; // 当前股票代码
}

export function TimeSharingChart({ data, bsPoints = [], stockCode }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.EChartsType | null>(null);

  const seriesData = useMemo(() => {
    // 处理BS点数据：匹配到对应的时间索引
    const buyPoints: (number | null)[] = [];
    const sellPoints: (number | null)[] = [];
    
    if (stockCode && bsPoints.length > 0) {
      const currentBSPoints = bsPoints.filter(p => p.stockCode === stockCode && p.time);
      const timeLabels = data.map(d => d.time);
      currentBSPoints.forEach(point => {
        // 优先精确匹配时间，如果找不到则匹配到最后一个时间点（实时点）
        let index = timeLabels.findIndex(t => t === point.time);
        if (index < 0 && data.length > 0) {
          // 如果找不到精确匹配，匹配到最后一个时间点（因为BS点是实时生成的）
          index = data.length - 1;
        }
        if (index >= 0) {
          if (point.type === 'buy') {
            buyPoints[index] = point.price;
          } else {
            sellPoints[index] = point.price;
          }
        }
      });
    }

    return { data, buyPoints, sellPoints };
  }, [data, bsPoints, stockCode]);

  useEffect(() => {
    if (!ref.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(ref.current);
      window.addEventListener('resize', () => chartRef.current?.resize());
    }
    const series: any[] = [
      { name: '价格', type: 'line', data: seriesData.data.map(p => p.price), smooth: true, showSymbol: false, lineStyle: { color: '#1677ff' } },
      { name: '均价', type: 'line', data: seriesData.data.map(p => p.avg), smooth: true, showSymbol: false, lineStyle: { color: '#fadb14' } },
      { name: '成交量', type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: seriesData.data.map(p => p.vol) }
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

    const option: echarts.EChartsOption = {
      tooltip: { trigger: 'axis' },
      legend: { 
        data: ['价格', '均价', '买入点(B)', '卖出点(S)'].filter(name => {
          if (name === '买入点(B)') return seriesData.buyPoints.some(p => p !== null);
          if (name === '卖出点(S)') return seriesData.sellPoints.some(p => p !== null);
          return true;
        })
      },
      grid: [{ left: 50, right: 20, height: 220 }, { left: 50, right: 20, top: 300, height: 80 }],
      xAxis: [
        { type: 'category', data: seriesData.data.map(p => p.time), boundaryGap: false },
        { type: 'category', gridIndex: 1, data: seriesData.data.map(p => p.time), axisLabel: { show: false } }
      ],
      yAxis: [ {}, { gridIndex: 1 } ],
      series
    };
    chartRef.current.setOption(option, true);
  }, [seriesData]);

  return <div className="chart-container" ref={ref} />;
}


