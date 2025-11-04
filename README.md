# 股票交易模拟平台

一个基于纯前端技术栈的股票交易模拟系统，提供完整的股票行情展示、模拟交易、持仓管理和历史记录功能。

## 📋 项目简介

本项目是一个功能完整的股票交易模拟平台，所有数据均为前端模拟生成，无需后端服务即可运行。适合学习股票交易流程、前端技术栈实践和量化交易策略验证。

## 🛠️ 技术栈

- **框架**: React 18 + TypeScript
- **UI组件**: Ant Design 5.x
- **图表库**: ECharts 5.x
- **状态管理**: Zustand (with Immer middleware)
- **构建工具**: Vite
- **日期处理**: Day.js
- **开发语言**: TypeScript 5.x

## ✨ 核心功能

### 1. 📊 行情展示模块（MarketPage）

- **自选股列表**
  - 显示股票代码、名称、当前价格、涨跌幅
  - 实时价格更新（每秒刷新）
  - 涨跌幅颜色标识（红涨绿跌）
  
- **股票搜索**
  - 支持股票代码搜索
  - 支持股票名称模糊搜索
  - 实时过滤结果
  
- **分时图展示**
  - 当日价格走势曲线
  - 买卖点标记（B点买入，S点卖出）
  - 成交量柱状图
  - 均价线显示
  - 实时数据更新

### 2. 💰 股票交易模块（TradePage）

- **K线图展示**
  - 专业K线图表（开盘、收盘、最高、最低）
  - 支持日K/周K/月K切换
  - MA5、MA10、MA20均线指标
  - MACD技术指标
  - 成交量副图
  - 买卖点标记展示
  - 缩放和拖拽功能
  - 十字线跟踪
  
- **分时图展示**
  - 实时价格曲线
  - 买卖点实时标记
  - 动态数据更新
  
- **交易面板**
  - 股票代码选择（支持搜索）
  - 买入/卖出切换
  - 当前价格实时显示
  - 涨跌幅展示
  - 可用资金查询
  - 数量输入（100股起，整百倍数）
  - 快捷操作按钮（1/4、1/2、全部）
  - 交易金额实时计算
  - 手续费计算（0.1%）
  - 合计金额显示
  - 交易验证
    - 资金充足性检查
    - 持仓数量验证
    - 数量有效性验证（必须为100的整数倍）
  
- **持仓列表**
  - 当前持仓展示
  - 股票代码、名称
  - 持仓数量
  - 成本价
  - 当前价
  - 浮动盈亏（金额和百分比）
  - 盈亏颜色标识

### 3. 📈 历史记录模块（HistoryPage）

- **交易记录**
  - 完整交易流水
  - 时间戳记录
  - 股票代码
  - 交易方向（买入/卖出）
  - 成交价格
  - 交易数量
  - 分页展示（每页10条）
  
- **对账单筛选**
  - 按日期筛选交易记录
  - 日期选择器
  - 实时过滤结果

### 4. 🎯 买卖点标记系统

- **买入点（B点）标记**
  - 在K线图上标记买入位置
  - 在分时图上标记买入位置
  - 显示买入价格
  - 显示买入时间
  
- **卖出点（S点）标记**
  - 在K线图上标记卖出位置
  - 在分时图上标记卖出位置
  - 显示卖出价格
  - 显示卖出时间

### 5. 💵 资金管理系统

- **虚拟账户**
  - 初始资金：100,000元
  - 实时余额显示
  - 资金变动追踪
  
- **交易费用**
  - 买入手续费：0.1%
  - 卖出手续费：0.1%
  - 自动计算并扣除

### 6. 📡 实时数据模拟

- **价格模拟**
  - 股票价格实时波动（每秒更新）
  - 涨跌幅实时计算
  - 分时数据动态生成
  
- **模拟数据生成**
  - 25只模拟股票
  - 90天K线历史数据
  - 当日分时数据（60个时间点）
  - 随机交易记录
  - 真实的价格波动算法

### 7. 🎨 用户界面

- **主布局（MainLayout）**
  - 顶部导航栏
  - 用户信息展示
  - 账户余额显示
  - 侧边导航菜单
  - 响应式布局
  
- **页面导航**
  - 行情页面
  - 交易页面
  - 历史记录页面
  - 页面切换动画

### 8. 💾 数据持久化

