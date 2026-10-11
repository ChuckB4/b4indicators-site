// B4 Seed: Filter tool (blank template for B4 CoPilot Dev)
// Copyright (c) 2026 TopTech Digital LLC. Free template. Educational and research use only. Not trading advice. Places no orders.
//
// YOUR FILTER GOES HERE. A filter publishes only a direction through B4ConfirmationDirections:
//   1 = longs allowed    -1 = shorts allowed    0 = neutral
// In B4 CoPilot Dev put the class name ("B4SeedFilter") into "Filter tool 1/2/3" and pick the filter rule:
//   MustAgree     - enter only when every filter equals the signal direction
//   MustNotOppose - enter unless a filter points the other way (0 lets the trade through)
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
    public class B4SeedFilter : Indicator
    {
        private EMA trend;                           // EXAMPLE ONLY - replace with your own filter
        private Series<bool> b4BuySignal, b4SellSignal;
        private Series<int> b4ConfirmationDirection;

        protected override void OnStateChange()
        {
            if (State == State.SetDefaults)
            {
                Description = "B4 Seed: blank filter tool for B4 CoPilot Dev. Publishes a direction only.";
                Name = "B4 Seed - Filter";
                Calculate = Calculate.OnBarClose;
                IsOverlay = true;
                IsSuspendedWhileInactive = true;
                TrendPeriod = 100;                   // YOUR SETTINGS: change the defaults here
                B4UseEntrySignals = true;
                B4UseConfirmations = true;
            }
            else if (State == State.DataLoaded)
            {
                trend = EMA(Close, TrendPeriod);     // EXAMPLE ONLY
                b4BuySignal = new Series<bool>(this, MaximumBarsLookBack.Infinite);
                b4SellSignal = new Series<bool>(this, MaximumBarsLookBack.Infinite);
                b4ConfirmationDirection = new Series<int>(this, MaximumBarsLookBack.Infinite);
            }
        }

        protected override void OnBarUpdate()
        {
            b4BuySignal[0] = false;                  // a filter never publishes entry pulses
            b4SellSignal[0] = false;
            b4ConfirmationDirection[0] = 0;
            if (CurrentBar < TrendPeriod) return;

            // =================== YOUR FILTER LOGIC (replace the example) ===================
            int direction = Close[0] > trend[0] ? 1 : Close[0] < trend[0] ? -1 : 0;
            // ================================================================================

            if (B4UseConfirmations) b4ConfirmationDirection[0] = direction;
        }

        [Range(1, int.MaxValue)][Display(Name = "Trend period", Order = 1, GroupName = "1. Your settings")]
        public int TrendPeriod { get; set; }

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
