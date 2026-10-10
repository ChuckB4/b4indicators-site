# B4 Developer Kit (free)

Everything here is free to use for building NinjaTrader 8 indicators that speak the **B4 Signal API v1**.

## Contents
- `demos/` — three simple NinjaScript indicators written from scratch with the B4 Signal API built in:
  - `B4ApiDemoEmaCross.cs` — fast/slow EMA cross; confirmation = trend side
  - `B4ApiDemoRsiReversal.cs` — RSI leaves oversold/overbought; confirmation = RSI vs midline
  - `B4ApiDemoDonchianBreakout.cs` — close breaks the prior N-bar channel; confirmation = last breakout side
- `skills/` — the B4 NinjaTrader 8 skill library for AI coding assistants (Claude Code and compatible tools):
  `nt8-indicator-foundations`, `nt8-b4-signal-api`, `nt8-adjustable-parameters`, `nt8-build-verification`,
  `nt8-drawing-and-rendering`, `nt8-order-flow-and-data`, `nt8-safe-deployment`

## Install a demo in NinjaTrader 8 (only when flat)
1. Close any open positions; ideally do this with the market closed.
2. Copy the `.cs` file into `Documents\NinjaTrader 8\bin\Custom\Indicators\` (or import a packaged archive via Tools -> Import).
3. In NinjaTrader open the NinjaScript Editor and compile (F5). Check for errors.
4. Add "B4 API Demo - ..." to a chart. The B4 settings appear under **B4 CoPilot Pro Integration**.

## Install the skills (Claude Code)
Copy any skill folder into `%USERPROFILE%\.claude\skills\` (personal) or `<project>\.claude\skills\` (project).
Each folder holds a `SKILL.md`; Claude uses it automatically when the task matches its description.

## What the demos do not do
They place no orders, read no account data and write no files. They are learning material, not trading systems.

Educational and research use only. Not trading advice. Trading involves substantial risk.