- **状态管理**
  - Zustand全局状态
  - Immer不可变更新
  - 实时状态同步
  
- **数据存储**
  - 交易记录
  - 持仓信息
  - BS点记录
  - 账户余额

## 📁 项目结构

```
src/
├── components/              # 组件目录
│   ├── charts/             # 图表组件
│   │   ├── KLineChart.tsx  # K线图组件
│   │   └── TimeSharingChart.tsx  # 分时图组件
│   ├── layout/             # 布局组件
│   │   └── MainLayout.tsx  # 主布局组件
│   └── trade/              # 交易组件
│       ├── PositionList.tsx  # 持仓列表组件
│       └── TradePanel.tsx    # 交易面板组件
├── pages/                  # 页面目录
│   ├── HistoryPage.tsx     # 历史记录页面
│   ├── MarketPage.tsx      # 行情页面
│   └── TradePage.tsx       # 交易页面
├── stores/                 # 状态管理
│   └── useStockStore.ts    # 股票交易状态store
├── types/                  # 类型定义
│   └── stock.ts            # 股票相关类型
├── utils/                  # 工具函数
│   ├── calculation.ts      # 计算工具
│   └── mockData.ts         # 模拟数据生成器
├── App.tsx                 # 应用根组件
├── main.tsx               # 应用入口
└── styles.css             # 全局样式
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动后访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📊 数据模型

### Stock（股票信息）
```typescript
interface Stock {
  code: string;           // 股票代码
  name: string;           // 股票名称
  currentPrice: number;   // 当前价格
  change: number;         // 涨跌幅
  volume: number;         // 成交量
}
```

### Position（持仓信息）
```typescript
interface Position {
  stockCode: string;      // 股票代码
  stockName: string;      // 股票名称
  quantity: number;       // 持仓数量
  costPrice: number;      // 成本价
}
```

### Transaction（交易记录）
```typescript
interface Transaction {
  id: string;             // 交易ID
  stockCode: string;      // 股票代码
  type: 'buy' | 'sell';   // 交易类型
  price: number;          // 成交价格
  quantity: number;       // 交易数量
  timestamp: string;      // 交易时间
}
```

### KLineData（K线数据）
```typescript
interface KLineData {
  date: string;           // 日期
  open: number;           // 开盘价
  close: number;          // 收盘价
  high: number;           // 最高价
  low: number;            // 最低价
  volume: number;         // 成交量
}
```

### BSPoint（买卖点标记）
```typescript
interface BSPoint {
  id: string;             // 标记ID
  stockCode: string;      // 股票代码
  type: 'buy' | 'sell';   // 类型（买/卖）
  price: number;          // 价格
  quantity: number;       // 数量
  timestamp: string;      // 时间戳
  date: string;           // 日期
  time: string;           // 时间
}
```

## 🎮 使用说明

1. **查看行情**
   - 进入"行情"页面
   - 浏览自选股列表
   - 使用搜索框查找股票
   - 点击股票查看分时图

2. **执行交易**
   - 进入"交易"页面
   - 选择要交易的股票
   - 查看K线图和分时图
   - 选择买入或卖出
   - 输入交易数量
   - 点击提交按钮

3. **查看持仓**
   - 在交易页面下方查看持仓列表
   - 查看浮动盈亏
   - 可直接卖出持仓股票

4. **查询历史**
   - 进入"历史记录"页面
   - 查看所有交易记录
   - 按日期筛选对账单

## 🔧 配置说明

- **初始资金**: 100,000元（可在 `useStockStore.ts` 中修改）
- **手续费率**: 0.1%（可在 `calculation.ts` 中修改）
- **最小交易单位**: 100股
- **价格更新频率**: 1秒/次
- **模拟股票数量**: 25只
- **K线历史数据**: 90天

## 📝 开发计划

- [ ] 添加更多技术指标（KDJ、BOLL等）
- [ ] 支持多账户管理
- [ ] 添加收益曲线图
- [ ] 实现止盈止损功能
- [ ] 支持数据导出
- [ ] 添加更多图表类型
- [ ] 实现策略回测功能

## 📄 许可证

MIT License

## 👨‍💻 贡献

欢迎提交 Issue 和 Pull Request！

## 🙏 致谢

感谢以下开源项目：
- React
- Ant Design
- ECharts
- Zustand
- Vite
