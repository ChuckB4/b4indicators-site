// NT8 indicator template (B4 Developer Kit). Rename the class, Name and namespace folder, then fill in the marked parts.
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

namespace NinjaTrader.NinjaScript.Indicators.MyIndicators
{
    public class MyIndicator : Indicator
    {
        private EMA basis;                 // cached indicator (created in DataLoaded)
        private Series<double> work;       // custom series (created in DataLoaded)

        protected override void OnStateChange()
        {
            if (State == State.SetDefaults)
            {
                Name = "My Indicator";
                Description = "What it shows, in one sentence.";
                Calculate = Calculate.OnBarClose;
                IsOverlay = true;
                DisplayInDataBox = true;
                IsSuspendedWhileInactive = true;
                Period = 20;                               // every signal-affecting value is a setting
                AddPlot(Brushes.DodgerBlue, "Basis");
            }
            else if (State == State.Configure)
            {
                // AddDataSeries(...) only here, if needed
            }
            else if (State == State.DataLoaded)
            {
                basis = EMA(Close, Period);
                work = new Series<double>(this);
            }
            else if (State == State.Terminated)
            {
                // dispose anything you created (timers, files, SharpDX resources)
            }
        }

        protected override void OnBarUpdate()
        {
            if (BarsInProgress != 0) return;
            if (CurrentBar < Period) return;
            work[0] = Close[0] - basis[0];
            Value[0] = basis[0];
        }

        [NinjaScriptProperty]
        [Range(1, int.MaxValue)]
        [Display(Name = "Period", Order = 1, GroupName = "1. Signal")]
        public int Period { get; set; }
    }
}
