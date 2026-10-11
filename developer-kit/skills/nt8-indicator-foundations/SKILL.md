---
name: nt8-indicator-foundations
description: Build NinjaTrader 8 (NinjaScript C#) indicators correctly from the first line - lifecycle states, plots, Series<T>, properties, bar guards, Calculate modes, anti-repaint and hot-path performance. Use whenever creating or editing any NT8 indicator, or when an NT8 indicator throws state, index, serialization or "object reference" errors.
---

# NT8 Indicator Foundations

The rules every NinjaTrader 8 indicator must follow. Each rule is tied to documented NT8 behavior; when in doubt, open the
official NinjaScript Language Reference (ninjatrader.com/support/helpGuides/nt8) before writing code - never guess a signature.

## 1. Lifecycle: put each thing in its state
`OnStateChange()` runs through SetDefaults -> Configure -> DataLoaded -> Historical -> Transition -> Realtime -> Terminated.

| State | Do here | Never here |
|---|---|---|
| `SetDefaults` | `Name`, `Description`, `Calculate`, `IsOverlay`, `AddPlot`, `AddLine`, property defaults | data access, indicator calls, `new Series<T>` |
| `Configure` | `AddDataSeries(...)`, settings that must exist before data loads | indicator instances, bar access |
| `DataLoaded` | create `Series<T>` (documented: "in the State.DataLoaded create a new Series<T>"), cache indicator instances (`ema = EMA(Close, Period)`), objects needing bars/instrument | `AddDataSeries` |
| `Historical` / `Realtime` | state-specific flags (e.g. ignore history) | assuming both behave alike |
| `Terminated` | dispose resources, unsubscribe events, release timers/files | anything that assumes data still exists |

Opening an indicator's settings dialog can construct the script into SetDefaults only - keep SetDefaults side-effect free.

## 2. OnBarUpdate skeleton
```csharp
protected override void OnBarUpdate()
{
    if (BarsInProgress != 0) return;            // multi-series scripts: handle the primary series explicitly
    // reset per-bar outputs FIRST so early returns never leave stale values
    if (CurrentBar < Math.Max(Period, BarsRequiredToPlot)) return;   // enough history for every [n] you read
    // ... calculation on cached indicators: ema[0], not EMA(Close, Period)[0]
}
```
- Guard every `[n]` lookback: reading `Close[n]` needs `CurrentBar >= n`.
- Cache indicators in DataLoaded; calling `EMA(Close, 9)[0]` inside OnBarUpdate is legal but wasteful and hides intent.

## 3. Calculate modes change behavior
- `Calculate.OnBarClose` - one call per closed bar. Simplest; signals cannot repaint within the bar.
- `Calculate.OnPriceChange` / `OnEachTick` - many calls per bar. Use `IsFirstTickOfBar` for once-per-bar work, and
  decide whether a signal is final at the close (`Bars.IsLastBarOfSession`, or check the previous bar) to avoid flicker.
- Historical bars run as OnBarClose unless Tick Replay is enabled - test both historical and real-time behavior.

## 4. Plots, lines and values
```csharp
AddPlot(Brushes.DodgerBlue, "Signal");   // SetDefaults; plot index = order added
Values[0][0] = value;                     // or Value[0] for plot 0
AddLine(Brushes.Gray, 30, "Oversold");   // horizontal reference line; adjust Lines[i].Value later if it is a setting
```
Leaving a plot value unset for a bar makes it "not set" (no point drawn) - use this instead of writing 0.

## 5. Properties (settings)
```csharp
[NinjaScriptProperty]                       // becomes a constructor parameter when another script calls this indicator
[Range(1, int.MaxValue)]
[Display(Name = "Period", Order = 1, GroupName = "1. Signal")]
public int Period { get; set; }
```
- `[NinjaScriptProperty]` only on XML-serializable types (documented warning). Brushes, Series and other complex types
  need `[XmlIgnore]` (and, for brushes, a serializable string twin property).
- Every value that changes a signal is a setting with a sensible default - see skill `nt8-adjustable-parameters`.
- Group with numbered `GroupName`s ("1. Signal", "2. Display") so the grid stays ordered.

## 6. Anti-repaint rules
- Never read future bars; `[0]` is the newest bar, positive indexes go back in time.
- Decide on bar close, or mark intrabar values as provisional.
- When a value depends on a window that includes the current bar (e.g. `MAX(High, N)[0]`), use `[1]` for "the channel of
  the previous N bars" so the current bar can break it.

## 7. Hot-path performance
No LINQ, string building, `new` objects or drawing-object churn per tick. Reuse buffers, cache indicators, keep `Print`
out of production (Output-window spam slows NinjaTrader). Remove or switch off debug prints before release.

## 8. Before you call it done
Compile, then load the indicator on a chart and check: values in the Data Box, plots on historical and real-time bars,
settings dialog, workspace save/reload. Use skill `nt8-build-verification` for the full gate list.

Template: [templates/IndicatorTemplate.cs](templates/IndicatorTemplate.cs)
