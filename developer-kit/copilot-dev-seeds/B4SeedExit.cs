// B4 Seed: Exit tool (blank template for B4 CoPilot Dev)
// Copyright (c) 2026 TopTech Digital LLC. Free template. Educational and research use only. Not trading advice. Places no orders.
//
// YOUR EXIT RULE GOES HERE. B4 CoPilot Dev reads this tool's pulses as exits (it never opens a trade from it):
//   B4SellSignals[0] = true -> exit a long      B4BuySignals[0] = true -> exit a short
// Put the class name ("B4SeedExit") into B4 CoPilot Dev's "Exit tool" setting. The stop / target in ticks still apply.
// Same rule as every tool: your settings are normal properties; only the B4 Signal API members carry [NinjaScriptProperty].
#region Using declarations
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Xml.Serialization;
using NinjaTrader.NinjaScript;
#endregion

namespace NinjaTrader.NinjaScript.Indicators.B4Seeds
{
    public class B4SeedExit : Indicator
    {
        private RSI rsi;                             // EXAMPLE ONLY - replace with your own exit rule
        private Series<bool> b4BuySignal, b4SellSignal;
        private Series<int> b4ConfirmationDirection;

        protected override void OnStateChange()
        {
            if (State == State.SetDefaults)
            {
                Description = "B4 Seed: blank exit tool for B4 CoPilot Dev. Sell pulse exits longs, buy pulse exits shorts.";
                Name = "B4 Seed - Exit";
                Calculate = Calculate.OnBarClose;
                IsOverlay = false;
                IsSuspendedWhileInactive = true;
                RsiPeriod = 14;                      // YOUR SETTINGS: change the defaults here
                ExitLongAbove = 75;
                ExitShortBelow = 25;
                B4UseEntrySignals = true;
                B4UseConfirmations = true;
            }
            else if (State == State.DataLoaded)
            {
                rsi = RSI(Close, RsiPeriod, 3);      // EXAMPLE ONLY
                b4BuySignal = new Series<bool>(this, MaximumBarsLookBack.Infinite);
                b4SellSignal = new Series<bool>(this, MaximumBarsLookBack.Infinite);
                b4ConfirmationDirection = new Series<int>(this, MaximumBarsLookBack.Infinite);
            }
        }

        protected override void OnBarUpdate()
        {
            b4BuySignal[0] = false;
            b4SellSignal[0] = false;
            b4ConfirmationDirection[0] = 0;
            if (CurrentBar < RsiPeriod + 1) return;

            // =================== YOUR EXIT LOGIC (replace the example) ===================
            bool exitLong = CrossBelow(rsi, ExitLongAbove, 1);    // momentum fades from overbought
            bool exitShort = CrossAbove(rsi, ExitShortBelow, 1);  // momentum fades from oversold
            // ==============================================================================

            if (B4UseEntrySignals) { b4SellSignal[0] = exitLong; b4BuySignal[0] = exitShort; }
        }

        [Range(1, int.MaxValue)][Display(Name = "RSI period", Order = 1, GroupName = "1. Your settings")]
        public int RsiPeriod { get; set; }

        [Range(1, 100)][Display(Name = "Exit long when RSI falls below", Order = 2, GroupName = "1. Your settings")]
        public double ExitLongAbove { get; set; }

        [Range(0, 99)][Display(Name = "Exit short when RSI rises above", Order = 3, GroupName = "1. Your settings")]
        public double ExitShortBelow { get; set; }

        #region B4 Signal API v1 (public contract - keep names and attributes exactly)
        [NinjaScriptProperty][Display(Name = "B4 Entry Signals Enabled", Order = 41, GroupName = "B4 CoPilot Pro Integration")]
        public bool B4UseEntrySignals { get; set; }

        [NinjaScriptProperty][Display(Name = "B4 Confirmation Signals Enabled", Order = 42, GroupName = "B4 CoPilot Pro Integration")]
        public bool B4UseConfirmations { get; set; }

        [NinjaScriptProperty][Browsable(false)][XmlIgnore]
        public Series<bool> B4BuySignals { get { return b4BuySignal; } set { } }

        [NinjaScriptProperty][Browsable(false)][XmlIgnore]
        public Series<bool> B4SellSignals { get { return b4SellSignal; } set { } }

        [NinjaScriptProperty][Browsable(false)][XmlIgnore]
        public Series<int> B4ConfirmationDirections { get { return b4ConfirmationDirection; } set { } }
        #endregion
    }
}
