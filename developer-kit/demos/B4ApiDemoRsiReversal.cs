// B4 API Demo: RSI Reversal  (free demo project, B4 Signal API v1)
// Copyright (c) 2026 TopTech Digital LLC. Released as free sample code for learning the B4 Signal API.
// Educational and research use only. Not trading advice. This indicator places no orders.
//
// What it does: RSI crossing back above the oversold level publishes a buy signal; crossing back below the
// overbought level publishes a sell signal. Confirmation: 1 while RSI is above the midline, -1 while below.
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
    public class B4ApiDemoRsiReversal : Indicator
    {
        private RSI rsi;
        private Series<bool> b4BuySignal;
        private Series<bool> b4SellSignal;
        private Series<int> b4ConfirmationDirection;

        protected override void OnStateChange()
        {
            if (State == State.SetDefaults)
            {
                Description = "B4 API demo: RSI reversal that publishes B4 Signal API v1 entry and confirmation signals.";
                Name = "B4 API Demo - RSI Reversal";
                Calculate = Calculate.OnBarClose;
                IsOverlay = false;
                DisplayInDataBox = true;
                DrawOnPricePanel = true;
                IsSuspendedWhileInactive = true;

                RsiPeriod = 14;
                RsiSmooth = 3;
                Oversold = 30;
                Overbought = 70;
                Midline = 50;
                ShowArrows = true;
                ArrowOffsetTicks = 2;
                B4UseEntrySignals = true;
                B4UseConfirmations = true;

                AddPlot(Brushes.MediumPurple, "RSI");
                AddLine(Brushes.DimGray, 30, "Oversold");
                AddLine(Brushes.DimGray, 70, "Overbought");
            }
            else if (State == State.Configure)
            {
                Lines[0].Value = Oversold;
                Lines[1].Value = Overbought;
            }
            else if (State == State.DataLoaded)
            {
                rsi = RSI(Close, RsiPeriod, RsiSmooth);
                b4BuySignal = new Series<bool>(this, MaximumBarsLookBack.Infinite);
                b4SellSignal = new Series<bool>(this, MaximumBarsLookBack.Infinite);
                b4ConfirmationDirection = new Series<int>(this, MaximumBarsLookBack.Infinite);
            }
        }

        protected override void OnBarUpdate()
        {
            Value[0] = rsi[0];
            b4BuySignal[0] = false;
            b4SellSignal[0] = false;
            b4ConfirmationDirection[0] = 0;

            if (CurrentBar < RsiPeriod + 1)
                return;

            bool buy = CrossAbove(rsi, Oversold, 1);
            bool sell = CrossBelow(rsi, Overbought, 1);

            if (B4UseEntrySignals)
            {
                b4BuySignal[0] = buy;
                b4SellSignal[0] = sell;
            }
            if (B4UseConfirmations)
                b4ConfirmationDirection[0] = rsi[0] > Midline ? 1 : rsi[0] < Midline ? -1 : 0;

            if (ShowArrows && buy)
                Draw.ArrowUp(this, "B4DemoRsiUp" + CurrentBar, false, 0, Low[0] - ArrowOffsetTicks * TickSize, Brushes.LimeGreen, true);
            if (ShowArrows && sell)
                Draw.ArrowDown(this, "B4DemoRsiDn" + CurrentBar, false, 0, High[0] + ArrowOffsetTicks * TickSize, Brushes.Red, true);
        }

        #region Settings
        [NinjaScriptProperty]
        [Range(1, int.MaxValue)]
        [Display(Name = "RSI period", Order = 1, GroupName = "1. Signal")]
        public int RsiPeriod { get; set; }

        [NinjaScriptProperty]
        [Range(1, int.MaxValue)]
        [Display(Name = "RSI smoothing", Order = 2, GroupName = "1. Signal")]
        public int RsiSmooth { get; set; }

        [NinjaScriptProperty]
        [Range(0, 100)]
        [Display(Name = "Oversold level", Order = 3, GroupName = "1. Signal")]
        public double Oversold { get; set; }

        [NinjaScriptProperty]
        [Range(0, 100)]
        [Display(Name = "Overbought level", Order = 4, GroupName = "1. Signal")]
        public double Overbought { get; set; }

        [NinjaScriptProperty]
        [Range(0, 100)]
        [Display(Name = "Confirmation midline", Order = 5, GroupName = "1. Signal")]
        public double Midline { get; set; }

        [Display(Name = "Show arrows on price", Order = 1, GroupName = "2. Display")]
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
