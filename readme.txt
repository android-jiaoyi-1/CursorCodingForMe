网站项目说明

## 项目简介

本仓库实现了一个基于 React + TypeScript 的股票交易模拟平台，提供从行情浏览、交易下单到历史回溯的完整体验，所有数据均使用本地生成的模拟数据，便于快速演示与二次开发。

## 技术栈

- React 18 + TypeScript
- Vite 构建工具
- Ant Design 5.x UI 组件库
- ECharts 5.x 可视化库
- Zustand + Immer 状态管理
- Dayjs 日期处理

## 功能特性

- **全局布局与导航**：通过 `MainLayout` 提供顶部标题与侧边导航栏，支持在「行情」「交易」「历史记录」三大模块间快速切换。
- **行情中心**：
  - 分时图实时展示当前选中股票的价格、均价与成交量曲线，并叠加买卖点标记。
  - 自选股列表支持代码/名称模糊搜索、点击切换股票、展示实时价格与涨跌幅。
- **交易工作台**：
  - K 线图支持 MA5/MA10/MA20 均线、成交量副图、区间缩放以及买卖点高亮。
  - 股票交易面板包含股票搜索、买/卖切换、快捷数量（1/4、1/2、全部）、交易金额与手续费 0.1% 计算、可用资金校验及提示信息。
  - 持仓列表实时计算持仓盈亏，展示成本价、现价与浮动收益。
- **历史记录与对账**：提供交易记录表格，支持日期筛选、分页查看买卖流水。
- **模拟数据与实时更新**：
  - `mockData` 自动生成股票列表、K 线、分时及交易历史等示例数据。
  - `useStockStore` 每秒刷新行情数据，更新当前持仓盈亏，并为买卖操作生成对应的 B/S 点用于图表联动。

## 本地开发

```bash
npm install
npm run dev
```

## 构建与预览

```bash
npm run build
npm run preview
```

## 提交到 GitHub（命令示例）

1. 初始化仓库（已完成可跳过）
   ```bash
   git init
   ```
2. 添加并提交更改
   ```bash
   git add .
   git commit -m "docs: 更新功能说明"
   ```
3. 关联远程（将 `YOUR_GITHUB_REPO_URL` 替换为实际仓库地址）
   ```bash
   git remote add origin YOUR_GITHUB_REPO_URL
   ```
4. 推送到主分支
   ```bash
   git branch -M main
   git push -u origin main
   ```


