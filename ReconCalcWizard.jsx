// ─── Reconstitution Calculator — Chronicle-style stepped wizard ──────────────
    

    function ReconCalcWizard({ onSave, onDelete, savedDoses={} }) {
      const [step, setStep] = useState(0);
      const [saved, setSaved] = useState(false);
      const [editingName, setEditingName] = useState(null); // peptide name being edited
      const [peptide, setPeptide] = useState(null);
      const [search, setSearch] = useState("");
      const [showSearch, setShowSearch] = useState(false);
      const [doseStr, setDoseStr] = useState("");
      const [doseUnit, setDoseUnit] = useState("mcg"); // mcg | mg
      const [vialStr, setVialStr] = useState("");
      const [waterMl, setWaterMl] = useState(2);
      const [showWaterPicker, setShowWaterPicker] = useState(false);
      const [customWater, setCustomWater] = useState(false);

      const filteredPeptides = PEPTIDE_DB.filter(p =>
        !search || p.name.toLowerCase().includes(search.toLowerCase())
      );

      const doseMcg = doseUnit==="mg" ? parseFloat(doseStr||0)*1000 : parseFloat(doseStr||0);
      const vialMg = parseFloat(vialStr||0);
      const concMcgPerMl = vialMg>0&&waterMl>0 ? (vialMg*1000)/waterMl : 0;
      const mlPerDose = concMcgPerMl>0 ? doseMcg/concMcgPerMl : 0;
      const unitsPerDose = mlPerDose*100;
      const dosesPerVial = doseMcg>0 ? (vialMg*1000)/doseMcg : 0;

      const DOSE_PRESETS_MCG = [100,200,250,300,400,500,750,1000];
      const DOSE_PRESETS_MG  = [0.5,1,1.5,2,2.5,3,4,5];
      const VIAL_PRESETS = [2,5,10,15,20,30,50];
      const WATER_PRESETS = [1,2,3];
      const selectedDosePresets = doseUnit==="mg" ? DOSE_PRESETS_MG : DOSE_PRESETS_MCG;

      const stepBadges = [
        {icon:"inject", val: doseMcg ? `${doseStr} ${doseUnit}` : null, label:"Dose"},
        {icon:"pill",   val: vialMg ? `${vialStr} mg` : null,           label:"Vial"},
        {icon:"blending",val: step>=3 ? `${waterMl} mL` : null,         label:"Water"},
      ];

      const numPad = (str, setStr, allowDecimal=true) => {
        const press = (k) => {
          if (k==="⌫") { setStr(s=>s.slice(0,-1)); return; }
          if (k==="."&&(!allowDecimal||str.includes("."))) return;
          if (str.length>=6) return;
          setStr(s=>s==="0"?k:s+k);
        };
        return (
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {["1","2","3","4","5","6","7","8","9","0",".","⌫"].map((k)=>(
              <div key={k} onClick={()=>press(k)} style={{
                background:"rgba(255,255,255,0.12)",borderRadius:14,padding:"18px 0",
                textAlign:"center",fontSize:20,fontWeight:500,color:"#fff",
                cursor:"pointer",border:"1px solid rgba(255,255,255,0.06)",
                WebkitTapHighlightColor:"transparent",
              }}>{k==="⌫"?<Icon name="calculator" size={18} color="rgba(255,255,255,0.75)"/>:k}</div>
            ))}
          </div>
        );
      };

      const WaterViz = ({ml}) => {
        const fillPct = Math.min(80,Math.max(20,ml*20));
        return (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"20px 0 10px"}}>
            <div style={{position:"relative",width:110,height:110}}>
              <svg viewBox="0 0 120 120" style={{position:"absolute",inset:0}}>
                <defs><clipPath id="cc"><circle cx="60" cy="60" r="54"/></clipPath></defs>
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2"/>
                <g clipPath="url(#cc)">
                  <rect x="0" y={120-fillPct*1.2} width="120" height="120" fill="rgba(56,189,248,0.3)"/>
                  <path d={`M0,${120-fillPct*1.2} Q30,${120-fillPct*1.2-8} 60,${120-fillPct*1.2} Q90,${120-fillPct*1.2+8} 120,${120-fillPct*1.2} L120,120 L0,120 Z`} fill="rgba(56,189,248,0.5)">
                    <animate attributeName="d"
                      values={`M0,${120-fillPct*1.2} Q30,${120-fillPct*1.2-8} 60,${120-fillPct*1.2} Q90,${120-fillPct*1.2+8} 120,${120-fillPct*1.2} L120,120 L0,120 Z;M0,${120-fillPct*1.2+4} Q30,${120-fillPct*1.2+10} 60,${120-fillPct*1.2+4} Q90,${120-fillPct*1.2-4} 120,${120-fillPct*1.2+4} L120,120 L0,120 Z;M0,${120-fillPct*1.2} Q30,${120-fillPct*1.2-8} 60,${120-fillPct*1.2} Q90,${120-fillPct*1.2+8} 120,${120-fillPct*1.2} L120,120 L0,120 Z`}
                      dur="3s" repeatCount="indefinite"/>
                  </path>
                </g>
              </svg>
            </div>
            <div style={{fontSize:32,fontWeight:700,color:"#fff",letterSpacing:"-1px",lineHeight:1}}>{ml} mL</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.65)"}}>{ml} mL = {ml*100} units on U-100 syringe</div>
          </div>
        );
      };

      // Shared header + badge row
      const headerRow = (
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          {step>0
            ? <div onClick={()=>setStep(s=>s-1)} style={{display:"flex",alignItems:"center",gap:4,fontSize:13,color:"rgba(255,255,255,0.75)",cursor:"pointer",padding:"6px 0",WebkitTapHighlightColor:"transparent"}}>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Back
              </div>
            : <div/>}
          {peptide&&<div style={{fontSize:15,fontWeight:600,color:"rgba(255,255,255,0.75)"}}>{peptide.name}</div>}
          {step>0
            ? <div onClick={()=>{setPeptide(null);setStep(0);setDoseStr("");setVialStr("");setWaterMl(2);}} style={{fontSize:13,color:"rgba(255,255,255,0.65)",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>Reset</div>
            : <div/>}
        </div>
      );

      const badgeRow = step>0&&(
        <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto"}}>
          {stepBadges.map((b,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:20,flexShrink:0,
              background:b.val?"rgba(52,211,153,0.12)":"rgba(255,255,255,0.06)",
              border:`1px solid ${b.val?"rgba(52,211,153,0.25)":"rgba(255,255,255,0.12)"}`}}>
              <Icon name={b.icon} size={13} color={b.val?"#34D399":"rgba(255,255,255,0.65)"}/>
              <span style={{fontSize:13,fontWeight:600,color:b.val?"#34D399":"rgba(255,255,255,0.65)"}}>{b.val||b.label}</span>
            </div>
          ))}
        </div>
      );

      const ctaBtn = (label, onPress, active=true, amber=false) => (
        <div onClick={active?onPress:undefined} style={{
          padding:"16px",borderRadius:28,textAlign:"center",fontSize:15,fontWeight:600,
          color:active?"#fff":"rgba(255,255,255,0.65)",
          background:active?(amber?"linear-gradient(180deg,#F5A94A 0%,#F08C28 100%)":"rgba(99,102,241,0.7)"):"rgba(255,255,255,0.06)",
          cursor:active?"pointer":"not-allowed",WebkitTapHighlightColor:"transparent",
          transition:"opacity 0.15s",marginBottom:4
        }}>{label}</div>
      );

      // ── STEP 0: Peptide picker ──────────────────────────────────────────────
      if (step===0) {
        const savedEntries = Object.entries(savedDoses);
        const loadForEdit = (name, data) => {
          const p = PEPTIDE_DB.find(p=>p.name===name) || {name, desc:""};
          setPeptide(p);
          setDoseStr(String(data.dose));
          setDoseUnit(data.doseUnit||"mg");
          setVialStr(String(data.vialMg));
          setWaterMl(data.waterMl||2);
          setEditingName(name);
          setStep(1);
        };
        return (
        <div>
          <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.65)",letterSpacing:"0.08em",marginBottom:10}}>RECONSTITUTION CALCULATOR</div>
          <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"16px",marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:4}}>Select Peptide</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.65)",marginBottom:12}}>Choose what you are reconstituting</div>
            {/* Inline search + dropdown */}
            <div style={{position:"relative"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.07)",border:`1px solid ${showSearch?"rgba(99,102,241,0.5)":peptide?"rgba(52,211,153,0.35)":"rgba(255,255,255,0.12)"}`,borderRadius:showSearch?"12px 12px 0 0":12,padding:"12px 14px",transition:"border-color 0.15s"}}>
                <Icon name="calculator" size={15} color="rgba(255,255,255,0.4)"/>
                <input
                  value={showSearch ? search : (peptide ? peptide.name : "")}
                  onFocus={()=>setShowSearch(true)}
                  onChange={e=>{setSearch(e.target.value);setShowSearch(true);}}
                  placeholder="Search peptides…"
                  style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:16,color:peptide&&!showSearch?"#F59E0B":"#fff",fontWeight:peptide&&!showSearch?600:400}}
                />
                {peptide && !showSearch
                  ? <span style={{fontSize:12,color:"#34D399",fontWeight:700}}>✓</span>
                  : showSearch && search
                    ? <span onClick={()=>{setSearch("");}} style={{fontSize:14,color:"rgba(255,255,255,0.4)",cursor:"pointer",padding:"0 2px"}}>✕</span>
                    : <span style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>›</span>
                }
              </div>
              {showSearch&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#1E3558",borderRadius:"0 0 12px 12px",border:"1px solid rgba(99,102,241,0.4)",borderTop:"none",zIndex:100,maxHeight:220,overflowY:"auto"}}>
                  {filteredPeptides.length === 0
                    ? <div style={{padding:"14px 16px",fontSize:13,color:"rgba(255,255,255,0.4)"}}>No matches</div>
                    : filteredPeptides.map(p=>(
                        <div key={p.name} onClick={()=>{setPeptide(p);setShowSearch(false);setSearch("");setEditingName(null);if(p.recDose){setDoseStr(p.recDose);setDoseUnit(p.recUnit==="mg"?"mg":"mcg");}}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",cursor:"pointer",WebkitTapHighlightColor:"transparent",background:peptide?.name===p.name?"rgba(99,102,241,0.15)":"transparent"}}>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                              <span style={{fontSize:14,fontWeight:500,color:"#fff"}}>{p.name}</span>
                              {p.recDose&&<span style={{fontSize:12,color:"#F5A94A",background:"rgba(245,169,74,0.12)",padding:"2px 7px",borderRadius:5,flexShrink:0}}>★ {p.recDose} {p.recUnit}</span>}
                            </div>
                            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{p.desc}</div>
                          </div>
                          {peptide?.name===p.name&&<span style={{color:"#34D399",fontSize:14,marginLeft:10}}>✓</span>}
                        </div>
                      ))
                  }
                </div>
              )}
            </div>
            {showSearch&&<div style={{position:"fixed",inset:0,zIndex:99}} onClick={()=>{setShowSearch(false);setSearch("");}}/>}
          </div>
          {ctaBtn("Select Peptide →", ()=>setStep(1), !!peptide)}

          {/* Saved doses */}
          {savedEntries.length > 0 && (
            <div style={{marginTop:20}}>
              <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.65)",letterSpacing:"0.08em",marginBottom:10}}>SAVED DOSES</div>
              <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,overflow:"hidden"}}>
                {savedEntries.map(([name, data], i)=>(
                  <div key={name} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<savedEntries.length-1?"1px solid rgba(255,255,255,0.07)":"none"}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:600,color:"#fff",marginBottom:3}}>{name}</div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        <span style={{fontSize:12,color:"#A78BFA",background:"rgba(167,139,250,0.15)",border:"1px solid rgba(167,139,250,0.25)",padding:"2px 8px",borderRadius:6,fontWeight:700}}>{data.units}u</span>
                        <span style={{fontSize:12,color:"rgba(255,255,255,0.5)",background:"rgba(255,255,255,0.06)",padding:"2px 8px",borderRadius:6}}>{data.dose}{data.doseUnit}</span>
                        <span style={{fontSize:12,color:"rgba(255,255,255,0.5)",background:"rgba(255,255,255,0.06)",padding:"2px 8px",borderRadius:6}}>{data.vialMg}mg vial</span>
                        <span style={{fontSize:12,color:"rgba(255,255,255,0.5)",background:"rgba(255,255,255,0.06)",padding:"2px 8px",borderRadius:6}}>{data.waterMl}mL water</span>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8,flexShrink:0}}>
                      <div onClick={()=>loadForEdit(name,data)} style={{padding:"7px 12px",background:"rgba(99,102,241,0.15)",border:"1px solid rgba(99,102,241,0.3)",borderRadius:8,fontSize:12,fontWeight:600,color:"#818CF8",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>Edit</div>
                      <div onClick={()=>{if(onDelete)onDelete(name);}} style={{padding:"7px 10px",background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.25)",borderRadius:8,fontSize:12,fontWeight:600,color:"#F87171",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>✕</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        );
      }

      // ── STEP 1: Dose ────────────────────────────────────────────────────────
      if (step===1) return (
        <div>
          {headerRow}{badgeRow}
          <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"16px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:600,color:"#fff"}}>Dose Amount</div>
              <div style={{display:"flex",gap:0,background:"rgba(255,255,255,0.07)",borderRadius:10,padding:3}}>
                {["mcg","mg"].map(u=>(
                  <div key={u} onClick={()=>{setDoseUnit(u);setDoseStr("");}} style={{padding:"5px 16px",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",WebkitTapHighlightColor:"transparent",background:doseUnit===u?"rgba(56,189,248,0.2)":"transparent",color:doseUnit===u?"#38BDF8":"rgba(255,255,255,0.65)",transition:"all 0.15s"}}>{u}</div>
                ))}
              </div>
            </div>
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:64,fontWeight:700,color:doseStr?"#fff":"rgba(255,255,255,0.35)",letterSpacing:"-3px",lineHeight:1,minHeight:72}}>{doseStr||"0"}</div>
              <div style={{fontSize:15,color:"rgba(255,255,255,0.65)",marginTop:4}}>{doseUnit}</div>
            </div>
            <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:16,paddingBottom:2}}>
              {selectedDosePresets.map(v=>(
                <div key={v} onClick={()=>setDoseStr(String(v))} style={{flexShrink:0,padding:"7px 12px",borderRadius:10,textAlign:"center",cursor:"pointer",WebkitTapHighlightColor:"transparent",background:parseFloat(doseStr)===v?"rgba(251,191,36,0.15)":"rgba(255,255,255,0.06)",border:`1px solid ${parseFloat(doseStr)===v?"rgba(251,191,36,0.4)":"rgba(255,255,255,0.12)"}`}}>
                  <div style={{fontSize:15,fontWeight:600,color:parseFloat(doseStr)===v?"#F59E0B":"rgba(255,255,255,0.75)"}}>{v}</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.65)",marginTop:1}}>{doseUnit}</div>
                </div>
              ))}
            </div>
            {numPad(doseStr,setDoseStr)}
          </div>
          {ctaBtn("Confirm Dose", ()=>setStep(2), !!(doseStr&&parseFloat(doseStr)>0))}
        </div>
      );

      // ── STEP 2: Vial size ───────────────────────────────────────────────────
      if (step===2) return (
        <div>
          {headerRow}{badgeRow}
          <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"16px",marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:16}}>Vial Size</div>
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:64,fontWeight:700,color:vialStr?"#fff":"rgba(255,255,255,0.35)",letterSpacing:"-3px",lineHeight:1,minHeight:72}}>{vialStr||"0"}</div>
              <div style={{fontSize:15,color:"rgba(255,255,255,0.65)",marginTop:4}}>mg</div>
            </div>
            <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:16,paddingBottom:2}}>
              {VIAL_PRESETS.map(v=>(
                <div key={v} onClick={()=>setVialStr(String(v))} style={{flexShrink:0,padding:"7px 12px",borderRadius:10,textAlign:"center",cursor:"pointer",WebkitTapHighlightColor:"transparent",background:parseFloat(vialStr)===v?"rgba(251,191,36,0.15)":"rgba(255,255,255,0.06)",border:`1px solid ${parseFloat(vialStr)===v?"rgba(251,191,36,0.4)":"rgba(255,255,255,0.12)"}`}}>
                  <div style={{fontSize:15,fontWeight:600,color:parseFloat(vialStr)===v?"#F59E0B":"rgba(255,255,255,0.75)"}}>{v}</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.65)",marginTop:1}}>mg</div>
                </div>
              ))}
            </div>
            {numPad(vialStr,setVialStr)}
          </div>
          {ctaBtn("Confirm Vial Size", ()=>setStep(3), !!(vialStr&&parseFloat(vialStr)>0))}
        </div>
      );

      // ── STEP 3: Water amount ────────────────────────────────────────────────
      if (step===3) return (
        <div>
          {headerRow}{badgeRow}
          <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"16px",marginBottom:12,position:"relative"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <div style={{fontSize:13,fontWeight:600,color:"#fff"}}>BacWater Amount</div>
              <div onClick={()=>setShowWaterPicker(true)} style={{fontSize:13,color:"rgba(255,255,255,0.65)",cursor:"pointer",padding:"4px 8px",background:"rgba(255,255,255,0.06)",borderRadius:8,WebkitTapHighlightColor:"transparent"}}>Change</div>
            </div>
            <WaterViz ml={waterMl}/>
          </div>
          {concMcgPerMl>0&&(
            <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"16px",marginBottom:12}}>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.65,marginBottom:12}}>
                For your <span style={{color:"#fff",fontWeight:600}}>{doseStr} {doseUnit} {peptide?.name}</span> dose, draw to <span style={{color:"#F59E0B",fontWeight:700,fontSize:13}}>{unitsPerDose.toFixed(1)} units</span>
              </div>
              <div style={{height:5,background:"rgba(255,255,255,0.12)",borderRadius:3,overflow:"hidden",position:"relative",marginBottom:4}}>
                <div style={{height:"100%",background:"linear-gradient(90deg,#38BDF8,#A78BFA)",borderRadius:2,width:`${Math.min(100,(unitsPerDose/100)*100)}%`}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"rgba(255,255,255,0.65)",marginTop:4}}><span>0</span><span>50</span><span>100 units</span></div>
            </div>
          )}
          {/* Water picker sheet */}
          {showWaterPicker&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:2000,display:"flex",alignItems:"flex-end"}} onClick={()=>setShowWaterPicker(false)}>
              <div style={{background:"rgba(255,255,255,0.07)",borderRadius:"20px 20px 0 0",width:"100%",padding:"20px 16px calc(20px + env(safe-area-inset-bottom))"}} onClick={e=>e.stopPropagation()}>
                <div style={{width:40,height:4,borderRadius:2,background:"rgba(255,255,255,0.35)",margin:"0 auto 16px"}}/>
                <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:4}}>Water Amount</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.65)",marginBottom:20}}>How much BacWater to add</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
                  {WATER_PRESETS.map(v=>(
                    <div key={v} onClick={()=>{setWaterMl(v);setShowWaterPicker(false);}} style={{padding:"14px 0",borderRadius:14,textAlign:"center",cursor:"pointer",WebkitTapHighlightColor:"transparent",background:waterMl===v?"rgba(56,189,248,0.12)":"rgba(255,255,255,0.06)",border:`2px solid ${waterMl===v?"#38BDF8":"rgba(255,255,255,0.12)"}`}}>
                      <div style={{fontSize:20,fontWeight:700,color:waterMl===v?"#38BDF8":"#fff"}}>{v}</div>
                      <div style={{fontSize:13,color:"rgba(255,255,255,0.65)",marginTop:2}}>mL</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {ctaBtn("See Results →", ()=>setStep(4), true)}
        </div>
      );

      // ── STEP 4: Results ─────────────────────────────────────────────────────
      return (
        <div>
          {headerRow}{badgeRow}
          {/* Hero result */}
          <div style={{background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.25)",borderRadius:16,padding:"20px",marginBottom:12,textAlign:"center"}}>
            <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.65)",letterSpacing:"0.08em",marginBottom:8}}>DRAW TO THIS LINE</div>
            <div style={{fontSize:52,fontWeight:700,color:"#fff",letterSpacing:"-2px",lineHeight:1}}>{unitsPerDose.toFixed(1)}</div>
            <div style={{fontSize:15,color:"rgba(255,255,255,0.75)",marginTop:4,marginBottom:16}}>units on U-100 syringe</div>
            <div style={{height:6,background:"rgba(255,255,255,0.12)",borderRadius:3,overflow:"hidden",position:"relative"}}>
              <div style={{height:"100%",background:"linear-gradient(90deg,#6366F1,#818CF8)",borderRadius:3,width:`${Math.min(100,(unitsPerDose/100)*100)}%`}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:13,color:"rgba(255,255,255,0.65)"}}><span>0</span><span>50</span><span>100</span></div>
          </div>

          {/* Stats */}
          <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,overflow:"hidden",marginBottom:12}}>
            {[
              {label:"Concentration",val:`${Math.round(concMcgPerMl)} mcg/mL`,color:"#818CF8"},
              {label:"Doses per vial",val:`${Math.floor(dosesPerVial)}`,color:"#34D399"},
              {label:"Volume per dose",val:`${mlPerDose.toFixed(3)} mL`,color:"#F59E0B"},
              {label:"BacWater added",val:`${waterMl} mL`,color:"#818CF8"},
            ].map((r,i,arr)=>(
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 16px",borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.08)":"none"}}>
                <span style={{fontSize:15,color:"rgba(255,255,255,0.75)"}}>{r.label}</span>
                <span style={{fontSize:13,fontWeight:600,color:r.color}}>{r.val}</span>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"14px 16px",marginBottom:12}}>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.7}}>
              Add <span style={{color:"#fff",fontWeight:600}}>{waterMl} mL</span> BacWater to your <span style={{color:"#fff",fontWeight:600}}>{vialStr} mg {peptide?.name}</span> vial. For each <span style={{color:"#F59E0B",fontWeight:600}}>{doseStr} {doseUnit}</span> dose, draw to <span style={{color:"#38BDF8",fontWeight:700}}>{unitsPerDose.toFixed(1)} units</span> on a U-100 syringe. Vial gives <span style={{color:"#34D399",fontWeight:600}}>{Math.floor(dosesPerVial)} doses</span>.
            </div>
          </div>

          {/* Save result */}
          {(() => {
            const alreadySaved = savedDoses[peptide?.name];
            const isSame = alreadySaved &&
              alreadySaved.units === parseFloat(unitsPerDose.toFixed(1)) &&
              alreadySaved.dose === doseStr &&
              alreadySaved.doseUnit === doseUnit;
            return (
              <div onClick={()=>{
                if(onSave && peptide) {
                  onSave(peptide.name, {units: parseFloat(unitsPerDose.toFixed(1)), dose: doseStr, doseUnit, vialMg, waterMl});
                  setSaved(true);
                  setTimeout(()=>setSaved(false), 2000);
                }
              }} style={{
                padding:"16px", borderRadius:28, textAlign:"center", fontSize:15, fontWeight:600,
                color: isSame ? "rgba(255,255,255,0.4)" : "#fff",
                background: saved ? "rgba(52,211,153,0.25)" : isSame ? "rgba(255,255,255,0.06)" : "rgba(52,211,153,0.18)",
                border: `1px solid ${saved||isSame ? "rgba(52,211,153,0.35)" : "rgba(52,211,153,0.4)"}`,
                cursor: isSame ? "default" : "pointer",
                WebkitTapHighlightColor:"transparent", marginBottom:8, transition:"all 0.2s",
              }}>
                {saved ? "✓ Saved to Timeline" : isSame ? "✓ Already Saved" : editingName ? `Update ${unitsPerDose.toFixed(1)}u` : `Save ${unitsPerDose.toFixed(1)}u to Timeline`}
              </div>
            );
          })()}

          {ctaBtn("New Calculation", ()=>{setPeptide(null);setStep(0);setDoseStr("");setVialStr("");setWaterMl(2);setSaved(false);setEditingName(null);}, true)}
        </div>
      );
    }