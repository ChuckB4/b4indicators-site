# NT8 Error Database (seed)

Add one entry per real failure: symptom, cause, fix. Check here before writing new code.

## Property / serialization
- **Symptom:** NinjaScript compile error in generated code: property or indexer cannot be assigned to (it is read only).
  **Cause:** a `[NinjaScriptProperty]` member has only a getter; NT8's generated code assigns every such member.
  **Fix:** add an empty setter `set { }` (for exposed Series) or a real setter.
- **Symptom:** workspace fails to save/restore, or "could not serialize" errors.
  **Cause:** a non-serializable public property (Brush, Series, custom object) without `[XmlIgnore]`.
  **Fix:** `[XmlIgnore]` it; for Brush settings add a `[Browsable(false)]` string twin using `Serialize.BrushToString` / `StringToBrush`.

## State / lifecycle
- **Symptom:** `Object reference not set to an instance of an object` on the first bar.
  **Cause:** Series or indicator created in SetDefaults/Configure, or used before DataLoaded.
  **Fix:** create Series<T> and cache indicators in `State.DataLoaded`.
- **Symptom:** "You are accessing an index with a value that is invalid since it is out-of-range".
  **Cause:** reading `[n]` before `CurrentBar >= n`.
  **Fix:** guard with `if (CurrentBar < n) return;` using the largest lookback you read.
- **Symptom:** AddDataSeries ignored or error.
  **Cause:** called outside `State.Configure`.
  **Fix:** move it to Configure; handle `BarsInProgress` in OnBarUpdate.

## Drawing
- **Symptom:** CS1503 cannot convert between Brush and string / wrong argument types on `Draw.*`.
  **Cause:** wrong overload.
  **Fix:** open the `Draw.*` page in the Language Reference and match the overload exactly (owner, tag, isAutoScale, barsAgo/time, y, brush ...).
- **Symptom:** only the newest arrow is visible.
  **Cause:** the same tag reused, so each draw replaces the last.
  **Fix:** make tags unique per bar (`"Up" + CurrentBar`).

## Performance
- **Symptom:** chart lag on OnEachTick.
  **Cause:** allocations, LINQ, string building or `Print` per tick; drawing-object churn.
  **Fix:** cache, reuse buffers, use `IsFirstTickOfBar`, prefer OnRender for heavy visuals, remove debug prints.
