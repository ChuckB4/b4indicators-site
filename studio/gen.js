/* B4 AI Indicator Studio - generator v2 (no AI): spec -> NinjaScript 8 indicator or strategy.
   Indicators publish the B4 Signal API v1. Strategies are bar-close, managed-order strategies with risk limits.
   Pure functions, used by the page and by the compile test (node). Built-in NinjaTrader 8 indicators only. */
(function (root) {
  'use strict';

  var VERSION = 'B4 Studio template generator 2.1 (2026-10-11)';
  // open-source NinjaTrader 8 projects (verified MIT on GitHub, 2026-10-11) shown as credited references; their code is NOT copied into Studio output
  var OPEN_SOURCE = [
    { fam: /^of_(imb|delta)$/, name: 'edwincummins/FootprintOrderFlow', url: 'https://github.com/edwincummins/FootprintOrderFlow', lic: 'MIT', what: 'Footprint indicator: bid, ask, delta and volume per price' },
    { fam: /^of_/, name: 'marksantiago290/OrderFlowBot-NinjaTrading', url: 'https://github.com/marksantiago290/OrderFlowBot-NinjaTrading', lic: 'MIT', what: 'Order-flow trading bot with ATM strategies' },
    { fam: /^of_(cvd|delta)$/, name: 'J01rbriones/Ninjatrader8-Cumulative-Cluster', url: 'https://github.com/J01rbriones/Ninjatrader8-Cumulative-Cluster', lic: 'MIT', what: 'Clusters of aggressive orders and cumulative flow' },
    { fam: /^of_(poc|va)$/, name: 'tarrellallen-dev/ninjatrader-volume-profile', url: 'https://github.com/tarrellallen-dev/ninjatrader-volume-profile', lic: 'MIT', what: 'Session volume profile without Order Flow+' },
    { fam: /^of_va$/, name: 'jalv92/AreaTrap', url: 'https://github.com/jalv92/AreaTrap', lic: 'MIT', what: 'Strategy for failed breaks of the value area' },
    { fam: /^of_(vwap|imb)$/, name: 'TraderLeocom/beer-money', url: 'https://github.com/TraderLeocom/beer-money', lic: 'MIT', what: 'Order-flow analysis with rolling VWAP' },
    { fam: /^of_(imb|big)$/, name: 'jalv92/TrapFlow', url: 'https://github.com/jalv92/TrapFlow', lic: 'MIT', what: 'Order-flow trap indicator (absorption, value structure)' },
    { fam: /^l2_/, name: 'wokecorndog/LiquidityCompass', url: 'https://github.com/wokecorndog/LiquidityCompass', lic: 'MIT', what: 'Real-time order-book depth gauge from the DOM' },
    { fam: /^l2_/, name: 'j-stach/baton-pass', url: 'https://github.com/j-stach/baton-pass', lic: 'MIT', what: 'Collects market data and depth events for analysis' }
  ];
  function references(sp) { var s = normalize(sp); return OPEN_SOURCE.filter(function (r) { return r.fam.test(s.sig); }).map(function (r) { return { name: r.name, url: r.url, license: r.lic, what: r.what }; }); }

  // ---------------------------------------------------------------- catalogs
  var MA = [['EMA', 'EMA - exponential'], ['SMA', 'SMA - simple'], ['WMA', 'WMA - weighted'], ['HMA', 'HMA - Hull'],
    ['DEMA', 'DEMA - double exponential'], ['TEMA', 'TEMA - triple exponential'], ['TMA', 'TMA - triangular'],
    ['ZLEMA', 'ZLEMA - zero lag'], ['VWMA', 'VWMA - volume weighted'], ['KAMA', 'KAMA - Kaufman adaptive'],
    ['T3', 'T3 - Tillson'], ['LinReg', 'Linear regression']];
  var OSC = {
    RSI: { l: 'RSI', ind: 'RSI(Close, OscPeriod, 3)', up: 70, lo: 30 },
    CCI: { l: 'CCI', ind: 'CCI(Close, OscPeriod)', up: 100, lo: -100 },
    Stochastics: { l: 'Stochastics %K', ind: 'Stochastics(Close, 3, OscPeriod, 3)', ser: '.K', up: 80, lo: 20 },
    StochRSI: { l: 'Stochastic RSI', ind: 'StochRSI(Close, OscPeriod)', up: 0.8, lo: 0.2 },
    WilliamsR: { l: 'Williams %R', ind: 'WilliamsR(Close, OscPeriod)', up: -20, lo: -80 },
    MFI: { l: 'Money Flow Index', ind: 'MFI(OscPeriod)', up: 80, lo: 20 },
    CMO: { l: 'Chande Momentum (CMO)', ind: 'CMO(Close, OscPeriod)', up: 50, lo: -50 },
    UltimateOscillator: { l: 'Ultimate Oscillator', ind: 'UltimateOscillator(Close, Math.Max(1, OscPeriod / 2), OscPeriod, OscPeriod * 2)', up: 70, lo: 30 },
    ROC: { l: 'Rate of Change (%)', ind: 'ROC(Close, OscPeriod)', up: 1, lo: -1 },
    Momentum: { l: 'Momentum (points)', ind: 'Momentum(Close, OscPeriod)', up: 5, lo: -5 }
  };
  var CANDLES = {
    engulfing: ['Engulfing', 'BullishEngulfing', 'BearishEngulfing'], harami: ['Harami', 'BullishHarami', 'BearishHarami'],
    haramiCross: ['Harami cross', 'BullishHaramiCross', 'BearishHaramiCross'], beltHold: ['Belt hold', 'BullishBeltHold', 'BearishBeltHold'],
    star: ['Morning star / Evening star', 'MorningStar', 'EveningStar'], soldiers: ['Three white soldiers / Three black crows', 'ThreeWhiteSoldiers', 'ThreeBlackCrows'],
    hammer: ['Hammer / Shooting star', 'Hammer', 'ShootingStar'], piercing: ['Piercing line / Dark cloud cover', 'PiercingLine', 'DarkCloudCover'],
    methods: ['Rising / Falling three methods', 'RisingThreeMethods', 'FallingThreeMethods']
  };
  var COLORS = ['LimeGreen', 'Lime', 'SpringGreen', 'MediumSeaGreen', 'Teal', 'DodgerBlue', 'DeepSkyBlue', 'SteelBlue', 'Navy', 'Cyan', 'Gold', 'Goldenrod', 'Yellow', 'Orange', 'OrangeRed',
    'Red', 'Crimson', 'Magenta', 'Violet', 'White', 'Silver', 'Gray', 'DimGray', 'DarkSlateGray', 'Black'];
  var PALETTES = { standard: ['LimeGreen', 'Red'], colorblind: ['DodgerBlue', 'Orange'], highcontrast: ['Lime', 'Magenta'], mono: ['White', 'Gray'] };
  var LABEL_WORDS = { buysell: ['BUY', 'SELL'], longshort: ['LONG', 'SHORT'], arrows: ['\\u25B2', '\\u25BC'] };   // arrows are C# unicode escapes (ASCII-safe source)
  var SOUNDS = [['Alert1.wav', 'Alert 1'], ['Alert2.wav', 'Alert 2'], ['Alert3.wav', 'Alert 3'], ['Alert4.wav', 'Alert 4'], ['Announcement.wav', 'Announcement'], ['', 'No sound']];
  var RESERVED = /^(Indicator|Strategy|Close|Open|High|Low|Volume|Time|Input|Values|Alert|Draw|Print|SMA|EMA|WMA|HMA|DEMA|TEMA|TMA|ZLEMA|VWMA|KAMA|T3|LinReg|RSI|CCI|Stochastics|StochRSI|WilliamsR|MFI|CMO|ROC|Momentum|UltimateOscillator|MACD|DM|ADX|ATR|MAX|MIN|Bollinger|KeltnerChannel|DonchianChannel|ParabolicSAR|CandlestickPattern|Swing|VMA|B4SignalApi)$/;
  var GROUPS = [['proj', 'Project'], ['sig', 'Signal'], ['flt', 'Filters'], ['disp', 'Display and styling'], ['read', 'Readability'], ['tbl', 'On-chart table'], ['alr', 'Alerts'],
    ['ord', 'Entries and sizing'], ['exit', 'Exits'], ['risk', 'Risk limits and safety']];
  var GN = { sig: '1. Signal', flt: '2. Filters', disp: '3. Display and styling', read: '4. Readability', tbl: '5. On-chart table', alr: '6. Alerts', ord: '7. Entries and sizing', exit: '8. Exits', risk: '9. Risk limits' };
  function twoLines(s) { return s.sig === 'ma_cross' || s.sig === 'macd' || s.sig === 'band' || s.sig === 'nbar' || s.sig === 'dmi'; }
  function hasLevels(s) { return s.sig === 'osc' || s.sig === 'macd'; }
  var TEXT_MAX = { name: 60, buyWord: 20, sellWord: 20, alertBuyText: 40, alertSellText: 40 };

  function opts(list) { return list.map(function (x) { return Array.isArray(x) ? x : [x, x]; }); }
  function isMa(s) { return s.sig === 'ma_cross' || s.sig === 'price_ma' || s.sig === 'ma_slope'; }
  function anyAtr(s) { return s.stopMode === 'atr' || s.tgtMode === 'atr' || s.trailMode === 'atr'; }

  // ---------------------------------------------------------------- field schema (drives the page, normalization and tooltips)
  var FIELDS = [
    { id: 'visibility', t: 'sel', g: 'proj', l: 'Visibility', d: 'private', o: [['private', 'Private - only in this browser'], ['public', 'Public - share with the community']], tip: 'Private builds stay in your browser. Public builds are shared as open source for the community to discuss and improve, and must pass stricter requirements.' },
    { id: 'author', t: 'text', g: 'proj', l: 'Author (attribution)', d: '', tip: 'Your name or handle, written into the file header. Required for public builds.' },
    { id: 'license', t: 'sel', g: 'proj', l: 'License', d: 'MIT', o: [['MIT', 'MIT - permissive'], ['Apache-2.0', 'Apache 2.0 - permissive, patent grant'], ['MPL-2.0', 'MPL 2.0 - changes to this file stay open']], show: function (s) { return s.visibility === 'public'; }, tip: 'Public builds are open source. MIT is the simplest; MPL 2.0 requires that improvements to this file are shared back.' },
    { id: 'description', t: 'text', g: 'proj', l: 'Short description', d: '', tip: 'One sentence shown in NinjaTrader and on the community post.' },
    { id: 'name', t: 'text', g: 'sig', l: 'Name', d: '', tip: 'Shown in NinjaTrader\'s indicator or strategy list. The C# class name is made from it (letters and numbers only).' },
    { id: 'sig', t: 'sel', g: 'sig', l: 'Signal type', d: 'ma_cross', o: [['ma_cross', 'Moving-average cross'], ['price_ma', 'Price crosses a moving average'], ['ma_slope', 'Moving-average turn (slope change)'], ['osc', 'Oscillator levels'], ['macd', 'MACD'], ['band', 'Bands: breakout or reversal'], ['nbar', 'N-bar high / low breakout'], ['dmi', 'DMI: DI+ / DI- cross'], ['psar', 'Parabolic SAR flip'], ['candle', 'Candlestick pattern'],
      ['of_delta', 'Order flow: bar delta'], ['of_cvd', 'Order flow: cumulative delta (CVD)'], ['of_imb', 'Order flow: stacked imbalances (footprint)'], ['of_poc', 'Order flow: session POC cross'],
      ['of_va', 'Order flow: value area (VAH / VAL)'], ['of_vwap', 'Order flow: session VWAP cross'], ['of_big', 'Order flow: big trade'],
      ['l2_book', 'Level 2: order book imbalance'], ['l2_wall', 'Level 2: liquidity wall break']],
      tip: 'The core event that creates a buy or sell signal. Filters below can then block signals that do not meet your conditions.' },
    { id: 'maType', t: 'sel', g: 'sig', l: 'Average type', d: 'EMA', o: MA, show: isMa, tip: 'EMA reacts faster than SMA. HMA, ZLEMA and TEMA cut lag further but turn more often. KAMA adapts to volatility. VWMA weights each bar by its volume.' },
    { id: 'fast', t: 'num', g: 'sig', l: 'Fast period', d: 9, min: 1, max: 400, show: function (s) { return s.sig === 'ma_cross'; }, tip: 'Bars in the fast average. Smaller = earlier signals and more false ones.' },
    { id: 'slow', t: 'num', g: 'sig', l: 'Slow period', d: 21, min: 2, max: 500, show: function (s) { return s.sig === 'ma_cross'; }, tip: 'Bars in the slow average. Must be larger than the fast period.' },
    { id: 'maLen', t: 'num', g: 'sig', l: 'Average period', d: 20, min: 2, max: 500, show: function (s) { return s.sig === 'price_ma' || s.sig === 'ma_slope'; }, tip: 'Bars in the moving average.' },
    { id: 'osc', t: 'sel', g: 'sig', l: 'Oscillator', d: 'RSI', o: Object.keys(OSC).map(function (k) { return [k, OSC[k].l]; }), show: function (s) { return s.sig === 'osc'; }, tip: 'Changing the oscillator resets the levels to its usual values (RSI 70/30, CCI +100/-100, Williams %R -20/-80 ...).' },
    { id: 'oscLen', t: 'num', g: 'sig', l: 'Oscillator period', d: 14, min: 2, max: 500, show: function (s) { return s.sig === 'osc'; }, tip: 'Look-back of the oscillator. 14 is the common default.' },
    { id: 'oscMode', t: 'sel', g: 'sig', l: 'Trigger', d: 'exit', o: [['exit', 'Leaves the zone (reversal)'], ['enter', 'Enters the zone (momentum)'], ['mid', 'Crosses the midline']], show: function (s) { return s.sig === 'osc'; },
      tip: 'Reversal: buy when it climbs back out of the low zone. Momentum: buy when it pushes into the high zone. Midline: buy when it crosses above the middle of the two levels.' },
    { id: 'upper', t: 'num', g: 'sig', l: 'High level', d: 70, min: -1000, max: 1000, step: 'any', show: function (s) { return s.sig === 'osc'; }, tip: 'The overbought / high zone boundary.' },
    { id: 'lower', t: 'num', g: 'sig', l: 'Low level', d: 30, min: -1000, max: 1000, step: 'any', show: function (s) { return s.sig === 'osc'; }, tip: 'The oversold / low zone boundary. Must be below the high level.' },
    { id: 'macdFast', t: 'num', g: 'sig', l: 'MACD fast', d: 12, min: 1, max: 200, show: function (s) { return s.sig === 'macd'; }, tip: 'Fast EMA of the MACD line.' },
    { id: 'macdSlow', t: 'num', g: 'sig', l: 'MACD slow', d: 26, min: 2, max: 400, show: function (s) { return s.sig === 'macd'; }, tip: 'Slow EMA of the MACD line. Must be larger than the fast one.' },
    { id: 'macdSmooth', t: 'num', g: 'sig', l: 'Signal line', d: 9, min: 1, max: 200, show: function (s) { return s.sig === 'macd'; }, tip: 'EMA of the MACD line used as the signal line.' },
    { id: 'macdMode', t: 'sel', g: 'sig', l: 'Trigger', d: 'signal', o: [['signal', 'MACD crosses its signal line'], ['zero', 'MACD crosses zero']], show: function (s) { return s.sig === 'macd'; }, tip: 'Signal-line crosses come earlier; zero-line crosses are slower but mark a change of trend.' },
    { id: 'band', t: 'sel', g: 'sig', l: 'Bands', d: 'Bollinger', o: [['Bollinger', 'Bollinger Bands'], ['Keltner', 'Keltner Channel'], ['Donchian', 'Donchian Channel']], show: function (s) { return s.sig === 'band'; }, tip: 'Bollinger uses standard deviation, Keltner uses average range, Donchian uses the highest high and lowest low.' },
    { id: 'bandLen', t: 'num', g: 'sig', l: 'Band period', d: 20, min: 2, max: 500, show: function (s) { return s.sig === 'band'; }, tip: 'Look-back of the bands.' },
    { id: 'width', t: 'num', g: 'sig', l: 'Band width', d: 2, min: 0.1, max: 10, step: 0.1, show: function (s) { return s.sig === 'band' && s.band !== 'Donchian'; }, tip: 'Bollinger: standard deviations. Keltner: multiplier of the average range.' },
    { id: 'bandMode', t: 'sel', g: 'sig', l: 'Trigger', d: 'breakout', o: [['breakout', 'Close breaks out of the bands'], ['reversal', 'Close comes back inside (reversal)']], show: function (s) { return s.sig === 'band'; }, tip: 'Breakout follows the move. Reversal fades it when price returns inside the band.' },
    { id: 'nbarLen', t: 'num', g: 'sig', l: 'Look-back bars', d: 20, min: 2, max: 500, show: function (s) { return s.sig === 'nbar'; }, tip: 'Buy when the close breaks above the highest high of the previous N bars; sell below the lowest low.' },
    { id: 'dmiLen', t: 'num', g: 'sig', l: 'DMI period', d: 14, min: 2, max: 200, show: function (s) { return s.sig === 'dmi'; }, tip: 'Buy when DI+ crosses above DI-, sell when DI- crosses above DI+.' },
    { id: 'sarAcc', t: 'num', g: 'sig', l: 'SAR acceleration', d: 0.02, min: 0.001, max: 1, step: 0.001, show: function (s) { return s.sig === 'psar'; }, tip: 'Starting acceleration factor (0.02 is standard).' },
    { id: 'sarMax', t: 'num', g: 'sig', l: 'SAR maximum', d: 0.2, min: 0.01, max: 1, step: 0.01, show: function (s) { return s.sig === 'psar'; }, tip: 'Maximum acceleration factor (0.2 is standard).' },
    { id: 'sarStep', t: 'num', g: 'sig', l: 'SAR step', d: 0.02, min: 0.001, max: 1, step: 0.001, show: function (s) { return s.sig === 'psar'; }, tip: 'How much the acceleration grows on each new extreme.' },
    { id: 'candle', t: 'sel', g: 'sig', l: 'Pattern', d: 'engulfing', o: Object.keys(CANDLES).map(function (k) { return [k, CANDLES[k][0]]; }), show: function (s) { return s.sig === 'candle'; }, tip: 'Uses NinjaTrader\'s built-in pattern recognition. The bullish form gives a buy, the bearish form a sell.' },
    { id: 'trendStrength', t: 'num', g: 'sig', l: 'Prior trend bars', d: 4, min: 0, max: 50, show: function (s) { return s.sig === 'candle'; }, tip: 'Bars of prior trend the pattern needs (0 = ignore the trend before the pattern).' },
    { id: 'ofDeltaMode', t: 'sel', g: 'sig', l: 'Trigger', d: 'threshold', o: [['threshold', 'Bar delta beyond a threshold'], ['flip', 'Bar delta changes sign']], show: function (s) { return s.sig === 'of_delta'; }, tip: 'Threshold: strong one-sided aggression in one bar. Flip: buyers and sellers swap control.' },
    { id: 'ofDelta', t: 'num', g: 'sig', l: 'Delta threshold (contracts)', d: 300, min: 1, max: 1000000, show: function (s) { return s.sig === 'of_delta' && s.ofDeltaMode === 'threshold'; }, tip: 'Buy volume minus sell volume in one bar. Start around 300-1000 for ES on 5-minute bars; much less for NQ, MES or MNQ.' },
    { id: 'ofCvdLen', t: 'num', g: 'sig', l: 'CVD average period', d: 20, min: 2, max: 500, show: function (s) { return s.sig === 'of_cvd'; }, tip: 'EMA of cumulative delta; a cross of CVD over its average marks a shift in aggression.' },
    { id: 'ofCvdReset', t: 'chk', g: 'sig', l: 'Reset cumulative delta each session', d: true, show: function (s) { return /^of_/.test(s.sig); }, tip: 'Start cumulative delta from zero at each session open (common for intraday). Off: one running total.' },
    { id: 'ofRatio', t: 'num', g: 'sig', l: 'Imbalance ratio', d: 3, min: 1, max: 50, step: 0.5, show: function (s) { return s.sig === 'of_imb'; }, tip: 'Diagonal imbalance: ask volume at a price at least this many times the bid volume one tick lower (buy), or bid volume at least this many times the ask one tick higher (sell).' },
    { id: 'ofMinVol', t: 'num', g: 'sig', l: 'Imbalance minimum volume', d: 10, min: 0, max: 1000000, show: function (s) { return s.sig === 'of_imb'; }, tip: 'Ignore imbalances on thin prices with less volume than this.' },
    { id: 'ofStack', t: 'num', g: 'sig', l: 'Stacked levels', d: 3, min: 1, max: 20, show: function (s) { return s.sig === 'of_imb'; }, tip: 'Consecutive prices with an imbalance in the same direction. 3 is the common "stacked imbalance".' },
    { id: 'ofVaPct', t: 'num', g: 'sig', l: 'Value area (%)', d: 70, min: 50, max: 95, show: function (s) { return s.sig === 'of_poc' || s.sig === 'of_va'; }, tip: 'Share of the session volume inside the value area. 70% is the standard.' },
    { id: 'ofVaMode', t: 'sel', g: 'sig', l: 'Trigger', d: 'breakout', o: [['breakout', 'Close breaks out of the value area'], ['reversal', 'Close comes back inside the value area']], show: function (s) { return s.sig === 'of_va'; }, tip: 'Breakout: acceptance outside value. Reversal: a failed break back into value.' },
    { id: 'ofBig', t: 'num', g: 'sig', l: 'Big trade size (contracts)', d: 50, min: 1, max: 1000000, show: function (s) { return s.sig === 'of_big'; }, tip: 'A single trade (one print) of at least this size in the bar. Its side (buy or sell) decides the signal.' },
    { id: 'l2Levels', t: 'num', g: 'sig', l: 'Book levels counted', d: 10, min: 1, max: 50, show: function (s) { return /^l2_/.test(s.sig); }, tip: 'How many price levels on each side of the order book are added up.' },
    { id: 'l2Ratio', t: 'num', g: 'sig', l: 'Book imbalance ratio', d: 2, min: 1, max: 20, step: 0.1, show: function (s) { return s.sig === 'l2_book'; }, tip: 'Signal when resting bids are at least this many times the resting asks (or the reverse).' },
    { id: 'l2Wall', t: 'num', g: 'sig', l: 'Wall size (contracts)', d: 300, min: 1, max: 10000000, show: function (s) { return s.sig === 'l2_wall'; }, tip: 'A resting order at one price of at least this size counts as a liquidity wall.' },
    { id: 'l2Range', t: 'num', g: 'sig', l: 'Wall search range (ticks)', d: 8, min: 1, max: 200, show: function (s) { return s.sig === 'l2_wall'; }, tip: 'Only walls within this many ticks of the close are tracked.' },
    { id: 'side', t: 'sel', g: 'sig', l: 'Direction', d: 'both', o: [['both', 'Long and short'], ['long', 'Long only'], ['short', 'Short only']], tip: 'Which side may signal or trade. Opposite-signal exits still work in one-sided strategies.' },
    { id: 'calc', t: 'sel', g: 'sig', l: 'Calculate', d: 'bar', k: 'i', o: [['bar', 'On bar close (recommended)'], ['tick', 'On each tick']], show: function (s) { return !/^(of|l2)_/.test(s.sig); }, tip: 'Bar close: a signal is final once shown. Each tick: signals appear earlier but can disappear before the bar closes (markers are removed if they do).' },

    { id: 'fTrend', t: 'chk', g: 'flt', l: 'Trend filter', d: false, tip: 'Longs only above the trend average, shorts only below it.' },
    { id: 'fTrendMa', t: 'sel', g: 'flt', l: 'Trend average', d: 'EMA', o: MA, show: function (s) { return s.fTrend; }, tip: 'Average used for the trend filter.' },
    { id: 'fTrendLen', t: 'num', g: 'flt', l: 'Trend period', d: 200, min: 2, max: 1000, show: function (s) { return s.fTrend; }, tip: '200 is a common long-term trend line; 50 is shorter-term.' },
    { id: 'fHtf', t: 'chk', g: 'flt', l: 'Higher-timeframe trend', d: false, tip: 'Only trade with the trend of a higher timeframe (for example the 60-minute chart while you trade the 5-minute).' },
    { id: 'fHtfTf', t: 'sel', g: 'flt', l: 'Higher timeframe', d: '60', o: [['5', '5 minutes'], ['15', '15 minutes'], ['30', '30 minutes'], ['60', '60 minutes'], ['240', '240 minutes'], ['D', 'Daily']], show: function (s) { return s.fHtf; }, tip: 'Must be higher than your chart\'s timeframe. Load enough days of history for it.' },
    { id: 'fHtfMa', t: 'sel', g: 'flt', l: 'Higher-timeframe average', d: 'EMA', o: MA, show: function (s) { return s.fHtf; }, tip: 'Longs only while the higher-timeframe close is above this average; shorts only below.' },
    { id: 'fHtfLen', t: 'num', g: 'flt', l: 'Higher-timeframe period', d: 50, min: 2, max: 500, show: function (s) { return s.fHtf; }, tip: 'Bars of the higher timeframe in the average.' },
    { id: 'fAdx', t: 'chk', g: 'flt', l: 'Trend strength (ADX)', d: false, tip: 'Skip signals while ADX is below the minimum: avoids choppy, trendless markets.' },
    { id: 'fAdxLen', t: 'num', g: 'flt', l: 'ADX period', d: 14, min: 2, max: 200, show: function (s) { return s.fAdx; }, tip: 'Look-back of ADX.' },
    { id: 'fAdxMin', t: 'num', g: 'flt', l: 'ADX minimum', d: 20, min: 1, max: 100, show: function (s) { return s.fAdx; }, tip: '20-25 is a common threshold for a trending market.' },
    { id: 'fVol', t: 'chk', g: 'flt', l: 'Volume filter', d: false, tip: 'Only signal when the bar\'s volume is above its average times the multiplier.' },
    { id: 'fVolLen', t: 'num', g: 'flt', l: 'Volume average period', d: 20, min: 2, max: 500, show: function (s) { return s.fVol; }, tip: 'Bars in the volume average.' },
    { id: 'fVolMult', t: 'num', g: 'flt', l: 'Volume multiplier', d: 1.2, min: 0.1, max: 20, step: 0.1, show: function (s) { return s.fVol; }, tip: '1.0 = above average; 1.5 = 50% above average.' },
    { id: 'fAtr', t: 'chk', g: 'flt', l: 'Volatility (ATR) filter', d: false, tip: 'Only signal when the average true range is inside a band, in ticks: skips dead and wild markets.' },
    { id: 'fAtrLen', t: 'num', g: 'flt', l: 'ATR period', d: 14, min: 2, max: 200, show: function (s) { return s.fAtr; }, tip: 'Look-back of ATR.' },
    { id: 'fAtrMin', t: 'num', g: 'flt', l: 'ATR minimum (ticks)', d: 4, min: 0, max: 100000, show: function (s) { return s.fAtr; }, tip: 'Skip signals when ATR is below this many ticks.' },
    { id: 'fAtrMax', t: 'num', g: 'flt', l: 'ATR maximum (ticks, 0 = none)', d: 0, min: 0, max: 100000, show: function (s) { return s.fAtr; }, tip: 'Skip signals when ATR is above this many ticks. 0 switches the ceiling off.' },
    { id: 'fSess', t: 'chk', g: 'flt', l: 'Time window', d: false, tip: 'Only signal or enter between the start and end time (chart time zone). Windows across midnight work.' },
    { id: 'sessStart', t: 'time', g: 'flt', l: 'Start time', d: '09:30', show: function (s) { return s.fSess; }, tip: 'First bar time that may signal (HH:MM, chart time zone).' },
    { id: 'sessEnd', t: 'time', g: 'flt', l: 'End time', d: '11:30', show: function (s) { return s.fSess; }, tip: 'Last bar time that may signal (HH:MM, chart time zone).' },
    { id: 'cooldown', t: 'num', g: 'flt', l: 'Cool-down bars', d: 0, min: 0, max: 1000, tip: 'Minimum bars between two signals. 0 = no cool-down.' },

    { id: 'marker', t: 'sel', g: 'disp', l: 'Marker', d: 'arrow', k: 'i', o: [['arrow', 'Arrows'], ['triangle', 'Triangles'], ['dot', 'Dots'], ['diamond', 'Diamonds'], ['square', 'Squares'], ['none', 'No markers']], tip: 'Shape drawn on each signal bar.' },
    { id: 'buyColor', t: 'sel', g: 'disp', l: 'Buy color', d: 'LimeGreen', k: 'i', o: COLORS, tip: 'Color of buy markers, labels, bars and shading. Can be changed later in NinjaTrader.' },
    { id: 'sellColor', t: 'sel', g: 'disp', l: 'Sell color', d: 'Red', k: 'i', o: COLORS, tip: 'Color of sell markers, labels, bars and shading.' },
    { id: 'markerOffset', t: 'num', g: 'disp', l: 'Marker offset (ticks)', d: 2, min: 0, max: 200, k: 'i', tip: 'Distance between the bar and the marker.' },
    { id: 'labels', t: 'chk', g: 'disp', l: 'Text labels on signals', d: false, k: 'i', tip: 'Writes a label (BUY / SELL or your own words) next to each marker. Words, font and box are under Readability.' },
    { id: 'colorBars', t: 'chk', g: 'disp', l: 'Color signal bars', d: false, k: 'i', tip: 'Paints the signal bar in the buy or sell color.' },
    { id: 'shade', t: 'chk', g: 'disp', l: 'Shade background', d: false, k: 'i', tip: 'Tints the chart background behind signal bars.' },
    { id: 'shadeOpacity', t: 'num', g: 'disp', l: 'Shade opacity (%)', d: 20, min: 1, max: 100, k: 'i', show: function (s) { return s.shade; }, tip: 'Strength of the background tint.' },
    { id: 'showPlots', t: 'chk', g: 'disp', l: 'Draw indicator lines', d: true, k: 'i', tip: 'Draws the averages, bands or SAR on the price panel. Oscillators, MACD and DMI always draw in their own panel.' },
    { id: 'plotWidth', t: 'num', g: 'disp', l: 'Line width', d: 2, min: 1, max: 6, k: 'i', tip: 'Thickness of the plotted lines.' },
    { id: 'plotStyle', t: 'sel', g: 'disp', l: 'Plot style', d: 'Line', k: 'i', o: [['Line', 'Line'], ['Dot', 'Dots'], ['Square', 'Squares'], ['Hash', 'Hash marks'], ['Bar', 'Histogram bars'], ['Cross', 'Crosses']], tip: 'How the main lines are drawn. Histogram bars suit oscillators and MACD. (The SAR always draws as dots.)' },
    { id: 'dash', t: 'sel', g: 'disp', l: 'Line dash', d: 'Solid', k: 'i', o: [['Solid', 'Solid'], ['Dash', 'Dashed'], ['Dot', 'Dotted'], ['DashDot', 'Dash-dot']], show: function (s) { return s.plotStyle === 'Line'; }, tip: 'Solid, dashed or dotted lines.' },
    { id: 'plotColor1', t: 'sel', g: 'disp', l: 'Main line color', d: 'DeepSkyBlue', k: 'i', o: COLORS, show: function (s) { return s.sig !== 'candle' && s.sig !== 'psar'; }, tip: 'Color of the first plotted line (fast average, oscillator, MACD, upper band, DI+...).' },
    { id: 'plotColor2', t: 'sel', g: 'disp', l: 'Second line color', d: 'Goldenrod', k: 'i', o: COLORS, show: twoLines, tip: 'Color of the second line (slow average, signal line, lower band, DI-...).' },
    { id: 'levelColor', t: 'sel', g: 'disp', l: 'Level line color', d: 'DimGray', k: 'i', o: COLORS, show: hasLevels, tip: 'Color of the horizontal level lines (high / low levels, MACD zero line).' },
    { id: 'levelDash', t: 'sel', g: 'disp', l: 'Level line dash', d: 'Dash', k: 'i', o: [['Solid', 'Solid'], ['Dash', 'Dashed'], ['Dot', 'Dotted']], show: hasLevels, tip: 'Style of the horizontal level lines.' },
    { id: 'fpShow', t: 'chk', g: 'disp', l: 'Footprint numbers next to bars', d: true, k: 'i', show: function (s) { return /^of_/.test(s.sig) && s.overlay; }, tip: 'Draws the volume traded at each price beside every bar (zoom in to read them). Prices where one side dominates are colored.' },
    { id: 'fpMode', t: 'sel', g: 'disp', l: 'Footprint shows', d: 'bidask', k: 'i', o: [['bidask', 'Bid x Ask'], ['delta', 'Delta per price'], ['volume', 'Volume per price']], show: function (s) { return /^of_/.test(s.sig) && s.overlay && s.fpShow; }, tip: 'Bid x Ask: sell volume x buy volume at each price.' },
    { id: 'fpBars', t: 'num', g: 'disp', l: 'Footprint bars kept', d: 300, min: 10, max: 5000, k: 'i', show: function (s) { return /^of_/.test(s.sig) && s.overlay && s.fpShow; }, tip: 'Only the most recent bars keep their footprint, to save memory.' },
    { id: 'fpRatio', t: 'num', g: 'disp', l: 'Footprint highlight ratio', d: 3, min: 1, max: 50, step: 0.5, k: 'i', show: function (s) { return /^of_/.test(s.sig) && s.overlay && s.fpShow; }, tip: 'Prices where one side traded at least this many times the other are colored buy or sell.' },
    { id: 'showOnChart', t: 'chk', g: 'disp', l: 'Show the signal indicators on the chart', d: true, k: 's', tip: 'Adds the averages, bands or oscillator the strategy uses to the chart so you can see why it traded.' },

    { id: 'palette', t: 'sel', g: 'read', l: 'Color preset', d: 'standard', k: 'i', o: [['standard', 'Standard - green / red'], ['colorblind', 'Color-blind safe - blue / orange'], ['highcontrast', 'High contrast - lime / magenta'], ['mono', 'Monochrome - white / gray'], ['custom', 'Custom - my own colors']],
      tip: 'Sets the buy and sell colors in one step. Color-blind safe avoids the red/green pair that about 1 in 12 men cannot tell apart. Picking your own colors switches this to Custom.' },
    { id: 'fontFamily', t: 'sel', g: 'read', l: 'Font', d: 'Arial', o: ['Arial', 'Segoe UI', 'Verdana', 'Tahoma', 'Consolas'], tip: 'Font for labels and the on-chart table. Verdana and Tahoma are the easiest to read at small sizes; Consolas lines numbers up in columns.' },
    { id: 'fontSize', t: 'num', g: 'read', l: 'Text size', d: 11, min: 7, max: 28, tip: 'Size of labels and the on-chart table, in points.' },
    { id: 'labelText', t: 'sel', g: 'read', l: 'Label words', d: 'buysell', k: 'i', o: [['buysell', 'BUY / SELL'], ['longshort', 'LONG / SHORT'], ['arrows', 'Arrows only (up / down)'], ['custom', 'My own words']], show: function (s) { return s.labels; }, tip: 'Text written on signal bars when labels are on.' },
    { id: 'buyWord', t: 'text', g: 'read', l: 'Buy label', d: 'BUY', k: 'i', show: function (s) { return s.labels && s.labelText === 'custom'; }, tip: 'Your own word for buy signals (up to 20 characters).' },
    { id: 'sellWord', t: 'text', g: 'read', l: 'Sell label', d: 'SELL', k: 'i', show: function (s) { return s.labels && s.labelText === 'custom'; }, tip: 'Your own word for sell signals (up to 20 characters).' },
    { id: 'labelPrice', t: 'chk', g: 'read', l: 'Show the price on labels', d: false, k: 'i', show: function (s) { return s.labels; }, tip: 'Adds the signal bar\'s close to the label, formatted for the instrument.' },
    { id: 'labelBox', t: 'chk', g: 'read', l: 'Dark box behind labels', d: true, k: 'i', show: function (s) { return s.labels; }, tip: 'Keeps labels readable on busy charts and light backgrounds.' },
    { id: 'labelBoxOpacity', t: 'num', g: 'read', l: 'Label box opacity (%)', d: 60, min: 1, max: 100, k: 'i', show: function (s) { return s.labels && s.labelBox; }, tip: 'How solid the box behind labels is.' },

    { id: 'table', t: 'chk', g: 'tbl', l: 'Show an info table on the chart', d: false, tip: 'A small panel in a corner of the chart with live values: bias, last signal, indicator values, filter status' + ' and, for strategies, position, session P&L, entries and status. Updated on the latest bar only, so it costs nothing on history.' },
    { id: 'tablePos', t: 'sel', g: 'tbl', l: 'Table position', d: 'TopRight', o: [['TopLeft', 'Top left'], ['TopRight', 'Top right'], ['BottomLeft', 'Bottom left'], ['BottomRight', 'Bottom right']], show: function (s) { return s.table; }, tip: 'Corner of the chart panel.' },
    { id: 'tblBias', t: 'chk', g: 'tbl', l: 'Row: current bias', d: true, show: function (s) { return s.table; }, tip: 'Bullish, bearish or neutral, from the confirmation direction.' },
    { id: 'tblLast', t: 'chk', g: 'tbl', l: 'Row: last signal', d: true, show: function (s) { return s.table; }, tip: 'Direction of the last signal and how many bars ago it was.' },
    { id: 'tblValues', t: 'chk', g: 'tbl', l: 'Row: indicator values', d: true, show: function (s) { return s.table; }, tip: 'Current values of the averages, oscillator, bands or other signal indicator.' },
    { id: 'tblFilters', t: 'chk', g: 'tbl', l: 'Row: filter status', d: true, show: function (s) { return s.table; }, tip: 'Whether the filters currently allow long and short signals.' },
    { id: 'tblStats', t: 'chk', g: 'tbl', l: 'Rows: position, session P&L, entries, status', d: true, k: 's', show: function (s) { return s.table; }, tip: 'Live strategy state, including whether a risk limit has stopped it for the session.' },
    { id: 'tableText', t: 'sel', g: 'tbl', l: 'Text color', d: 'White', o: COLORS, show: function (s) { return s.table; }, tip: 'Color of the table text.' },
    { id: 'tableBg', t: 'sel', g: 'tbl', l: 'Background color', d: 'Black', o: COLORS, show: function (s) { return s.table; }, tip: 'Color of the table background.' },
    { id: 'tableOpacity', t: 'num', g: 'tbl', l: 'Background opacity (%)', d: 70, min: 0, max: 100, show: function (s) { return s.table; }, tip: '0 = no background; 100 = solid.' },

    { id: 'alerts', t: 'chk', g: 'alr', l: 'Alerts', d: false, tip: 'Real-time alerts in NinjaTrader\'s Alerts Log, with sound. Never fire on historical bars.' },
    { id: 'alertSide', t: 'sel', g: 'alr', l: 'Alert on', d: 'both', o: [['both', 'Buy and sell'], ['buy', 'Buy only'], ['sell', 'Sell only']], show: function (s) { return s.alerts; }, tip: 'Indicators: which signals alert. Strategies: which entries alert (risk-limit stops always alert).' },
    { id: 'alertMode', t: 'sel', g: 'alr', l: 'Alert type', d: 'log', o: [['log', 'Alerts window + sound'], ['sound', 'Sound only']], show: function (s) { return s.alerts; }, tip: 'Alerts window: a line in NinjaTrader\'s Alerts Log with the sound, priority and re-arm time. Sound only: just plays the sound.' },
    { id: 'alertSound', t: 'sel', g: 'alr', l: 'Buy sound', d: 'Alert2.wav', o: SOUNDS, show: function (s) { return s.alerts; }, tip: 'Sound for buy signals (long entries). From NinjaTrader\'s own sounds folder; any .wav name can be typed later in the properties.' },
    { id: 'alertSoundSell', t: 'sel', g: 'alr', l: 'Sell sound', d: 'Alert4.wav', o: SOUNDS, show: function (s) { return s.alerts; }, tip: 'A different sound for sell signals (short entries) lets you hear the direction without looking.' },
    { id: 'alertBuyText', t: 'text', g: 'alr', l: 'Buy alert text', d: 'BUY signal', k: 'i', show: function (s) { return s.alerts; }, tip: 'Words used in buy alerts (up to 40 characters).' },
    { id: 'alertSellText', t: 'text', g: 'alr', l: 'Sell alert text', d: 'SELL signal', k: 'i', show: function (s) { return s.alerts; }, tip: 'Words used in sell alerts (up to 40 characters).' },
    { id: 'alertMax', t: 'num', g: 'alr', l: 'Max alerts per session (0 = no limit)', d: 0, min: 0, max: 1000, show: function (s) { return s.alerts; }, tip: 'Stops alerting after this many in one session. Risk-limit alerts from strategies are always sent.' },
    { id: 'alertPriority', t: 'sel', g: 'alr', l: 'Priority', d: 'Medium', o: ['Low', 'Medium', 'High'], show: function (s) { return s.alerts; }, tip: 'Priority shown in the Alerts Log.' },
    { id: 'alertRearm', t: 'num', g: 'alr', l: 'Re-arm (seconds)', d: 60, min: 0, max: 86400, show: function (s) { return s.alerts; }, tip: 'Minimum seconds before the same alert can fire again.' },
    { id: 'alertMsg', t: 'text', g: 'alr', l: 'Message prefix', d: '', show: function (s) { return s.alerts; }, tip: 'Optional text added in front of every alert message, for example your setup name.' },
    { id: 'logSignals', t: 'chk', g: 'alr', l: 'Log to the Output window', d: false, tip: 'Prints every signal (or order and risk event) with time, instrument and price to NinjaScript Output.' },

    { id: 'entryType', t: 'sel', g: 'ord', l: 'Entry order', d: 'market', k: 's', o: [['market', 'Market on the next bar'], ['limit', 'Limit, better than the close'], ['stop', 'Stop-market beyond the signal bar']], tip: 'Market fills for sure. Limit waits for a better price and may miss. Stop enters only if price continues past the signal bar. Limit and stop orders expire after one bar.' },
    { id: 'entryOffset', t: 'num', g: 'ord', l: 'Entry offset (ticks)', d: 1, min: 0, max: 1000, k: 's', show: function (s) { return s.entryType !== 'market'; }, tip: 'Limit: ticks better than the close. Stop: ticks beyond the signal bar\'s high (long) or low (short).' },
    { id: 'qtyMode', t: 'sel', g: 'ord', l: 'Position size', d: 'fixed', k: 's', o: [['fixed', 'Fixed contracts'], ['risk', 'Risk-based (fixed $ risk per trade)']], tip: 'Risk-based sizing buys fewer contracts when the stop is wide, so every trade risks about the same dollars.' },
    { id: 'qty', t: 'num', g: 'ord', l: 'Contracts', d: 1, min: 1, max: 1000, k: 's', show: function (s) { return s.qtyMode === 'fixed'; }, tip: 'Contracts per entry.' },
    { id: 'riskUsd', t: 'num', g: 'ord', l: 'Risk per trade ($)', d: 200, min: 1, max: 1000000, k: 's', show: function (s) { return s.qtyMode === 'risk'; }, tip: 'Contracts = risk / (stop distance x tick value), rounded down. If even one contract risks more, the trade is skipped.' },
    { id: 'maxQty', t: 'num', g: 'ord', l: 'Maximum contracts', d: 5, min: 1, max: 1000, k: 's', show: function (s) { return s.qtyMode === 'risk'; }, tip: 'Upper limit for risk-based sizing.' },
    { id: 'exitOpp', t: 'chk', g: 'ord', l: 'Exit on an opposite signal', d: true, k: 's', tip: 'A sell signal closes a long, a buy signal closes a short (filters do not block exits).' },
    { id: 'reverse', t: 'chk', g: 'ord', l: 'Reverse on an opposite signal', d: false, k: 's', tip: 'Instead of only exiting, enter the other way when the opposite signal also passes the filters.' },

    { id: 'stopMode', t: 'sel', g: 'exit', l: 'Stop loss', d: 'ticks', k: 's', o: [['ticks', 'Fixed ticks'], ['atr', 'ATR multiple'], ['percent', 'Percent of price'], ['swing', 'Beyond the recent swing'], ['none', 'No stop (not recommended)']], tip: 'Protective stop placed with every entry. ATR stops widen in fast markets; swing stops sit beyond the recent low (long) or high (short).' },
    { id: 'stopTicks', t: 'num', g: 'exit', l: 'Stop (ticks)', d: 16, min: 1, max: 100000, k: 's', show: function (s) { return s.stopMode === 'ticks'; }, tip: 'Distance from the entry price in ticks.' },
    { id: 'stopAtr', t: 'num', g: 'exit', l: 'Stop (x ATR)', d: 1.5, min: 0.1, max: 50, step: 0.1, k: 's', show: function (s) { return s.stopMode === 'atr'; }, tip: 'Stop distance as a multiple of ATR at the signal bar.' },
    { id: 'stopPct', t: 'num', g: 'exit', l: 'Stop (% of price)', d: 0.5, min: 0.01, max: 50, step: 0.01, k: 's', show: function (s) { return s.stopMode === 'percent'; }, tip: 'Stop distance as a percentage of the signal bar\'s close.' },
    { id: 'swingLen', t: 'num', g: 'exit', l: 'Swing look-back (bars)', d: 10, min: 2, max: 500, k: 's', show: function (s) { return s.stopMode === 'swing'; }, tip: 'The stop goes beyond the lowest low (long) or highest high (short) of these bars.' },
    { id: 'swingPad', t: 'num', g: 'exit', l: 'Swing padding (ticks)', d: 2, min: 0, max: 1000, k: 's', show: function (s) { return s.stopMode === 'swing'; }, tip: 'Extra ticks beyond the swing point.' },
    { id: 'tgtMode', t: 'sel', g: 'exit', l: 'Profit target', d: 'r', k: 's', o: [['r', 'R multiple of the stop'], ['ticks', 'Fixed ticks'], ['atr', 'ATR multiple'], ['none', 'No target']], tip: 'R multiple: a 2R target is twice the stop distance, which keeps reward-to-risk constant.' },
    { id: 'tgtR', t: 'num', g: 'exit', l: 'Target (R)', d: 2, min: 0.1, max: 50, step: 0.1, k: 's', show: function (s) { return s.tgtMode === 'r'; }, tip: 'Target distance = stop distance x R.' },
    { id: 'tgtTicks', t: 'num', g: 'exit', l: 'Target (ticks)', d: 32, min: 1, max: 100000, k: 's', show: function (s) { return s.tgtMode === 'ticks'; }, tip: 'Distance from the entry price in ticks.' },
    { id: 'tgtAtr', t: 'num', g: 'exit', l: 'Target (x ATR)', d: 3, min: 0.1, max: 100, step: 0.1, k: 's', show: function (s) { return s.tgtMode === 'atr'; }, tip: 'Target distance as a multiple of ATR at the signal bar.' },
    { id: 'exitAtrLen', t: 'num', g: 'exit', l: 'ATR period (exits)', d: 14, min: 2, max: 200, k: 's', show: anyAtr, tip: 'Look-back of the ATR used by ATR stops, targets and trailing.' },
    { id: 'beOn', t: 'chk', g: 'exit', l: 'Move stop to break-even', d: false, k: 's', show: function (s) { return s.stopMode !== 'none'; }, tip: 'Once the trade is this many ticks in profit, the stop moves to entry plus the offset.' },
    { id: 'beTrigger', t: 'num', g: 'exit', l: 'Break-even trigger (ticks)', d: 12, min: 1, max: 100000, k: 's', show: function (s) { return s.beOn && s.stopMode !== 'none'; }, tip: 'Profit in ticks that triggers the move.' },
    { id: 'beOffset', t: 'num', g: 'exit', l: 'Break-even offset (ticks)', d: 1, min: 0, max: 1000, k: 's', show: function (s) { return s.beOn && s.stopMode !== 'none'; }, tip: 'Ticks beyond entry to lock in (covers commissions).' },
    { id: 'trailMode', t: 'sel', g: 'exit', l: 'Trailing stop', d: 'none', k: 's', o: [['none', 'Off'], ['ticks', 'Trail by ticks'], ['atr', 'Trail by ATR multiple']], show: function (s) { return s.stopMode !== 'none'; }, tip: 'Follows the best price since entry, checked at each bar close. It only ever tightens the stop.' },
    { id: 'trailTicks', t: 'num', g: 'exit', l: 'Trail distance (ticks)', d: 12, min: 1, max: 100000, k: 's', show: function (s) { return s.trailMode === 'ticks' && s.stopMode !== 'none'; }, tip: 'Distance behind the best price.' },
    { id: 'trailAtr', t: 'num', g: 'exit', l: 'Trail distance (x ATR)', d: 2, min: 0.1, max: 50, step: 0.1, k: 's', show: function (s) { return s.trailMode === 'atr' && s.stopMode !== 'none'; }, tip: 'Distance behind the best price as a multiple of the current ATR.' },
    { id: 'timeStop', t: 'num', g: 'exit', l: 'Time stop (bars, 0 = off)', d: 0, min: 0, max: 100000, k: 's', tip: 'Exit if the trade is still open after this many bars.' },

    { id: 'maxTrades', t: 'num', g: 'risk', l: 'Max entries per day (0 = no limit)', d: 5, min: 0, max: 1000, k: 's', tip: 'Stops new entries for the session once this many have been sent.' },
    { id: 'dailyLoss', t: 'num', g: 'risk', l: 'Daily loss limit ($, 0 = off)', d: 500, min: 0, max: 10000000, k: 's', tip: 'Closed + open P&L for the session. When reached: flatten and no new entries until the next session. Checked at bar close.' },
    { id: 'dailyProfit', t: 'num', g: 'risk', l: 'Daily profit target ($, 0 = off)', d: 0, min: 0, max: 10000000, k: 's', tip: 'When reached: flatten and stop for the session.' },
    { id: 'maxConsec', t: 'num', g: 'risk', l: 'Max losing trades in a row (0 = off)', d: 3, min: 0, max: 1000, k: 's', tip: 'Stops for the session after this many consecutive losing trades.' },
    { id: 'flatOn', t: 'chk', g: 'risk', l: 'Flatten at a set time', d: true, k: 's', tip: 'Closes any position and blocks new entries from this time until the next session.' },
    { id: 'flatTime', t: 'time', g: 'risk', l: 'Flatten time', d: '15:50', k: 's', show: function (s) { return s.flatOn; }, tip: 'HH:MM in the chart time zone.' },
    { id: 'exitOnClose', t: 'chk', g: 'risk', l: 'Exit at session close', d: true, k: 's', tip: 'NinjaTrader closes the position 30 seconds before the session ends.' },
    { id: 'accounts', t: 'sel', g: 'risk', l: 'Accounts', d: 'sim', k: 's', o: [['sim', 'Simulation and Playback only (recommended)'], ['any', 'Any account, including live']], tip: 'With "Simulation and Playback only" the strategy refuses to place orders on any other account. Test thoroughly before allowing live accounts.' },
    { id: 'barsReq', t: 'num', g: 'risk', l: 'Bars required to trade', d: 20, min: 0, max: 100000, k: 's', tip: 'No orders before this many bars have loaded (indicator warm-up is added automatically).' },
    { id: 'trace', t: 'chk', g: 'risk', l: 'Trace orders', d: false, k: 's', tip: 'NinjaTrader prints detailed order handling to the Output window. Useful while testing.' }
  ];
  var BY = {}; FIELDS.forEach(function (f) { BY[f.id] = f; });

  // ---------------------------------------------------------------- helpers
  function cls(name, kind) {
    var s = String(name || '').replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean)
      .map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join('');
    if (!s) s = kind === 's' ? 'MyStrategy' : 'MyIndicator';
    if (/^[0-9]/.test(s)) s = 'B4' + s;
    s = s.slice(0, 48);
    if (RESERVED.test(s)) s += 'Studio';
    return s;
  }
  function titleCase(s) { return String(s).replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); }); }
  function clamp(v, d, min, max) { v = Number(v); if (!isFinite(v)) v = d; return Math.min(max, Math.max(min, v)); }
  function dbl(v) { var s = String(Number(v)); return /[.eE]/.test(s) ? s : s + '.0'; }
  function esc(s) { return String(s).replace(/\\/g, '').replace(/"/g, '\'').replace(/[\r\n]+/g, ' '); }
  function hhmm(v, d) { var m = String(v || '').match(/^(\d{1,2}):(\d{2})$/); if (!m || +m[1] > 23 || +m[2] > 59) return d; return (m[1].length < 2 ? '0' : '') + m[1] + ':' + m[2]; }
  function maX(type, src, len) {
    if (type === 'KAMA') return 'KAMA(' + src + ', 2, ' + len + ', 30)';
    if (type === 'T3') return 'T3(' + src + ', ' + len + ', 3, 0.7)';
    return type + '(' + src + ', ' + len + ')';
  }
  function maxExpr(a) { return a.reduce(function (acc, x) { return acc ? 'Math.Max(' + acc + ', ' + x + ')' : x; }, ''); }

  function defaults(kind) {
    var o = { kind: kind === 's' ? 's' : 'i' };
    FIELDS.forEach(function (f) { o[f.id] = f.d; });
    o.name = o.kind === 's' ? 'My B4 Strategy' : 'My B4 Indicator';
    return o;
  }

  function normalize(sp) {
    sp = sp || {};
    var kind = sp.kind === 's' ? 's' : 'i', d = defaults(kind), o = { kind: kind };
    FIELDS.forEach(function (f) {
      var v = sp[f.id];
      if (v === undefined || v === null || v === '') v = d[f.id];
      if (f.t === 'sel') { var ok = opts(f.o).some(function (x) { return String(x[0]) === String(v); }); o[f.id] = ok ? String(v) : f.d; }
      else if (f.t === 'num') o[f.id] = clamp(v, f.d, f.min, f.max);
      else if (f.t === 'chk') o[f.id] = v === true || v === 'true' || v === 1 || v === 'on';
      else if (f.t === 'time') o[f.id] = hhmm(v, f.d);
      else o[f.id] = String(v).replace(/[<>"`\\{}\r\n\t]/g, '').replace(/\s+/g, ' ').slice(0, TEXT_MAX[f.id] || 80).trim();   // text fields: no markup, quotes, braces or control characters
      if (f.t === 'text' && !o[f.id] && f.d) o[f.id] = f.d;
    });
    if (!String(o.name).trim()) o.name = d.name;
    ['fast', 'slow', 'maLen', 'oscLen', 'macdFast', 'macdSlow', 'macdSmooth', 'bandLen', 'nbarLen', 'dmiLen', 'trendStrength', 'fTrendLen', 'fHtfLen', 'fAdxLen',
      'fVolLen', 'fAtrLen', 'cooldown', 'markerOffset', 'shadeOpacity', 'plotWidth', 'alertRearm', 'entryOffset', 'qty', 'maxQty', 'stopTicks', 'swingLen',
      'swingPad', 'tgtTicks', 'exitAtrLen', 'beTrigger', 'beOffset', 'trailTicks', 'timeStop', 'maxTrades', 'maxConsec', 'barsReq', 'fAtrMin', 'fAtrMax',
      'fontSize', 'labelBoxOpacity', 'tableOpacity', 'alertMax', 'ofCvdLen', 'ofStack', 'ofVaPct', 'l2Levels', 'l2Range', 'fpBars']
      .forEach(function (k) { o[k] = Math.round(o[k]); });
    if (o.slow <= o.fast) o.slow = o.fast + 1;
    if (o.macdSlow <= o.macdFast) o.macdSlow = o.macdFast + 1;
    var lv = OSC[o.osc];
    if (o.lower >= o.upper) { o.upper = lv.up; o.lower = lv.lo; }
    if (o.sarMax < o.sarAcc) o.sarMax = o.sarAcc;
    if (PALETTES[o.palette]) { o.buyColor = PALETTES[o.palette][0]; o.sellColor = PALETTES[o.palette][1]; }   // a preset decides both colors; 'custom' keeps the user's
    if (o.entryType === 'stop' && o.entryOffset < 1) o.entryOffset = 1;
    // exits that need a stop distance
    if (o.stopMode === 'none') { o.beOn = false; o.trailMode = 'none'; if (o.tgtMode === 'r') o.tgtMode = 'ticks'; if (o.qtyMode === 'risk') o.qtyMode = 'fixed'; }
    o.className = cls(o.name, kind);
    o.overlay = !(o.sig === 'osc' || o.sig === 'macd' || o.sig === 'dmi' || o.sig === 'of_delta' || o.sig === 'of_cvd' || o.sig === 'l2_book');
    if (/^(of|l2)_/.test(o.sig)) o.calc = 'bar';   // order flow and depth are evaluated at bar close
    return o;
  }

  function visible(f, s) { return (!f.k || f.k === s.kind) && (!f.show || f.show(s)); }

  // ---------------------------------------------------------------- plain-language reading (keywords, NOT AI)
  function suggest(text, kind) {
    var t = String(text || '').toLowerCase(), sp = defaults(kind);
    if (/\bstrateg|\bauto.?trad|\benter (a |the )?(long|short|trade)|\bstop.?loss|\bprofit target|\bcontracts?\b|\btake profit/.test(t)) sp.kind = 's';
    sp.name = sp.kind === 's' ? 'My B4 Strategy' : 'My B4 Indicator';
    var depthWords = /\bdom\b|depth of market|market depth|order book|level ?2|\bl2\b/.test(t);
    // a named order-flow signal wins; "footprint" alone means the footprint display with a stacked-imbalance signal
    var flowSig = depthWords && /liquidity wall|\bwalls?\b|iceberg/.test(t) ? 'l2_wall' : depthWords ? 'l2_book'
      : /value area|\bvah\b|\bval\b/.test(t) ? 'of_va' : /\bpoc\b|point of control/.test(t) ? 'of_poc' : /cumulative delta|\bcvd\b/.test(t) ? 'of_cvd'
      : /\bvwap\b/.test(t) ? 'of_vwap' : /big (trade|print)|large (trade|print)|block trade/.test(t) ? 'of_big' : /imbalance/.test(t) ? 'of_imb' : /\bdelta\b/.test(t) ? 'of_delta'
      : /footprint/.test(t) ? 'of_imb' : /volume profile/.test(t) ? 'of_poc' : '';
    if (/footprint/.test(t)) sp.fpShow = true;
    if (/reversal|fade|back inside|failed break/.test(t) && flowSig === 'of_va') sp.ofVaMode = 'reversal';
    if (/\bflip|turns? (positive|negative)|changes sign/.test(t) && flowSig === 'of_delta') sp.ofDeltaMode = 'flip';
    if (flowSig) sp.sig = flowSig;
    else if (/macd/.test(t)) sp.sig = 'macd';
    else if (/parabolic|\bsar\b/.test(t)) sp.sig = 'psar';
    else if (/\bdmi\b|\bdi\+|directional/.test(t)) sp.sig = 'dmi';
    else if (/engulf|harami|hammer|shooting star|morning star|evening star|doji|soldiers|crows|piercing|dark cloud|belt hold|three methods|candle(stick)? pattern/.test(t)) sp.sig = 'candle';
    else if (/bollinger|keltner|donchian|channel|\bbands?\b/.test(t)) sp.sig = 'band';
    else if (/\b\d+.?bar (high|low|breakout)|highest high|lowest low|range breakout|n.?bar/.test(t)) sp.sig = 'nbar';
    else if (/rsi|cci|stoch|williams|\bmfi\b|money flow|\bcmo\b|ultimate|\broc\b|rate of change|momentum|oversold|overbought|oscillator/.test(t)) sp.sig = 'osc';
    else if (/(price|close) (crosses|closes above|closes below|moves above|moves below|above|below)/.test(t)
      || (/crosses (above |below )?(the )?\d+ ?(ema|sma|wma|hma)/.test(t) && !/\d+ ?(ema|sma|wma|hma|average)s? cross/.test(t))) sp.sig = 'price_ma';
    else if (/slope|turns? (up|down)|direction change/.test(t)) sp.sig = 'ma_slope';
    else sp.sig = 'ma_cross';
    [['hull', 'HMA'], ['\\bhma\\b', 'HMA'], ['\\btema\\b', 'TEMA'], ['\\bdema\\b', 'DEMA'], ['\\btma\\b|triangular', 'TMA'], ['zlema|zero.?lag', 'ZLEMA'], ['vwma|volume.?weighted', 'VWMA'],
      ['kama|kaufman|adaptive', 'KAMA'], ['\\bt3\\b|tillson', 'T3'], ['linreg|linear regression', 'LinReg'], ['\\bwma\\b|weighted', 'WMA'], ['\\bsma\\b|simple', 'SMA'], ['\\bema\\b|exponential', 'EMA']]
      .some(function (p) { if (new RegExp(p[0]).test(t)) { sp.maType = p[1]; return true; } return false; });
    if (/\bcci\b/.test(t)) sp.osc = 'CCI'; else if (/stoch(astic)?.?rsi/.test(t)) sp.osc = 'StochRSI'; else if (/stoch/.test(t)) sp.osc = 'Stochastics';
    else if (/williams/.test(t)) sp.osc = 'WilliamsR'; else if (/\bmfi\b|money flow/.test(t)) sp.osc = 'MFI'; else if (/\bcmo\b|chande/.test(t)) sp.osc = 'CMO';
    else if (/ultimate/.test(t)) sp.osc = 'UltimateOscillator'; else if (/\broc\b|rate of change/.test(t)) sp.osc = 'ROC'; else if (/momentum/.test(t) && !/rsi/.test(t)) sp.osc = 'Momentum';
    sp.upper = OSC[sp.osc].up; sp.lower = OSC[sp.osc].lo;
    if (/midline|middle line|crosses 50/.test(t)) sp.oscMode = 'mid'; else if (/(enters|into) (the )?(overbought|oversold|zone)|momentum/.test(t) && sp.sig === 'osc') sp.oscMode = 'enter';
    if (/zero.?line|crosses zero|above zero/.test(t)) sp.macdMode = 'zero';
    if (/keltner/.test(t)) sp.band = 'Keltner'; else if (/donchian/.test(t)) sp.band = 'Donchian'; else sp.band = 'Bollinger';
    if (/revers|fade|mean.?revert|bounce|back inside/.test(t)) sp.bandMode = 'reversal';
    Object.keys(CANDLES).some(function (k) { var re = { engulfing: /engulf/, harami: /harami(?! cross)/, haramiCross: /harami cross/, beltHold: /belt hold/, star: /morning star|evening star/,
      soldiers: /soldiers|crows/, hammer: /hammer|shooting star/, piercing: /piercing|dark cloud/, methods: /three methods/ }[k]; if (re.test(t)) { sp.candle = k; return true; } return false; });
    if (/long only|only long|longs only|buy only/.test(t)) sp.side = 'long'; else if (/short only|only short|shorts only|sell only/.test(t)) sp.side = 'short';

    // numbers: strip the ones that belong to a named setting first
    var used = [];
    function grab(re, key, fn) { var m = t.match(re); if (m) { sp[key] = fn ? fn(m[1]) : Number(m[1]); used.push(m[0]); } }
    grab(/oversold\D{0,10}?(-?\d+(?:\.\d+)?)/, 'lower'); grab(/overbought\D{0,10}?(-?\d+(?:\.\d+)?)/, 'upper');
    var STOP_T = /(\d+)\s*(?:tick|tk)s?\s*stop|stop(?:\s*loss)?(?:\s*(?:of|at|=|:))?\s*(\d+)\s*(?:tick|tk)s?/;
    var stm = t.match(STOP_T); if (stm) { sp.stopMode = 'ticks'; sp.stopTicks = Number(stm[1] || stm[2]); used.push(stm[0]); }
    var ma = t.match(/(\d+(?:\.\d+)?)\s*(?:x\s*)?atr\s*stop|stop(?:\s*loss)?(?:\s*(?:of|at|=|:))?\s*(\d+(?:\.\d+)?)\s*(?:x\s*)?atr/); if (ma) { sp.stopMode = 'atr'; sp.stopAtr = Number(ma[1] || ma[2]); used.push(ma[0]); }
    if (/swing (low|high|stop)|stop (below|above) the swing/.test(t)) sp.stopMode = 'swing';
    var tr = t.match(/(\d+(?:\.\d+)?)\s*r\b(?:\s*target)?|target\D{0,8}?(\d+(?:\.\d+)?)\s*r\b/); if (tr) { sp.tgtMode = 'r'; sp.tgtR = Number(tr[1] || tr[2]); used.push(tr[0]); }
    var tt = t.match(/(\d+)\s*ticks?\s*(?:profit\s*)?target|target(?:\s*(?:of|at|=|:))?\s*(\d+)\s*ticks?/); if (tt) { sp.tgtMode = 'ticks'; sp.tgtTicks = Number(tt[1] || tt[2]); used.push(tt[0]); }
    grab(/(\d+)\s*contracts?/, 'qty');
    var rk = t.match(/risk\D{0,6}?\$?\s*(\d+)/); if (rk) { sp.qtyMode = 'risk'; sp.riskUsd = Number(rk[1]); used.push(rk[0]); }
    var dl = t.match(/(?:daily|day) loss\D{0,10}?\$?\s*(\d+)|max(?:imum)? loss\D{0,10}?\$?\s*(\d+)/); if (dl) { sp.dailyLoss = Number(dl[1] || dl[2]); used.push(dl[0]); }
    if (/trail/.test(t)) { sp.trailMode = /atr/.test(t.slice(t.indexOf('trail'), t.indexOf('trail') + 30)) ? 'atr' : 'ticks'; var tk = t.match(/trail\D{0,12}?(\d+)\s*ticks?/); if (tk) { sp.trailTicks = Number(tk[1]); used.push(tk[0]); } }
    if (/break.?even/.test(t)) sp.beOn = true;
    if (/reverse|always in|stop and reverse/.test(t)) sp.reverse = true;
    var adx = t.match(/adx\D{0,10}?(?:above|over|>|at least)?\D{0,4}?(\d+)/); if (adx) { sp.fAdx = true; sp.fAdxMin = Number(adx[1]); used.push(adx[0]); }
    var trd = t.match(/(?:above|below|with) (?:the )?(\d+)\s*(ema|sma|wma|hma)?\s*(?:trend|filter)|trend filter\D{0,10}?(\d+)/);
    if (trd) { sp.fTrend = true; sp.fTrendLen = Number(trd[1] || trd[3]); if (trd[2]) sp.fTrendMa = trd[2].toUpperCase(); used.push(trd[0]); }
    var htf = t.match(/(\d+)\s*(?:min(?:ute)?s?|m)\s*(?:chart )?trend|(?:higher time ?frame|htf)\D{0,12}?(\d+)/); if (htf) { var hv = String(htf[1] || htf[2]); sp.fHtf = true; if (['5', '15', '30', '60', '240'].indexOf(hv) >= 0) sp.fHtfTf = hv; used.push(htf[0]); }
    if (/daily trend|daily chart trend/.test(t)) { sp.fHtf = true; sp.fHtfTf = 'D'; }
    if (/volume (spike|filter|above average|confirm)/.test(t)) sp.fVol = true;
    var win = t.match(/(?:between|from)\s*(\d{1,2}:\d{2})\s*(?:and|to|-)\s*(\d{1,2}:\d{2})/); if (win) { sp.fSess = true; sp.sessStart = win[1]; sp.sessEnd = win[2]; used.push(win[0]); }
    var ft = t.match(/flat(?:ten)?\D{0,8}?(\d{1,2}:\d{2})/); if (ft) { sp.flatOn = true; sp.flatTime = ft[1]; used.push(ft[0]); }
    var cd = t.match(/cool.?down\D{0,6}?(\d+)/); if (cd) { sp.cooldown = Number(cd[1]); used.push(cd[0]); }
    var rest = t; used.forEach(function (u) { rest = rest.replace(u, ' '); });
    var nums = (rest.match(/\b\d+(?:\.\d+)?\b/g) || []).map(Number).filter(function (n) { return n >= 1 && n < 500; });
    if (sp.sig === 'ma_cross' && nums.length >= 2) { sp.fast = Math.min(nums[0], nums[1]); sp.slow = Math.max(nums[0], nums[1]); }
    else if (nums.length >= 1) {
      var n0 = Math.round(nums[0]);
      ({ price_ma: 'maLen', ma_slope: 'maLen', osc: 'oscLen', band: 'bandLen', nbar: 'nbarLen', dmi: 'dmiLen' })[sp.sig] && (sp[({ price_ma: 'maLen', ma_slope: 'maLen', osc: 'oscLen', band: 'bandLen', nbar: 'nbarLen', dmi: 'dmiLen' })[sp.sig]] = n0);
      if (sp.sig === 'macd' && nums.length >= 3) { sp.macdFast = nums[0]; sp.macdSlow = nums[1]; sp.macdSmooth = nums[2]; }
    }
    sp.alerts = /alert|sound|notify|ding/.test(t);
    if (/colou?r (the )?(bars|candles)|paint/.test(t)) sp.colorBars = true;
    if (/shade|highlight (the )?background/.test(t)) sp.shade = true;
    if (/label|text/.test(t)) sp.labels = true;
    if (/triangle/.test(t)) sp.marker = 'triangle'; else if (/\bdots?\b/.test(t)) sp.marker = 'dot'; else if (/diamond/.test(t)) sp.marker = 'diamond';
    if (/each tick|every tick|intrabar|intra-bar/.test(t) && sp.kind === 'i') sp.calc = 'tick';
    if (/live account|real account/.test(t)) sp.accounts = 'sim';   // never switched on from text; owner chooses it explicitly
    var m = t.match(/(?:called|named)\s+["']?([a-z0-9]+(?:\s+[a-z0-9]+){0,3})/);
    if (m) sp.name = titleCase(m[1].split(/\s+(?:when|with|that|which|and|to|for|on|using|if|where)\b/)[0]);
    return sp;
  }

  // ---------------------------------------------------------------- human-readable specification and review
  function sigText(s) {
    var M = function (len) { return s.maType + '(' + len + ')'; };
    switch (s.sig) {
      case 'ma_cross': return [M(s.fast) + ' crosses above ' + M(s.slow), M(s.fast) + ' crosses below ' + M(s.slow), '1 while the fast average is above the slow one, -1 while below'];
      case 'price_ma': return ['Close crosses above ' + M(s.maLen), 'Close crosses below ' + M(s.maLen), '1 while the close is above the average, -1 while below'];
      case 'ma_slope': return [M(s.maLen) + ' turns up', M(s.maLen) + ' turns down', '1 while the average is rising, -1 while falling'];
      case 'osc':
        var o = OSC[s.osc].l + '(' + s.oscLen + ')', mid = (s.upper + s.lower) / 2;
        if (s.oscMode === 'exit') return [o + ' crosses back above ' + s.lower, o + ' crosses back below ' + s.upper, '1 above the midpoint ' + mid + ', -1 below'];
        if (s.oscMode === 'enter') return [o + ' crosses above ' + s.upper, o + ' crosses below ' + s.lower, '1 above the midpoint ' + mid + ', -1 below'];
        return [o + ' crosses above ' + mid, o + ' crosses below ' + mid, '1 above ' + mid + ', -1 below'];
      case 'macd':
        var mc = 'MACD(' + s.macdFast + ', ' + s.macdSlow + ', ' + s.macdSmooth + ')';
        return s.macdMode === 'signal' ? [mc + ' crosses above its signal line', mc + ' crosses below its signal line', '1 while MACD is above its signal line, -1 below']
          : [mc + ' crosses above zero', mc + ' crosses below zero', '1 while MACD is above zero, -1 below'];
      case 'band':
        var b = s.band === 'Bollinger' ? 'Bollinger(' + s.bandLen + ', ' + s.width + ' std dev)' : s.band === 'Keltner' ? 'Keltner(' + s.bandLen + ', x' + s.width + ')' : 'Donchian(' + s.bandLen + ', previous bar)';
        return s.bandMode === 'breakout' ? ['Close breaks above the upper ' + b + ' band', 'Close breaks below the lower ' + b + ' band', '1 while the close is above the middle, -1 below']
          : ['Close moves back above the lower ' + b + ' band', 'Close moves back below the upper ' + b + ' band', '1 while the close is above the middle, -1 below'];
      case 'nbar': return ['Close breaks above the highest high of the previous ' + s.nbarLen + ' bars', 'Close breaks below the lowest low of the previous ' + s.nbarLen + ' bars', '1 above the middle of that range, -1 below'];
      case 'dmi': return ['DI+ crosses above DI- (' + s.dmiLen + ')', 'DI- crosses above DI+ (' + s.dmiLen + ')', '1 while DI+ leads, -1 while DI- leads'];
      case 'psar': return ['Close crosses above Parabolic SAR(' + s.sarAcc + ', ' + s.sarMax + ', ' + s.sarStep + ')', 'Close crosses below the SAR', '1 while the close is above the SAR, -1 below'];
      case 'of_delta': return s.ofDeltaMode === 'threshold' ? ['Bar delta (buy - sell volume) of +' + s.ofDelta + ' or more on an up bar', 'Bar delta of -' + s.ofDelta + ' or less on a down bar', '1 while bar delta is positive, -1 while negative']
        : ['Bar delta turns positive', 'Bar delta turns negative', '1 while bar delta is positive, -1 while negative'];
      case 'of_cvd': return ['Cumulative delta crosses above its ' + s.ofCvdLen + '-bar EMA', 'Cumulative delta crosses below its ' + s.ofCvdLen + '-bar EMA', '1 while CVD is above its average, -1 below'];
      case 'of_imb': return [s.ofStack + '+ stacked buy imbalances (ask at least ' + s.ofRatio + 'x the bid one tick lower, min ' + s.ofMinVol + ')', s.ofStack + '+ stacked sell imbalances (bid at least ' + s.ofRatio + 'x the ask one tick higher)', '1 when bar delta is positive, -1 when negative'];
      case 'of_poc': return ['Close crosses above the developing session POC', 'Close crosses below the developing session POC', '1 above the POC, -1 below'];
      case 'of_va': return s.ofVaMode === 'breakout' ? ['Close breaks above the developing value-area high (' + s.ofVaPct + '%)', 'Close breaks below the developing value-area low', '1 above the POC, -1 below']
        : ['Close comes back above the value-area low (' + s.ofVaPct + '%)', 'Close comes back below the value-area high', '1 above the POC, -1 below'];
      case 'of_vwap': return ['Close crosses above the session VWAP (from every trade)', 'Close crosses below the session VWAP', '1 above VWAP, -1 below'];
      case 'of_big': return ['A single buy trade of ' + s.ofBig + '+ contracts in the bar', 'A single sell trade of ' + s.ofBig + '+ contracts in the bar', '1 when bar delta is positive, -1 when negative'];
      case 'l2_book': return ['Resting bids in the top ' + s.l2Levels + ' levels reach ' + s.l2Ratio + 'x the asks (real time only)', 'Resting asks reach ' + s.l2Ratio + 'x the bids (real time only)', '1 bid-heavy book, -1 ask-heavy'];
      case 'l2_wall': return ['Close breaks above an ask wall of ' + s.l2Wall + '+ contracts within ' + s.l2Range + ' ticks (real time only)', 'Close breaks below a bid wall of ' + s.l2Wall + '+ contracts', '1 when the bid wall is larger, -1 when the ask wall is'];
      default: var c = CANDLES[s.candle]; return [c[1].replace(/([a-z])([A-Z])/g, '$1 $2') + ' (prior trend ' + s.trendStrength + ' bars)', c[2].replace(/([a-z])([A-Z])/g, '$1 $2'), '1 on a bullish pattern bar, -1 on a bearish one'];
    }
  }
  function filterText(s) {
    var f = [];
    if (s.fTrend) f.push('longs above / shorts below ' + s.fTrendMa + '(' + s.fTrendLen + ')');
    if (s.fHtf) f.push('with the ' + (s.fHtfTf === 'D' ? 'daily' : s.fHtfTf + '-minute') + ' trend: close vs ' + s.fHtfMa + '(' + s.fHtfLen + ')');
    if (s.fAdx) f.push('ADX(' + s.fAdxLen + ') at least ' + s.fAdxMin);
    if (s.fVol) f.push('volume at least ' + s.fVolMult + 'x its ' + s.fVolLen + '-bar average');
    if (s.fAtr) f.push('ATR(' + s.fAtrLen + ') of at least ' + s.fAtrMin + ' ticks' + (s.fAtrMax > 0 ? ' and at most ' + s.fAtrMax : ''));
    if (s.fSess) f.push('between ' + s.sessStart + ' and ' + s.sessEnd);
    if (s.cooldown > 0) f.push('at least ' + s.cooldown + ' bars between signals');
    if (s.side !== 'both') f.push(s.side === 'long' ? 'long side only' : 'short side only');
    return f.length ? f.join('; ') : 'none';
  }
  function alertText(s) {
    if (!s.alerts) return 'off';
    var snd = function (f) { return f ? f.replace('.wav', '') : 'no sound'; };
    return (s.alertMode === 'sound' ? 'sound only' : 'Alerts window + sound') + ', ' + s.alertSide + ', sounds ' + snd(s.alertSound) + ' / ' + snd(s.alertSoundSell) +
      (s.alertMode === 'log' ? ', priority ' + s.alertPriority + ', re-arm ' + s.alertRearm + ' s' : '') + (s.alertMax > 0 ? ', max ' + s.alertMax + ' per session' : '');
  }
  function stopText(s) {
    return { ticks: s.stopTicks + ' ticks', atr: s.stopAtr + ' x ATR(' + s.exitAtrLen + ')', percent: s.stopPct + '% of price', swing: 'beyond the ' + s.swingLen + '-bar swing + ' + s.swingPad + ' ticks', none: 'none' }[s.stopMode];
  }
  function specLines(sp) {
    var s = normalize(sp), x = sigText(s), L = [];
    L.push(['Name', s.name + ' (class ' + s.className + ')']);
    L.push(['Kind', (s.kind === 's' ? 'Strategy (managed orders, calculated on bar close)' : 'Indicator, ' + (s.overlay ? 'drawn on the price panel' : 'drawn in its own panel') + (s.calc === 'tick' ? ', calculated on each tick' : ', calculated on bar close'))
      + (/^of_/.test(s.sig) ? '; order flow from a 1-tick data series' : /^l2_/.test(s.sig) ? '; real-time market depth (Level 2)' : '')]);
    L.push([s.kind === 's' ? 'Long setup' : 'Buy signal', x[0]]);
    L.push([s.kind === 's' ? 'Short setup' : 'Sell signal', x[1]]);
    L.push(['Filters', filterText(s)]);
    if (s.kind === 'i') {
      L.push(['Confirmation', x[2]]);
      var lw = s.labelText === 'custom' ? s.buyWord + ' / ' + s.sellWord : { buysell: 'BUY / SELL', longshort: 'LONG / SHORT', arrows: 'up / down arrows' }[s.labelText];
      L.push(['Display', (s.marker === 'none' ? 'no markers' : s.marker + ' markers ' + s.buyColor + ' / ' + s.sellColor) + (s.labels ? ', labels "' + lw + '"' + (s.labelPrice ? ' with price' : '') : '') +
        (s.colorBars ? ', colored bars' : '') + (s.shade ? ', background shading ' + s.shadeOpacity + '%' : '')]);
      if (s.sig !== 'candle') L.push(['Styling', (s.overlay && !s.showPlots ? 'indicator lines hidden' : s.plotStyle.toLowerCase() + (s.plotStyle === 'Line' ? ' (' + s.dash.toLowerCase() + ')' : '') + ', width ' + s.plotWidth + ', ' + s.plotColor1 + (twoLines(s) ? ' / ' + s.plotColor2 : '')) +
        (hasLevels(s) ? '; levels ' + s.levelColor + ' ' + s.levelDash.toLowerCase() : '')]);
      L.push(['Readability', s.fontFamily + ' ' + s.fontSize + ' pt' + (s.labels && s.labelBox ? ', label box ' + s.labelBoxOpacity + '%' : '') + (s.palette !== 'custom' ? ', ' + { standard: 'standard', colorblind: 'color-blind safe', highcontrast: 'high-contrast', mono: 'monochrome' }[s.palette] + ' colors' : '')]);
      L.push(['Alerts', alertText(s)]);
      L.push(['Signals', 'B4 Signal API v1 (pulses on the signal bar); works with B4 CoPilot Dev as a signal, filter or exit tool']);
      L.push(['Orders', 'None. Indicators publish information only.']);
    } else {
      L.push(['Entry', { market: 'market order', limit: 'limit ' + s.entryOffset + ' ticks better than the close (1 bar)', stop: 'stop-market ' + s.entryOffset + ' ticks beyond the signal bar (1 bar)' }[s.entryType] + '; ' +
        (s.qtyMode === 'fixed' ? s.qty + ' contract' + (s.qty > 1 ? 's' : '') : 'risk $' + s.riskUsd + ' per trade, max ' + s.maxQty + ' contracts') + (s.reverse ? '; reverses on an opposite signal' : s.exitOpp ? '; exits on an opposite signal' : '')]);
      L.push(['Stop', stopText(s) + (s.beOn ? '; break-even at +' + s.beTrigger + ' ticks (+' + s.beOffset + ')' : '') + (s.trailMode !== 'none' ? '; trailing ' + (s.trailMode === 'ticks' ? s.trailTicks + ' ticks' : s.trailAtr + ' x ATR') : '')]);
      L.push(['Target', { r: s.tgtR + 'R (' + s.tgtR + ' x the stop distance)', ticks: s.tgtTicks + ' ticks', atr: s.tgtAtr + ' x ATR(' + s.exitAtrLen + ')', none: 'none' }[s.tgtMode] + (s.timeStop > 0 ? '; time stop ' + s.timeStop + ' bars' : '')]);
      L.push(['Risk limits', [s.maxTrades > 0 ? s.maxTrades + ' entries/day' : '', s.dailyLoss > 0 ? 'daily loss $' + s.dailyLoss : '', s.dailyProfit > 0 ? 'daily target $' + s.dailyProfit : '',
        s.maxConsec > 0 ? s.maxConsec + ' losses in a row' : '', s.flatOn ? 'flat at ' + s.flatTime : '', s.exitOnClose ? 'exit at session close' : ''].filter(Boolean).join(', ') || 'none']);
      L.push(['Accounts', s.accounts === 'sim' ? 'Simulation and Playback only (refuses other accounts)' : 'Any account, including live']);
      L.push(['Alerts', s.alerts ? 'entries (' + s.alertSide + ') and risk-limit stops; ' + alertText(s) : 'off']);
    }
    L.push(['Info table', s.table ? s.tablePos.replace(/([a-z])([A-Z])/, '$1 $2').toLowerCase() + ': ' + [s.tblBias ? 'bias' : '', s.tblLast ? 'last signal' : '', s.tblValues ? 'values' : '', s.tblFilters ? 'filters' : '',
      s.kind === 's' && s.tblStats ? 'position, P&L, entries, status' : ''].filter(Boolean).join(', ') + '; ' + s.fontFamily + ' ' + s.fontSize + ' pt, ' + s.tableText + ' on ' + s.tableBg + ' ' + s.tableOpacity + '%' : 'off']);
    return L;
  }
  function review(sp) {
    var s = normalize(sp), R = [];
    function add(level, text) { R.push({ level: level, text: text }); }
    if (s.kind === 's') {
      if (s.stopMode === 'none') add('high', 'No protective stop: one bad trade has no limit. Choose a stop.');
      if (s.dailyLoss <= 0) add('high', 'No daily loss limit.');
      if (s.accounts === 'any') add('high', 'Live accounts are allowed. Test for weeks in simulation first; you are responsible for every order.');
      if (s.tgtMode === 'none' && s.trailMode === 'none' && !s.exitOpp && !s.reverse && s.timeStop === 0) add('warn', 'The only exit is the stop (and the session close). Add a target, trailing stop, opposite-signal exit or time stop.');
      if (s.tgtMode === 'r' && s.tgtR < 1) add('warn', 'Target is smaller than the stop (below 1R): the win rate must be high to break even.');
      if (s.maxConsec === 0 && s.maxTrades === 0) add('warn', 'No limit on entries or losing streaks per day.');
      if (s.entryType !== 'market') add('info', 'Limit and stop entries expire after one bar if not filled; an unfilled entry still counts toward the daily entry limit.');
      if (s.qtyMode === 'risk') add('info', 'Position size depends on the stop distance; wide stops trade fewer contracts or are skipped.');
      if (s.flatOn && s.fSess && s.sessEnd > s.flatTime && s.sessStart < s.flatTime) add('info', 'The time window ends after the flatten time; no entries are made after ' + s.flatTime + '.');
      add('info', 'Risk limits are checked at each bar close by the strategy, not by the broker. Keep the platform\'s own account risk settings on as well.');
    } else {
      if (s.calc === 'tick') add('warn', 'On each tick, signals can appear and vanish before the bar closes' + (s.alerts ? ' and alerts can fire for signals that later disappear.' : '.'));
      if (s.marker === 'none' && !s.colorBars && !s.shade && !s.labels) add('info', 'Nothing is drawn for signals; they are still published through the B4 Signal API.');
    }
    if (/^of_/.test(s.sig)) {
      add('info', 'Order flow reads a 1-tick data series: NinjaTrader needs tick history for every date on the chart (Tools > Historical Data, or your data feed). Long ranges load slowly.');
      add('info', 'Each trade is counted as buying or selling from the bid and ask recorded with it; when the feed has no quote, the up-tick / down-tick rule is used. Numbers can differ slightly from other footprint tools.');
      if (s.kind === 's') add('info', 'Order-flow strategies can be backtested in the Strategy Analyzer for periods that have tick data.');
    }
    if (/^l2_/.test(s.sig)) add(s.kind === 's' ? 'high' : 'warn', 'Level 2 has no history: signals appear only in real time or in Playback of Market Replay data that includes depth. The Strategy Analyzer and historical bars show no signals.');
    if (s.fHtf) add('info', 'The higher-timeframe filter needs enough history: load at least a few days for minute timeframes, a year for daily.');
    if (s.sig === 'candle') add('info', 'Candlestick patterns are frequent on small timeframes; combine them with a trend or volume filter.');
    if (s.sig === 'ma_cross' && s.slow / s.fast < 1.5) add('warn', 'The fast and slow periods are close together: expect many whipsaws.');
    return R;
  }

  // ---------------------------------------------------------------- code generation
  function generate(sp) {
    var s = normalize(sp), S = s.kind === 's', c = s.className;
    var I = '        ', II = I + '    ', III = II + '    ';
    var fields = [], props = [], defs = [], configure = [], init = [], chart = [], plots = [], lines = [], lineInit = [], body = [], warm = [], plotVals = [];
    var order = 0;

    function P(type, name, label, grp, def, tip, extra) {
      extra = extra || {};
      props.push({ type: type, name: name, label: label, grp: GN[grp], def: def, tip: tip, order: ++order, range: extra.range, editor: extra.editor,
        nsp: S && extra.nsp !== false && /^(sig|flt|ord|exit|risk)$/.test(grp) && /^(int|double|bool|DateTime)$/.test(type) });
      if (def !== null && def !== undefined) defs.push(name + ' = ' + def + ';');
    }
    function intP(name, label, grp, v, min, tip) { P('int', name, label, grp, String(v), tip, { range: '[Range(' + min + ', int.MaxValue)]' }); }
    function dblP(name, label, grp, v, min, tip) { P('double', name, label, grp, dbl(v), tip, { range: '[Range(' + dbl(min) + ', double.MaxValue)]' }); }
    function boolP(name, label, grp, v, tip) { P('bool', name, label, grp, v ? 'true' : 'false', tip); }
    function brushP(name, label, grp, color, tip) { P('Brush', name, label, grp, 'Brushes.' + color, tip, { nsp: false }); }
    function strP(name, label, grp, v, tip) { P('string', name, label, grp, '"' + v + '"', tip, { nsp: false }); }
    function timeP(name, label, grp, v, tip) { P('DateTime', name, label, grp, 'DateTime.Parse("' + v + '", System.Globalization.CultureInfo.InvariantCulture)', tip, { editor: '[PropertyEditor("NinjaTrader.Gui.Tools.TimeEditorKey")]' }); }
    // color: 1 / 2 = the user's main / second line color, otherwise a fixed brush; fixed: a style this plot always keeps (SAR dots, dashed band middle)
    function plot(color, name, fixed) {
      var w = S ? 2 : s.plotWidth, col = color === 1 ? s.plotColor1 : color === 2 ? s.plotColor2 : color;
      var style = fixed === 'Dash' ? 'Line' : fixed || s.plotStyle;
      var dash = fixed === 'Dash' ? 'Dash' : fixed ? 'Solid' : (s.plotStyle === 'Line' ? s.dash : 'Solid');
      plots.push('AddPlot(new Stroke(Brushes.' + col + ', DashStyleHelper.' + dash + ', ' + w + '), PlotStyle.' + style + ', "' + name + '");');
    }
    function level(value, name) { lines.push('AddLine(new Stroke(Brushes.' + s.levelColor + ', DashStyleHelper.' + s.levelDash + ', 1), ' + value + ', "' + name + '");'); }
    var drawPlots = !S && (!s.overlay || s.showPlots);

    // ---- order flow (1-tick series) and depth (Level 2) engines
    var OF = /^of_/.test(s.sig), L2 = /^l2_/.test(s.sig), htfIdx = OF ? 2 : 1;
    var tickLines = [], preBody = [], members = [], colorLines = [], renderWanted = !S && OF && s.overlay && s.fpShow;
    function flowSignal() {
      configure.push('AddDataSeries(BarsPeriodType.Tick, 1);   // order flow: every trade with the bid and ask at that moment');
      fields.push('private sealed class FlowLevel { public double Bid; public double Ask; }',
        'private SortedDictionary<double, FlowLevel> barLevels = new SortedDictionary<double, FlowLevel>();',
        'private readonly Dictionary<double, double> sessionVolume = new Dictionary<double, double>();',
        'private double barBuyVolume, barSellVolume, barMaxBuyPrint, barMaxSellPrint, lastTickPrice, sessionDelta, sessionPv, sessionVolumeTotal;',
        'private int lastTickDirection;', 'private bool tickDataSeen;', 'private Series<double> barDelta;', 'private Series<double> cumDelta;');
      init.push('barDelta = new Series<double>(this, MaximumBarsLookBack.Infinite);', 'cumDelta = new Series<double>(this, MaximumBarsLookBack.Infinite);');
      boolP('ResetCvdEachSession', 'Reset cumulative delta each session', 'sig', s.ofCvdReset, BY.ofCvdReset.tip);
      tickLines.push('if (BarsInProgress == 1)   // each trade on the 1-tick series: classify it as buying or selling and add it to the bar being built', '{',
        '    tickDataSeen = true;',
        '    if (BarsArray[1].IsFirstBarOfSession) { sessionVolume.Clear(); sessionPv = 0; sessionVolumeTotal = 0; if (ResetCvdEachSession) sessionDelta = 0; }',
        '    double price = Instrument.MasterInstrument.RoundToTickSize(Closes[1][0]);',
        '    double volume = Volumes[1][0];',
        '    double ask = BarsArray[1].GetAsk(CurrentBars[1]), bid = BarsArray[1].GetBid(CurrentBars[1]);',
        '    int side = 0;',
        '    if (ask > 0 && bid > 0 && ask >= bid) side = price >= ask ? 1 : price <= bid ? -1 : 0;',
        '    if (side == 0) side = price > lastTickPrice ? 1 : price < lastTickPrice ? -1 : lastTickDirection;   // no quote, or a print inside the spread: tick rule',
        '    lastTickPrice = price;', '    lastTickDirection = side;',
        '    FlowLevel level;',
        '    if (!barLevels.TryGetValue(price, out level)) { level = new FlowLevel(); barLevels[price] = level; }',
        '    if (side > 0) { level.Ask += volume; barBuyVolume += volume; if (volume > barMaxBuyPrint) barMaxBuyPrint = volume; }',
        '    else if (side < 0) { level.Bid += volume; barSellVolume += volume; if (volume > barMaxSellPrint) barMaxSellPrint = volume; }',
        '    double atPrice;', '    sessionVolume.TryGetValue(price, out atPrice);', '    sessionVolume[price] = atPrice + volume;',
        '    sessionDelta += side > 0 ? volume : side < 0 ? -volume : 0;',
        '    sessionPv += price * volume;', '    sessionVolumeTotal += volume;',
        '    return;', '}');
      preBody.push('// order flow of the bar that just closed (its trades arrived on the tick series before this bar closed)',
        'double flowDelta = barBuyVolume - barSellVolume, flowBigBuy = barMaxBuyPrint, flowBigSell = barMaxSellPrint;',
        'double flowVwap = sessionVolumeTotal > 0 ? sessionPv / sessionVolumeTotal : Close[0];',
        'SortedDictionary<double, FlowLevel> flowLevels = barLevels;',
        'barDelta[0] = flowDelta;', 'cumDelta[0] = sessionDelta;');
      warm.push('3');
      switch (s.sig) {
        case 'of_delta':
          if (s.ofDeltaMode === 'threshold') dblP('DeltaThreshold', 'Delta threshold (contracts)', 'sig', s.ofDelta, 1, BY.ofDelta.tip);
          plot(1, 'Delta', 'Bar'); plotVals.push('barDelta[0]'); level('0', 'Zero');
          colorLines.push('PlotBrushes[0][0] = barDelta[0] >= 0 ? BuyBrush : SellBrush;');
          body.push(s.ofDeltaMode === 'threshold' ? 'bool sigBuy = flowDelta >= DeltaThreshold && Close[0] > Open[0];' : 'bool sigBuy = barDelta[0] > 0 && barDelta[1] <= 0;',
            s.ofDeltaMode === 'threshold' ? 'bool sigSell = flowDelta <= -DeltaThreshold && Close[0] < Open[0];' : 'bool sigSell = barDelta[0] < 0 && barDelta[1] >= 0;',
            'int direction = flowDelta > 0 ? 1 : flowDelta < 0 ? -1 : 0;');
          break;
        case 'of_cvd':
          intP('CvdPeriod', 'CVD average period', 'sig', s.ofCvdLen, 2, BY.ofCvdLen.tip);
          fields.push('private ISeries<double> cvdAverage;'); init.push('cvdAverage = EMA(cumDelta, CvdPeriod);');
          plot(1, 'CVD'); plot(2, 'CVD average'); plotVals.push('cumDelta[0]', 'cvdAverage[0]'); warm.push('CvdPeriod + 2');
          body.push('bool sigBuy = CrossAbove(cumDelta, cvdAverage, 1);', 'bool sigSell = CrossBelow(cumDelta, cvdAverage, 1);',
            'int direction = cumDelta[0] > cvdAverage[0] ? 1 : cumDelta[0] < cvdAverage[0] ? -1 : 0;');
          break;
        case 'of_imb':
          dblP('ImbalanceRatio', 'Imbalance ratio', 'sig', s.ofRatio, 1, BY.ofRatio.tip); dblP('ImbalanceMinVolume', 'Imbalance minimum volume', 'sig', s.ofMinVol, 0, BY.ofMinVol.tip);
          intP('StackedLevels', 'Stacked levels', 'sig', s.ofStack, 1, BY.ofStack.tip);
          preBody.push('int stackBuy, stackSell;', 'CountStacks(flowLevels, out stackBuy, out stackSell);');
          members.push('// longest run of consecutive diagonal imbalances in one bar, for each side',
            'private void CountStacks(SortedDictionary<double, FlowLevel> levels, out int buyStack, out int sellStack)', '{',
            '    buyStack = 0; sellStack = 0;', '    int runBuy = 0, runSell = 0;',
            '    foreach (KeyValuePair<double, FlowLevel> kv in levels)', '    {',
            '        FlowLevel below, above;',
            '        double bidBelow = levels.TryGetValue(Instrument.MasterInstrument.RoundToTickSize(kv.Key - TickSize), out below) ? below.Bid : 0;',
            '        double askAbove = levels.TryGetValue(Instrument.MasterInstrument.RoundToTickSize(kv.Key + TickSize), out above) ? above.Ask : 0;',
            '        bool buyImbalance = kv.Value.Ask >= ImbalanceMinVolume && kv.Value.Ask >= ImbalanceRatio * Math.Max(bidBelow, 1);',
            '        bool sellImbalance = kv.Value.Bid >= ImbalanceMinVolume && kv.Value.Bid >= ImbalanceRatio * Math.Max(askAbove, 1);',
            '        runBuy = buyImbalance ? runBuy + 1 : 0;', '        runSell = sellImbalance ? runSell + 1 : 0;',
            '        if (runBuy > buyStack) buyStack = runBuy;', '        if (runSell > sellStack) sellStack = runSell;', '    }', '}', '');
          body.push('bool sigBuy = stackBuy >= StackedLevels;', 'bool sigSell = stackSell >= StackedLevels;', 'int direction = flowDelta > 0 ? 1 : flowDelta < 0 ? -1 : 0;');
          break;
        case 'of_poc': case 'of_va':
          dblP('ValueAreaPercent', 'Value area (%)', 'sig', s.ofVaPct, 1, BY.ofVaPct.tip);
          fields.push('private Series<double> pocSeries;', 'private Series<double> vahSeries;', 'private Series<double> valSeries;');
          init.push('pocSeries = new Series<double>(this, MaximumBarsLookBack.Infinite);', 'vahSeries = new Series<double>(this, MaximumBarsLookBack.Infinite);', 'valSeries = new Series<double>(this, MaximumBarsLookBack.Infinite);');
          preBody.push('double poc, vah, val;', 'ComputeProfile(out poc, out vah, out val);',
            'pocSeries[0] = double.IsNaN(poc) ? Close[0] : poc;', 'vahSeries[0] = double.IsNaN(vah) ? Close[0] : vah;', 'valSeries[0] = double.IsNaN(val) ? Close[0] : val;');
          members.push('// developing session volume profile: point of control and value area from every trade so far this session',
            'private void ComputeProfile(out double poc, out double vah, out double val)', '{',
            '    poc = double.NaN; vah = double.NaN; val = double.NaN;', '    if (sessionVolume.Count == 0) return;',
            '    List<double> prices = new List<double>(sessionVolume.Keys);', '    prices.Sort();',
            '    double total = 0, best = -1;', '    int pocIndex = 0;',
            '    for (int i = 0; i < prices.Count; i++) { double v = sessionVolume[prices[i]]; total += v; if (v > best) { best = v; pocIndex = i; } }',
            '    poc = prices[pocIndex];', '    double target = total * ValueAreaPercent / 100.0, area = best;', '    int lo = pocIndex, hi = pocIndex;',
            '    while (area < target && (lo > 0 || hi < prices.Count - 1))', '    {',
            '        double down = lo > 0 ? sessionVolume[prices[lo - 1]] : -1, up = hi < prices.Count - 1 ? sessionVolume[prices[hi + 1]] : -1;',
            '        if (up >= down) { hi++; area += up; } else { lo--; area += down; }', '    }',
            '    vah = prices[hi];', '    val = prices[lo];', '}', '');
          if (s.sig === 'of_poc') {
            plot(1, 'POC'); plotVals.push('pocSeries[0]');
            body.push('bool sigBuy = Close[0] > pocSeries[1] && Close[1] <= pocSeries[1];', 'bool sigSell = Close[0] < pocSeries[1] && Close[1] >= pocSeries[1];');
          } else {
            plot(1, 'VAH'); plot(2, 'VAL'); plot('SlateGray', 'POC', 'Dash'); plotVals.push('vahSeries[0]', 'valSeries[0]', 'pocSeries[0]');
            if (s.ofVaMode === 'breakout') body.push('bool sigBuy = Close[0] > vahSeries[1] && Close[1] <= vahSeries[1];', 'bool sigSell = Close[0] < valSeries[1] && Close[1] >= valSeries[1];');
            else body.push('bool sigBuy = Close[0] > valSeries[1] && Close[1] <= valSeries[1];', 'bool sigSell = Close[0] < vahSeries[1] && Close[1] >= vahSeries[1];');
          }
          body.push('int direction = Close[0] > pocSeries[0] ? 1 : Close[0] < pocSeries[0] ? -1 : 0;');
          break;
        case 'of_vwap':
          fields.push('private Series<double> vwapSeries;'); init.push('vwapSeries = new Series<double>(this, MaximumBarsLookBack.Infinite);');
          preBody.push('vwapSeries[0] = flowVwap;');
          plot(1, 'VWAP'); plotVals.push('vwapSeries[0]');
          body.push('bool sigBuy = CrossAbove(Close, vwapSeries, 1);', 'bool sigSell = CrossBelow(Close, vwapSeries, 1);', 'int direction = Close[0] > vwapSeries[0] ? 1 : Close[0] < vwapSeries[0] ? -1 : 0;');
          break;
        default:   // of_big
          dblP('BigTradeSize', 'Big trade size (contracts)', 'sig', s.ofBig, 1, BY.ofBig.tip);
          body.push('bool sigBuy = flowBigBuy >= BigTradeSize && flowBigBuy >= flowBigSell;', 'bool sigSell = flowBigSell >= BigTradeSize && flowBigSell > flowBigBuy;',
            'int direction = flowDelta > 0 ? 1 : flowDelta < 0 ? -1 : 0;');
      }
      if (renderWanted) {
        boolP('ShowFootprint', 'Footprint numbers next to bars', 'disp', true, BY.fpShow.tip);
        intP('FootprintBars', 'Footprint bars kept', 'disp', s.fpBars, 10, BY.fpBars.tip);
        dblP('FootprintRatio', 'Footprint highlight ratio', 'disp', s.fpRatio, 1, BY.fpRatio.tip);
        fields.push('private readonly Dictionary<int, SortedDictionary<double, FlowLevel>> footprint = new Dictionary<int, SortedDictionary<double, FlowLevel>>();');
        preBody.push('if (ShowFootprint) { footprint[CurrentBar] = flowLevels; footprint.Remove(CurrentBar - FootprintBars); }');
        var txt = { bidask: 'kv.Value.Bid.ToString("0") + " x " + kv.Value.Ask.ToString("0")', delta: '(kv.Value.Ask - kv.Value.Bid).ToString("+0;-0;0")', volume: '(kv.Value.Ask + kv.Value.Bid).ToString("0")' }[s.fpMode];
        members.push('// footprint: the volume traded at each price, drawn beside each bar that is on screen',
          'protected override void OnRender(ChartControl chartControl, ChartScale chartScale)', '{',
          '    base.OnRender(chartControl, chartScale);',
          '    if (!ShowFootprint || ChartBars == null || footprint.Count == 0 || RenderTarget == null) return;',
          '    float rowHeight = Math.Abs(chartScale.GetYByValue(chartScale.MaxValue) - chartScale.GetYByValue(chartScale.MaxValue - TickSize));',
          '    if (rowHeight < 7) return;   // zoomed out too far to read the numbers',
          '    using (SharpDX.DirectWrite.TextFormat format = new SharpDX.DirectWrite.TextFormat(NinjaTrader.Core.Globals.DirectWriteFactory, FontFamilyName, (float)Math.Min(TextSize, rowHeight - 1)))',
          '    using (SharpDX.Direct2D1.Brush buyDx = BuyBrush.ToDxBrush(RenderTarget))',
          '    using (SharpDX.Direct2D1.Brush sellDx = SellBrush.ToDxBrush(RenderTarget))',
          '    using (SharpDX.Direct2D1.Brush plainDx = Brushes.Gainsboro.ToDxBrush(RenderTarget))', '    {',
          '        float offset = (float)chartControl.BarWidth + 3f;',
          '        for (int idx = Math.Max(ChartBars.FromIndex, 0); idx <= ChartBars.ToIndex; idx++)', '        {',
          '            SortedDictionary<double, FlowLevel> levels;',
          '            if (!footprint.TryGetValue(idx, out levels)) continue;',
          '            float x = chartControl.GetXByBarIndex(ChartBars, idx) + offset;',
          '            foreach (KeyValuePair<double, FlowLevel> kv in levels)', '            {',
          '                float y = chartScale.GetYByValue(kv.Key) - rowHeight / 2f;',
          '                string text = ' + txt + ';',
          '                SharpDX.Direct2D1.Brush brush = kv.Value.Ask >= FootprintRatio * Math.Max(kv.Value.Bid, 1) ? buyDx : kv.Value.Bid >= FootprintRatio * Math.Max(kv.Value.Ask, 1) ? sellDx : plainDx;',
          '                RenderTarget.DrawText(text, format, new SharpDX.RectangleF(x, y, 160f, rowHeight), brush);', '            }', '        }', '    }', '}', '');
      }
      preBody.push('barLevels = new SortedDictionary<double, FlowLevel>();', 'barBuyVolume = 0; barSellVolume = 0; barMaxBuyPrint = 0; barMaxSellPrint = 0;',
        'if (!tickDataSeen && (State == State.Realtime || CurrentBar >= Bars.Count - 2))',
        '    Draw.TextFixed(this, "B4StudioNoTicks", Name + ": no tick data. Download 1-tick history for these dates (Tools > Historical Data), then reload the chart.", TextPosition.BottomLeft, Brushes.OrangeRed, new SimpleFont("Arial", 12), Brushes.Transparent, Brushes.Black, 70);');
    }
    function depthSignal() {
      fields.push('private sealed class DepthRow { public double Price; public long Volume; }', 'private readonly List<DepthRow> askBook = new List<DepthRow>();',
        'private readonly List<DepthRow> bidBook = new List<DepthRow>();', 'private readonly object bookLock = new object();');
      intP('DepthLevels', 'Book levels counted', 'sig', s.l2Levels, 1, BY.l2Levels.tip);
      members.push('// Level 2: keep a live copy of the order book (real time and Market Replay playback only; there is no depth history)',
        'protected override void OnMarketDepth(MarketDepthEventArgs e)', '{',
        '    if (e.MarketDataType != MarketDataType.Ask && e.MarketDataType != MarketDataType.Bid) return;',
        '    lock (bookLock)', '    {',
        '        List<DepthRow> book = e.MarketDataType == MarketDataType.Ask ? askBook : bidBook;',
        '        if (e.Operation == NinjaTrader.Cbi.Operation.Add) { if (e.Position <= book.Count) book.Insert(e.Position, new DepthRow { Price = e.Price, Volume = e.Volume }); }',
        '        else if (e.Operation == NinjaTrader.Cbi.Operation.Remove) { if (e.Position < book.Count) book.RemoveAt(e.Position); }',
        '        else if (e.Position < book.Count) { book[e.Position].Price = e.Price; book[e.Position].Volume = e.Volume; }', '    }', '}', '');
      preBody.push('// snapshot of the order book at this bar close', 'double bookBid = 0, bookAsk = 0;');
      var wall = s.sig === 'l2_wall';
      if (wall) {
        dblP('WallSize', 'Wall size (contracts)', 'sig', s.l2Wall, 1, BY.l2Wall.tip); intP('WallRangeTicks', 'Wall search range (ticks)', 'sig', s.l2Range, 1, BY.l2Range.tip);
        fields.push('private double prevAskWall = double.NaN;', 'private double prevBidWall = double.NaN;');
        preBody.push('double askWall = double.NaN, bidWall = double.NaN, askWallSize = 0, bidWallSize = 0;');
      }
      preBody.push('lock (bookLock)', '{', '    for (int i = 0; i < bidBook.Count && i < DepthLevels; i++) bookBid += bidBook[i].Volume;', '    for (int i = 0; i < askBook.Count && i < DepthLevels; i++) bookAsk += askBook[i].Volume;');
      if (wall) preBody.push('    foreach (DepthRow r in askBook) if (r.Price - Close[0] <= WallRangeTicks * TickSize && r.Volume >= WallSize && r.Volume > askWallSize) { askWallSize = r.Volume; askWall = r.Price; }',
        '    foreach (DepthRow r in bidBook) if (Close[0] - r.Price <= WallRangeTicks * TickSize && r.Volume >= WallSize && r.Volume > bidWallSize) { bidWallSize = r.Volume; bidWall = r.Price; }');
      preBody.push('}');
      warm.push('3');
      if (!wall) {
        dblP('DepthRatio', 'Book imbalance ratio', 'sig', s.l2Ratio, 1, BY.l2Ratio.tip);
        fields.push('private int lastBookState;');
        plot(1, 'Bid share %'); level('50', 'Balanced');
        body.push('double bidShare = bookBid + bookAsk > 0 ? 100.0 * bookBid / (bookBid + bookAsk) : 50.0;',
          'int bookState = bookBid + bookAsk <= 0 ? 0 : bookBid >= DepthRatio * Math.Max(bookAsk, 1) ? 1 : bookAsk >= DepthRatio * Math.Max(bookBid, 1) ? -1 : 0;',
          'bool sigBuy = bookState == 1 && lastBookState != 1;', 'bool sigSell = bookState == -1 && lastBookState != -1;', 'lastBookState = bookState;', 'int direction = bookState;');
        plotVals.push('bidShare');
      } else {
        body.push('bool sigBuy = !double.IsNaN(prevAskWall) && Close[0] > prevAskWall;', 'bool sigSell = !double.IsNaN(prevBidWall) && Close[0] < prevBidWall;',
          'prevAskWall = askWall;', 'prevBidWall = bidWall;', 'int direction = bidWallSize > askWallSize ? 1 : askWallSize > bidWallSize ? -1 : 0;');
      }
    }

    // ---- signal
    var yPanel = 'Values[0][0]';
    switch (s.sig) {
      case 'ma_cross':
        fields.push('private ISeries<double> fastMa;', 'private ISeries<double> slowMa;');
        intP('FastPeriod', 'Fast ' + s.maType + ' period', 'sig', s.fast, 1, BY.fast.tip); intP('SlowPeriod', 'Slow ' + s.maType + ' period', 'sig', s.slow, 2, BY.slow.tip);
        init.push('var fastInd = ' + maX(s.maType, 'Close', 'FastPeriod') + ';', 'var slowInd = ' + maX(s.maType, 'Close', 'SlowPeriod') + ';', 'fastMa = fastInd;', 'slowMa = slowInd;'); chart.push('fastInd', 'slowInd');
        plot(1, 'Fast'); plot(2, 'Slow'); plotVals.push('fastMa[0]', 'slowMa[0]');
        warm.push('SlowPeriod + 2', 'FastPeriod + 2');
        body.push('bool sigBuy = CrossAbove(fastMa, slowMa, 1);', 'bool sigSell = CrossBelow(fastMa, slowMa, 1);', 'int direction = fastMa[0] > slowMa[0] ? 1 : fastMa[0] < slowMa[0] ? -1 : 0;');
        break;
      case 'price_ma': case 'ma_slope':
        fields.push('private ISeries<double> ma;');
        intP('MaPeriod', s.maType + ' period', 'sig', s.maLen, 2, BY.maLen.tip);
        init.push('var maInd = ' + maX(s.maType, 'Close', 'MaPeriod') + ';', 'ma = maInd;'); chart.push('maInd');
        plot(1, s.maType); plotVals.push('ma[0]'); warm.push('MaPeriod + 3');
        if (s.sig === 'price_ma') body.push('bool sigBuy = CrossAbove(Close, ma, 1);', 'bool sigSell = CrossBelow(Close, ma, 1);', 'int direction = Close[0] > ma[0] ? 1 : Close[0] < ma[0] ? -1 : 0;');
        else body.push('bool sigBuy = ma[0] > ma[1] && ma[1] <= ma[2];', 'bool sigSell = ma[0] < ma[1] && ma[1] >= ma[2];', 'int direction = ma[0] > ma[1] ? 1 : ma[0] < ma[1] ? -1 : 0;');
        break;
      case 'osc':
        var od = OSC[s.osc];
        fields.push('private ISeries<double> osc;');
        intP('OscPeriod', od.l + ' period', 'sig', s.oscLen, 2, BY.oscLen.tip);
        P('double', 'UpperLevel', 'High level', 'sig', dbl(s.upper), BY.upper.tip); P('double', 'LowerLevel', 'Low level', 'sig', dbl(s.lower), BY.lower.tip);
        init.push('var oscInd = ' + od.ind + ';', 'osc = oscInd' + (od.ser || '') + ';'); chart.push('oscInd');
        plot(1, s.osc); plotVals.push('osc[0]'); warm.push('OscPeriod * 2 + 3');
        level(dbl(s.upper), 'High level'); level(dbl(s.lower), 'Low level');
        lineInit.push('Lines[0].Value = UpperLevel;', 'Lines[1].Value = LowerLevel;');
        body.push('double mid = (UpperLevel + LowerLevel) / 2.0;');
        if (s.oscMode === 'exit') body.push('bool sigBuy = CrossAbove(osc, LowerLevel, 1);', 'bool sigSell = CrossBelow(osc, UpperLevel, 1);');
        else if (s.oscMode === 'enter') body.push('bool sigBuy = CrossAbove(osc, UpperLevel, 1);', 'bool sigSell = CrossBelow(osc, LowerLevel, 1);');
        else body.push('bool sigBuy = CrossAbove(osc, mid, 1);', 'bool sigSell = CrossBelow(osc, mid, 1);');
        body.push('int direction = osc[0] > mid ? 1 : osc[0] < mid ? -1 : 0;');
        break;
      case 'macd':
        fields.push('private ISeries<double> macdLine;', 'private ISeries<double> macdSignal;');
        intP('MacdFast', 'MACD fast', 'sig', s.macdFast, 1, BY.macdFast.tip); intP('MacdSlow', 'MACD slow', 'sig', s.macdSlow, 2, BY.macdSlow.tip); intP('MacdSmooth', 'Signal line', 'sig', s.macdSmooth, 1, BY.macdSmooth.tip);
        init.push('var macdInd = MACD(Close, MacdFast, MacdSlow, MacdSmooth);', 'macdLine = macdInd;', 'macdSignal = macdInd.Avg;'); chart.push('macdInd');
        plot(1, 'MACD'); plot(2, 'Signal'); plotVals.push('macdLine[0]', 'macdSignal[0]'); level('0', 'Zero');
        warm.push('MacdSlow + MacdSmooth + 2');
        if (s.macdMode === 'signal') body.push('bool sigBuy = CrossAbove(macdLine, macdSignal, 1);', 'bool sigSell = CrossBelow(macdLine, macdSignal, 1);', 'int direction = macdLine[0] > macdSignal[0] ? 1 : macdLine[0] < macdSignal[0] ? -1 : 0;');
        else body.push('bool sigBuy = CrossAbove(macdLine, 0, 1);', 'bool sigSell = CrossBelow(macdLine, 0, 1);', 'int direction = macdLine[0] > 0 ? 1 : macdLine[0] < 0 ? -1 : 0;');
        break;
      case 'band':
        fields.push('private ISeries<double> upperBand;', 'private ISeries<double> lowerBand;', 'private ISeries<double> middleBand;');
        intP('BandPeriod', s.band + ' period', 'sig', s.bandLen, 2, BY.bandLen.tip);
        if (s.band !== 'Donchian') dblP('BandWidth', s.band === 'Bollinger' ? 'Standard deviations' : 'Range multiplier', 'sig', s.width, 0.1, BY.width.tip);
        if (s.band === 'Bollinger') init.push('var bandInd = Bollinger(Close, BandWidth, BandPeriod);', 'upperBand = bandInd.Upper;', 'lowerBand = bandInd.Lower;', 'middleBand = bandInd.Middle;');
        else if (s.band === 'Keltner') init.push('var bandInd = KeltnerChannel(Close, BandWidth, BandPeriod);', 'upperBand = bandInd.Upper;', 'lowerBand = bandInd.Lower;', 'middleBand = bandInd.Midline;');
        else init.push('var bandInd = DonchianChannel(Close, BandPeriod);', 'upperBand = bandInd.Upper;', 'lowerBand = bandInd.Lower;', 'middleBand = bandInd.Mean;');
        chart.push('bandInd');
        plot(1, 'Upper'); plot(2, 'Lower'); plot('SlateGray', 'Middle', 'Dash'); plotVals.push('upperBand[0]', 'lowerBand[0]', 'middleBand[0]');
        warm.push('BandPeriod + 2');
        var r0 = s.band === 'Donchian' ? 1 : 0;   // Donchian: compare with the previous bar's channel (the current bar is inside it by definition)
        if (s.bandMode === 'breakout') body.push('bool sigBuy = Close[0] > upperBand[' + r0 + '] && Close[1] <= upperBand[' + (r0 + 1) + '];', 'bool sigSell = Close[0] < lowerBand[' + r0 + '] && Close[1] >= lowerBand[' + (r0 + 1) + '];');
        else body.push('bool sigBuy = Close[0] > lowerBand[' + r0 + '] && Close[1] <= lowerBand[' + (r0 + 1) + '];', 'bool sigSell = Close[0] < upperBand[' + r0 + '] && Close[1] >= upperBand[' + (r0 + 1) + '];');
        body.push('int direction = Close[0] > middleBand[0] ? 1 : Close[0] < middleBand[0] ? -1 : 0;');
        break;
      case 'nbar':
        fields.push('private ISeries<double> rangeHigh;', 'private ISeries<double> rangeLow;');
        intP('LookbackBars', 'Look-back bars', 'sig', s.nbarLen, 2, BY.nbarLen.tip);
        init.push('rangeHigh = MAX(High, LookbackBars);', 'rangeLow = MIN(Low, LookbackBars);');
        plot(1, 'Range high'); plot(2, 'Range low'); plotVals.push('rangeHigh[1]', 'rangeLow[1]');
        warm.push('LookbackBars + 3');
        body.push('bool sigBuy = Close[0] > rangeHigh[1] && Close[1] <= rangeHigh[2];', 'bool sigSell = Close[0] < rangeLow[1] && Close[1] >= rangeLow[2];',
          'double rangeMid = (rangeHigh[1] + rangeLow[1]) / 2.0;', 'int direction = Close[0] > rangeMid ? 1 : Close[0] < rangeMid ? -1 : 0;');
        break;
      case 'dmi':
        fields.push('private ISeries<double> diPlus;', 'private ISeries<double> diMinus;');
        intP('DmiPeriod', 'DMI period', 'sig', s.dmiLen, 2, BY.dmiLen.tip);
        init.push('var dmInd = DM(Close, DmiPeriod);', 'diPlus = dmInd.DiPlus;', 'diMinus = dmInd.DiMinus;'); chart.push('dmInd');
        plot(1, 'DI+'); plot(2, 'DI-'); plotVals.push('diPlus[0]', 'diMinus[0]'); warm.push('DmiPeriod * 2 + 2');
        body.push('bool sigBuy = CrossAbove(diPlus, diMinus, 1);', 'bool sigSell = CrossAbove(diMinus, diPlus, 1);', 'int direction = diPlus[0] > diMinus[0] ? 1 : diPlus[0] < diMinus[0] ? -1 : 0;');
        break;
      case 'psar':
        fields.push('private ISeries<double> sar;');
        dblP('SarAcceleration', 'SAR acceleration', 'sig', s.sarAcc, 0.001, BY.sarAcc.tip); dblP('SarMaximum', 'SAR maximum', 'sig', s.sarMax, 0.001, BY.sarMax.tip); dblP('SarStep', 'SAR step', 'sig', s.sarStep, 0.001, BY.sarStep.tip);
        init.push('var sarInd = ParabolicSAR(Close, SarAcceleration, SarMaximum, SarStep);', 'sar = sarInd;'); chart.push('sarInd');
        plot('Orange', 'SAR', 'Dot'); plotVals.push('sar[0]'); warm.push('5');
        body.push('bool sigBuy = Close[0] > sar[0] && Close[1] <= sar[1];', 'bool sigSell = Close[0] < sar[0] && Close[1] >= sar[1];', 'int direction = Close[0] > sar[0] ? 1 : Close[0] < sar[0] ? -1 : 0;');
        break;
      case 'of_delta': case 'of_cvd': case 'of_imb': case 'of_poc': case 'of_va': case 'of_vwap': case 'of_big':
        flowSignal();
        break;
      case 'l2_book': case 'l2_wall':
        depthSignal();
        break;
      default:
        var cp = CANDLES[s.candle];
        fields.push('private ISeries<double> bullPattern;', 'private ISeries<double> bearPattern;');
        intP('TrendStrength', 'Prior trend bars', 'sig', s.trendStrength, 0, BY.trendStrength.tip);
        init.push('bullPattern = CandlestickPattern(ChartPattern.' + cp[1] + ', TrendStrength);', 'bearPattern = CandlestickPattern(ChartPattern.' + cp[2] + ', TrendStrength);');
        warm.push('TrendStrength + 4');
        body.push('bool sigBuy = bullPattern[0] > 0.5;', 'bool sigSell = bearPattern[0] > 0.5;', 'int direction = sigBuy ? 1 : sigSell ? -1 : 0;');
    }
    if (!drawPlots) plots = [];

    // ---- filters
    var flt = ['bool longOk = ' + (s.side === 'short' ? 'false' : 'true') + ';', 'bool shortOk = ' + (s.side === 'long' ? 'false' : 'true') + ';'];
    if (s.fTrend) {
      fields.push('private ISeries<double> trendMa;'); intP('TrendPeriod', 'Trend ' + s.fTrendMa + ' period', 'flt', s.fTrendLen, 2, BY.fTrendLen.tip);
      init.push('trendMa = ' + maX(s.fTrendMa, 'Close', 'TrendPeriod') + ';'); warm.push('TrendPeriod + 1');
      flt.push('if (Close[0] <= trendMa[0]) longOk = false;      // trend filter', 'if (Close[0] >= trendMa[0]) shortOk = false;');
    }
    if (s.fHtf) {
      fields.push('private ISeries<double> htfMa;'); intP('HtfPeriod', 'Higher-timeframe ' + s.fHtfMa + ' period', 'flt', s.fHtfLen, 2, BY.fHtfLen.tip);
      configure.push(s.fHtfTf === 'D' ? 'AddDataSeries(BarsPeriodType.Day, 1);' : 'AddDataSeries(BarsPeriodType.Minute, ' + s.fHtfTf + ');');
      init.push('htfMa = ' + maX(s.fHtfMa, 'BarsArray[' + htfIdx + ']', 'HtfPeriod') + ';');
      flt.push('if (CurrentBars[' + htfIdx + '] < HtfPeriod) { longOk = false; shortOk = false; }   // higher timeframe still warming up',
        'else { if (Closes[' + htfIdx + '][0] <= htfMa[0]) longOk = false; if (Closes[' + htfIdx + '][0] >= htfMa[0]) shortOk = false; }');
    }
    if (s.fAdx) {
      fields.push('private ISeries<double> adx;'); intP('AdxPeriod', 'ADX period', 'flt', s.fAdxLen, 2, BY.fAdxLen.tip); dblP('AdxMinimum', 'ADX minimum', 'flt', s.fAdxMin, 0, BY.fAdxMin.tip);
      init.push('adx = ADX(Close, AdxPeriod);'); warm.push('AdxPeriod * 2');
      flt.push('if (adx[0] < AdxMinimum) { longOk = false; shortOk = false; }');
    }
    if (s.fVol) {
      fields.push('private ISeries<double> volumeAvg;'); intP('VolumePeriod', 'Volume average period', 'flt', s.fVolLen, 2, BY.fVolLen.tip); dblP('VolumeMultiplier', 'Volume multiplier', 'flt', s.fVolMult, 0, BY.fVolMult.tip);
      init.push('volumeAvg = SMA(Volume, VolumePeriod);'); warm.push('VolumePeriod + 1');
      flt.push('if (Volume[0] < volumeAvg[0] * VolumeMultiplier) { longOk = false; shortOk = false; }');
    }
    if (s.fAtr) {
      fields.push('private ISeries<double> atrFilter;'); intP('AtrFilterPeriod', 'ATR period', 'flt', s.fAtrLen, 2, BY.fAtrLen.tip);
      dblP('AtrMinTicks', 'ATR minimum (ticks)', 'flt', s.fAtrMin, 0, BY.fAtrMin.tip); dblP('AtrMaxTicks', 'ATR maximum (ticks, 0 = none)', 'flt', s.fAtrMax, 0, BY.fAtrMax.tip);
      init.push('atrFilter = ATR(Close, AtrFilterPeriod);'); warm.push('AtrFilterPeriod + 1');
      flt.push('double atrTicks = atrFilter[0] / TickSize;', 'if (atrTicks < AtrMinTicks || (AtrMaxTicks > 0 && atrTicks > AtrMaxTicks)) { longOk = false; shortOk = false; }');
    }
    if (s.fSess) {
      timeP('WindowStart', 'Window start', 'flt', s.sessStart, BY.sessStart.tip); timeP('WindowEnd', 'Window end', 'flt', s.sessEnd, BY.sessEnd.tip);
      flt.push('if (!InWindow(ToTime(Time[0]), ToTime(WindowStart), ToTime(WindowEnd))) { longOk = false; shortOk = false; }');
    }
    intP('CooldownBars', 'Cool-down bars', 'flt', s.cooldown, 0, BY.cooldown.tip);
    flt.push('if (CooldownBars > 0 && lastSignalBar >= 0 && CurrentBar - lastSignalBar < CooldownBars) { longOk = false; shortOk = false; }');
    flt.push('bool goLong = sigBuy && longOk;', 'bool goShort = sigSell && shortOk;');
    fields.push('private int lastSignalBar;');
    var warmExpr = maxExpr(warm);

    // ---- alerts / logging (shared)
    if (s.alerts) {
      boolP('UseAlerts', 'Alerts (real-time)', 'alr', true, BY.alerts.tip);
      boolP('AlertOnBuy', S ? 'Alert on long entries' : 'Alert on buy signals', 'alr', s.alertSide !== 'sell', BY.alertSide.tip);
      boolP('AlertOnSell', S ? 'Alert on short entries' : 'Alert on sell signals', 'alr', s.alertSide !== 'buy', BY.alertSide.tip);
      boolP('SoundOnly', 'Sound only (no Alerts window line)', 'alr', s.alertMode === 'sound', BY.alertMode.tip);
      strP('AlertSound', (S ? 'Long entry sound' : 'Buy sound') + ' (file in the sounds folder)', 'alr', s.alertSound, BY.alertSound.tip);
      strP('AlertSoundSell', (S ? 'Short entry sound' : 'Sell sound') + ' (file in the sounds folder)', 'alr', s.alertSoundSell, BY.alertSoundSell.tip);
      if (!S) { strP('BuyAlertText', 'Buy alert text', 'alr', esc(s.alertBuyText), BY.alertBuyText.tip); strP('SellAlertText', 'Sell alert text', 'alr', esc(s.alertSellText), BY.alertSellText.tip); }
      P('Priority', 'AlertPriority', 'Priority', 'alr', 'Priority.' + s.alertPriority, BY.alertPriority.tip, { nsp: false });
      intP('AlertRearmSeconds', 'Re-arm (seconds)', 'alr', s.alertRearm, 0, BY.alertRearm.tip);
      intP('MaxAlertsPerSession', 'Max alerts per session (0 = no limit)', 'alr', s.alertMax, 0, BY.alertMax.tip);
      strP('AlertMessage', 'Message prefix', 'alr', esc(s.alertMsg), BY.alertMsg.tip);
      fields.push('private int alertsThisSession;');
    }
    boolP('LogToOutput', 'Log to the Output window', 'alr', s.logSignals, BY.logSignals.tip);
    if (!S || s.table) { strP('FontFamilyName', 'Font', 'read', s.fontFamily, BY.fontFamily.tip); intP('TextSize', 'Text size', 'read', s.fontSize, 6, BY.fontSize.tip); }
    if (s.table) {
      boolP('ShowTable', 'Show the info table', 'tbl', true, BY.table.tip);
      P('TextPosition', 'TablePosition', 'Table position', 'tbl', 'TextPosition.' + s.tablePos, BY.tablePos.tip, { nsp: false });
      boolP('TableShowBias', 'Row: current bias', 'tbl', s.tblBias, BY.tblBias.tip);
      boolP('TableShowLast', 'Row: last signal', 'tbl', s.tblLast, BY.tblLast.tip);
      boolP('TableShowValues', 'Row: indicator values', 'tbl', s.tblValues, BY.tblValues.tip);
      boolP('TableShowFilters', 'Row: filter status', 'tbl', s.tblFilters, BY.tblFilters.tip);
      if (S) boolP('TableShowStats', 'Rows: position, session P&L, entries, status', 'tbl', s.tblStats, BY.tblStats.tip);
      brushP('TableTextBrush', 'Table text color', 'tbl', s.tableText, BY.tableText.tip);
      brushP('TableBackBrush', 'Table background color', 'tbl', s.tableBg, BY.tableBg.tip);
      intP('TableOpacity', 'Table background opacity (%)', 'tbl', s.tableOpacity, 0, BY.tableOpacity.tip);
      fields.push('private bool lastSignalWasBuy;');
    }
    var FP = function (x) { return 'Instrument.MasterInstrument.FormatPrice(' + x + ')'; };
    var valuesExpr = {
      ma_cross: '"Fast " + ' + FP('fastMa[0]') + ' + "   Slow " + ' + FP('slowMa[0]'), price_ma: '"' + s.maType + ' " + ' + FP('ma[0]'), ma_slope: '"' + s.maType + ' " + ' + FP('ma[0]'),
      osc: '"' + s.osc + ' " + osc[0].ToString("0.00")', macd: '"MACD " + macdLine[0].ToString("0.000") + "   Signal " + macdSignal[0].ToString("0.000")',
      band: '"Upper " + ' + FP('upperBand[0]') + ' + "   Lower " + ' + FP('lowerBand[0]'), nbar: '"Range " + ' + FP('rangeLow[1]') + ' + " to " + ' + FP('rangeHigh[1]'),
      dmi: '"DI+ " + diPlus[0].ToString("0.0") + "   DI- " + diMinus[0].ToString("0.0")',
      of_delta: '"Delta " + barDelta[0].ToString("N0") + "   CVD " + cumDelta[0].ToString("N0")', of_cvd: '"CVD " + cumDelta[0].ToString("N0") + "   avg " + cvdAverage[0].ToString("N0")',
      of_imb: '"Stacks: buy " + stackBuy + "   sell " + stackSell + "   delta " + barDelta[0].ToString("N0")', of_poc: '"POC " + ' + FP('pocSeries[0]') + ' + "   delta " + barDelta[0].ToString("N0")',
      of_va: '"VAH " + ' + FP('vahSeries[0]') + ' + "   VAL " + ' + FP('valSeries[0]') + ' + "   POC " + ' + FP('pocSeries[0]'), of_vwap: '"VWAP " + ' + FP('vwapSeries[0]') + ' + "   delta " + barDelta[0].ToString("N0")',
      of_big: '"Largest print: buy " + flowBigBuy.ToString("N0") + "   sell " + flowBigSell.ToString("N0")',
      l2_book: '"Book: bids " + bookBid.ToString("N0") + "   asks " + bookAsk.ToString("N0")',
      l2_wall: '"Walls: ask " + (double.IsNaN(askWall) ? "none" : ' + FP('askWall') + ') + "   bid " + (double.IsNaN(bidWall) ? "none" : ' + FP('bidWall') + ')', psar: '"SAR " + ' + FP('sar[0]'), candle: '"Pattern: " + (sigBuy ? "bullish" : sigSell ? "bearish" : "none")' }[s.sig];
    // the info table: drawn only on the latest bar (or live), so it costs nothing while history loads
    function tableLines(stats) {
      if (!s.table) return [];
      var L = [II + 'if (ShowTable && (State == State.Realtime || CurrentBar >= Bars.Count - 2))', II + '{',
        III + 'var table = new System.Text.StringBuilder(Name);',
        III + 'if (TableShowBias) table.Append("\\nBias: " + (direction > 0 ? "bullish" : direction < 0 ? "bearish" : "neutral"));',
        III + 'if (TableShowLast) table.Append("\\nLast signal: " + (lastSignalBar < 0 ? "none yet" : (lastSignalWasBuy ? "buy, " : "sell, ") + (CurrentBar - lastSignalBar) + " bars ago"));',
        III + 'if (TableShowValues) table.Append("\\n" + ' + valuesExpr + ');',
        III + 'if (TableShowFilters) table.Append("\\nFilters: long " + (longOk ? "open" : "blocked") + ", short " + (shortOk ? "open" : "blocked"));'];
      if (stats) L.push(III + 'if (TableShowStats) table.Append("\\nPosition: " + Position.MarketPosition + (Position.Quantity > 0 ? " " + Position.Quantity : "") + "\\nSession P&L: " + sessionPnl.ToString("C0")'
        + ' + "\\nEntries today: " + entriesToday + (MaxEntriesPerDay > 0 ? " of " + MaxEntriesPerDay : "") + "\\nStatus: " + (haltedToday ? "stopped for the session" : pastFlattenTime ? "past the flatten time" : "active"));');
      L.push(III + 'Draw.TextFixed(this, "B4StudioTable", table.ToString(), TablePosition, TableTextBrush, new SimpleFont(FontFamilyName, TextSize), Brushes.Transparent, TableBackBrush, Math.Max(0, Math.Min(100, TableOpacity)));', II + '}');
      return L;
    }
    var lastSig = s.table ? 'if (goLong || goShort) { lastSignalBar = CurrentBar; lastSignalWasBuy = goLong; }' : 'if (goLong || goShort) lastSignalBar = CurrentBar;';

    var out = [];
    var tag = S ? 'strategy' : 'indicator';
    out.push('// ' + s.name + ' - generated by B4 AI Indicator Studio (template generator, no AI).');
    out.push('// Status: GENERATED. The B4 templates are compile-checked against NinjaTrader 8, but this exact file has not been');
    out.push('// compiled or tested by B4. Compile it (F5), test it ' + (S ? 'in the Strategy Analyzer and on a simulation account' : 'in simulation') + ', and review the logic before you rely on it.');
    out.push('// Educational and research use only. Not trading advice.' + (S ? ' Trading futures involves substantial risk of loss.' : ' This indicator places no orders.'));
    if (String(s.author).trim()) out.push('// Author: ' + esc(s.author).replace(/[^A-Za-z0-9 .,_@()-]/g, ''));
    out.push('// Visibility: ' + (s.visibility === 'public' ? 'public, open source under the ' + s.license + ' license' : 'private') + '. Generator: ' + VERSION + '.');
    out.push('//');
    specLines(s).forEach(function (l) { out.push('// ' + l[0] + ': ' + l[1]); });
    out.push('#region Using declarations', 'using System;', 'using System.Collections.Generic;', 'using System.ComponentModel;', 'using System.ComponentModel.DataAnnotations;', 'using System.Windows.Media;',
      'using System.Xml.Serialization;', 'using NinjaTrader.Cbi;', 'using NinjaTrader.Data;', 'using NinjaTrader.Gui;', 'using NinjaTrader.Gui.Tools;', 'using NinjaTrader.NinjaScript;',
      'using NinjaTrader.NinjaScript.DrawingTools;', 'using NinjaTrader.NinjaScript.Indicators;');
    if (renderWanted) out.push('using NinjaTrader.Gui.Chart;');
    out.push('#endregion', '');

    if (!S) genIndicator(); else genStrategy();
    return out.join('\r\n');

    // ======================================================== indicator
    function genIndicator() {
      var mk = { arrow: ['ArrowUp', 'ArrowDown'], triangle: ['TriangleUp', 'TriangleDown'], dot: ['Dot', 'Dot'], diamond: ['Diamond', 'Diamond'], square: ['Square', 'Square'] }[s.marker];
      if (mk) intP('MarkerOffsetTicks', 'Marker offset (ticks)', 'disp', s.markerOffset, 0, BY.markerOffset.tip);
      brushP('BuyBrush', 'Buy color', 'disp', s.buyColor, BY.buyColor.tip);
      brushP('SellBrush', 'Sell color', 'disp', s.sellColor, BY.sellColor.tip);
      boolP('ShowLabels', 'Text labels on signals', 'disp', s.labels, BY.labels.tip);
      var words = s.labelText === 'custom' ? [esc(s.buyWord), esc(s.sellWord)] : LABEL_WORDS[s.labelText];
      strP('BuyLabelText', 'Buy label', 'read', words[0], BY.buyWord.tip); strP('SellLabelText', 'Sell label', 'read', words[1], BY.sellWord.tip);
      boolP('ShowLabelPrice', 'Show the price on labels', 'read', s.labelPrice, BY.labelPrice.tip);
      boolP('LabelBox', 'Dark box behind labels', 'read', s.labelBox, BY.labelBox.tip);
      intP('LabelBoxOpacity', 'Label box opacity (%)', 'read', s.labelBoxOpacity, 1, BY.labelBoxOpacity.tip);
      boolP('ColorSignalBars', 'Color signal bars', 'disp', s.colorBars, BY.colorBars.tip);
      boolP('ShadeBackground', 'Shade background', 'disp', s.shade, BY.shade.tip);
      intP('ShadeOpacity', 'Shade opacity (%)', 'disp', s.shadeOpacity, 1, BY.shadeOpacity.tip);
      defs.push('B4UseEntrySignals = true;', 'B4UseConfirmations = true;');
      out.push('namespace NinjaTrader.NinjaScript.Indicators.B4Studio', '{', '    public class ' + c + ' : Indicator', '    {');
      fields.forEach(function (f) { out.push(I + f); });
      out.push(I + 'private Brush buyShade;', I + 'private Brush sellShade;');
      out.push(I + 'private Series<bool> b4BuySignal;', I + 'private Series<bool> b4SellSignal;', I + 'private Series<int> b4ConfirmationDirection;', '');
      out.push(I + 'protected override void OnStateChange()', I + '{', II + 'if (State == State.SetDefaults)', II + '{');
      out.push(III + 'Description = "' + (String(s.description).trim() ? esc(s.description) + ' ' : '') + '(B4 AI Indicator Studio. Publishes B4 Signal API v1 signals.)";', III + 'Name = "' + esc(s.name) + '";',
        III + 'Calculate = Calculate.' + (s.calc === 'tick' ? 'OnEachTick' : 'OnBarClose') + ';', III + 'IsOverlay = ' + s.overlay + ';', III + 'DisplayInDataBox = true;',
        III + 'DrawOnPricePanel = true;', III + 'PaintPriceMarkers = ' + (s.overlay ? 'true' : 'false') + ';', III + 'IsSuspendedWhileInactive = true;');
      defs.forEach(function (d) { out.push(III + d); });
      plots.forEach(function (p) { out.push(III + p); });
      lines.forEach(function (p) { out.push(III + p); });
      out.push(II + '}');
      if (configure.length) { out.push(II + 'else if (State == State.Configure)', II + '{'); configure.forEach(function (x) { out.push(III + x); }); out.push(II + '}'); }
      out.push(II + 'else if (State == State.DataLoaded)', II + '{');
      init.forEach(function (x) { out.push(III + x); });
      lineInit.forEach(function (x) { out.push(III + x); });
      out.push(III + 'lastSignalBar = -1;', III + 'buyShade = MakeShade(BuyBrush);', III + 'sellShade = MakeShade(SellBrush);',
        III + 'b4BuySignal = new Series<bool>(this, MaximumBarsLookBack.Infinite);', III + 'b4SellSignal = new Series<bool>(this, MaximumBarsLookBack.Infinite);',
        III + 'b4ConfirmationDirection = new Series<int>(this, MaximumBarsLookBack.Infinite);', II + '}', I + '}', '');
      out.push(I + 'protected override void OnBarUpdate()', I + '{');
      tickLines.forEach(function (x) { out.push(II + x); });
      if (configure.length) out.push(II + 'if (BarsInProgress != 0) return;');
      if (s.alerts) out.push(II + 'if (Bars.IsFirstBarOfSession && IsFirstTickOfBar) alertsThisSession = 0;');
      preBody.forEach(function (x) { out.push(II + x); });
      out.push(II + 'b4BuySignal[0] = false;      // B4 Signal API: pulse, then reset every bar', II + 'b4SellSignal[0] = false;', II + 'b4ConfirmationDirection[0] = 0;');
      if (s.calc === 'tick') out.push(II + 'ClearMarks();   // each tick: a signal that is no longer true on this bar is removed');
      out.push(II + 'if (CurrentBar < ' + warmExpr + ') return;', '');
      body.forEach(function (b) { out.push(II + b); });
      flt.forEach(function (b) { out.push(II + b); });
      if (plots.length) { plotVals.forEach(function (v, i) { out.push(II + 'Values[' + i + '][0] = ' + v + ';'); }); colorLines.forEach(function (x) { out.push(II + x); }); }
      out.push('', II + lastSig,
        II + 'if (B4UseEntrySignals) { b4BuySignal[0] = goLong; b4SellSignal[0] = goShort; }', II + 'if (B4UseConfirmations) b4ConfirmationDirection[0] = direction;');
      var yb = s.overlay ? 'Low[0] - ' + (mk ? 'MarkerOffsetTicks' : '2') + ' * TickSize' : yPanel, ys = s.overlay ? 'High[0] + ' + (mk ? 'MarkerOffsetTicks' : '2') + ' * TickSize' : yPanel;
      out.push(II + 'if (goLong) Mark(true, ' + yb + ');', II + 'if (goShort) Mark(false, ' + ys + ');');
      tableLines(false).forEach(function (x) { out.push(x); });
      out.push(I + '}', '');
      // Mark
      out.push(I + 'private void Mark(bool isBuy, double y)', I + '{', II + 'Brush b = isBuy ? BuyBrush : SellBrush;', II + 'string tag = (isBuy ? "B4StudioBuy" : "B4StudioSell") + CurrentBar;');
      if (mk) out.push(II + 'if (isBuy) Draw.' + mk[0] + '(this, tag, false, 0, y, b); else Draw.' + mk[1] + '(this, tag, false, 0, y, b);');
      out.push(II + 'if (ShowLabels) Draw.Text(this, tag + "T", false, (isBuy ? BuyLabelText : SellLabelText) + (ShowLabelPrice ? " " + Instrument.MasterInstrument.FormatPrice(Close[0]) : ""), 0, y, isBuy ? -(TextSize + 10) : TextSize + 10, b,',
        III + 'new SimpleFont(FontFamilyName, TextSize), System.Windows.TextAlignment.Center, Brushes.Transparent, LabelBox ? Brushes.Black : Brushes.Transparent, LabelBox ? Math.Max(1, Math.Min(100, LabelBoxOpacity)) : 0);',
        II + 'if (ColorSignalBars) BarBrush = b;', II + 'if (ShadeBackground) BackBrush = isBuy ? buyShade : sellShade;');
      if (s.alerts) out.push(II + 'if (UseAlerts && State == State.Realtime && (isBuy ? AlertOnBuy : AlertOnSell) && (MaxAlertsPerSession <= 0 || alertsThisSession < MaxAlertsPerSession))', II + '{',
        III + 'alertsThisSession++;',
        III + 'string message = Prefix() + Name + " " + Instrument.FullName + " " + (isBuy ? BuyAlertText : SellAlertText) + " @ " + Instrument.MasterInstrument.FormatPrice(Close[0]);',
        III + 'if (SoundOnly) { string sound = SoundPath(isBuy); if (sound.Length > 0) PlaySound(sound); }',
        III + 'else Alert("B4Studio" + (isBuy ? "Buy" : "Sell"), AlertPriority, message, SoundPath(isBuy), AlertRearmSeconds, Brushes.Black, b);', II + '}');
      out.push(II + 'if (LogToOutput) Print(string.Format("{0} {1} {2} {3} @ {4}", Time[0], Name, Instrument.FullName, isBuy ? "BUY" : "SELL", Instrument.MasterInstrument.FormatPrice(Close[0])));', I + '}', '');
      if (s.calc === 'tick') out.push(I + 'private void ClearMarks()', I + '{', II + 'RemoveDrawObject("B4StudioBuy" + CurrentBar); RemoveDrawObject("B4StudioBuy" + CurrentBar + "T");',
        II + 'RemoveDrawObject("B4StudioSell" + CurrentBar); RemoveDrawObject("B4StudioSell" + CurrentBar + "T");', II + 'BarBrush = null; BackBrush = null;', I + '}', '');
      members.forEach(function (x) { out.push(x === '' ? '' : I + x); });
      out.push(I + 'private Brush MakeShade(Brush source)', I + '{', II + 'if (source == null) return null;', II + 'Brush shade = source.Clone();', II + 'shade.Opacity = Math.Max(1, Math.Min(100, ShadeOpacity)) / 100.0;', II + 'shade.Freeze();', II + 'return shade;', I + '}', '');
      helpers();
      out.push(I + '#region Settings (normal properties, so B4 CoPilot Dev can load this indicator)');
      emitProps();
      out.push(I + '#endregion', '', I + '#region B4 Signal API v1 (public contract - keep names and attributes exactly)',
        I + '[NinjaScriptProperty][Display(Name = "B4 Entry Signals Enabled", Order = 41, GroupName = "B4 CoPilot Pro Integration")]', I + 'public bool B4UseEntrySignals { get; set; }', '',
        I + '[NinjaScriptProperty][Display(Name = "B4 Confirmation Signals Enabled", Order = 42, GroupName = "B4 CoPilot Pro Integration")]', I + 'public bool B4UseConfirmations { get; set; }', '',
        I + '[NinjaScriptProperty][Browsable(false)][XmlIgnore]', I + 'public Series<bool> B4BuySignals { get { return b4BuySignal; } set { } }', '',
        I + '[NinjaScriptProperty][Browsable(false)][XmlIgnore]', I + 'public Series<bool> B4SellSignals { get { return b4SellSignal; } set { } }', '',
        I + '[NinjaScriptProperty][Browsable(false)][XmlIgnore]', I + 'public Series<int> B4ConfirmationDirections { get { return b4ConfirmationDirection; } set { } }',
        I + '#endregion', '    }', '}', '');
    }

    // ======================================================== strategy
    function genStrategy() {
      var stopOn = s.stopMode !== 'none', track = stopOn && (s.beOn || s.trailMode !== 'none');
      if (s.entryType !== 'market') intP('EntryOffsetTicks', 'Entry offset (ticks)', 'ord', s.entryOffset, s.entryType === 'stop' ? 1 : 0, BY.entryOffset.tip);
      if (s.qtyMode === 'fixed') intP('Contracts', 'Contracts', 'ord', s.qty, 1, BY.qty.tip);
      else { dblP('RiskPerTrade', 'Risk per trade ($)', 'ord', s.riskUsd, 1, BY.riskUsd.tip); intP('MaxContracts', 'Maximum contracts', 'ord', s.maxQty, 1, BY.maxQty.tip); }
      boolP('ExitOnOpposite', 'Exit on an opposite signal', 'ord', s.exitOpp, BY.exitOpp.tip);
      boolP('ReverseOnOpposite', 'Reverse on an opposite signal', 'ord', s.reverse, BY.reverse.tip);
      if (s.stopMode === 'ticks') intP('StopLossTicks', 'Stop (ticks)', 'exit', s.stopTicks, 1, BY.stopTicks.tip);
      if (s.stopMode === 'atr') dblP('StopAtrMultiple', 'Stop (x ATR)', 'exit', s.stopAtr, 0.1, BY.stopAtr.tip);
      if (s.stopMode === 'percent') dblP('StopPercent', 'Stop (% of price)', 'exit', s.stopPct, 0.01, BY.stopPct.tip);
      if (s.stopMode === 'swing') { intP('SwingLookback', 'Swing look-back (bars)', 'exit', s.swingLen, 2, BY.swingLen.tip); intP('SwingPadTicks', 'Swing padding (ticks)', 'exit', s.swingPad, 0, BY.swingPad.tip); }
      if (s.tgtMode === 'r') dblP('TargetR', 'Target (R)', 'exit', s.tgtR, 0.1, BY.tgtR.tip);
      if (s.tgtMode === 'ticks') intP('ProfitTargetTicks', 'Target (ticks)', 'exit', s.tgtTicks, 1, BY.tgtTicks.tip);
      if (s.tgtMode === 'atr') dblP('TargetAtrMultiple', 'Target (x ATR)', 'exit', s.tgtAtr, 0.1, BY.tgtAtr.tip);
      if (anyAtr(s)) { intP('ExitAtrPeriod', 'ATR period (exits)', 'exit', s.exitAtrLen, 2, BY.exitAtrLen.tip); fields.push('private ATR exitAtr;'); init.push('exitAtr = ATR(Close, ExitAtrPeriod);'); warm.push('ExitAtrPeriod + 1'); }
      if (s.stopMode === 'swing') { fields.push('private MIN swingLow;', 'private MAX swingHigh;'); init.push('swingLow = MIN(Low, SwingLookback);', 'swingHigh = MAX(High, SwingLookback);'); warm.push('SwingLookback + 1'); }
      if (s.beOn) { intP('BreakevenTriggerTicks', 'Break-even trigger (ticks)', 'exit', s.beTrigger, 1, BY.beTrigger.tip); intP('BreakevenOffsetTicks', 'Break-even offset (ticks)', 'exit', s.beOffset, 0, BY.beOffset.tip); }
      if (s.trailMode === 'ticks') intP('TrailTicks', 'Trail distance (ticks)', 'exit', s.trailTicks, 1, BY.trailTicks.tip);
      if (s.trailMode === 'atr') dblP('TrailAtrMultiple', 'Trail distance (x ATR)', 'exit', s.trailAtr, 0.1, BY.trailAtr.tip);
      intP('TimeStopBars', 'Time stop (bars, 0 = off)', 'exit', s.timeStop, 0, BY.timeStop.tip);
      intP('MaxEntriesPerDay', 'Max entries per day (0 = no limit)', 'risk', s.maxTrades, 0, BY.maxTrades.tip);
      dblP('DailyLossLimit', 'Daily loss limit ($, 0 = off)', 'risk', s.dailyLoss, 0, BY.dailyLoss.tip);
      dblP('DailyProfitTarget', 'Daily profit target ($, 0 = off)', 'risk', s.dailyProfit, 0, BY.dailyProfit.tip);
      intP('MaxConsecutiveLosses', 'Max losing trades in a row (0 = off)', 'risk', s.maxConsec, 0, BY.maxConsec.tip);
      boolP('FlattenAtTime', 'Flatten at a set time', 'risk', s.flatOn, BY.flatOn.tip);
      timeP('FlattenTime', 'Flatten time', 'risk', s.flatTime, BY.flatTime.tip);
      if (s.showOnChart) boolP('ShowSignalIndicators', 'Show the signal indicators on the chart', 'disp', true, BY.showOnChart.tip);
      warm = warm.concat([]); var wx = maxExpr(warm);

      out.push('namespace NinjaTrader.NinjaScript.Strategies.B4Studio', '{', '    public class ' + c + ' : Strategy', '    {');
      fields.forEach(function (f) { out.push(I + f); });
      out.push(I + 'private const string LongName = "Long";', I + 'private const string ShortName = "Short";',
        I + 'private double dayStartProfit;', I + 'private int entriesToday;', I + 'private int lossStreak;', I + 'private int tradesSeen;',
        I + 'private bool haltedToday;', I + 'private bool pastFlattenTime;', I + 'private MarketPosition managedSide;');
      if (track) out.push(I + 'private double armedStopTicks;', I + 'private double entryPrice;', I + 'private double bestPrice;', I + 'private double currentStop;');
      if (track && s.beOn) out.push(I + 'private bool breakevenDone;');
      if (s.accounts === 'sim') out.push(I + 'private bool accountBlocked;');
      out.push('', I + 'protected override void OnStateChange()', I + '{', II + 'if (State == State.SetDefaults)', II + '{');
      out.push(III + 'Description = "' + (String(s.description).trim() ? esc(s.description) + ' ' : '') + '(B4 AI Indicator Studio strategy: bar close, managed orders, daily risk limits.)";', III + 'Name = "' + esc(s.name) + '";',
        III + 'Calculate = Calculate.OnBarClose;', III + 'EntriesPerDirection = 1;', III + 'EntryHandling = EntryHandling.AllEntries;',
        III + 'IsExitOnSessionCloseStrategy = ' + s.exitOnClose + ';', III + 'ExitOnSessionCloseSeconds = 30;', III + 'IsFillLimitOnTouch = false;',
        III + 'MaximumBarsLookBack = MaximumBarsLookBack.TwoHundredFiftySix;', III + 'OrderFillResolution = OrderFillResolution.Standard;', III + 'Slippage = 0;',
        III + 'StartBehavior = StartBehavior.WaitUntilFlat;', III + 'TimeInForce = TimeInForce.Gtc;', III + 'TraceOrders = ' + s.trace + ';',
        III + 'RealtimeErrorHandling = RealtimeErrorHandling.StopCancelClose;', III + 'StopTargetHandling = StopTargetHandling.PerEntryExecution;',
        III + 'BarsRequiredToTrade = ' + s.barsReq + ';', III + 'IsInstantiatedOnEachOptimizationIteration = true;');
      defs.forEach(function (d) { out.push(III + d); });
      out.push(II + '}');
      if (configure.length) { out.push(II + 'else if (State == State.Configure)', II + '{'); configure.forEach(function (x) { out.push(III + x); }); out.push(II + '}'); }
      out.push(II + 'else if (State == State.DataLoaded)', II + '{');
      init.forEach(function (x) { out.push(III + x); });
      if (s.showOnChart && chart.length) out.push(III + 'if (ShowSignalIndicators)', III + '{', chart.map(function (v) { return III + '    AddChartIndicator(' + v + ');'; }).join('\r\n'), III + '}');
      out.push(III + 'lastSignalBar = -1;', III + 'ResetDay();', III + 'tradesSeen = 0;', III + 'managedSide = MarketPosition.Flat;', II + '}');
      if (s.accounts === 'sim') out.push(II + 'else if (State == State.Realtime)', II + '{', III + 'accountBlocked = !IsSimulationAccount(Account);',
        III + 'if (accountBlocked)', III + '{', III + '    Print(Name + ": account \'" + (Account != null ? Account.Name : "?") + "\' is not a simulation or Playback account. This strategy never trades it.");',
        III + '    Draw.TextFixed(this, "B4StudioAccount", Name + ": simulation and Playback accounts only. No orders will be placed on this account.", TextPosition.TopRight, Brushes.OrangeRed, new SimpleFont("Arial", 12), Brushes.Transparent, Brushes.Black, 70);',
        III + '}', II + '}');
      out.push(I + '}', '');

      out.push(I + 'protected override void OnBarUpdate()', I + '{');
      tickLines.forEach(function (x) { out.push(II + x); });
      out.push(II + 'if (BarsInProgress != 0) return;');
      preBody.forEach(function (x) { out.push(II + x); });
      out.push(II + 'if (CurrentBar < Math.Max(BarsRequiredToTrade, ' + wx + ')) return;',
        II + 'if (Bars.IsFirstBarOfSession) ResetDay();', II + 'CountClosedTrades();', '');
      body.forEach(function (b) { out.push(II + b); });
      flt.forEach(function (b) { out.push(II + b); });
      out.push(II + lastSig, '');
      out.push(II + '// ---- session risk limits (checked at bar close)',
        II + 'double sessionPnl = SystemPerformance.AllTrades.TradesPerformance.Currency.CumProfit - dayStartProfit + Position.GetUnrealizedProfitLoss(PerformanceUnit.Currency, Close[0]);',
        II + 'if (!haltedToday)', II + '{', III + 'string breach = RiskBreach(sessionPnl);', III + 'if (breach != null) { haltedToday = true; FlattenAll(breach); Notify(breach + " - no more entries this session", true); }', II + '}',
        II + 'if (FlattenAtTime && !pastFlattenTime && ToTime(Time[0]) >= ToTime(FlattenTime)) { pastFlattenTime = true; FlattenAll("Flatten time"); }');
      tableLines(true).forEach(function (x) { out.push(x); });
      if (s.accounts === 'sim') out.push(II + 'if (State == State.Realtime && accountBlocked) return;');
      out.push('', II + '// ---- manage an open position', II + 'ManagePosition();', '');
      out.push(II + '// ---- opposite signals', II + 'bool canEnter = !haltedToday && !pastFlattenTime && (MaxEntriesPerDay <= 0 || entriesToday < MaxEntriesPerDay);',
        II + 'if (Position.MarketPosition == MarketPosition.Long && sigSell)', II + '{',
        III + 'if (ReverseOnOpposite && goShort && canEnter) { EnterSide(false); return; }', III + 'if (ExitOnOpposite || ReverseOnOpposite) ExitLong("Opposite signal", LongName);', II + '}',
        II + 'else if (Position.MarketPosition == MarketPosition.Short && sigBuy)', II + '{',
        III + 'if (ReverseOnOpposite && goLong && canEnter) { EnterSide(true); return; }', III + 'if (ExitOnOpposite || ReverseOnOpposite) ExitShort("Opposite signal", ShortName);', II + '}', '',
        II + '// ---- new entries (flat only)', II + 'if (Position.MarketPosition != MarketPosition.Flat || !canEnter) return;',
        II + 'if (goLong) EnterSide(true);', II + 'else if (goShort) EnterSide(false);', I + '}', '');

      // EnterSide
      out.push(I + 'private void EnterSide(bool isLong)', I + '{', II + 'string signal = isLong ? LongName : ShortName;', II + 'double stopTicks = StopDistanceTicks(isLong);');
      out.push(II + 'int quantity = PositionSize(stopTicks);', II + 'if (quantity < 1) { Notify("Entry skipped: one contract risks more than the risk per trade", false); return; }');
      if (stopOn) out.push(II + 'SetStopLoss(signal, CalculationMode.Ticks, stopTicks, false);');
      if (s.tgtMode !== 'none') out.push(II + 'double targetTicks = TargetDistanceTicks(stopTicks);', II + 'SetProfitTarget(signal, CalculationMode.Ticks, targetTicks);');
      if (track) out.push(II + 'armedStopTicks = stopTicks;');
      out.push(II + 'entriesToday++;');
      if (s.entryType === 'market') out.push(II + 'if (isLong) EnterLong(quantity, signal); else EnterShort(quantity, signal);');
      else if (s.entryType === 'limit') out.push(II + 'if (isLong) EnterLongLimit(quantity, Close[0] - EntryOffsetTicks * TickSize, signal);', II + 'else EnterShortLimit(quantity, Close[0] + EntryOffsetTicks * TickSize, signal);');
      else out.push(II + 'if (isLong) EnterLongStopMarket(quantity, Math.Max(High[0], Close[0]) + EntryOffsetTicks * TickSize, signal);', II + 'else EnterShortStopMarket(quantity, Math.Min(Low[0], Close[0]) - EntryOffsetTicks * TickSize, signal);');
      out.push(II + 'Notify((isLong ? "LONG " : "SHORT ") + quantity + " " + Instrument.FullName + " @ " + Instrument.MasterInstrument.FormatPrice(Close[0]) + (stopTicks > 0 ? ", stop " + stopTicks + " ticks" : ""), false, isLong);', I + '}', '');

      // distances
      out.push(I + 'private double StopDistanceTicks(bool isLong)', I + '{');
      out.push(II + { ticks: 'return StopLossTicks;', atr: 'return Math.Max(1, Math.Round(exitAtr[0] * StopAtrMultiple / TickSize));', percent: 'return Math.Max(1, Math.Round(Close[0] * StopPercent / 100.0 / TickSize));',
        swing: 'double d = isLong ? Close[0] - swingLow[0] : swingHigh[0] - Close[0];\r\n' + II + 'return Math.Max(1, Math.Round(d / TickSize) + SwingPadTicks);', none: 'return 0;' }[s.stopMode], I + '}', '');
      if (s.tgtMode !== 'none') out.push(I + 'private double TargetDistanceTicks(double stopTicks)', I + '{',
        II + { r: 'return Math.Max(1, Math.Round(stopTicks * TargetR));', ticks: 'return ProfitTargetTicks;', atr: 'return Math.Max(1, Math.Round(exitAtr[0] * TargetAtrMultiple / TickSize));' }[s.tgtMode], I + '}', '');
      out.push(I + 'private int PositionSize(double stopTicks)', I + '{');
      if (s.qtyMode === 'fixed') out.push(II + 'return Contracts;');
      else out.push(II + 'double riskPerContract = stopTicks * TickSize * Instrument.MasterInstrument.PointValue;', II + 'if (riskPerContract <= 0) return 0;',
        II + 'return Math.Min(MaxContracts, (int)Math.Floor(RiskPerTrade / riskPerContract));');
      out.push(I + '}', '');

      // ManagePosition
      out.push(I + 'private void ManagePosition()', I + '{', II + 'if (Position.MarketPosition == MarketPosition.Flat) { managedSide = MarketPosition.Flat; return; }',
        II + 'bool isLong = Position.MarketPosition == MarketPosition.Long;',
        II + 'if (managedSide != Position.MarketPosition)   // a new position (or a reversal): start tracking it', II + '{', III + 'managedSide = Position.MarketPosition;',
        track ? III + 'entryPrice = Position.AveragePrice;\r\n' + III + 'bestPrice = entryPrice;\r\n' + (s.beOn ? III + 'breakevenDone = false;\r\n' : '') + III + 'currentStop = isLong ? entryPrice - armedStopTicks * TickSize : entryPrice + armedStopTicks * TickSize;' : III + '// no break-even or trailing stop: the stop and target set at entry manage the trade',
        II + '}',
        II + 'if (TimeStopBars > 0 && BarsSinceEntryExecution() >= TimeStopBars)', II + '{', III + 'if (isLong) ExitLong("Time stop", LongName); else ExitShort("Time stop", ShortName);', III + 'return;', II + '}');
      if (track) {
        out.push(II + 'bestPrice = isLong ? Math.Max(bestPrice, High[0]) : Math.Min(bestPrice, Low[0]);', II + 'double newStop = currentStop;');
        if (s.beOn) out.push(II + 'if (!breakevenDone && (isLong ? bestPrice >= entryPrice + BreakevenTriggerTicks * TickSize : bestPrice <= entryPrice - BreakevenTriggerTicks * TickSize))', II + '{',
          III + 'breakevenDone = true;', III + 'double be = isLong ? entryPrice + BreakevenOffsetTicks * TickSize : entryPrice - BreakevenOffsetTicks * TickSize;',
          III + 'newStop = isLong ? Math.Max(newStop, be) : Math.Min(newStop, be);', II + '}');
        if (s.trailMode !== 'none') out.push(II + 'double trail = ' + (s.trailMode === 'ticks' ? 'TrailTicks * TickSize' : 'exitAtr[0] * TrailAtrMultiple') + ';',
          II + 'newStop = isLong ? Math.Max(newStop, bestPrice - trail) : Math.Min(newStop, bestPrice + trail);');
        out.push(II + 'newStop = Instrument.MasterInstrument.RoundToTickSize(newStop);',
          II + 'bool tighter = isLong ? newStop > currentStop && newStop < Close[0] : newStop < currentStop && newStop > Close[0];   // only ever tighten, never cross the market',
          II + 'if (tighter) { currentStop = newStop; SetStopLoss(isLong ? LongName : ShortName, CalculationMode.Price, currentStop, false); }');
      }
      out.push(I + '}', '');

      // risk helpers
      out.push(I + 'private string RiskBreach(double sessionPnl)', I + '{',
        II + 'if (DailyLossLimit > 0 && sessionPnl <= -DailyLossLimit) return "Daily loss limit reached (" + sessionPnl.ToString("C0") + ")";',
        II + 'if (DailyProfitTarget > 0 && sessionPnl >= DailyProfitTarget) return "Daily profit target reached (" + sessionPnl.ToString("C0") + ")";',
        II + 'if (MaxConsecutiveLosses > 0 && lossStreak >= MaxConsecutiveLosses) return lossStreak + " losing trades in a row";', II + 'return null;', I + '}', '');
      out.push(I + 'private void FlattenAll(string reason)', I + '{', II + 'if (Position.MarketPosition == MarketPosition.Long) ExitLong(reason, LongName);',
        II + 'else if (Position.MarketPosition == MarketPosition.Short) ExitShort(reason, ShortName);', I + '}', '');
      out.push(I + 'private void ResetDay()', I + '{', II + 'dayStartProfit = SystemPerformance != null ? SystemPerformance.AllTrades.TradesPerformance.Currency.CumProfit : 0;',
        II + 'entriesToday = 0;', II + 'lossStreak = 0;', II + 'haltedToday = false;', II + 'pastFlattenTime = false;', s.alerts ? II + 'alertsThisSession = 0;' : II + '// (no alerts configured)', I + '}', '');
      out.push(I + 'private void CountClosedTrades()', I + '{', II + 'int count = SystemPerformance.AllTrades.Count;', II + 'while (tradesSeen < count)', II + '{',
        III + 'Trade trade = SystemPerformance.AllTrades[tradesSeen++];', III + 'lossStreak = trade.ProfitCurrency < 0 ? lossStreak + 1 : 0;', II + '}', I + '}', '');
      out.push(I + 'private void Notify(string text, bool riskEvent, bool isLong = true)', I + '{',
        II + 'if (LogToOutput) Print(string.Format("{0} {1}: {2}", Time[0], Name, text));');
      if (s.alerts) out.push(II + 'if (UseAlerts && State == State.Realtime && (riskEvent || ((isLong ? AlertOnBuy : AlertOnSell) && (MaxAlertsPerSession <= 0 || alertsThisSession < MaxAlertsPerSession))))', II + '{',
        III + 'if (!riskEvent) alertsThisSession++;',
        III + 'if (SoundOnly) { string sound = SoundPath(isLong); if (sound.Length > 0) PlaySound(sound); }',
        III + 'else Alert("B4Studio" + (riskEvent ? "Risk" : isLong ? "Long" : "Short"), riskEvent ? Priority.High : AlertPriority, Prefix() + Name + ": " + text, SoundPath(isLong), AlertRearmSeconds, Brushes.Black, riskEvent ? Brushes.OrangeRed : isLong ? Brushes.LimeGreen : Brushes.Red);', II + '}');
      out.push(I + '}', '');
      members.forEach(function (x) { out.push(x === '' ? '' : I + x); });
      if (s.accounts === 'sim') out.push(I + 'public static bool IsSimulationAccount(Account a)', I + '{', II + 'if (a == null || string.IsNullOrEmpty(a.Name)) return false;',
        II + 'string n = a.Name;', II + 'return n == "Playback101" || n == "Backtest" || n.StartsWith("Sim", StringComparison.OrdinalIgnoreCase);', I + '}', '');
      helpers();
      out.push(I + '#region Settings');
      emitProps();
      out.push(I + '#endregion', '    }', '}', '');
    }

    function helpers() {
      if (s.fSess) out.push(I + 'private static bool InWindow(int t, int start, int end)', I + '{', II + 'return start <= end ? t >= start && t <= end : t >= start || t <= end;   // windows across midnight work', I + '}', '');
      if (s.alerts) {
        out.push(I + 'private string SoundPath(bool isBuy)', I + '{', II + 'string file = isBuy ? AlertSound : AlertSoundSell;',
          II + 'return string.IsNullOrWhiteSpace(file) ? "" : System.IO.Path.Combine(NinjaTrader.Core.Globals.InstallDir, "sounds", file.Trim());', I + '}', '');
        out.push(I + 'private string Prefix()', I + '{', II + 'return string.IsNullOrWhiteSpace(AlertMessage) ? "" : AlertMessage.Trim() + " ";', I + '}', '');
      }
    }

    function emitProps() {
      props.forEach(function (p) {
        out.push(I + (p.nsp ? '[NinjaScriptProperty]' : '') + (p.range || '') + (p.editor || '') + (p.type === 'Brush' ? '[XmlIgnore]' : ''));
        out.push(I + '[Display(Name = "' + p.label + '", Description = "' + esc(p.tip || '') + '", Order = ' + p.order + ', GroupName = "' + p.grp + '")]');
        out.push(I + 'public ' + p.type + ' ' + p.name + ' { get; set; }', '');
        if (p.type === 'Brush') out.push(I + '[Browsable(false)]', I + 'public string ' + p.name + 'Serializable { get { return Serialize.BrushToString(' + p.name + '); } set { ' + p.name + ' = Serialize.StringToBrush(value); } }', '');
      });
      // remove empty attribute lines
      for (var i = out.length - 1; i >= 0; i--) if (out[i] === I) out.splice(i, 1);
    }
  }

  // ---------------------------------------------------------------- supported-feature check (never silently invent behavior)
  var UNSUPPORTED = [
    [/market profile|\btpo\b/, 'TPO / market profile letters', 'Volume profile (POC, value area) is supported; TPO letter profiles are not generated.'],
    [/absorption|iceberg detect|spoof/, 'Absorption, iceberg or spoofing detection', 'Not generated yet. Use stacked imbalances, big trades, delta or liquidity walls as building blocks.'],
    [/machine learning|\bml\b|neural|\bai\b model|predict/, 'Machine learning / prediction', 'Not part of the template generator.'],
    [/\bnews\b|economic calendar|sentiment/, 'News or sentiment data', 'No news data source is available to NinjaScript here.'],
    [/pine|tradingview|thinkscript|\bmql\b|metatrader|python/, 'Other platforms or languages', 'This Studio generates NinjaTrader 8 NinjaScript only.'],
    [/\boptions?\b (chain|greeks)|implied volatility|\bgreeks\b/, 'Options data', 'Not available.'],
    [/(two|2|multiple|other) instruments?|spread|pairs? trad|correlation/, 'Multi-instrument logic', 'Only the chart instrument (plus one higher timeframe of it) is supported.'],
    [/martingale|double (the )?(size|position) after (a )?loss|average down|grid trad/, 'Martingale / averaging down', 'Not supported: it removes the risk limit on a losing position.'],
    [/b4 ?(algo|confirm|indicator pro|signal pro|copilot pro)|hosoda|kazoe|kyushu|shoyu/, 'Proprietary B4 logic', 'B4\'s own algorithms and confirmation rules are not available to the Studio.']
  ];
  function unsupported(text) {
    var t = String(text || '').toLowerCase();
    return UNSUPPORTED.filter(function (u) { return u[0].test(t); }).map(function (u) { return { feature: u[1], reason: u[2] }; });
  }

  // ---------------------------------------------------------------- confirmations and test plans per project type
  function confirmations(sp) {
    var s = normalize(sp);
    var C = [['signal', s.kind === 's' ? 'The long and short setups above are what I want' : 'The buy and sell signals above are what I want']];
    if (s.kind === 'i') C.push(['calc', s.calc === 'tick' ? 'I understand each-tick signals can disappear before the bar closes' : 'Signals are final on bar close (no repainting)']);
    else {
      C.push(['exits', 'Stop: ' + stopText(s) + '; target: ' + ({ r: s.tgtR + 'R', ticks: s.tgtTicks + ' ticks', atr: s.tgtAtr + ' x ATR', none: 'none' }[s.tgtMode])]);
      C.push(['size', s.qtyMode === 'fixed' ? 'Size: ' + s.qty + ' contract(s) per entry' : 'Size: risk $' + s.riskUsd + ' per trade, up to ' + s.maxQty + ' contracts']);
      C.push(['opposite', s.reverse ? 'An opposite signal reverses the position' : s.exitOpp ? 'An opposite signal exits (does not reverse)' : 'Opposite signals are ignored while in a trade']);
      C.push(['limits', 'Daily limits: ' + (s.dailyLoss > 0 ? 'loss $' + s.dailyLoss : 'NO loss limit') + ', ' + (s.maxTrades > 0 ? s.maxTrades + ' entries' : 'no entry limit') + (s.flatOn ? ', flat at ' + s.flatTime : '')]);
      C.push(['accounts', s.accounts === 'sim' ? 'Simulation and Playback accounts only' : 'I allow live accounts and accept the risk']);
    }
    if (s.visibility === 'public') C.push(['public', 'I will publish this under ' + s.license + ', it contains no one else\'s code, and I make no profit claims']);
    return C.map(function (c) { return { id: c[0], text: c[1] }; });
  }
  function testPlan(sp) {
    var s = normalize(sp), T = [];
    T.push(['Compile', 'Copy the file to Documents\\NinjaTrader 8\\bin\\Custom\\' + (s.kind === 's' ? 'Strategies' : 'Indicators') + '\\ while flat, press F5 in the NinjaScript Editor: zero errors.']);
    if (/^of_/.test(s.sig)) T.push(['Tick data', 'Download 1-tick history for the chart dates (Tools > Historical Data). The chart must not show the "no tick data" note. If you have another footprint tool, compare bar delta on a few bars.']);
    if (/^l2_/.test(s.sig)) T.push(['Market depth', 'Run it live on Sim101 or in Playback of a Market Replay day with depth: the table (turn it on) shows the book filling; signals must not appear on historical bars.']);
    T.push(['Parameter boundaries', 'Set each period to its minimum and to a large value; the ' + (s.kind === 's' ? 'strategy' : 'indicator') + ' must load without errors in the Log tab.']);
    if (s.kind === 'i') {
      T.push(['Signals on history', 'Apply to a chart with 10+ days: markers appear only where the specification says.']);
      T.push(['Bar close vs real time', s.calc === 'tick' ? 'In Playback, confirm a signal that disappears intrabar also loses its marker.' : 'In Playback, confirm signals appear only when the bar closes and never move afterwards.']);
      T.push(['B4 Signal API', 'Load it in B4 CoPilot Dev as the signal tool on Sim101: CoPilot Dev must report the tool loaded.']);
      if (s.alerts) T.push(['Alerts', 'In Playback (real-time mode), a signal writes one alert to the Alerts Log with the chosen sound; not again within the re-arm time.']);
    } else {
      T.push(['Backtest', 'Strategy Analyzer, 3+ months: every trade has a stop' + (s.tgtMode !== 'none' ? ' and a target' : '') + ' in the Executions tab.']);
      T.push(['Order lifecycle', 'Playback on Sim101: entry, stop and target appear together; the stop ' + (s.beOn || s.trailMode !== 'none' ? 'moves only in your favor' : 'stays where it was placed') + '.']);
      T.push(['Daily limits', 'Lower the daily loss limit to a small value in Playback: the position closes and no new entries are made until the next session.']);
      if (s.flatOn) T.push(['Flatten time', 'In Playback across ' + s.flatTime + ': flat at that time, no entries after it.']);
      if (s.accounts === 'sim') T.push(['Account guard', 'Enable on a non-simulation account (if you have one connected): it must refuse to trade and show the warning.']);
      T.push(['Forward simulation', 'Run on a simulation account for at least 20 sessions before any live use. Past results do not guarantee future results.']);
    }
    T.push(['Regression', 'After any change, re-run the tests above on the new revision and keep its notes with the version.']);
    return T.map(function (t) { return { name: t[0], how: t[1] }; });
  }

  // ---------------------------------------------------------------- static checks on the generated source (structural, safety, API, IP)
  var FORBIDDEN = [[/System\.Net\b|WebClient|HttpClient|Socket/, 'network access'], [/System\.Diagnostics\.Process|Process\.Start/, 'starting processes'],
    [/System\.Reflection|Assembly\.Load|Activator\.CreateInstance/, 'reflection / loading code'], [/File\.(Write|Delete|Move|Copy)|Directory\.Delete|StreamWriter/, 'writing or deleting files'],
    [/Registry|DllImport|\bunsafe\b|Marshal\./, 'native or registry access']];
  var B4_PRIVATE = /B4Algo|B4Confirm(?!ationDirections\b)|B4IV2|B4IndicatorPro|B4Hosoda|B4Kazoe|B4Kyushu|B4Shoyu|B4CoPilotPro|B4SignalPro/;
  function staticChecks(code, sp) {
    var s = normalize(sp), R = [];
    function chk(name, pass, detail) { R.push({ name: name, pass: !!pass, detail: detail || '' }); }
    var bare = code.replace(/\/\/[^\n]*/g, '').replace(/@?"(?:[^"\\\n]|\\.)*"/g, '""');
    var bal = function (a, b) { return bare.split(a).length === bare.split(b).length; };
    chk('Balanced braces and brackets', bal('{', '}') && bal('(', ')') && bal('[', ']'));
    chk('Namespace and class', new RegExp('namespace NinjaTrader\\.NinjaScript\\.' + (s.kind === 's' ? 'Strategies' : 'Indicators') + '\\.B4Studio[\\s\\S]*public class ' + s.className + ' : ' + (s.kind === 's' ? 'Strategy' : 'Indicator')).test(code));
    chk('Warm-up guard before any signal', /if \(CurrentBar < .+\) return;/.test(code));
    var missing = []; (code.match(/public (?:int|double|bool|DateTime|string|Brush|Priority|TextPosition) (\w+) \{ get; set; \}/g) || []).forEach(function (m) {
      var n = m.split(' ')[2]; if (!new RegExp('\\b' + n + ' = ').test(code)) missing.push(n); });
    chk('Every setting has a default', missing.length === 0, missing.join(', '));
    var bad = FORBIDDEN.filter(function (f) { return f[0].test(bare); }).map(function (f) { return f[1]; });
    chk('No unsafe APIs (network, processes, files, reflection, native)', bad.length === 0, bad.join(', '));
    chk('No proprietary B4 code or names', !B4_PRIVATE.test(code));
    if (/Alert\(/.test(code)) chk('Alerts only in real time', /State == State\.Realtime/.test(code));
    if (s.kind === 'i') {
      chk('Places no orders', !/\b(Enter|Exit)(Long|Short)\w*\(|SubmitOrder/.test(bare));
      chk('B4 Signal API v1 contract intact', ['public bool B4UseEntrySignals', 'public bool B4UseConfirmations', 'public Series<bool> B4BuySignals', 'public Series<bool> B4SellSignals', 'public Series<int> B4ConfirmationDirections']
        .every(function (x) { return code.indexOf(x) >= 0; }) && (code.match(/\[NinjaScriptProperty\]/g) || []).length === 5, 'only the 5 API members may be [NinjaScriptProperty]');
    } else {
      chk('Bar-close calculation', /Calculate = Calculate\.OnBarClose;/.test(code));
      chk('Waits until flat before trading', /StartBehavior = StartBehavior\.WaitUntilFlat;/.test(code));
      chk('One position per direction', /EntriesPerDirection = 1;/.test(code));
      chk('Protective stop on every entry', s.stopMode === 'none' || /SetStopLoss\(signal, CalculationMode\.Ticks/.test(code), s.stopMode === 'none' ? 'no stop chosen (see review)' : '');
      chk('Daily risk limits wired', /RiskBreach\(sessionPnl\)/.test(code) && /DailyLossLimit/.test(code));
      if (s.accounts === 'sim') chk('Simulation-account guard', /accountBlocked = !IsSimulationAccount\(Account\)/.test(code) && /State == State\.Realtime && accountBlocked\) return;/.test(code));
    }
    return R;
  }

  // ---------------------------------------------------------------- public vs private requirements
  function publicRequirements(sp, code) {
    var s = normalize(sp), Q = [];
    function q(text, ok) { Q.push({ text: text, ok: !!ok }); }
    q('Author name for attribution', String(s.author || '').trim().length >= 2);
    q('Open-source license chosen (' + s.license + ')', !!s.license);
    q('All static checks pass', staticChecks(code || generate(s), s).every(function (c) { return c.pass; }));
    if (s.kind === 's') {
      q('Simulation and Playback accounts only', s.accounts === 'sim');
      q('Protective stop on every trade', s.stopMode !== 'none');
      q('Daily loss limit set', s.dailyLoss > 0);
      q('Daily entry limit set', s.maxTrades > 0);
      q('No high-risk review items', review(s).filter(function (r) { return r.level === 'high'; }).length === 0);
    }
    return Q;
  }

  var PRESETS = {
    i: [['Trend cross', { sig: 'ma_cross', maType: 'EMA', fast: 9, slow: 21, name: 'Trend Cross' }],
      ['RSI reversal', { sig: 'osc', osc: 'RSI', oscLen: 14, oscMode: 'exit', upper: 70, lower: 30, name: 'RSI Reversal' }],
      ['Bollinger breakout', { sig: 'band', band: 'Bollinger', bandMode: 'breakout', bandLen: 20, width: 2, name: 'Bollinger Breakout' }],
      ['20-bar breakout', { sig: 'nbar', nbarLen: 20, name: 'Range Breakout' }],
      ['MACD momentum', { sig: 'macd', macdMode: 'signal', name: 'MACD Momentum' }],
      ['Trend-filtered pullback', { sig: 'osc', osc: 'Stochastics', oscMode: 'exit', upper: 80, lower: 20, fTrend: true, fTrendLen: 200, name: 'Trend Pullback' }],
      ['Order flow: stacked imbalance footprint', { sig: 'of_imb', ofRatio: 3, ofStack: 3, ofMinVol: 10, fpShow: true, fpMode: 'bidask', table: true, name: 'Stacked Imbalance Footprint' }],
      ['Order flow: CVD trend', { sig: 'of_cvd', ofCvdLen: 20, ofCvdReset: true, table: true, name: 'CVD Trend' }],
      ['Order flow: value area breakout', { sig: 'of_va', ofVaPct: 70, ofVaMode: 'breakout', fpShow: true, fpMode: 'delta', name: 'Value Area Breakout' }],
      ['Order flow: big trade alerts', { sig: 'of_big', ofBig: 50, alerts: true, fpShow: true, fpMode: 'volume', name: 'Big Trade Alerts' }],
      ['Level 2: order book imbalance', { sig: 'l2_book', l2Levels: 10, l2Ratio: 2, table: true, name: 'Book Imbalance' }]],
    s: [['Trend follower', { sig: 'ma_cross', fast: 9, slow: 21, fTrend: true, fTrendLen: 200, stopMode: 'atr', stopAtr: 1.5, tgtMode: 'r', tgtR: 2, trailMode: 'atr', name: 'Trend Follower' }],
      ['Mean reversion', { sig: 'band', band: 'Bollinger', bandMode: 'reversal', fAdx: false, stopMode: 'swing', tgtMode: 'r', tgtR: 1.5, name: 'Band Reversion' }],
      ['Morning range breakout', { sig: 'nbar', nbarLen: 12, fSess: true, sessStart: '09:45', sessEnd: '11:30', stopMode: 'swing', tgtMode: 'r', tgtR: 2, beOn: true, name: 'Morning Breakout' }],
      ['MACD with trailing stop', { sig: 'macd', macdMode: 'signal', fAdx: true, fAdxMin: 20, stopMode: 'ticks', stopTicks: 16, tgtMode: 'none', trailMode: 'ticks', trailTicks: 14, name: 'MACD Trail' }],
      ['Order flow: imbalance with trend', { sig: 'of_imb', ofStack: 3, fTrend: true, fTrendLen: 50, stopMode: 'swing', tgtMode: 'r', tgtR: 2, table: true, name: 'Imbalance Trend' }],
      ['Order flow: value area fade', { sig: 'of_va', ofVaMode: 'reversal', stopMode: 'ticks', stopTicks: 12, tgtMode: 'r', tgtR: 1.5, fSess: true, sessStart: '09:45', sessEnd: '15:00', name: 'Value Area Fade' }],
      ['Order flow: delta flip with ADX', { sig: 'of_delta', ofDeltaMode: 'flip', fAdx: true, fAdxMin: 20, stopMode: 'atr', tgtMode: 'r', tgtR: 2, name: 'Delta Flip' }]]
  };

  var api = { VERSION: VERSION, FIELDS: FIELDS, GROUPS: GROUPS, OSC: OSC, PRESETS: PRESETS, defaults: defaults, normalize: normalize, visible: visible, suggest: suggest,
    specLines: specLines, review: review, generate: generate, references: references, unsupported: unsupported, confirmations: confirmations, testPlan: testPlan, staticChecks: staticChecks, publicRequirements: publicRequirements };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.B4Studio = api;
})(this);
