---
name: nt8-drawing-and-rendering
description: Draw on NinjaTrader 8 charts safely and fast - Draw.* objects with correct overloads and unique tags, when to switch to OnRender with SharpDX, creating and disposing SharpDX resources, and keeping rendering separate from calculation. Use when adding arrows, text, lines, zones, labels or custom visuals to an NT8 indicator, or when a chart becomes slow or visuals glitch.
---

# NT8 Drawing and Rendering

## Choose the right tool
| Need | Use |
|---|---|
| A few markers per session (arrows, dots, a text label) | `Draw.*` drawing objects |
| Many shapes, per-price-level visuals, heatmaps, footprints, dashboards | `OnRender` with SharpDX |
| A line that follows a value every bar | a plot (`AddPlot` + `Values[i][0]`) |

## Draw.* rules
- Check the overload in the Language Reference before using it (e.g. `Draw.ArrowUp(owner, tag, isAutoScale, barsAgo, y, brush[, drawOnPricePanel])`).
- Tags identify objects: reuse a tag to move/replace an object, use a unique tag per bar (`"Up" + CurrentBar`) to keep history.
- Indicators in a separate panel that mark price: pass `drawOnPricePanel: true` and set `DrawOnPricePanel = true`.
- Hundreds of drawing objects slow every chart action - cap history (remove old tags with `RemoveDrawObject`) or move to OnRender.

## OnRender rules
```csharp
public override void OnRenderTargetChanged()
{
    if (dxUp != null) { dxUp.Dispose(); dxUp = null; }
    if (RenderTarget != null) dxUp = UpBrush.ToDxBrush(RenderTarget);   // recreate per render target
}

protected override void OnRender(ChartControl chartControl, ChartScale chartScale)
{
    base.OnRender(chartControl, chartScale);                 // keep normal plot rendering
    if (IsInHitTest || dxUp == null) return;
    for (int i = ChartBars.FromIndex; i <= ChartBars.ToIndex; i++)   // only the visible bars
    {
        float x = chartControl.GetXByBarIndex(ChartBars, i);
        float y = chartScale.GetYByValue(High.GetValueAt(i));
        // RenderTarget.FillEllipse(...) etc.
    }
}
```
- Create SharpDX brushes/text formats once per render target, dispose them on change and in `State.Terminated`.
- Never allocate per bar inside OnRender; reuse objects.
- Read values with `GetValueAt(index)`, not `[barsAgo]`, inside OnRender.
- OnRender is presentation only: never calculate signals, place orders or change state there. Strategy Analyzer does not
  call OnRender, so any logic placed there silently disappears in backtests.
- Keep layout deterministic: compute positions from chart scale and bar width, and avoid overlapping labels by reserving space.

## Test
Scroll, zoom, resize, change bar spacing, switch to a different instrument, reload NinjaScript, and leave a chart running
in real time - visuals must stay correct and memory must not grow.
