---
name: nt8-order-flow-and-data
description: Work with NinjaTrader 8 market data correctly - OnMarketData trade classification, Tick Replay for historical order flow, OnMarketDepth (Level II), AddDataSeries and BarsInProgress for multiple timeframes, and keeping real versus estimated order flow honest. Use when building footprint, delta, CVD, volume-profile, DOM or multi-timeframe NinjaScript.
---

# NT8 Order Flow and Data

## Real trades: OnMarketData
```csharp
protected override void OnMarketData(MarketDataEventArgs e)
{
    if (e.MarketDataType == MarketDataType.Ask) { lastAsk = e.Price; return; }
    if (e.MarketDataType == MarketDataType.Bid) { lastBid = e.Price; return; }
    if (e.MarketDataType != MarketDataType.Last) return;
    // classify the trade: at/above ask = buyer-initiated, at/below bid = seller-initiated, between = unclassified
}
```
- Historical bars only replay OnMarketData when **Tick Replay** is enabled (and the data provider supplies the history).
  Without it, historical order flow does not exist - do not estimate it from OHLC and call it real.
- If you ever estimate (e.g. spread volume across the bar range), label the output as estimated in the UI and in any data
  you publish, and keep estimated and real values in separate fields.
- Check `Bars.IsTickReplay` and tell the user when order-flow features need it.

## Level II: OnMarketDepth
Depth updates arrive per price level with an operation (add/update/remove). Maintain your own book per side, expect
rapid changes, and never treat displayed size as guaranteed liquidity.

## Multiple series
- `AddDataSeries(...)` only in `State.Configure`; every series then calls OnBarUpdate with its own `BarsInProgress`.
- Guard each block: `if (BarsInProgress == 1) { ... }` and check the secondary series has enough bars (`CurrentBars[1]`).
- Some host environments that run your script as a hidden child cannot add series. If your script must run inside another
  tool, avoid AddDataSeries or provide a mode without it.

## Sessions and time
Use the instrument's trading hours (`Bars.IsFirstBarOfSession`, `SessionIterator`) rather than hard-coded clock times, and
make any session window a setting.

## Publishing data for other tools
Write files from a background queue, never from the UI thread or per tick in the hot path. Use an append-only line format
(one JSON object per line), include instrument, series, bar time and a state field (historical/real-time), and rotate or
cap large logs.
