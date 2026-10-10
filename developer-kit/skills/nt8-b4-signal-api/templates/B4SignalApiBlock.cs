        // ===== B4 Signal API v1 (public contract - keep names, types and attributes exactly) =====
        // Backing series: declare as fields, create in State.DataLoaded:
        //   private Series<bool> b4BuySignal;  private Series<bool> b4SellSignal;  private Series<int> b4ConfirmationDirection;
        //   b4BuySignal = new Series<bool>(this, MaximumBarsLookBack.Infinite);   (same for the other two)
        // SetDefaults:  B4UseEntrySignals = true;  B4UseConfirmations = true;
        // OnBarUpdate:  reset to false / false / 0 first, then publish for the current bar [0].
        // Requires: using System.ComponentModel; using System.ComponentModel.DataAnnotations; using System.Xml.Serialization;

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
