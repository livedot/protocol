const DIET_MEALS = [
      {
        id:"m1", time:"9:30 AM", weekendTime:"10:00 AM", label:"Meal 1 — Break Fast",
        icon:"coffee", color:"#38BDF8",
        note:"First meal after fasted window. High protein, low carb. Keep insulin low. On weekends — take with your coffee.",
        macros:{p:40,f:20,c:2,cal:350},
        supps:[{name:"Vitamin D3+K2",dose:"10,000 IU",note:"With coffee"},{name:"TUDCA",dose:"250–500mg"},{name:"Omega-3",dose:"2g EPA/DHA"},{name:"P-5-P",dose:"50–100mg"},{name:"Methylfolate",dose:"400–800mcg"},{name:"Digestive Enzymes",dose:"2 caps"}],
        options:[
          {
            label:"Option A — Eggs + Whites",
            items:[
              {name:"3 whole eggs",p:18,f:15,c:1,cal:209},
              {name:"200ml egg whites",p:22,f:0,c:1,cal:96},
              {name:"1 tsp olive oil / butter",p:0,f:5,c:0,cal:45},
            ]
          },
          {
            label:"Option B — Eggs + Shake",
            items:[
              {name:"3 whole eggs",p:18,f:15,c:1,cal:209},
              {name:"1 scoop protein in water",p:24,f:3,c:5,cal:150},
            ]
          },
        ]
      },
      {
        id:"m2", time:"12:00–2:00 PM", weekendTime:"1:00–2:00 PM", label:"Meal 2 — Lunch / Stew",
        icon:"meal", color:"#34D399",
        note:"Your biggest protein hit. Beef or chicken stew. Keep carbs low here — save them for dinner.",
        macros:{p:63,f:12,c:12,cal:415},
        supps:[{name:"Digestive Enzymes",dose:"2 caps"}],
        options:[
          {
            label:"Option A — Beef Stew",
            items:[
              {name:"250g lean beef (chuck/topside)",p:62,f:12,c:0,cal:355},
              {name:"200g mixed veg (carrot, celery, onion)",p:3,f:0,c:12,cal:60},
            ]
          },
          {
            label:"Option B — Chicken Stew",
            items:[
              {name:"300g chicken thigh (skin off)",p:57,f:15,c:0,cal:369},
              {name:"200g mixed veg",p:3,f:0,c:12,cal:60},
            ]
          },
          {
            label:"Option C — Chicken Breast Stew",
            items:[
              {name:"300g chicken breast",p:69,f:5,c:0,cal:320},
              {name:"200g mixed veg",p:3,f:0,c:12,cal:60},
            ]
          },
        ]
      },
      {
        id:"m3", time:"5:00–6:30 PM", weekendTime:"6:00–7:00 PM", label:"Meal 3 — Dinner (Carb Meal)",
        icon:"meal", color:"#F59E0B",
        note:"Carbs go here with Dihydroberberine. Must finish by 6:30 PM — needs 2+ hrs before evening injection at 9 PM.",
        macros:{p:51,f:9,c:49,cal:481},
        supps:[{name:"Dihydroberberine",dose:"200mg"},{name:"Omega-3",dose:"2g EPA/DHA"},{name:"Digestive Enzymes",dose:"2 caps"}],
        options:[
          {
            label:"Option A — Chicken + Rice",
            items:[
              {name:"200g chicken breast",p:46,f:4,c:0,cal:220},
              {name:"150g cooked white rice",p:3,f:0,c:41,cal:176},
              {name:"100g mixed veg + 1 tsp oil",p:2,f:5,c:8,cal:85},
            ]
          },
          {
            label:"Option B — Beef Mince + Sweet Potato",
            items:[
              {name:"200g lean beef mince (5% fat)",p:46,f:10,c:0,cal:274},
              {name:"200g sweet potato (cooked)",p:2,f:0,c:40,cal:168},
              {name:"100g veg",p:2,f:0,c:8,cal:40},
            ]
          },
          {
            label:"Option C — Salmon + Rice",
            items:[
              {name:"200g salmon",p:40,f:14,c:0,cal:290},
              {name:"150g cooked rice",p:3,f:0,c:41,cal:176},
              {name:"100g veg",p:2,f:0,c:8,cal:40},
            ]
          },
        ]
      },
      {
        id:"m4", time:"8:00–8:30 PM", label:"Protein Shake (Gap Filler)",
        icon:"pill", color:"#818CF8",
        note:"Only if short on protein. Water only — no milk. Digests fast enough to clear before 9 PM injection.",
        macros:{p:36,f:4,c:7,cal:225},
        supps:[],
        options:[
          {
            label:"1.5 Scoops Whey in Water",
            items:[
              {name:"1.5 scoops protein powder in water",p:36,f:4,c:7,cal:225},
            ]
          },
          {
            label:"1 Scoop + Egg Whites",
            items:[
              {name:"1 scoop protein powder",p:24,f:3,c:5,cal:150},
              {name:"150ml egg whites",p:16,f:0,c:1,cal:72},
            ]
          },
        ]
      },
    ];