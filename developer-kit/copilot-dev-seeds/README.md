# B4 CoPilot Dev: Seed Pack

Free starter tools for **B4 CoPilot Dev**, the free developer edition of the B4 execution shell for NinjaTrader 8.
B4 CoPilot Dev trades **simulation accounts only** (Sim101, Playback101, accounts named "Sim…", and Strategy Analyzer backtests).

## How it works

B4 CoPilot Dev ships as a protected NinjaTrader import. You never edit it. You extend it with your **own tools**: normal
NinjaTrader 8 indicators that implement the public **B4 Signal API v1**. In the strategy settings you type each tool's class name:

| Setting | Tool | What B4 CoPilot Dev reads |
|---|---|---|
| Signal tool | `B4SeedSignal` | `B4BuySignals` / `B4SellSignals` pulses = entries |
| Filter tool 1-3 | `B4SeedFilter` | `B4ConfirmationDirections` (1 long, -1 short, 0 neutral) = filter |
| Exit tool | `B4SeedExit` | sell pulse exits a long, buy pulse exits a short |

Stop loss and profit target (ticks), trading hours, max trades per day and opposite-signal exits are settings of B4 CoPilot Dev.

## The one rule for tools

Your own settings are **normal properties** (no `[NinjaScriptProperty]`). Only the five B4 Signal API members carry
`[NinjaScriptProperty]`. B4 CoPilot Dev loads the copy that uses the defaults in `State.SetDefaults`, so change your values there.

## Quick start

1. Make sure you are flat, ideally with the market closed.
2. Copy the three `.cs` files into `Documents\NinjaTrader 8\bin\Custom\Indicators\B4Seeds\` and compile (F5).
3. Import B4 CoPilot Dev (Tools > Import > NinjaScript Add-On) when the protected download is available.
4. Add B4 CoPilot Dev to a chart on **Sim101** or in **Playback**. Signal tool = `B4SeedSignal`. Enable it.
5. Replace the example logic between the `YOUR ... LOGIC` markers with your own, rename the class, and point the setting at it.

The examples (SMA cross, EMA trend filter, RSI exit) are placeholders that show the wiring. They are not trading systems.

Educational and research use only. Not trading advice. Test in simulation. You are responsible for your own code and trading decisions.
