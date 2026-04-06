const WEEKLY_INJECTIONS = {
      1: [
        {name:"Retatrutide",dose:"0.5–4mg",method:"SubQ",purpose:"Triple agonist GLP-1/GIP/Glucagon — appetite + systemic fat loss",color:C.rose,timeHour:8,timeLabel:"7:30 AM",note:"Standalone SubQ — inject after post-train blend"},
        {name:"TB-500",dose:"2–2.5mg",method:"SubQ",purpose:"Systemic tissue repair, anti-inflammatory, connective tissue recovery. Pairs with BPC-157 — BPC handles local/gut repair, TB-500 handles systemic.",color:C.teal,timeHour:8.1,timeLabel:"7:30 AM",note:"Standalone SubQ — separate syringe, do NOT blend with post-train blend"},
      ],
      3: [
        {name:"TB-500",dose:"2–2.5mg",method:"SubQ",purpose:"Mid-week systemic repair dose — maintains connective tissue anti-inflammatory effect between Monday and Friday injections.",color:C.teal,timeHour:8.1,timeLabel:"7:30 AM",note:"Standalone SubQ — separate syringe, do NOT blend with post-train blend"},
      ],
      5: [
        {name:"Retatrutide",dose:"0.5–4mg",method:"SubQ",purpose:"Second weekly dose — maintains triple agonist GLP-1/GIP/Glucagon activity through the weekend.",color:C.rose,timeHour:8,timeLabel:"7:30 AM",note:"Standalone SubQ — inject after post-train blend"},
      ],
      0: [], 2: [], 4: [], 6: [],
    };

    const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const DAY_NOTES = {
      0: {note:"REST + METABOLIC REFEED", sub:"2× carbs, 2 meals today (Trigili)", color:C.green},
      1: {note:"HEAVIEST DAY", sub:"Retatrutide + TB-500 — 5 total injections", color:C.rose},
      2: {note:"STANDARD PROTOCOL", sub:"No weekly injections today", color:C.muted},
      3: {note:"TB-500 DAY", sub:"Recovery injection + standard protocol", color:C.teal},
      4: {note:"STANDARD PROTOCOL", sub:"No weekly injections today", color:C.muted},
      5: {note:"RETATRUTIDE DAY", sub:"Second weekly GLP-1/GIP/Glucagon dose", color:C.violet},
      6: {note:"REST DAY", sub:"No gym — morning blend at 8 AM", color:C.green},
    };


    const BLENDS = [
      {id:"pre-train", time:"5:30 AM",label:"Pre-Train Blend",icon:"inject",color:C.green,
       items:[{text:"Mots-c — 5mg"},{text:"Selank — 100–200mcg"},{text:"L-Carnitine — 500mg–1g (standalone)"}],note:"Mots-c + Selank → one syringe. L-Carnitine standalone — DO NOT blend"},
      {id:"post-train-a", time:"7:30 AM",label:"Post-Train Blend A",icon:"sun",color:C.amber,
       items:[
         {text:"BPC-157 — 250–500mcg"},
         {text:"KPV — 500mcg–1mg"},
         {text:"GHK-Cu — 1–2mg"},
         {text:"5-Amino-1MQ — 50mg"},
       ],note:"These four are pH-compatible and stable together."},
      {id:"aod", time:"7:30 AM",label:"AOD-9604 (Standalone)",icon:"sun",color:C.amber,
       items:[
         {text:"AOD-9604 — 300mcg"},
       ],note:"Standalone — separate syringe. pH-sensitive, degrades in blends. Must remain fasted + glucose low."},
      {id:"weekly", time:"7:30 AM · Weekly",label:"Weekly Standalones",icon:"inject",color:C.rose,
       items:[
         {text:"Retatrutide — 0.5–1mg → 2–4mg", days:["Mon","Fri"], note:"Standalone — separate syringe"},
         {text:"TB-500 — 2–2.5mg", days:["Mon","Wed"], note:"Standalone — separate syringe"},
       ],note:"Each in its own syringe. Never blend Retatrutide or TB-500 with anything."},
      {id:"evening", time:"Evening",label:"Evening Blend",icon:"moon",color:C.violet,
       items:[{text:"Tesamorelin — 1–2mg"},{text:"Ipamorelin — 200–300mcg"},{text:"DSIP — 100–200mcg"}],note:"Tesamorelin + Ipamorelin + DSIP → one syringe. NAC + Astragalus oral."},
      {id:"pre-sleep", time:"Pre-Sleep",label:"Epithalon (cycle only)",icon:"sleep",color:"#8B7FE8",
       items:[{text:"Epithalon — 5–10mg"}],note:"Standalone — DO NOT blend with other compounds"},
    ];

    // Helper: get blend note by id for Today tab
    const blendNote = (id) => BLENDS.find(b=>b.id===id)?.note || "";

    const DAILY = [
      { time:"5:30 AM", label:"Pre-Training — Fasted", icon:"inject", color:C.green, timeHour:5,
        weekendTime:"8:00 AM", weekendHour:8, weekendLabel:"Morning Blend — Fasted",
        blend:blendNote("pre-train"),
        items:[
          {name:"Mots-c",dose:"5mg",method:"SubQ/IM",purpose:"AMPK activation — mitochondrial efficiency, primes fat oxidation",t:false,cycle:{type:"daily"}},
          {name:"Selank",dose:"100–200mcg",method:"SubQ",purpose:"Cortisol modulation — BDNF support, reduces training stress",t:false,cycle:{type:"weekdays",note:"5 on / 2 off — tolerance prevention"}},
          {name:"L-Carnitine",dose:"500mg–1g",method:"SubQ/IM",purpose:"Shuttles mobilized fatty acids into mitochondria — maximizes fat oxidation during fasted training",t:false,cycle:{type:"daily"}},
          {name:"Alpha-GPC",dose:"300–600mg",method:"Oral",purpose:"Choline precursor — acetylcholine for mind-muscle connection + minor GH pulse stimulus. Synergizes with Selank for cognitive sharpness during fasted training",t:false,cycle:{type:"daily"}},
        ]},
      { time:"6:00 AM", label:"Training — Fasted", icon:"train", color:C.amber, timeHour:6, blend:null,
        weekendSkip:false, weekendTime:"8:30 AM", weekendHour:8.5, weekendLabel:"Electrolytes — Fasted",
        items:[
          {name:"Electrolyte Cocktail",dose:"5g Na / 1g K / 500mg Mg per L",method:"Drink",purpose:"These peptides act as diuretics — if you're flat and weak it's a mineral deficiency, not a calorie deficiency",t:true,cycle:{type:"daily"}},
        ]},
      { time:"7:30 AM", label:"Post-Training — Before Coffee", icon:"sun", color:C.amber, timeHour:8,
        weekendTime:"9:00 AM", weekendHour:9, weekendLabel:"Post-Blend — Still Fasted",
        blend:"Blend A: BPC-157 + KPV + GHK-Cu + 5-Amino-1MQ → one syringe. AOD-9604 → separate syringe (pH-sensitive, keep fasted). NAC + Astragalus oral.",
        items:[
          {name:"AOD-9604",dose:"300mcg",method:"SubQ",purpose:"Direct lipolysis — maximized fasted, before coffee insulin spike",t:false,cycle:{type:"daily"}},
          {name:"BPC-157",dose:"250–500mcg",method:"SubQ",purpose:"Gut integrity, tissue repair, GH receptor interaction",t:false,cycle:{type:"weeks",on:6,off:3,note:"6 wks on / 3 wks off"}},
          {name:"KPV",dose:"500mcg–1mg",method:"SubQ",purpose:"NF-kB inhibitor — gut lining protection, GI support on Retatrutide",t:false,cycle:{type:"weeks",on:10,off:4,note:"10 wks on / 4 wks off"}},
          {name:"GHK-Cu",dose:"1–2mg",method:"SubQ",purpose:"Copper peptide — collagen remodeling, tissue repair, anti-inflammatory, skin and connective tissue regeneration",t:false,cycle:{type:"weeks",on:6,off:4,note:"6 wks on / 4 wks off"}},
          {name:"5-Amino-1MQ",dose:"50mg",method:"SubQ",purpose:"NNMT inhibitor — NAD+ preservation, reduces fat cell size",t:false,cycle:{type:"weekdays",note:"5 on / 2 off — standard NNMT protocol"}},
          {name:"NAC",dose:"500mg",method:"Oral",purpose:"Glutathione precursor — liver protection, visceral fat senescence",t:true,cycle:{type:"daily"}},
          {name:"Astragalus",dose:"1500mg",method:"Oral",purpose:"Kidney protection, immune support, telomerase activation",t:true,cycle:{type:"daily"}},
        ]},
      { time:"9:00–10:00 AM", label:"First Coffee", icon:"coffee", color:C.amber, timeHour:9, blend:null,
        weekendTime:"10:00 AM", weekendHour:10,
        items:[
          {name:"Vitamin D3 + K2",dose:"10,000 IU",method:"With coffee",purpose:"Maintains testosterone production during a caloric deficit — fat-soluble, take with any fat source",t:false,cycle:{type:"daily"}},
        ]},
      { time:"Meal 1", label:"Break Fast (Protein + Fiber)", icon:"meal", color:C.teal, timeHour:12, blend:null,
        items:[
          {name:"TUDCA",dose:"250–500mg",method:"With meal",purpose:"Essential for bile flow — prevents liver sluggishness during rapid fat loss",t:true,cycle:{type:"daily"}},
          {name:"Omega-3 (High EPA)",dose:"2g EPA/DHA",method:"With meal",purpose:"Lowers systemic inflammation — prevents cortisol belly",t:true,cycle:{type:"daily"}},
          {name:"P-5-P (Active B6)",dose:"50–100mg",method:"With meal",purpose:"Keeps prolactin in check — high prolactin causes water retention and a soft look",t:true,cycle:{type:"daily"}},
          {name:"Methylfolate (5-MTHF)",dose:"400–800mcg",method:"With meal",purpose:"Active folate — methylation cycle, homocysteine clearance, neurotransmitter synthesis. Stacks with P-5-P as co-methylation factors",t:false,cycle:{type:"daily"}},
          {name:"Digestive Enzymes",dose:"2 caps",method:"With meal",purpose:"Prevents food sitting too long in the gut — stops sulfur burps from Retatrutide GI load",t:false,cycle:{type:"daily"}},
        ]},
      { time:"Meal 2", label:"Dinner (Carbs + Protein)", icon:"meal", color:C.teal, timeHour:17, blend:null,
        items:[
          {name:"Dihydroberberine",dose:"200mg",method:"With meal",purpose:"Potent GDA — forces glucose into muscle not fat, counters GH-driven insulin resistance",t:true,cycle:{type:"daily"}},
          {name:"Omega-3 (High EPA)",dose:"2g EPA/DHA",method:"With meal",purpose:"Second dose — split across meals for better absorption and sustained anti-inflammatory effect",t:true,cycle:{type:"daily"}},
          {name:"Digestive Enzymes",dose:"2 caps",method:"With meal",purpose:"Prevents food sitting too long in the gut — stops sulfur burps from Retatrutide GI load",t:false,cycle:{type:"daily"}},
        ]},
      { time:"2–3 hrs After Dinner", label:"Evening Blend", icon:"moon", color:C.violet, timeHour:20,
        blend:blendNote("evening"),
        items:[
          {name:"Tesamorelin",dose:"1–2mg",method:"SubQ",purpose:"GHRH analog — clinically validated visceral fat, nocturnal GH pulse",t:false,cycle:{type:"daily"}},
          {name:"Ipamorelin",dose:"200–300mcg",method:"SubQ",purpose:"GHRP — initiates GH pulse without cortisol or prolactin spike",t:false,cycle:{type:"weekdays",note:"5 on / 2 off — preserves pulsatile GH response"}},
          {name:"DSIP",dose:"100–200mcg",method:"SubQ",purpose:"Delta sleep inducing peptide — increases slow wave sleep depth",t:false,cycle:{type:"weeks",on:3,off:1,note:"3 wks on / 1 wk off — prevents efficacy drop"}},
          {name:"NAC",dose:"500mg",method:"Oral",purpose:"Second daily dose — evening glutathione, liver antioxidant",t:true,cycle:{type:"daily"}},
          {name:"Astragalus",dose:"1500mg",method:"Oral",purpose:"Second daily dose — kidney protection, telomere support",t:true,cycle:{type:"daily"}},
        ]},
      { time:"30–60 Min Before Bed", label:"Pre-Sleep", icon:"sleep", color:"#8B7FE8", timeHour:22,
        blend:blendNote("pre-sleep"),
        items:[
          {name:"Epithalon",dose:"5–10mg",method:"SubQ",purpose:"Pineal restoration, telomere support",t:false,cycle:{type:"fixed",onDays:10,offDays:80,note:"10 days on → 80 days off"}},
          {name:"Myo-Inositol",dose:"2–4g",method:"Oral",purpose:"Insulin sensitizer + cortisol modulator — overnight glucose homeostasis, blunts morning cortisol spike. Synergizes with Dihydroberberine for glucose partitioning",t:false,cycle:{type:"daily"}},
          {name:"Magnesium Citrate",dose:"400–600mg",method:"Oral",purpose:"Prevents peptide-induced constipation and maintains bowel motility. Better absorbed than Glycinate for gut purposes",t:false,cycle:{type:"daily"}},
          {name:"Apigenin",dose:"50mg",method:"Oral",purpose:"Mild anxiolytic, CD38 inhibitor — preserves NAD+ alongside 5-Amino-1MQ",t:false,cycle:{type:"daily"}},
          {name:"Melatonin",dose:"0.5–1mg",method:"Oral",purpose:"Low dose only — higher doses fragment sleep and blunt the nocturnal GH pulse",t:false,cycle:{type:"daily"}},
        ]},
    ];
    const SUPPLIES = [
      {item:"Luer Lock Syringe",spec:"1ml barrel",use:"Primary syringe — screw-on needle allows safe swapping between vials"},
      {item:"Draw Needle",spec:"21g × 1\"",use:"Drawing from vials only — swap before injecting to stay sharp"},
      {item:"Injection Needle",spec:"29–30g × 0.5\"",use:"Fresh needle every injection — clean, painless SubQ"},
      {item:"Alcohol Swabs",spec:"Sterile",use:"Wipe vial tops before every draw; injection site before/after"},
      {item:"Sharps Container",spec:"1–2 quart",use:"Dispose all needles safely — never recap used needles"},
      {item:"Bacteriostatic Water",spec:"Sterile BacWater",use:"Reconstituting all lyophilized (freeze-dried) peptide vials"},
      {item:"Insulin Syringes",spec:"0.5ml / 28–31g",use:"Optional for single-peptide or very low-volume doses"},
    ];

    const SUPPS = [
      {name:"Electrolytes",dose:"5g Na / 1g K / 500mg Mg",timing:"Daily — especially training days",cat:"Performance",t:true,
       purpose:"These peptides act as diuretics. If you're flat and weak, it's a mineral deficiency — not a calorie deficiency."},
      {name:"NAC",dose:"600mg–1200mg",timing:"AM + Evening",cat:"Antioxidant",t:true,
       purpose:"Precursor to Glutathione — protects cells from oxidative stress during aggressive fat mobilization."},
      {name:"Astragalus",dose:"3000mg–4000mg",timing:"AM + Evening",cat:"Kidney Shield",t:true,
       purpose:"Specifically maintains GFR (kidney filtration rate) when consuming high protein and running multiple peptides."},
      {name:"TUDCA",dose:"250mg–500mg",timing:"Meal 1",cat:"Liver Shield",t:true,
       purpose:"Essential for bile flow and preventing liver sluggishness during rapid fat loss."},
      {name:"Omega-3 (High EPA)",dose:"4g daily",timing:"Meals 1 + 2",cat:"Anti-Inflam",t:true,
       purpose:"Lowers systemic inflammation to prevent cortisol belly."},
      {name:"P-5-P (Active B6)",dose:"50mg–100mg",timing:"Meal 1",cat:"Hormones",t:true,
       purpose:"Keeps Prolactin in check. High prolactin causes water retention and a soft look."},
      {name:"Vitamin D3 + K2",dose:"10,000 IU D3",timing:"With fat-containing meal",cat:"Hormonal",t:false,
       purpose:"Maintains testosterone production during a caloric deficit."},
      {name:"Digestive Enzymes",dose:"Protease-heavy formula",timing:"With every meal",cat:"Gut Health",t:false,
       purpose:"Prevents food from sitting too long in the gut — stops sulfur burps caused by Retatrutide GI load."},
      {name:"Magnesium Citrate",dose:"400mg–600mg",timing:"Pre-sleep",cat:"Sleep / Gut",t:false,
       purpose:"Prevents peptide-induced constipation and maintains bowel motility. Better absorbed than Glycinate for this purpose."},
      {name:"Dihydroberberine",dose:"200mg",timing:"Meal 2",cat:"Metabolic",t:true,
       purpose:"Potent GDA — forces glucose into muscle not fat, directly countering GH-driven insulin resistance."},
      {name:"Apigenin",dose:"50mg",timing:"Pre-sleep",cat:"Sleep/NAD+",t:false,
       purpose:"Mild anxiolytic, CD38 inhibitor — preserves NAD+ alongside 5-Amino-1MQ."},
      {name:"Melatonin",dose:"0.5–1mg",timing:"90min pre-sleep",cat:"Sleep onset",t:false,
       purpose:"Low dose only — higher doses fragment sleep and blunt the Tesamorelin + Ipamorelin GH pulse."},
      {name:"Alpha-GPC",dose:"300–600mg",timing:"Pre-Train (5:30 AM)",cat:"Cognitive",t:false,
       purpose:"Choline precursor — raises acetylcholine for mind-muscle connection and cognitive sharpness during fasted training. Also stimulates a minor GH pulse, synergizing with the morning injection window."},
      {name:"Methylfolate (5-MTHF)",dose:"400–800mcg",timing:"Meal 1",cat:"Methylation",t:false,
       purpose:"Active folate — supports the methylation cycle, clears homocysteine, and drives neurotransmitter synthesis. Co-factor alongside P-5-P at Meal 1."},
      {name:"Myo-Inositol",dose:"2–4g",timing:"Pre-Sleep",cat:"Metabolic",t:false,
       purpose:"Insulin sensitizer and cortisol modulator — supports overnight glucose homeostasis and blunts the morning cortisol spike. Synergizes with Dihydroberberine for glucose partitioning into muscle."},
    ];

    const PHASES = [
      {phase:"Phase 1",dur:"Weeks 1–4",color:C.amber,bg:"rgba(245,166,35,0.08)",focus:"Titrate Retatrutide from 0.5mg. Establish baseline bloodwork. Add supplements gradually. Assess full stack tolerance."},
      {phase:"Phase 2",dur:"Weeks 5–12",color:C.cyan,bg:"rgba(0,198,255,0.08)",focus:"Full protocol + all supplements running. Primary visceral fat loss phase. Target Retatrutide 2mg by end of phase."},
      {phase:"Phase 3",dur:"Weeks 13–20",color:C.violet,bg:"rgba(123,97,255,0.08)",focus:"Shift to body recomp. Target Retatrutide 2–4mg. Adjust based on DEXA scan at week 12."},
      {phase:"Assessment",dur:"Week 20",color:C.green,bg:"rgba(0,200,150,0.08)",focus:"DEXA scan + full bloodwork. Evaluate all markers. Trigger exit strategy if at target body fat %."},
    ];

    const BLOODWORK = [
      {marker:"IGF-1",freq:"Every 6–8 wks",target:"Age-appropriate",flag:"Elevated",t:false},
      {marker:"Fasting Insulin",freq:"Every 6–8 wks",target:"< 6.0 uIU/mL",flag:"> 10 uIU/mL",t:true},
      {marker:"Fasting Glucose / HbA1c",freq:"Every 6–8 wks",target:"Normal range",flag:"Trending up",t:false},
      {marker:"hs-CRP",freq:"Every 8 wks",target:"< 1.0 mg/L",flag:"> 2.0 mg/L",t:true},
      {marker:"ALT / AST",freq:"Every 8 wks",target:"< 30 U/L",flag:"> 50 U/L",t:true},
      {marker:"Free T3",freq:"Every 8 wks",target:"3.5–4.2 pg/mL",flag:"< 3.0 pg/mL",t:true},
      {marker:"Cortisol (AM)",freq:"Every 8 wks",target:"Normal AM range",flag:"Elevated",t:false},
      {marker:"Testosterone / Estradiol",freq:"Per TRT protocol",target:"TRT optimized",flag:"E2 out of range",t:false},
      {marker:"DEXA / InBody",freq:"Every 8–12 wks",target:"Fat↓ LBM stable",flag:"LBM loss",t:false},
      {marker:"Resting Heart Rate",freq:"Daily self-monitor",target:"Baseline",flag:"+15 BPM from base",t:true},
      {marker:"CMP (Metabolic Panel)",freq:"Every 8 wks",target:"All normal",flag:"Kidney markers↑",t:false},
    ];

    const SYNERGY = [
      {layer:"Hormonal Foundation",combo:"TRT",role:"Anabolic anchor; prevents muscle loss as aggressive fat mobilization strips bodyweight. Everything else runs on top of this.",color:C.cyan},
      {layer:"GH Axis",combo:"Tesamorelin + Ipamorelin",role:"Tesamorelin — GHRH analog; FDA-validated specifically for visceral fat elimination. Ipamorelin — clean GHRP; fires the nocturnal GH pulse without raising cortisol or prolactin.",color:C.violet},
      {layer:"Fat Loss",combo:"AOD-9604",role:"C-terminal GH fragment; triggers direct lipolysis without IGF-1 elevation or blood sugar impact. Fasted window only.",color:C.amber},
      {layer:"Tissue & Recovery",combo:"GHK-Cu",role:"Copper tripeptide; activates collagen synthesis, remodels connective tissue, and drives systemic repair signaling. Synergizes with BPC-157 and KPV in the post-train blend — all three hit the repair window simultaneously. Also documented to upregulate antioxidant enzymes, reducing oxidative load during aggressive fat mobilization.",color:C.teal},
      {layer:"Fat Loss",combo:"Retatrutide",role:"Triple agonist GLP-1/GIP/Glucagon; drives BMR up, kills food noise, and mobilizes fat from liver and adipose simultaneously.",color:C.rose},
      {layer:"Fat Loss",combo:"Mots-c + 5-Amino-1MQ",role:"Mots-c — mitochondrial peptide; activates AMPK and forces metabolic flexibility. 5-Amino-1MQ — NNMT inhibitor; preserves NAD+ in fat cells and shrinks adipocytes.",color:C.green},
      {layer:"Fat Loss",combo:"L-Carnitine",role:"Fatty acid transporter; shuttles mobilized free fatty acids across the mitochondrial membrane so they're actually burned, not re-esterified. Without it, AOD and the GH axis mobilize fat into circulation that never gets oxidized. Injectable pre-training maximizes muscle uptake and hardness.",color:C.teal},
      {layer:"Recovery",combo:"BPC-157 + TB-500",role:"BPC-157 — gut and tissue repair; interacts with GH receptors directly. TB-500 — systemic anti-inflammatory; rebuilds connective tissue and keeps training frequency sustainable.",color:C.teal},
      {layer:"Recovery",combo:"KPV",role:"NF-kB inhibitor; blocks gut inflammation at the source. The daily buffer that lets Retatrutide reach therapeutic dose without forcing a GI-driven taper.",color:C.teal},
      {layer:"Sleep & CNS",combo:"Epithalon + DSIP + Selank",role:"Epithalon — restores pineal function; telomere support on a 10-day cycle. DSIP — deepens slow-wave sleep; the exact phase Tesamorelin fires in. Selank — cortisol modulator; stops fasted training from blunting the morning stack.",color:"#8B7FE8"},
      {layer:"Organ Protection",combo:"NAC + TUDCA",role:"NAC — glutathione precursor; neutralizes oxidative stress as visceral fat breaks down. TUDCA — bile acid; keeps ALT/AST in range on TRT + peptides long-term.",color:C.rose},
      {layer:"Organ Protection",combo:"Astragalus + P-5-P",role:"Astragalus — renal protection + telomerase activation; synergizes with Epithalon. P-5-P — active B6; controls prolactin on TRT without a pharmaceutical dopamine agonist.",color:C.green},
      {layer:"Organ Protection",combo:"Omega-3 + Dihydroberberine",role:"Omega-3 — keeps hs-CRP in range as fat mobilizes. Dihydroberberine — potent GDA; forces glucose into muscle not fat, directly countering GH-driven insulin resistance.",color:C.amber},
      {layer:"Organ Protection",combo:"Electrolytes",role:"Sodium + potassium before fasted training; prevents the HPA cortisol spike that would suppress fat oxidation and blunt every other compound in the morning blend.",color:C.cyan},
      // ─── Supplement Synergies ───────────────────────────────────────────────
      {layer:"Supplement Synergy",combo:"Dihydroberberine × GH Axis",role:"GH drives insulin resistance as a side effect. Dihydroberberine directly counters this — it partitions glucose into muscle glycogen at the exact moment the Tesamorelin + Ipamorelin pulse is driving anabolism. Without it, the carbs from your refeeds go to fat.",color:C.amber,supp:true},
      {layer:"Supplement Synergy",combo:"NAC × Rapid Fat Loss",role:"As visceral fat breaks down at accelerated rates on this stack, oxidative stress rises in direct proportion. NAC replenishes glutathione in real time — it's the cleanup crew for the metabolic debris the peptides generate. Twice daily because one dose doesn't last.",color:C.rose,supp:true},
      {layer:"Supplement Synergy",combo:"TUDCA × TRT + Peptides",role:"Running TRT plus multiple peptides long-term is a sustained liver load. TUDCA is the specific bile acid that prevents cholestasis and keeps ALT/AST markers clean. Think of it as the liver's dedicated maintenance dose — not optional on a 20-week cycle.",color:C.teal,supp:true},
      {layer:"Supplement Synergy",combo:"Omega-3 × Retatrutide",role:"Retatrutide aggressively mobilizes visceral fat, which releases stored inflammatory compounds as it breaks down. Omega-3 at 4g/day suppresses the resulting hs-CRP surge and prevents that inflammation from manifesting as cortisol belly — which would directly oppose the fat loss.",color:C.cyan,supp:true},
      {layer:"Supplement Synergy",combo:"Magnesium × DSIP + Sleep Stack",role:"DSIP deepens slow-wave sleep, but slow-wave depth is physically gated by magnesium availability. Low magnesium = shallow sleep regardless of DSIP dose. Magnesium Citrate pre-sleep ensures DSIP has the substrate it needs to actually work. Also prevents the constipation that Retatrutide causes.",color:"#8B7FE8",supp:true},
      {layer:"Supplement Synergy",combo:"P-5-P × Retatrutide GI Load",role:"Retatrutide slows gastric motility, which raises prolactin as a stress response. Elevated prolactin causes water retention and a soft, flat look — the opposite of what you want mid-cycle. P-5-P (active B6) is a natural dopamine agonist that keeps prolactin suppressed without pharmaceutical intervention.",color:C.violet,supp:true},
      {layer:"Supplement Synergy",combo:"Astragalus × High Protein + Peptides",role:"Running 1.5g protein per pound of bodyweight through the kidneys while simultaneously running multiple peptides is a significant GFR load. Astragalus specifically maintains kidney filtration rate under high protein conditions — it's the renal protection layer that most people skip and then wonder why their creatinine creeps up.",color:C.green,supp:true},
      {layer:"Supplement Synergy",combo:"Apigenin × 5-Amino-1MQ (NAD+ Stack)",role:"5-Amino-1MQ inhibits NNMT to preserve NAD+ in fat cells. Apigenin inhibits CD38, which is the primary enzyme that degrades NAD+ systemically. Together they hit NAD+ from both ends — preserving it at the cellular level and preventing its breakdown. The result is higher available NAD+ for the mitochondria that Mots-c is simultaneously activating.",color:C.green,supp:true},
      {layer:"Supplement Synergy",combo:"Digestive Enzymes × Retatrutide GI",role:"Retatrutide slows gastric emptying as part of its mechanism. Without support, protein-dense meals sit in the gut too long and ferment — producing the sulfur burps that signal GI distress. Protease-heavy digestive enzymes break down protein before it reaches that stage and keep GI symptoms manageable through dose escalation.",color:C.amber,supp:true},
      {layer:"Supplement Synergy",combo:"Vitamin D3 + K2 × TRT",role:"A caloric deficit suppresses testosterone production through a well-documented pathway. D3 at 10,000 IU directly supports the enzymatic steps in testosterone synthesis, acting as a co-factor. K2 directs the calcium D3 mobilizes into bone rather than arteries. Together they protect hormonal output during aggressive fat loss.",color:C.violet,supp:true},
      {layer:"Supplement Synergy",combo:"Alpha-GPC × Pre-Train Window",role:"Alpha-GPC raises acetylcholine at the exact moment Selank is supporting BDNF and Mots-c is priming AMPK. The result is sharper neuromuscular recruitment during fasted training — better mind-muscle connection when blood glucose is low and the brain is running on ketones. Alpha-GPC also independently stimulates a minor GH pulse, adding a small anabolic signal on top of the morning peptide stack.",color:C.cyan,supp:true},
      {layer:"Supplement Synergy",combo:"Methylfolate (5-MTHF) × P-5-P Methylation Stack",role:"P-5-P and 5-MTHF are co-factors in the same methylation pathway — P-5-P converts homocysteine to cystathionine, 5-MTHF drives the remethylation back to methionine. Running both at Meal 1 completes the methylation cycle at both ends. This matters on TRT because exogenous testosterone elevates homocysteine; clearing it protects cardiovascular markers and keeps SHBG in range.",color:C.green,supp:true},
      {layer:"Supplement Synergy",combo:"Myo-Inositol × Dihydroberberine (Glucose Partitioning Stack)",role:"Dihydroberberine at Meal 3 forces glucose into muscle glycogen via GLUT4 upregulation. Myo-Inositol pre-sleep sustains insulin sensitization overnight via a separate IP3 signaling pathway. Together they cover glucose partitioning across the full evening-to-morning window — critical when running Tesamorelin + Ipamorelin, which drive mild insulin resistance as a side effect of elevating GH.",color:C.amber,supp:true},
    ];

    const EXIT_PROBLEM = {
      title:"The Post-Peptide Rebound",
      body:"Trigili identifies this as the primary failure point after a successful cycle. When peptides are removed, Ghrelin (hunger hormone) returns aggressively while the metabolism is still adjusting downward. Most people mistake this hunger surge as normal and eat back the deficit — undoing weeks of work in days. The exit strategy below is specifically designed to prevent this.",
    };

    const EXIT = [
      {step:"Trigger",icon:"🎯",detail:"At target body fat % — confirmed by DEXA",action:"Do not taper early. Complete the full recomp phase first. Run a DEXA scan to confirm you've actually hit target — visual assessment alone isn't sufficient.",color:"#7B61FF"},
      {step:"The Taper",icon:"📉",detail:"Weeks 1–4 post-cycle · Reduce Retatrutide 50% every 2 weeks",action:"Never stop cold turkey. Drop dose by half every 14 days — e.g. 4mg → 2mg → 1mg → off. This gives the brain's satiety signaling time to recalibrate and prevents the Ghrelin rebound from hitting full force at once.",color:C.rose},
      {step:"Metabolic Hand-Off",icon:"🏃",detail:"Add Zone 2 cardio as peptides decrease",action:"For every dose reduction step, add 15 minutes of Zone 2 cardio. As Retatrutide's metabolic rate elevation decreases, cardio manually fills that gap and keeps TDEE elevated through the transition.",color:C.amber},
      {step:"The Protein Lock",icon:"🥩",detail:"1.5g protein per lb of bodyweight through the transition",action:"High protein keeps PYY and natural GLP-1 (satiety hormones) as elevated as possible without the peptide. It also provides the substrate needed to hold lean mass as the anabolic signaling from the GH axis winds down.",color:C.green},
      {step:"Post-Cycle GDA Bridge",icon:"💊",detail:"Continue Dihydroberberine for 4 weeks after last peptide dose",action:"Rebound calories are inevitable as appetite returns. Dihydroberberine ensures those calories are partitioned into muscle glycogen rather than fat cells. This is the difference between a clean transition and a fat rebound.",color:C.cyan},
      {step:"What to Keep Running",icon:"✅",detail:"Permanent maintenance stack post-cycle",action:"TRT continues indefinitely. Tesamorelin + Ipamorelin can run long-term for maintenance GH support. NAC, TUDCA, Omega-3, and Astragalus stay on as baseline organ protection. These are not cycle compounds — they're your foundation.",color:C.teal},
    ];

    

    const TABS = [
      {id:"daily",    label:"Today",       icon:"today"},
      {id:"blending", label:"Blending",    icon:"blending"},
      {id:"timeline",  label:"Timeline",    icon:"cycle"},
      {id:"synergy",  label:"Stack",       icon:"stack"},
      {id:"exit",     label:"Taper Off",   icon:"exit"},
      {id:"orders",   label:"Inventory",   icon:"inventory"},
      {id:"tools",    label:"Calculator",  icon:"calculator"},
      {id:"diet",     label:"Diet",        icon:"meal"},
      {id:"settings", label:"Settings",    icon:"settings"},
    ];

    const BACKUP_KEYS = [
      "protocolStartDate","readiness","lastHealthSync",
      "orderStatuses","orderSources","suppStatuses","shopStatuses","installDismissed","invRemaining","savedDoses",
    ];

    function collectAllData() {
      const data = { version: 2, exportedAt: new Date().toISOString(), keys: {} };
      // Fixed keys
      BACKUP_KEYS.forEach(k => {
        const v = localStorage.getItem(k);
        if (v !== null) data.keys[k] = v;
      });
      // Daily checklist keys (chk-YYYY-MM-DD) — last 90 days
      for (let i = 0; i < 90; i++) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const k = `chk-${d.toISOString().split("T")[0]}`;
        const v = localStorage.getItem(k);
        if (v !== null) data.keys[k] = v;
      }
      return data;
    }

    function restoreAllData(data) {
      if (!data || !data.keys) throw new Error("Invalid backup file");
      Object.entries(data.keys).forEach(([k, v]) => {
        try { localStorage.setItem(k, v); } catch {}
      });
    }

    function getBackupHistory() {
      return LS.get("backupHistory", []);
    }

    function recordBackup() {
      const history = getBackupHistory();
      history.unshift({ at: new Date().toISOString(), keys: Object.keys(collectAllData().keys).length });
      LS.set("backupHistory", history.slice(0, 10));
    }

    const STREAK_THRESHOLD = 0.6;
    const TOTAL_DAILY_ITEMS = DAILY.reduce((s,b) => s + b.items.length, 0);

    const INJECTION_WINDOWS = [
      {id:"pre-train",label:"Pre-Train Blend",icon:"⚡",color:C.green,openHour:5,closeHour:6,blockIdx:0,
       compounds:[{name:"Mots-c",note:"AMPK blunted if glucose elevated"},{name:"Selank",note:"Cortisol modulation — always effective"},{name:"L-Carnitine",note:"Standalone injection — do not blend. Shuttles fatty acids to mitochondria"}]},
      {id:"post-train",label:"Post-Train Blend",icon:"☀️",color:C.amber,openHour:7,closeHour:10,blockIdx:2,
       compounds:[{name:"AOD-9604",note:"Requires fasted + low glucose state"},{name:"BPC-157",note:"Not fasting-sensitive"},{name:"KPV",note:"Not fasting-sensitive"},{name:"5-Amino-1MQ",note:"Enhanced in fasted metabolic state"}]},
      {id:"evening",label:"Evening Blend",icon:"🌙",color:C.violet,openHour:18,closeHour:24,blockIdx:5,
       compounds:[{name:"Tesamorelin",note:"GH pulse magnitude depends on sleep quality"},{name:"Ipamorelin",note:"Amplifies existing pulse — blunted if sleep-deprived"},{name:"DSIP",note:"Improves slow-wave sleep depth"}]},
      {id:"pre-sleep",label:"Pre-Sleep",icon:"💤",color:"#8B7FE8",openHour:21,closeHour:24,blockIdx:6,
       compounds:[{name:"Epithalon",note:"Pineal restoration — sleep dependent"},{name:"Magnesium Glycinate",note:"Supports slow-wave sleep"}]},
    ];

    const SHORTCUT_INSTRUCTIONS = [
      {step:"1",text:'Open the Shortcuts app on your iPhone and tap "+" to create a new shortcut.'},
      {step:"2",text:'Add action: "Find Health Samples Where" → Category: Sleep Analysis → Sort: Latest First → Limit: 1'},
      {step:"3",text:'Add action: "Find Health Samples Where" → Category: Blood Glucose → Sort: Latest First → Limit: 1'},
      {step:"4",text:'Add action: "Find Health Samples Where" → Category: Heart Rate Variability SDNN → Sort: Latest First → Limit: 1'},
      {step:"5",text:'Add action: "Find Health Samples Where" → Category: Steps → Sort: Latest First → Limit: 1'},
      {step:"6",text:'Add action: "Find Health Samples Where" → Category: Body Mass → Sort: Latest First → Limit: 1'},
      {step:"7",text:'Add action: "Copy to Clipboard" with text: "sleep:[Sleep hours] glucose:[Glucose mg/dL] hrv:[HRV ms] steps:[Steps count] weight:[Body Mass lbs]"'},
      {step:"8",text:'Name the shortcut "Protocol Sync" and add it to your Home Screen for one-tap access.'},
    ];