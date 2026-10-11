/* B4 AI Indicator Studio - Phase 1 generator (no AI): spec -> NinjaScript skeleton with the B4 Signal API v1.
   Pure functions, used by the page and by the compile test (node). Built-in NinjaTrader 8 indicators only. */
(function (root) {
  'use strict';
  var MA = { SMA: 'SMA', EMA: 'EMA', WMA: 'WMA', HMA: 'HMA' };
  var TEMPLATES = {
    ma_cross: { label: 'Moving-average cross', overlay: true },
    level_cross: { label: 'Oscillator level cross', overlay: false },
    band_break: { label: 'Band breakout / reversal', overlay: true }
  };

  function cls(name) {
    var s = String(name || '').replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean)
      .map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join('');
    if (!s) s = 'MyIndicator';
    if (/^[0-9]/.test(s)) s = 'I' + s;
    return s.slice(0, 48);
  }
  function titleCase(s) { return String(s).replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); }); }
  function num(v, d, min, max) { v = Number(v); if (!isFinite(v)) v = d; return Math.min(max, Math.max(min, v)); }
  function dbl(v) { var s = String(v); return /[.eE]/.test(s) ? s : s + '.0'; }

  // keyword matching from a plain-language description (NOT AI): returns a suggested spec
  function suggest(text) {
    var t = String(text || '').toLowerCase(), sp = defaults();
    if (/rsi|cci|stoch|oversold|overbought|oscillator/.test(t)) sp.template = 'level_cross';
    else if (/bollinger|keltner|donchian|channel|band|breakout|break out/.test(t)) sp.template = 'band_break';
    else sp.template = 'ma_cross';
    if (/\bcci\b/.test(t)) sp.osc = 'CCI'; else if (/stoch/.test(t)) sp.osc = 'Stochastics'; else sp.osc = 'RSI';
    if (/keltner/.test(t)) sp.band = 'Keltner'; else if (/donchian/.test(t)) sp.band = 'Donchian'; else sp.band = 'Bollinger';
    if (/revers|fade|mean.?revert|bounce/.test(t)) sp.bandMode = 'reversal';
    if (/\bhma\b|hull/.test(t)) sp.maType = 'HMA'; else if (/\bwma\b|weighted/.test(t)) sp.maType = 'WMA'; else if (/\bsma\b|simple/.test(t)) sp.maType = 'SMA'; else sp.maType = 'EMA';
    var nums = (t.match(/\b\d{1,3}\b/g) || []).map(Number).filter(function (n) { return n > 1 && n < 500; });
    if (sp.template === 'ma_cross' && nums.length >= 2) { sp.fast = Math.min(nums[0], nums[1]); sp.slow = Math.max(nums[0], nums[1]); }
    if (sp.template !== 'ma_cross' && nums.length >= 1) sp.period = nums[0];
    var os = t.match(/oversold\D{0,8}?(-?\d{1,3})\b/), ob = t.match(/overbought\D{0,8}?(-?\d{1,3})\b/);
    if (os) sp.lower = Number(os[1]);
    if (ob) sp.upper = Number(ob[1]);
    if (os || ob) nums = nums.filter(function (n) { return !(os && n === Number(os[1])) && !(ob && n === Number(ob[1])); });
    if (sp.template !== 'ma_cross' && nums.length >= 1) sp.period = nums[0];
    sp.alerts = /alert|sound|notify/.test(t);
    sp.colorBars = /colou?r (the )?(bars|candles)|paint/.test(t);
    var m = t.match(/(?:called|named)\s+["']?([a-z0-9]+(?:\s+[a-z0-9]+){0,3})/);
    if (m) sp.name = titleCase(m[1].split(/\s+(?:when|with|that|which|and|to|for|on|using)\b/)[0]);
    return sp;
  }

  function defaults() {
    return { name: 'My B4 Indicator', template: 'ma_cross', maType: 'EMA', fast: 9, slow: 21, osc: 'RSI', period: 14,
      upper: 70, lower: 30, band: 'Bollinger', bandMode: 'breakout', width: 2, arrows: true, alerts: false, colorBars: false };
  }

  function normalize(sp) {
    var d = defaults(), o = {};
    for (var k in d) o[k] = sp && sp[k] !== undefined ? sp[k] : d[k];
    o.template = TEMPLATES[o.template] ? o.template : 'ma_cross';
    o.maType = MA[o.maType] ? o.maType : 'EMA';
    o.osc = { RSI: 1, CCI: 1, Stochastics: 1 }[o.osc] ? o.osc : 'RSI';
    o.band = { Bollinger: 1, Keltner: 1, Donchian: 1 }[o.band] ? o.band : 'Bollinger';
    o.bandMode = o.bandMode === 'reversal' ? 'reversal' : 'breakout';
    o.fast = num(o.fast, 9, 1, 400); o.slow = num(o.slow, 21, 2, 500); if (o.slow <= o.fast) o.slow = o.fast + 1;
    o.period = num(o.period, 14, 2, 500);
    var lv = o.osc === 'CCI' ? [100, -100] : [70, 30];
    o.upper = num(o.upper, lv[0], -1000, 1000); o.lower = num(o.lower, lv[1], -1000, 1000);
    if (o.lower >= o.upper) { o.upper = lv[0]; o.lower = lv[1]; }
    o.width = num(o.width, 2, 0.1, 10);
    o.className = cls(o.name);
    o.arrows = !!o.arrows; o.alerts = !!o.alerts; o.colorBars = !!o.colorBars;
    return o;
  }

  function specLines(sp) {
    var s = normalize(sp), L = [];
    L.push(['Name', s.name + ' (class ' + s.className + ')']);
    L.push(['Type', TEMPLATES[s.template].label + (TEMPLATES[s.template].overlay ? ', drawn on the price panel' : ', drawn in its own panel')]);
    if (s.template === 'ma_cross') {
      L.push(['Buy signal', s.maType + '(' + s.fast + ') crosses above ' + s.maType + '(' + s.slow + ')']);
      L.push(['Sell signal', s.maType + '(' + s.fast + ') crosses below ' + s.maType + '(' + s.slow + ')']);
      L.push(['Confirmation', '1 while the fast average is above the slow one, -1 while below']);
    } else if (s.template === 'level_cross') {
      var o = s.osc === 'Stochastics' ? 'Stochastics %K(' + s.period + ')' : s.osc + '(' + s.period + ')';
      L.push(['Buy signal', o + ' crosses back above ' + s.lower + ' (leaving the low zone)']);
      L.push(['Sell signal', o + ' crosses back below ' + s.upper + ' (leaving the high zone)']);
      L.push(['Confirmation', '1 while ' + o + ' is above the midpoint of ' + s.lower + ' and ' + s.upper + ', -1 while below']);
    } else {
      var b = s.band === 'Bollinger' ? 'Bollinger(' + s.period + ', ' + s.width + ' std dev)' : s.band === 'Keltner' ? 'Keltner(' + s.period + ', x' + s.width + ')' : 'Donchian(' + s.period + ', previous bar)';
      if (s.bandMode === 'breakout') {
        L.push(['Buy signal', 'Close breaks above the upper ' + b + ' band']);
        L.push(['Sell signal', 'Close breaks below the lower ' + b + ' band']);
      } else {
        L.push(['Buy signal', 'Close moves back above the lower ' + b + ' band (reversal)']);
        L.push(['Sell signal', 'Close moves back below the upper ' + b + ' band (reversal)']);
      }
      L.push(['Confirmation', '1 while Close is above the middle of the bands, -1 while below']);
    }
    L.push(['Signals', 'Published through the B4 Signal API v1 (pulses on the signal bar only); compatible with B4 CoPilot Dev']);
    L.push(['Extras', [s.arrows ? 'arrows' : '', s.alerts ? 'alerts (real-time)' : '', s.colorBars ? 'signal bars coloured' : ''].filter(Boolean).join(', ') || 'none']);
    L.push(['Orders', 'None. Indicators publish information only.']);
    return L;
  }

  function generate(sp) {
    var s = normalize(sp), c = s.className, I = '        ', II = I + '    ', III = II + '    ';
    var fields = [], init = [], props = [], defs = [], plots = [], body = [], warm;
    if (s.template === 'ma_cross') {
      fields.push('private ISeries<double> fast;', 'private ISeries<double> slow;');
      defs.push('FastPeriod = ' + s.fast + ';', 'SlowPeriod = ' + s.slow + ';');
      plots.push('AddPlot(Brushes.DeepSkyBlue, "Fast");', 'AddPlot(Brushes.Goldenrod, "Slow");');
      init.push('fast = ' + s.maType + '(Close, FastPeriod);', 'slow = ' + s.maType + '(Close, SlowPeriod);');
      props.push(prop('int', 'FastPeriod', 'Fast ' + s.maType + ' period', 1, '[Range(1, int.MaxValue)]'),
                 prop('int', 'SlowPeriod', 'Slow ' + s.maType + ' period', 2, '[Range(2, int.MaxValue)]'));
      warm = 'Math.Max(FastPeriod, SlowPeriod) + 1';
      body.push('Values[0][0] = fast[0];', 'Values[1][0] = slow[0];',
        'bool buy = CrossAbove(fast, slow, 1);', 'bool sell = CrossBelow(fast, slow, 1);',
        'int direction = fast[0] > slow[0] ? 1 : fast[0] < slow[0] ? -1 : 0;');
    } else if (s.template === 'level_cross') {
      fields.push('private ISeries<double> osc;');
      defs.push('Period = ' + s.period + ';', 'UpperLevel = ' + dbl(s.upper) + ';', 'LowerLevel = ' + dbl(s.lower) + ';');
      plots.push('AddPlot(Brushes.DeepSkyBlue, "' + s.osc + '");');
      var mk = s.osc === 'RSI' ? 'RSI(Close, Period, 3)' : s.osc === 'CCI' ? 'CCI(Close, Period)' : 'Stochastics(3, Period, 3).K';
      init.push('osc = ' + mk + ';');
      props.push(prop('int', 'Period', s.osc + ' period', 1, '[Range(2, int.MaxValue)]'),
                 prop('double', 'UpperLevel', 'High zone level', 2, ''), prop('double', 'LowerLevel', 'Low zone level', 3, ''));
      warm = 'Period + 3';
      body.push('Values[0][0] = osc[0];', 'bool buy = CrossAbove(osc, LowerLevel, 1);', 'bool sell = CrossBelow(osc, UpperLevel, 1);',
        'double mid = (UpperLevel + LowerLevel) / 2.0;', 'int direction = osc[0] > mid ? 1 : osc[0] < mid ? -1 : 0;');
    } else {
      fields.push('private ISeries<double> upper;', 'private ISeries<double> lower;', 'private ISeries<double> middle;');
      defs.push('Period = ' + s.period + ';');
      if (s.band !== 'Donchian') defs.push('Width = ' + dbl(s.width) + ';');
      plots.push('AddPlot(Brushes.SteelBlue, "Upper");', 'AddPlot(Brushes.SteelBlue, "Lower");');
      if (s.band === 'Bollinger') init.push('var bands = Bollinger(Close, Width, Period);', 'upper = bands.Upper;', 'lower = bands.Lower;', 'middle = bands.Middle;');
      else if (s.band === 'Keltner') init.push('var bands = KeltnerChannel(Close, Width, Period);', 'upper = bands.Upper;', 'lower = bands.Lower;', 'middle = bands.Midline;');
      else init.push('var bands = DonchianChannel(Close, Period);', 'upper = bands.Upper;', 'lower = bands.Lower;', 'middle = bands.Mean;');
      props.push(prop('int', 'Period', s.band + ' period', 1, '[Range(2, int.MaxValue)]'));
      if (s.band !== 'Donchian') props.push(prop('double', 'Width', s.band === 'Bollinger' ? 'Standard deviations' : 'Offset multiplier', 2, '[Range(0.1, 10)]'));
      warm = 'Period + 2';
      var ref = s.band === 'Donchian' ? 1 : 0;   // Donchian: compare with the previous bar's channel (the current bar is inside it by definition)
      body.push('Values[0][0] = upper[0];', 'Values[1][0] = lower[0];');
      if (s.bandMode === 'breakout')
        body.push('bool buy = Close[0] > upper[' + ref + '] && Close[1] <= upper[' + (ref + 1) + '];', 'bool sell = Close[0] < lower[' + ref + '] && Close[1] >= lower[' + (ref + 1) + '];');
      else
        body.push('bool buy = Close[0] > lower[' + ref + '] && Close[1] <= lower[' + (ref + 1) + '];', 'bool sell = Close[0] < upper[' + ref + '] && Close[1] >= upper[' + (ref + 1) + '];');
      body.push('int direction = Close[0] > middle[0] ? 1 : Close[0] < middle[0] ? -1 : 0;');
    }
    defs.push('ShowArrows = ' + s.arrows + ';', 'UseAlerts = ' + s.alerts + ';', 'ColorSignalBars = ' + s.colorBars + ';', 'B4UseEntrySignals = true;', 'B4UseConfirmations = true;');
    props.push(prop('bool', 'ShowArrows', 'Show arrows', 10, ''), prop('bool', 'UseAlerts', 'Alerts (real-time)', 11, ''), prop('bool', 'ColorSignalBars', 'Colour signal bars', 12, ''));

    var out = [];
    out.push('// ' + s.name + ' - generated by B4 AI Indicator Studio (Phase 1 preview: template generator, no AI).');
    out.push('// Status: GENERATED. The B4 templates are compile-checked against NinjaTrader 8, but this exact file has not been');
    out.push('// compiled or tested by B4. Compile it (F5), test it in simulation, and review the logic before you rely on it.');
    out.push('// Educational and research use only. Not trading advice. This indicator places no orders.');
    out.push('//');
    specLines(s).forEach(function (l) { out.push('// ' + l[0] + ': ' + l[1]); });
    out.push('#region Using declarations', 'using System;', 'using System.ComponentModel;', 'using System.ComponentModel.DataAnnotations;',
      'using System.Windows.Media;', 'using System.Xml.Serialization;', 'using NinjaTrader.Gui;', 'using NinjaTrader.NinjaScript;',
      'using NinjaTrader.NinjaScript.DrawingTools;', '#endregion', '');
    out.push('namespace NinjaTrader.NinjaScript.Indicators.B4Studio', '{', '    public class ' + c + ' : Indicator', '    {');
    fields.forEach(function (f) { out.push(I + f); });
    out.push(I + 'private Series<bool> b4BuySignal;', I + 'private Series<bool> b4SellSignal;', I + 'private Series<int> b4ConfirmationDirection;', '');
    out.push(I + 'protected override void OnStateChange()', I + '{', II + 'if (State == State.SetDefaults)', II + '{');
    out.push(III + 'Description = "' + s.name.replace(/"/g, '') + ' (B4 AI Indicator Studio). Publishes B4 Signal API v1 signals.";');
    out.push(III + 'Name = "' + s.name.replace(/"/g, '') + '";', III + 'Calculate = Calculate.OnBarClose;', III + 'IsOverlay = ' + TEMPLATES[s.template].overlay + ';',
      III + 'DisplayInDataBox = true;', III + 'IsSuspendedWhileInactive = true;');
    defs.forEach(function (d) { out.push(III + d); });
    plots.forEach(function (p) { out.push(III + p); });
    out.push(II + '}', II + 'else if (State == State.DataLoaded)', II + '{');
    init.forEach(function (x) { out.push(III + x); });
    out.push(III + 'b4BuySignal = new Series<bool>(this, MaximumBarsLookBack.Infinite);', III + 'b4SellSignal = new Series<bool>(this, MaximumBarsLookBack.Infinite);',
      III + 'b4ConfirmationDirection = new Series<int>(this, MaximumBarsLookBack.Infinite);', II + '}', I + '}', '');
    out.push(I + 'protected override void OnBarUpdate()', I + '{', II + 'b4BuySignal[0] = false;      // B4 Signal API: pulse, then reset every bar',
      II + 'b4SellSignal[0] = false;', II + 'b4ConfirmationDirection[0] = 0;', II + 'if (CurrentBar < ' + warm + ') return;', '');
    body.forEach(function (b) { out.push(II + b); });
    out.push('', II + 'if (B4UseEntrySignals) { b4BuySignal[0] = buy; b4SellSignal[0] = sell; }', II + 'if (B4UseConfirmations) b4ConfirmationDirection[0] = direction;');
    out.push(II + 'if (ColorSignalBars && buy) BarBrush = Brushes.LimeGreen;', II + 'if (ColorSignalBars && sell) BarBrush = Brushes.Red;');
    if (TEMPLATES[s.template].overlay) {
      out.push(II + 'if (ShowArrows && buy) Draw.ArrowUp(this, "' + c + 'Buy" + CurrentBar, false, 0, Low[0] - 2 * TickSize, Brushes.LimeGreen);',
        II + 'if (ShowArrows && sell) Draw.ArrowDown(this, "' + c + 'Sell" + CurrentBar, false, 0, High[0] + 2 * TickSize, Brushes.Red);');
    } else {
      out.push(II + 'if (ShowArrows && buy) Draw.ArrowUp(this, "' + c + 'Buy" + CurrentBar, false, 0, LowerLevel, Brushes.LimeGreen);',
        II + 'if (ShowArrows && sell) Draw.ArrowDown(this, "' + c + 'Sell" + CurrentBar, false, 0, UpperLevel, Brushes.Red);');
    }
    out.push(II + 'if (UseAlerts && State == State.Realtime && (buy || sell))',
      III + 'Alert("' + c + '", Priority.Medium, Name + (buy ? ": buy signal" : ": sell signal"), NinjaTrader.Core.Globals.InstallDir + @"\\sounds\\Alert1.wav", 10, Brushes.Black, buy ? Brushes.LimeGreen : Brushes.Red);');
    out.push(I + '}', '', I + '#region Your settings (normal properties, so B4 CoPilot Dev can load this indicator)');
    props.forEach(function (p) { out.push(p); });
    out.push(I + '#endregion', '', I + '#region B4 Signal API v1 (public contract - keep names and attributes exactly)',
      I + '[NinjaScriptProperty][Display(Name = "B4 Entry Signals Enabled", Order = 41, GroupName = "B4 CoPilot Pro Integration")]', I + 'public bool B4UseEntrySignals { get; set; }', '',
      I + '[NinjaScriptProperty][Display(Name = "B4 Confirmation Signals Enabled", Order = 42, GroupName = "B4 CoPilot Pro Integration")]', I + 'public bool B4UseConfirmations { get; set; }', '',
      I + '[NinjaScriptProperty][Browsable(false)][XmlIgnore]', I + 'public Series<bool> B4BuySignals { get { return b4BuySignal; } set { } }', '',
      I + '[NinjaScriptProperty][Browsable(false)][XmlIgnore]', I + 'public Series<bool> B4SellSignals { get { return b4SellSignal; } set { } }', '',
      I + '[NinjaScriptProperty][Browsable(false)][XmlIgnore]', I + 'public Series<int> B4ConfirmationDirections { get { return b4ConfirmationDirection; } set { } }',
      I + '#endregion', '    }', '}', '');
    return out.join('\r\n');

    function prop(type, name, label, order, range) {
      return I + (range ? range : '') + '[Display(Name = "' + label + '", Order = ' + order + ', GroupName = "1. Settings")]\r\n' + I + 'public ' + type + ' ' + name + ' { get; set; }';
    }
  }

  var api = { TEMPLATES: TEMPLATES, defaults: defaults, normalize: normalize, suggest: suggest, specLines: specLines, generate: generate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.B4Studio = api;
})(this);
