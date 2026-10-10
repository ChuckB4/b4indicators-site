---
name: nt8-safe-deployment
description: Install or update NinjaScript files without hurting live charts or open trades - back up first, deploy only when flat and ideally with the market closed, understand that saving a .cs into the Custom folder triggers a compile, reload charts after, and keep a rollback path. Use before copying, importing or compiling any NinjaScript into a NinjaTrader 8 installation that is in use.
---

# NT8 Safe Deployment

NinjaTrader compiles the entire Custom project whenever a NinjaScript file in it changes. A compile reloads NinjaScript
types; running add-ons and strategies can restart, while open charts may keep using the previous build until reloaded.
Treat every file change in the Custom folder as a live deployment.

## Before deploying
1. **Be flat.** No open positions and no working orders on any account a script manages. A restart can leave a position
   without the stop or target a script was managing.
2. **Prefer the market closed** (or a weekend) for anything that touches strategies or execution tools.
3. **Back up** the current files (copy with a timestamped name, or export a NinjaScript archive) and note their hashes.
4. **Build and test outside the live folder first** (a scratch copy or a separate NinjaTrader installation / Playback).
5. Write down what is being deployed and how to roll it back.

## Deploy
- Import via Tools -> Import -> NinjaScript Add-On for packaged files, or copy the files in, then compile once (F5) and read
  the error list. One error anywhere blocks the whole project - fix or roll back immediately.
- Do not edit and save files repeatedly in the live folder: each save is another compile.

## After deploying
- Reload NinjaScript on every chart that uses the changed scripts (right-click chart -> Reload NinjaScript).
- Re-enable strategies and confirm in the Output window / Control Center log that they terminated and re-attached cleanly.
- Confirm managed positions still have their protective orders before trading again.
- Watch the log for exceptions for the first session.

## Rollback
Restore the backed-up files, compile, reload charts, and record what failed in your error database.

## Distribution
Ship customer builds as protected/compiled assemblies when the source is proprietary; never include source maps, debug
symbols or internal paths in a public package.
