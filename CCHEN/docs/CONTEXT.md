# Trader Edge Tracker

## Project Specification

Build a small web app called **Trader Edge Tracker**.

### Goal

Ultra-simple trading journal for scalpers (crypto, forex, meme coins) with stats and filters.

### Tech Stack

- **Next.js** (App Router) + **TypeScript** + **TailwindCSS**
- Using **localStorage only** (no backend) for v1

---

## High-Level Requirements

Single-page experience at `/` with:

- **Top stats panel**
- **Trade input form**
- **Trades table with filters**

### Additional Requirements

- Data should persist in browser via **localStorage**
- Clean, minimal UI optimized for **desktop first**, but responsive
- Name the main page component: `app/page.tsx`
- Use functional components and React hooks only

---

## Data Model

### Trade Type

Define a `Trade` type with the following fields:

- **id**: `string` (uuid)
- **date**: `string` (ISO YYYY-MM-DD)
- **symbol**: `string` (e.g. "BTCUSDT", "EURUSD", "BONK/USDC")
- **market**: `string` (enum-ish: "crypto" | "forex" | "stocks" | "other")
- **direction**: `"long" | "short"`
- **entryPrice**: `number`
- **exitPrice**: `number`
- **stopLoss**: `number`
- **takeProfit**: `number`
- **size**: `number` (position size, e.g. in units or lots)
- **realizedPnl**: `number` (in account currency)
- **riskReward**: `number`
- **setupTag**: `string` (e.g. "breakout", "retest", "news", "range")
- **emotion**: `"calm" | "fear" | "greed" | "tilt" | "revenge" | "other"`
- **notes**: `string`
- **screenshotUrl**: `string` (optional)

### Storage

Store all trades in **localStorage** under key `trader-edge-trades`.

---

## Layout

Use a simple **1-column layout**:

### Header

- **App name**: "Trader Edge Tracker"
- **Small subtitle**: "Fast journaling for scalpers"

### Stats Panel

Cards with:

- **Total trades**
- **Winrate %**
- **Average R:R**
- **Total PnL**
- **Best day PnL**

> **Note**: Stats are computed from currently filtered trades.

### Filters Section

- **Date range**: from and to (type date)
- **Symbol search** (text input)
- **Market select** (all, crypto, forex, stocks, other)
- **Direction select** (all, long, short)
- **Setup tag select** (dropdown built dynamically from existing trades, plus "all")
- **Emotion select** (all, calm, fear, greed, tilt, revenge, other)
- **"Reset filters"** button

### Trade Form

Left/right or stacked, but on desktop it should look compact.

#### Fields (with labels and placeholders)

- **Date** (default to today)
- **Symbol**
- **Market** (select)
- **Direction** (radio or select)
- **Entry price**
- **Exit price**
- **Stop loss**
- **Take profit**
- **Size**
- **Realized PnL**
- **R:R** (can be user input, but also auto-suggested)
- **Setup tag**
- **Emotion** (select)
- **Screenshot URL**
- **Notes** (textarea)

#### Buttons

- **"Add trade"**
- **"Clear form"**

#### Basic Validation

- **Required**: date, symbol, direction, entryPrice, exitPrice, realizedPnl
- Numbers must be numbers; show small error messages

### Trades Table

#### Columns

- Date
- Symbol
- Market
- Dir
- Entry
- Exit
- SL
- TP
- Size
- PnL
- R:R
- Tag
- Emotion
- Screenshot (icon/link)
- Notes (icon or truncated text)
- Actions (Edit, Delete)

#### Sorting

- **Default**: date desc (newest first)

#### Implement

- **Delete trade** (with confirm)
- **Edit trade** (click "Edit" to load into form, then "Save changes" instead of "Add trade")

---

## State & Logic

### Custom Hook: `useTrades`

Implement a custom hook `useTrades`:

#### Responsibilities

- Load trades from localStorage once on mount
- Save trades to localStorage whenever they change

#### Expose

- `trades`
- `addTrade(tradeInput)`
- `updateTrade(id, updatedFields)`
- `deleteTrade(id)`

> **Note**: `addTrade` generates uuid for id.

> **Important**: Ensure localStorage interactions are guarded for SSR (check `typeof window !== "undefined"`).

### Stats Calculation

Implement a separate hook or utilities for stats:

```typescript
calculateStats(trades: Trade[]) returns:
  - totalTrades
  - winrate (wins = realizedPnl > 0)
  - avgRR (mean of riskReward where defined)
  - totalPnl
  - bestDayPnl (group by date, sum pnl, take max)
```

> **Note**: All stats take filtered trades, not full trades list.

---

## Filters

Keep filter state in the main page component:

- `fromDate`: string or null
- `toDate`: string or null
- `searchSymbol`: string
- `market`: string
- `direction`: string
- `setupTag`: string
- `emotion`: string

### Filter Function

Create a pure function:

```typescript
function applyFilters(trades: Trade[], filters: Filters): Trade[]
```

### Filtering Rules

- **Date range**: include trade if `trade.date` is between from and to (inclusive)
- **Symbol**: case-insensitive substring search in symbol
- **Market, direction, setupTag, emotion**: if filter != "all", match exactly

---

## UI Design Details

Use **TailwindCSS** with a neutral, dark-ish trading style:

### Colors

- **Background**: `bg-slate-950` or `bg-slate-900`
- **Cards**: `bg-slate-800 border border-slate-700 rounded-lg p-4`
- **Text**: mostly `text-slate-100`
- **Accent color** (for buttons): emerald or cyan

### Buttons

#### Primary

```
bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-md px-4 py-2
```

#### Secondary

```
bg-slate-700 hover:bg-slate-600 text-slate-100 px-3 py-2 rounded-md
```

### Typography

- **Header**: `text-2xl font-semibold`
- **Section titles**: `text-lg font-medium mb-2`

### Table Styling

- **PnL**:
  - Positive: `text-emerald-400`
  - Negative: `text-rose-400`
- **Emotion tag**: show a small pill with background depending on emotion
- **ScreenshotUrl**: if present, render a small "Open" button/link that opens in new tab

---

## File Structure

Create:

```
app/page.tsx              – main page with layout, hooks usage, UI
components/StatsPanel.tsx
components/FiltersBar.tsx
components/TradeForm.tsx
components/TradesTable.tsx
hooks/useTrades.ts
lib/stats.ts              – calculateStats and any helper functions
lib/filters.ts            – applyFilters and filter types
types/trade.ts            – Trade type and enums
```

> **Note**: Ensure each component is fully typed with TypeScript props interfaces.

---

## Extra: Preset Sample Trades

On first load, if localStorage has no trades, insert **5–10 example trades** (BTC, SOL, EURUSD etc.) so the stats and table are not empty. Show realistic mix:

- **4 wins, 3 losses**
- Different emotions and tags
- Crypto and forex markets

### Implementation

Provide a small helper in `useTrades`:

- `loadInitialTradesIfEmpty()` called once to seed data

---

## Next Steps After Scaffold

After generating the project:

1. Add a small tagline text block under the header explaining:
   - "Made for scalpers who hate complex journals."
   - "Log trades in under 30 seconds and instantly see where you leak edge."

2. Make sure the app builds and runs with `npm run dev`
