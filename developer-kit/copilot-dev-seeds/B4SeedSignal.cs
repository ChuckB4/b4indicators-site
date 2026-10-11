// B4 Seed: Signal tool (blank template for B4 CoPilot Dev)
// Copyright (c) 2026 TopTech Digital LLC. Free template. Educational and research use only. Not trading advice. Places no orders.
//
// YOUR ENTRY SIGNAL GOES HERE. B4 CoPilot Dev loads this indicator by its class name ("B4SeedSignal") and enters on its pulses:
//   B4BuySignals[0] = true  -> buy     B4SellSignals[0] = true -> sell     (true only on the bar the signal happened)
// Rename the class (and the file) to make your own tool, then type the new class name into B4 CoPilot Dev's "Signal tool" setting.
//
// RULE FOR TOOLS LOADED BY B4 CoPILOT DEV: your own settings are normal properties (no [NinjaScriptProperty]); only the five B4
// Signal API members below carry [NinjaScriptProperty]. The copy B4 CoPilot Dev loads uses the defaults set in State.SetDefaults,
// so change your values there.
#region Using declarations
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Windows.Media;
using System.Xml.Serialization;
using NinjaTrader.Gui;
using NinjaTrader.NinjaScript;
using NinjaTrader.NinjaScript.DrawingTools;
#endregion

namespace NinjaTrader.NinjaScript.Indicators.B4Seeds
{
    public class B4SeedSignal : Indicator
    {
        private SMA fast, slow;                      // EXAMPLE ONLY - replace with your own logic
        private Series<bool> b4BuySignal, b4SellSignal;
        private Series<int> b4ConfirmationDirection;

        protected override void OnStateChange()
        {
            if (State == State.SetDefaults)
            {
                Description = "B4 Seed: blank signal tool for B4 CoPilot Dev. Replace the example with your own entry logic.";
                Name = "B4 Seed - Signal";
                Calculate = Calculate.OnBarClose;
                IsOverlay = true;
                IsSuspendedWhileInactive = true;

                // ---- YOUR SETTINGS (normal properties; change the defaults here)
                FastPeriod = 10;
                SlowPeriod = 30;
                ShowArrows = true;

                B4UseEntrySignals = true;
                B4UseConfirmations = true;
            }
            else if (State == State.DataLoaded)
            {
                fast = SMA(Close, FastPeriod);       // EXAMPLE ONLY
                slow = SMA(Close, SlowPeriod);       // EXAMPLE ONLY
                b4BuySignal = new Series<bool>(this, MaximumBarsLookBack.Infinite);
                b4SellSignal = new Series<bool>(this, MaximumBarsLookBack.Infinite);
                b4ConfirmationDirection = new Series<int>(this, MaximumBarsLookBack.Infinite);
            }
        }

        protected override void OnBarUpdate()
        {
            b4BuySignal[0] = false;                  // pulse, then reset: never remove these three lines
            b4SellSignal[0] = false;
            b4ConfirmationDirection[0] = 0;
            if (CurrentBar < Math.Max(FastPeriod, SlowPeriod) + 1) return;

            // =================== YOUR ENTRY LOGIC (replace the example) ===================
            bool buy = CrossAbove(fast, slow, 1);
            bool sell = CrossBelow(fast, slow, 1);
            int direction = fast[0] > slow[0] ? 1 : fast[0] < slow[0] ? -1 : 0;
            // ===============================================================================

            if (B4UseEntrySignals) { b4BuySignal[0] = buy; b4SellSignal[0] = sell; }
            if (B4UseConfirmations) b4ConfirmationDirection[0] = direction;
            if (ShowArrows && buy) Draw.ArrowUp(this, "B4SeedBuy" + CurrentBar, false, 0, Low[0] - 2 * TickSize, Brushes.LimeGreen);
            if (ShowArrows && sell) Draw.ArrowDown(this, "B4SeedSell" + CurrentBar, false, 0, High[0] + 2 * TickSize, Brushes.Red);
        }

        #region Your settings (normal properties)
        [Range(1, int.MaxValue)][Display(Name = "Fast period", Order = 1, GroupName = "1. Your settings")]
        public int FastPeriod { get; set; }

        [Range(2, int.MaxValue)][Display(Name = "Slow period", Order = 2, GroupName = "1. Your settings")]
        public int SlowPeriod { get; set; }

        [Display(Name = "Show arrows", Order = 3, GroupName = "1. Your settings")]
        public bool ShowArrows { get; set; }
        #endregion

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
