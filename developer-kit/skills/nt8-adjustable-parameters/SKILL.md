---
name: nt8-adjustable-parameters
description: Make every trading-relevant value in a NinjaTrader 8 indicator or strategy a visible, adjustable setting with a sensible default - no hard-wired thresholds, periods, offsets or risk values. Use when writing new NinjaScript, reviewing code for "magic numbers", or converting an existing script's constants into settings without changing its behaviour.
---

# NT8 Adjustable Parameters (no hard-wired trading values)

**Rule:** any value that changes when a signal fires, where a stop or target sits, how much is traded, or which session
counts must be a property the user can see and change in the settings grid. Its default is today's value.

Why: the trader owns the parameter choices. A hidden constant is a decision the developer made for them, it cannot be
tested or tuned, and it makes the tool harder to trust.

## What must be a setting
Periods, lookbacks and smoothing; thresholds, levels and score bands; confirmation counts and weights; offsets in ticks;
stop, target and trailing distances; position size and risk limits; session and time windows; regime cut-offs; the
settings of any indicator you host inside your script.

Display-only values (colours, widths, fonts) should be settings too where practical, but trading values are mandatory.

## Pattern
```csharp
[NinjaScriptProperty]
[Range(0, 100)]
[Display(Name = "Oversold level", Description = "RSI value that arms a buy signal", Order = 3, GroupName = "1. Signal")]
public double Oversold { get; set; }          // default set in SetDefaults: Oversold = 30;
```
- Use `[Range]` to block impossible input; validate cross-field rules (e.g. fast < slow) in `DataLoaded` and `Print` a clear
  message or fall back safely - never throw from OnBarUpdate.
- Name settings in trader language, with units: "Stop distance (ticks)", "Session start (HHmm)".
- Brushes as settings need `[XmlIgnore]` plus a serializable string twin:
  ```csharp
  [XmlIgnore] [Display(Name = "Up colour", GroupName = "2. Display")] public Brush UpBrush { get; set; }
  [Browsable(false)] public string UpBrushSerializable { get { return Serialize.BrushToString(UpBrush); } set { UpBrush = Serialize.StringToBrush(value); } }
  ```

## Converting an existing script (behaviour must not change)
1. Inventory every literal that affects trading, with file and line.
2. Add one property per value; default = the literal it replaces.
3. Replace the literal with the property. Nothing else changes - no renames, no cleanup.
4. Regression test: with default settings the script must reproduce its previous output bar for bar (same plots, same
   signals, same orders on the same historical data). Any difference is a failed conversion.
5. A value that genuinely cannot become a setting (an external contract field name, a platform constant) is listed with
   the reason - never silently kept.

## Review checklist
- [ ] Search the code for numeric literals inside OnBarUpdate / signal methods: each is a setting or justified.
- [ ] Every setting has a unit, a range and a default.
- [ ] Defaults reproduce the documented behaviour.
