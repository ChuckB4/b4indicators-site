---
name: nt8-build-verification
description: Verify NinjaTrader 8 code properly before calling it done - documentation check, real compile, functional test on a chart, regression test, platform checks and an honest build report. Use for every NinjaScript change, when a compile fails, or when someone asks "does it work?". Prevents fabricated "compiled successfully" and "tested" claims.
---

# NT8 Build Verification (eight gates)

A build is VERIFIED only when all eight gates pass. If a gate cannot be run, say so - `NT8 VERIFICATION BLOCKED` - and
never imply it passed. "Looks correct" and "should work" are not results.

| Gate | Pass means |
|---|---|
| 1. Requirement | The exact change, files, classes and the features that must NOT change are written down. Ambiguous request = stop and ask. |
| 2. NT8 API | Every NinjaScript call used was checked in the official Language Reference (signature, lifecycle state, historical vs real-time behavior). No API borrowed from another platform. |
| 3. Existing code | You read the code you are changing and what depends on it. You extend what exists rather than building a parallel copy. |
| 4. Compile | Compiled for real, 0 errors. Warnings read and explained. |
| 5. Functional | Loaded on a chart (or run in Strategy Analyzer / Playback) and the feature behaves as specified on historical and real-time bars. |
| 6. Regression | Everything that could be affected still behaves as before - plots, signals, settings, saved workspaces, dependent scripts. Ask "what could this have broken?" and test those. |
| 7. Platform | Calculate mode, Tick Replay, multi-series, Strategy Analyzer, rendering and resource cleanup checked as relevant. |
| 8. Final audit | Diff against the baseline: only the requested change is present. |

## Compile options
- **In NinjaTrader:** NinjaScript Editor -> Compile (F5). Read the error list; NT8 compiles the whole Custom project, so an
  error in any file blocks all of them.
- **Outside NinjaTrader (quick check):** compile your files with the .NET Framework `csc.exe` against
  `NinjaTrader.Core.dll`, `NinjaTrader.Gui.dll` (NinjaTrader install `bin`) and `NinjaTrader.Custom.dll`
  (Documents\NinjaTrader 8\bin\Custom) plus WPF references. This catches syntax and type errors without touching the
  live Custom folder, but it does **not** include NinjaTrader's generated code - an in-app compile is still required.

## When a gate fails
`BUILD STATUS: FAILED` - record the failed gate, the error, the root cause and the exact fix; fix only that; run all
gates again from Gate 1. Never fix one feature by quietly changing another.

## Keep an error database
Record every compile/runtime failure with cause and fix, and check it before writing new code. Seed entries:
[errors/NT8_ERROR_DATABASE.md](errors/NT8_ERROR_DATABASE.md)

## Build report (paste at the end of every change)
```
CHANGE:            <exact requested change>
FILES:             <files actually changed>
NT8 DOCS:          PASS / FAIL       COMPILE:      PASS / FAIL / BLOCKED
FUNCTIONAL:        PASS / FAIL / BLOCKED          REGRESSION:   PASS / FAIL / BLOCKED
PLATFORM:          PASS / FAIL / BLOCKED          UNRELATED CHANGES: NONE / FOUND
FINAL STATUS:      VERIFIED / FAILED / BLOCKED
```
