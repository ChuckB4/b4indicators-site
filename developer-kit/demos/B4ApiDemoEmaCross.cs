// B4 API Demo: EMA Cross  (free demo project, B4 Signal API v1)
// Copyright (c) 2026 TopTech Digital LLC. Released as free sample code for learning the B4 Signal API.
// Educational and research use only. Not trading advice. This indicator places no orders.
//
// What it does: a fast EMA crossing above a slow EMA publishes a buy signal; crossing below publishes a sell
// signal. The confirmation series reports the trend side: 1 while fast > slow, -1 while fast < slow.
// Every value that affects a signal is an adjustable setting.
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
    public class B4ApiDemoEmaCross : Indicator
    {
        private EMA fastEma;
        private EMA slowEma;

        // ---- B4 Signal API v1 backing series (created in State.DataLoaded, per NT8 Series<T> docs)
        private Series<bool> b4BuySignal;
        private Series<bool> b4SellSignal;
        private Series<int> b4ConfirmationDirection;

        protected override void OnStateChange()
        {
            if (State == State.SetDefaults)
            {
                Description = "B4 API demo: EMA cross that publishes B4 Signal API v1 entry and confirmation signals.";
                Name = "B4 API Demo - EMA Cross";
                Calculate = Calculate.OnBarClose;
                IsOverlay = true;
                DisplayInDataBox = true;
                DrawOnPricePanel = true;
                IsSuspendedWhileInactive = true;

                FastPeriod = 9;
                SlowPeriod = 21;
                ShowArrows = true;
                ArrowOffsetTicks = 2;
                B4UseEntrySignals = true;
                B4UseConfirmations = true;

                AddPlot(Brushes.DeepSkyBlue, "Fast EMA");
                AddPlot(Brushes.Goldenrod, "Slow EMA");
            }
            else if (State == State.DataLoaded)
            {
                fastEma = EMA(Close, FastPeriod);
                slowEma = EMA(Close, SlowPeriod);
                b4BuySignal = new Series<bool>(this, MaximumBarsLookBack.Infinite);
                b4SellSignal = new Series<bool>(this, MaximumBarsLookBack.Infinite);
                b4ConfirmationDirection = new Series<int>(this, MaximumBarsLookBack.Infinite);
            }
        }

        protected override void OnBarUpdate()
        {
            Values[0][0] = fastEma[0];
            Values[1][0] = slowEma[0];

            // B4 Signal API v1: signals are pulses on the bar that produced them; reset every bar.
            b4BuySignal[0] = false;
            b4SellSignal[0] = false;
            b4ConfirmationDirection[0] = 0;

            if (CurrentBar < Math.Max(FastPeriod, SlowPeriod) + 1)
                return;

            bool crossUp = CrossAbove(fastEma, slowEma, 1);
            bool crossDown = CrossBelow(fastEma, slowEma, 1);

            if (B4UseEntrySignals)
            {
                b4BuySignal[0] = crossUp;
                b4SellSignal[0] = crossDown;
            }
            if (B4UseConfirmations)
                b4ConfirmationDirection[0] = fastEma[0] > slowEma[0] ? 1 : fastEma[0] < slowEma[0] ? -1 : 0;

            if (ShowArrows && crossUp)
                Draw.ArrowUp(this, "B4DemoEmaUp" + CurrentBar, false, 0, Low[0] - ArrowOffsetTicks * TickSize, Brushes.LimeGreen);
            if (ShowArrows && crossDown)
                Draw.ArrowDown(this, "B4DemoEmaDn" + CurrentBar, false, 0, High[0] + ArrowOffsetTicks * TickSize, Brushes.Red);
        }

        #region Settings
        [NinjaScriptProperty]
        [Range(1, int.MaxValue)]
        [Display(Name = "Fast EMA period", Order = 1, GroupName = "1. Signal")]
        public int FastPeriod { get; set; }

        [NinjaScriptProperty]
        [Range(2, int.MaxValue)]
        [Display(Name = "Slow EMA period", Order = 2, GroupName = "1. Signal")]
        public int SlowPeriod { get; set; }

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
