---
name: nt8-b4-signal-api
description: Add the free B4 Signal API v1 to a NinjaTrader 8 indicator so its buy/sell entry signals and confirmation direction can be read by B4 tools and other NinjaScript. Use when a user wants an indicator to "work with B4", "publish B4 signals", "connect to B4 CoPilot Pro", or asks how the B4 API contract works.
---

# B4 Signal API v1 for NinjaTrader 8

The B4 Signal API is a small, public NinjaScript contract: five members on your indicator. Tools that understand the
contract read them like any other indicator series. Signals stay inside NinjaTrader; the API never places orders.

## The contract (copy names, types and attributes exactly)
| Member | Type | Meaning |
|---|---|---|
| `B4UseEntrySignals` | `bool` setting | Master switch for entry signals (default `true`) |
| `B4UseConfirmations` | `bool` setting | Master switch for the confirmation series (default `true`) |
| `B4BuySignals` | `Series<bool>` | `true` only on the bar that produced a buy signal |
| `B4SellSignals` | `Series<bool>` | `true` only on the bar that produced a sell signal |
| `B4ConfirmationDirections` | `Series<int>` | `1` long bias, `-1` short bias, `0` none, for the current bar |

Settings grid: group `"B4 CoPilot Pro Integration"`, display names `"B4 Entry Signals Enabled"` (Order 41) and
`"B4 Confirmation Signals Enabled"` (Order 42).

## Implementation steps
1. Declare private backing series and create them in `State.DataLoaded` (documented Series<T> location):
   `b4BuySignal = new Series<bool>(this, MaximumBarsLookBack.Infinite);` (same for sell and `Series<int>` confirmation).
2. Default both switches to `true` in `SetDefaults`.
3. At the top of `OnBarUpdate`, **reset** the bar: buy = false, sell = false, confirmation = 0. Signals are pulses, so a
   stale `true` would look like a fresh signal on every later bar.
4. After your warm-up guard, set the values for the current bar `[0]`, honouring the switches:
   ```csharp
   if (B4UseEntrySignals) { b4BuySignal[0] = buy; b4SellSignal[0] = sell; }
   if (B4UseConfirmations) b4ConfirmationDirection[0] = bias;   // 1, -1 or 0
   ```
5. Paste the public members from [templates/B4SignalApiBlock.cs](templates/B4SignalApiBlock.cs). Keep the empty
   `set { }`: NT8's generated code assigns every `[NinjaScriptProperty]` member, so a getter-only property fails the
   NinjaScript compile. Keep `[Browsable(false)]` and `[XmlIgnore]` so the series never appear in the grid or the workspace.

## Rules
- Prefer `Calculate.OnBarClose` for the published signals. If you calculate intrabar, only publish a final signal.
- Publish entries only when the condition is new (e.g. a cross), not on every bar the condition stays true.
- The confirmation series is a bias, not an entry: hold it while your condition holds.
- Never rename or re-type a contract member; tools match by exact name.
- No order methods in an API indicator. Execution belongs to a strategy or execution tool the user controls.
- Every value that decides a signal is still an adjustable setting (skill `nt8-adjustable-parameters`).

## Test checklist
- Data Box: add temporary plots or prints during development to see the pulses on the right bars, then remove them.
- Switch `B4UseEntrySignals` off: no `true` values. Switch `B4UseConfirmations` off: confirmation stays 0.
- Historical and real-time bars both publish; a reload reproduces the same historical signals.

Working examples: the three free demos in the B4 Developer Kit (`B4ApiDemoEmaCross`, `B4ApiDemoRsiReversal`,
`B4ApiDemoDonchianBreakout`).
