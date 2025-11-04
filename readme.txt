网站项目说明

## 项目简介
- 基于 React 18 + TypeScript 构建的股票交易模拟平台，提供行情查看、下单交易、持仓查询以及历史对账等核心流程的演练。
- 使用 Ant Design 搭建界面，结合 ECharts 呈现分时与 K 线图表，并通过 Zustand + Immer 维护全局模拟数据与实时状态。
- 所有行情、成交、持仓数据均由内置的 Mock 生成，并以定时器驱动模拟实时波动。

## 技术栈与结构
- 框架：React 18、Vite、TypeScript。
- UI：Ant Design 5.x，统一配置主题与布局。
- 图表：ECharts 5.x，封装 `TimeSharingChart`、`KLineChart` 两类图表组件。
- 状态管理：Zustand + Immer，集中管理资金、持仓、交易记录、行情与 B/S 点。
- 目录：`src/components`（布局、图表、交易组件）、`src/pages`（行情/交易/历史页面）、`src/stores`、`src/utils`、`src/types`。

## 核心功能清单
- **应用框架**
  - `MainLayout` 提供顶部标题、左侧导航（行情/交易/历史），并在内容区切换页面。
  - 全局样式覆盖 Ant Design 默认样式，为图表区域提供自适应尺寸。

- **行情页（`MarketPage`）**
  - 首次加载调用 `init`，生成 25 只模拟股票及对应分时数据、交易记录。
  - 顶部展示 `TimeSharingChart` 分时图：价格曲线、均价线、成交量柱状图，并按股票叠加买卖信号（B/S 点）。
  - 自选列表支持代码/名称模糊搜索，实时过滤；列表展示价格、涨跌幅标签。
  - 点击列表项切换当前关注股票，同步驱动所有页面共享的行情状态。

- **交易页（`TradePage`）**
  - `KLineChart` 展示最近 90 天 K 线，附带 MA5/MA10/MA20 均线、成交量副图、缩放交互，并标记历史买卖信号。
  - 下方再次提供分时图，保持与行情页一致的实时走势与 B/S 点标记。
    - `TradePanel` 支持股票搜索、买卖切换、数量快捷按钮（1/4、1/2、全部），实时展示价格、涨跌幅、资金、手续费等信息，并在校验失败时弹出提示。
    - 下单成功后（`buyStock` / `sellStock`）自动扣减/增加资金、更新持仓、写入最新交易记录，并生成带日期与时间的 B/S 点供图表标记。
    - `PositionList` 展示当前所有持仓：代码、名称、数量、成本价、现价、浮动盈亏（实时刷新）。

- **历史页（`HistoryPage`）**
  - 交易记录以表格形式展示，列包含时间、股票、方向、价格、数量。
  - 支持使用 Ant Design `DatePicker` 按日筛选对账，仅保留符合所选日期的记录。
  - 分页每页 10 条，方便滚动浏览。

- **数据与状态管理（`useStockStore`）**
  - 初始资金 100,000 元，持仓/交易自零开始。
  - `generateStocks`、`generateKline`、`generateIntradaySeries`、`generateTransactions` 生成模拟数据；`nextIntradayTick` 每秒推送新分时点并刷新涨跌幅。
  - `setCurrentStock` 切换当前标的并动态生成 K 线数据。
  - 维护 `bsPoints` 集合，为分时和 K 线图提供买卖信号展示。
  - 在组件销毁前通过全局定时器保持数据持续波动。

- **通用工具**
  - `calculateAmount`、`calculateFee`、`formatCurrency` 等工具函数协助交易金额、手续费、格式化计算。

## 本地开发
- 安装依赖：`npm install`
- 启动开发环境：`npm run dev`
- 构建产物：`npm run build`

## 提交到 GitHub（命令示例）
1. 初始化仓库（已初始化可跳过）：`git init`
2. 添加并提交：`git add . && git commit -m "docs: 更新项目功能说明"`
3. 关联远程：`git remote add origin YOUR_GITHUB_REPO_URL`
4. 推送：`git branch -M main && git push -u origin main`

