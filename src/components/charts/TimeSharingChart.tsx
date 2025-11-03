import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { TimePoint } from '@/types/stock';

echarts.use([LineChart, BarChart, GridComponent, TooltipComponent, DataZoomComponent, CanvasRenderer]);

// 涨跌停幅度，通常为10%
const PRICE_LIMIT_RATIO = 0.1;

interface Props { 
  data: TimePoint[];
  yesterdayClosePrice?: number; // 昨日收盘价
}

export function TimeSharingChart({ data, yesterdayClosePrice }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.EChartsType | null>(null);

  const seriesData = useMemo(() => data, [data]);

  // 计算Y轴范围
  const yAxisRange = useMemo(() => {
    if (!yesterdayClosePrice) {
      // 如果没有昨日收盘价，使用数据的最大值和最小值
      const prices = seriesData.map(p => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const padding = (maxPrice - minPrice) * 0.1;
      return {
        min: minPrice - padding,
        max: maxPrice + padding
      };
    }
    
    // 根据公式计算：最大值 = 昨日收盘价 × (1 + 涨跌停幅度)，最小值 = 昨日收盘价 × (1 - 涨跌停幅度)
    const maxPrice = yesterdayClosePrice * (1 + PRICE_LIMIT_RATIO);
    const minPrice = yesterdayClosePrice * (1 - PRICE_LIMIT_RATIO);
    
    return {
      min: Number(minPrice.toFixed(2)),
      max: Number(maxPrice.toFixed(2))
    };
  }, [yesterdayClosePrice, seriesData]);

  useEffect(() => {
    if (!ref.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(ref.current);
      window.addEventListener('resize', () => chartRef.current?.resize());
    }
    const option: echarts.EChartsOption = {
      tooltip: { trigger: 'axis' },
      grid: [{ left: 50, right: 20, height: 220 }, { left: 50, right: 20, top: 300, height: 80 }],
      xAxis: [
        { type: 'category', data: seriesData.map(p => p.time), boundaryGap: false },
        { type: 'category', gridIndex: 1, data: seriesData.map(p => p.time), axisLabel: { show: false } }
      ],
      yAxis: [ 
        { 
          min: yAxisRange.min,
          max: yAxisRange.max,
          scale: false
        }, 
        { gridIndex: 1 } 
      ],
      series: [
        { name: '价格', type: 'line', data: seriesData.map(p => p.price), smooth: true, showSymbol: false, lineStyle: { color: '#1677ff' } },
        { name: '均价', type: 'line', data: seriesData.map(p => p.avg), smooth: true, showSymbol: false, lineStyle: { color: '#fadb14' } },
        { name: '成交量', type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: seriesData.map(p => p.vol) }
      ]
    };
    chartRef.current.setOption(option, true);
  }, [seriesData, yAxisRange]);

  return <div className="chart-container" ref={ref} />;
}


