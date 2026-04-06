const SOURCES = ["HE Peptides","zztai Peptide","Hebei Feisite"];

    const ORDERS = [
      {name:"L-Carnitine",spec:"600mg×10",qty:"1",mg:"6g",cost:"$55",status:"covered",src:"Hebei Feisite"},
      {name:"BPC-157",spec:"10mg×10",qty:"1",mg:"100mg",cost:"$68",status:"covered",src:"HE Peptides"},
      {name:"Tesamorelin",spec:"5mg×10",qty:"1",mg:"50mg",cost:"$100",status:"topup",src:"HE Peptides"},
      {name:"Sermorelin",spec:"5mg×10",qty:"1",mg:"50mg",cost:"$65",status:"backup",src:"HE Peptides"},
      {name:"TB-500",spec:"10mg×10",qty:"1",mg:"100mg",cost:"$100",status:"covered",src:"HE Peptides"},
      {name:"Retatrutide",spec:"10mg×10",qty:"1",mg:"100mg",cost:"$90",status:"covered",src:"HE Peptides"},
      {name:"Mots-c",spec:"10mg×10",qty:"1",mg:"100mg",cost:"$60",status:"topup",src:"HE Peptides"},
      {name:"KPV",spec:"10mg×10",qty:"1",mg:"100mg",cost:"$65",status:"covered",src:"HE Peptides"},
      {name:"Bac Water",spec:"10ml×10",qty:"1",mg:"—",cost:"$15",status:"covered",src:"HE Peptides"},
      {name:"ARA-290",spec:"10mg×10",qty:"1",mg:"100mg",cost:"$63",status:"ordered",src:"HE Peptides"},
      {name:"Tesamorelin",spec:"20mg×10",qty:"1",mg:"200mg",cost:"$243",status:"covered",src:"zztai Peptide"},
      {name:"Mots-c",spec:"10mg×10",qty:"2",mg:"200mg",cost:"$146",status:"covered",src:"Hebei Feisite"},
      {name:"AOD-9604",spec:"10mg×10",qty:"1",mg:"100mg",cost:"$168",status:"covered",src:"Hebei Feisite"},
      {name:"Ipamorelin",spec:"10mg×10",qty:"1",mg:"100mg",cost:"$57",status:"covered",src:"Hebei Feisite"},
      {name:"Epithalon",spec:"10mg×10",qty:"2",mg:"200mg",cost:"$94",status:"covered",src:"Hebei Feisite"},
      {name:"DSIP",spec:"5mg×10",qty:"1",mg:"50mg",cost:"$58",status:"covered",src:"Hebei Feisite"},
      {name:"Selank",spec:"5mg×10",qty:"1",mg:"50mg",cost:"$41",status:"covered",src:"Hebei Feisite"},
      {name:"5-Amino-1MQ",spec:"50mg×10",qty:"1",mg:"500mg",cost:"$98",status:"covered",src:"Hebei Feisite"},
      {name:"Bac Water",spec:"10ml×10",qty:"1",mg:"—",cost:"$18",status:"covered",src:"Hebei Feisite"},
      {name:"GHK-Cu",spec:"50mg×10",qty:"2",mg:"1000mg",cost:"$68",status:"covered",src:"Hebei Feisite"},
      {name:"Kisspeptin",spec:"5mg×10",qty:"1",mg:"50mg",cost:"$50",status:"covered",src:"Hebei Feisite"},
    ];

    const LOCAL_SUPPS = [
      {name:"TUDCA",spec:"250mg · 60ct",serving:"1–2 caps",cost:"$19.94",brand:"Double Wood"},
      {name:"Omega-3 (High EPA)",spec:"1250mg · 90ct",serving:"1 softgel",cost:"$22.36",brand:"Sports Research"},
      {name:"Dihydroberberine",spec:"200mg · 60ct",serving:"1 cap",cost:"$24.95",brand:"Nutricost"},
      {name:"Astragalus",spec:"20:1 Extract · 180ct",serving:"3 caps",cost:"$22.97",brand:"Zazzee"},
      {name:"P-5-P (Active B6)",spec:"50mg · 240ct",serving:"1–2 caps",cost:"$16.95",brand:"Nutricost"},
      {name:"Vitamin D3 + K2",spec:"10,000 IU · 60ct",serving:"1 softgel",cost:"$23.16",brand:"Sports Research"},
      {name:"Digestive Enzymes",spec:"Similase · 180ct",serving:"1–2 caps",cost:"$49.75",brand:"Integrative Therapeutics"},
      {name:"Magnesium Citrate",spec:"420mg · 240ct",serving:"1 cap",cost:"$17.95",brand:"Nutricost"},
      {name:"Magnesium Glycinate",spec:"300mg · 500g powder",serving:"1 scoop",cost:"$20.97",brand:"BulkSupplements"},
      {name:"Apigenin",spec:"50mg · 60ct",serving:"1 cap",cost:"$19.99",brand:"Nootropics Depot"},
      {name:"Melatonin",spec:"0.5mg · 60ct",serving:"1 cap",cost:"$12.50",brand:"Pure Encapsulations"},
      {name:"Electrolytes / Potassium",spec:"Potassium Chloride · 1kg",serving:"1 scoop",cost:"$21.97",brand:"BulkSupplements"},
      {name:"NAC",spec:"500mg · 210ct",serving:"2 caps",cost:"$19.95",brand:"Double Wood"},
      {name:"Alpha-GPC",spec:"—",serving:"—",cost:"—",brand:""},
      {name:"Methylfolate (5-MTHF)",spec:"—",serving:"—",cost:"—",brand:""},
      {name:"Myo-Inositol",spec:"—",serving:"—",cost:"—",brand:""},
    ];

    const SHOPPING_LIST = [
      {cat:"Injection Supplies",item:"Luer Lock Syringes",spec:"1ml",qty:"100 pack",where:"EasyTouch",est:"$20.99",note:"Core syringe — must be Luer Lock for needle swapping",priority:"critical"},
      {cat:"Injection Supplies",item:"Draw Needles 21g",spec:"21g × 1\"",qty:"100 pack",where:"Garfily",est:"$9.99",note:"Drawing from vials only — never inject with these",priority:"critical"},
      {cat:"Injection Supplies",item:"Injection Needles 32g",spec:"32g × 0.5\"",qty:"100 pack",where:"Cailos",est:"$16.99",note:"Fresh needle every injection — SubQ pinch technique",priority:"critical"},
      {cat:"Injection Supplies",item:"Sharps Container",spec:"1–2 quart",qty:"1",where:"Amazon / pharmacy",est:"~$5–10",note:"Required — never recap used needles, never bin loose",priority:"critical"},
      {cat:"Injection Supplies",item:"Bacteriostatic Water",spec:"30ml vials",qty:"4–6 vials",where:"Amazon / compounding pharmacy",est:"~$15–25",note:"For reconstituting all lyophilized peptides — not sterile water",priority:"critical"},
      {cat:"Injection Supplies",item:"Insulin Syringes (backup)",spec:"0.5ml / 31g",qty:"50 pack",where:"Walmart / pharmacy counter",est:"~$10–15",note:"Backup option for single low-volume doses",priority:"optional"},
    ];

    const PEPTIDE_LIST = ["AOD-9604","BPC-157","DSIP","Epithalon","Ipamorelin","KPV","L-Carnitine","Mots-c","Retatrutide","Selank","TB-500","Tesamorelin","5-Amino-1MQ","Sermorelin"];