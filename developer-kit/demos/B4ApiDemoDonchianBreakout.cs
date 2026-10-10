// B4 API Demo: Donchian Breakout  (free demo project, B4 Signal API v1)
// Copyright (c) 2026 TopTech Digital LLC. Released as free sample code for learning the B4 Signal API.
// Educational and research use only. Not trading advice. This indicator places no orders.
//
// What it does: a close above the highest high of the previous N bars publishes a buy signal; a close below the
// lowest low of the previous N bars publishes a sell signal. Confirmation holds the direction of the most recent
// breakout until the opposite breakout occurs. Every value that affects a signal is an adjustable setting.
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

namespace NinjaTrader.NinjaScript.Indicators.B4ApiDemos
{
    public class B4ApiDemoDonchianBreakout : Indicator
    {
        private MAX highest;
        private MIN lowest;
        private int lastBreakout;  // 1 after an up breakout, -1 after a down breakout, 0 before the first
        private Series<bool> b4BuySignal;
        private Series<bool> b4SellSignal;
        private Series<int> b4ConfirmationDirection;

        protected override void OnStateChange()
        {
            if (State == State.SetDefaults)
            {
                Description = "B4 API demo: Donchian channel breakout that publishes B4 Signal API v1 entry and confirmation signals.";
                Name = "B4 API Demo - Donchian Breakout";
                Calculate = Calculate.OnBarClose;
                IsOverlay = true;
                DisplayInDataBox = true;
                DrawOnPricePanel = true;
                IsSuspendedWhileInactive = true;

                ChannelPeriod = 20;
                ShowArrows = true;
                ArrowOffsetTicks = 2;
                B4UseEntrySignals = true;
                B4UseConfirmations = true;

                AddPlot(Brushes.SeaGreen, "Upper");
                AddPlot(Brushes.IndianRed, "Lower");
            }
            else if (State == State.DataLoaded)
            {
                highest = MAX(High, ChannelPeriod);
                lowest = MIN(Low, ChannelPeriod);
                lastBreakout = 0;
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

            if (CurrentBar < ChannelPeriod + 2)  // needs highest[2] / lowest[2] of a full channel
                return;

            double upper = highest[1];  // channel of the previous N bars, so the current bar can break it
            double lower = lowest[1];
            Values[0][0] = upper;
            Values[1][0] = lower;

            bool buy = Close[0] > upper && Close[1] <= highest[2];
            bool sell = Close[0] < lower && Close[1] >= lowest[2];
            if (buy) lastBreakout = 1;
            if (sell) lastBreakout = -1;

            if (B4UseEntrySignals)
            {
                b4BuySignal[0] = buy;
                b4SellSignal[0] = sell;
            }
            if (B4UseConfirmations)
                b4ConfirmationDirection[0] = lastBreakout;

            if (ShowArrows && buy)
                Draw.ArrowUp(this, "B4DemoDcUp" + CurrentBar, false, 0, Low[0] - ArrowOffsetTicks * TickSize, Brushes.LimeGreen);
            if (ShowArrows && sell)
                Draw.ArrowDown(this, "B4DemoDcDn" + CurrentBar, false, 0, High[0] + ArrowOffsetTicks * TickSize, Brushes.Red);
        }

        #region Settings
        [NinjaScriptProperty]
        [Range(2, int.MaxValue)]
        [Display(Name = "Channel period (bars)", Order = 1, GroupName = "1. Signal")]
        public int ChannelPeriod { get; set; }

        [Display(Name = "Show arrows", Order = 1, GroupName = "2. Display")]
        public bool ShowArrows { get; set; }

        [Range(0, 100)]
        [Display(Name = "Arrow offset (ticks)", Order = 2, GroupName = "2. Display")]
        public int ArrowOffsetTicks { get; set; }
        #endregion

        #region B4 Signal API v1 (public contract - keep names and attributes exactly)
        [NinjaScriptProperty]
        [Display(Name = "B4 Entry Signals Enabled", Order = 41, GroupName = "B4 CoPilot Pro Integration")]
        public bool B4UseEntrySignals { get; set; }

        [NinjaScriptProperty]
        [Display(Name = "B4 Confirmation Signals Enabled", Order = 42, GroupName = "B4 CoPilot Pro Integration")]
        public bool B4UseConfirmations { get; set; }

        [NinjaScriptProperty]
        [Browsable(false)]
        [XmlIgnore]
        public Series<bool> B4BuySignals { get { return b4BuySignal; } set { } }  // empty setter: NT8 generated code assigns [NinjaScriptProperty] members

        [NinjaScriptProperty]
        [Browsable(false)]
        [XmlIgnore]
        public Series<bool> B4SellSignals { get { return b4SellSignal; } set { } }

        [NinjaScriptProperty]
        [Browsable(false)]
        [XmlIgnore]
        public Series<int> B4ConfirmationDirections { get { return b4ConfirmationDirection; } set { } }
        #endregion
    }
}
