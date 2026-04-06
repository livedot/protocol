function ReadinessScore({ chk, viewDay, theme }) {
      const t = theme || C;
      const [inputs, setInputs] = useState(() => LS.get("readiness", {sleep:7,lastMeal:10,glucose:85,hrv:60,steps:0,weight:0}));
      const [expanded, setExpanded] = useState(false);
      const [showSync, setShowSync] = useState(false);
      const [lastSynced, setLastSynced] = useState(() => LS.get("lastHealthSync", null));
      const [now, setNow] = useState(new Date());
      useEffect(() => { const ti = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(ti); }, []);
      const set = (k,v) => setInputs(p => { const n={...p,[k]:v}; LS.set("readiness",n); return n; });
      const handleSync = (parsed) => {
        setInputs(prev => {
          const next = {...prev,
            ...(parsed.sleep!=null?{sleep:Math.min(12,Math.max(0,parsed.sleep))}:{}),
            ...(parsed.glucose!=null?{glucose:Math.min(140,Math.max(60,parsed.glucose))}:{}),
            ...(parsed.hrv!=null?{hrv:Math.min(120,Math.max(20,parsed.hrv))}:{}),
            ...(parsed.steps!=null?{steps:Math.max(0,parsed.steps)}:{}),
            ...(parsed.weight!=null?{weight:Math.max(0,parsed.weight)}:{}),
          };
          LS.set("readiness",next); return next;
        });
        const ts = new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});
        setLastSynced(ts); LS.set("lastHealthSync",ts);
        window.dispatchEvent(new Event("storage"));
      };

      const sleepScore = Math.min(100,(inputs.sleep/8)*100);
      const fastScore  = Math.min(100,(inputs.lastMeal/14)*100);
      const glucScore  = inputs.glucose<90?100:inputs.glucose<100?75:inputs.glucose<110?40:10;
      const hrvScore   = Math.min(100,(inputs.hrv/70)*100);
      const bioScore   = Math.round(sleepScore*0.3+fastScore*0.25+glucScore*0.3+hrvScore*0.15);
      const bioColor   = bioScore>=80?"#34D399":bioScore>=60?"#F59E0B":"#F87171";

      const currentHour = now.getHours();
      const WINDOWS = [
        {id:"pre",label:"Pre-Train",icon:"inject",color:"#34D399",open:5,close:6,blockIdx:0,
          compounds:[{name:"Mots-c",note:"AMPK blunted if glucose elevated"},{name:"Selank",note:"Always effective"},{name:"L-Carnitine",note:"Standalone — do not blend"}]},
        {id:"post",label:"Post-Train",icon:"sun",color:"#F59E0B",open:7,close:10,blockIdx:2,
          compounds:[{name:"AOD-9604",note:"Needs fasted + glucose <95"},{name:"BPC-157",note:"Not fasting-sensitive"},{name:"KPV",note:"Not fasting-sensitive"},{name:"5-Amino-1MQ",note:"Enhanced fasted"}]},
        {id:"eve",label:"Evening Blend",icon:"moon",color:"#A78BFA",open:18,close:24,blockIdx:5,
          compounds:[{name:"Tesamorelin",note:"GH pulse needs ≥6h sleep"},{name:"Ipamorelin",note:"Blunted if sleep-deprived"},{name:"DSIP",note:"Deepens slow-wave sleep"}]},
        {id:"sleep",label:"Pre-Sleep",icon:"sleep",color:"#8B5CF6",open:21,close:24,blockIdx:6,
          compounds:[{name:"Epithalon",note:"Pineal restoration"},{name:"Magnesium",note:"Supports slow-wave sleep"}]},
      ];

      const winStatus = WINDOWS.map(win => {
        const blockItems = DAILY[win.blockIdx]?.items||[];
        const checkedCount = blockItems.filter(it=>chk[`${viewDay}-${win.blockIdx}-${it.name}`]).length;
        const isDone = checkedCount>0;
        const isActive = currentHour>=win.open&&currentHour<win.close;
        const isPast = currentHour>=win.close;
        return {...win,isDone,isActive,isPast,isUpcoming:!isActive&&!isPast,checkedCount,total:blockItems.length};
      });

      const activeWin = winStatus.find(w=>w.isActive);
      const nextWin = winStatus.find(w=>w.isUpcoming);
      const statusText = activeWin
        ? (activeWin.isDone?`${activeWin.label} complete`:`${activeWin.label} — open now`)
        : nextWin ? `Next: ${nextWin.label} at ${nextWin.open>12?nextWin.open-12:nextWin.open}${nextWin.open>=12?"pm":"am"}`
        : "Protocol complete for today";

      return (
        <>
          {showSync&&<HealthSyncModal onSync={handleSync} onClose={()=>setShowSync(false)}/>}
          <div style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:16,marginBottom:12,overflow:"hidden"}}>
            {/* Header */}
            <div onClick={()=>setExpanded(p=>!p)} style={{display:"flex",alignItems:"center",gap:14,padding:"16px",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
              {/* Score ring */}
              <div style={{position:"relative",width:52,height:52,flexShrink:0}}>
                <svg viewBox="0 0 52 52" style={{position:"absolute",inset:0,transform:"rotate(-90deg)"}}>
                  <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4"/>
                  <circle cx="26" cy="26" r="22" fill="none" stroke={bioColor} strokeWidth="4"
                    strokeDasharray={`${2*Math.PI*22}`} strokeDashoffset={`${2*Math.PI*22*(1-bioScore/100)}`}
                    strokeLinecap="round" style={{transition:"stroke-dashoffset 0.5s"}}/>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:bioColor}}>{bioScore}</div>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <span style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.65)",letterSpacing:"0.08em"}}>STACK READINESS</span>
                  {lastSynced&&<span style={{fontSize:13,color:"#34D399",background:"rgba(52,211,153,0.12)",padding:"2px 7px",borderRadius:8}}><Icon name="backup" size={10} color="#34D399" style={{display:"inline-block",verticalAlign:"middle"}}/> {lastSynced}</span>}
                </div>
                <div style={{fontSize:13,fontWeight:500,color:bioColor,marginBottom:4}}>{statusText}</div>
                <div style={{display:"flex",gap:4,flexWrap:"nowrap",overflow:"hidden"}}>
                  {[{icon:"sleep",val:`${inputs.sleep}h`,s:sleepScore},{icon:"glucose",val:`${inputs.glucose}`,s:glucScore},{icon:"hrv",val:`${inputs.hrv}ms`,s:hrvScore},{icon:"train",val:`${inputs.lastMeal}h`,s:fastScore}].map((m,i)=>(
                    <span key={i} style={{fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:3,
                      color:m.s>70?"#34D399":m.s>40?"#F59E0B":"#F87171",
                      background:m.s>70?"rgba(52,211,153,0.1)":m.s>40?"rgba(251,191,36,0.1)":"rgba(248,113,113,0.1)",
                      padding:"2px 6px",borderRadius:6,flexShrink:0}}><Icon name={m.icon} size={10}/>{m.val}</span>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <button onClick={e=>{e.stopPropagation();setShowSync(true)}} style={{background:"rgba(56,189,248,0.1)",border:"1px solid rgba(56,189,248,0.25)",borderRadius:8,padding:"5px 7px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Icon name="backup" size={14} color="#38BDF8"/>
                </button>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{transform:expanded?"rotate(180deg)":"none",transition:"0.2s",color:"rgba(255,255,255,0.65)"}}>
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Expanded bio inputs */}
            {expanded&&(
              <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",padding:"14px 16px"}}>
                <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.65)",letterSpacing:"0.08em",marginBottom:12}}>BIO INPUTS</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                  {[
                    {k:"sleep",label:"Sleep",min:0,max:12,step:0.5,unit:"h",score:sleepScore,sync:true},
                    {k:"lastMeal",label:"Hours Fasted",min:0,max:18,step:0.5,unit:"h",score:fastScore,sync:false},
                    {k:"glucose",label:"Glucose",min:60,max:140,step:1,unit:"mg/dL",score:glucScore,sync:true},
                    {k:"hrv",label:"HRV",min:20,max:120,step:1,unit:"ms",score:hrvScore,sync:true},
                  ].map(f=>(
                    <div key={f.k} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"10px 12px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                        <span style={{fontSize:13,color:"rgba(255,255,255,0.65)"}}>{f.label}{f.sync&&<Icon name="backup" size={10} color="#34D399" style={{marginLeft:4}}/>}</span>
                        <span style={{fontSize:13,fontWeight:600,color:f.score>70?"#34D399":f.score>40?"#F59E0B":"#F87171"}}>{inputs[f.k]}{f.unit}</span>
                      </div>
                      <input type="range" min={f.min} max={f.max} step={f.step} value={inputs[f.k]}
                        onChange={e=>set(f.k,parseFloat(e.target.value))}
                        style={{width:"100%",accentColor:f.score>70?"#34D399":f.score>40?"#F59E0B":"#F87171"}}/>
                    </div>
                  ))}
                </div>
                <button onClick={e=>{e.stopPropagation();setShowSync(true)}} style={{width:"100%",padding:"11px",background:"rgba(56,189,248,0.08)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:10,fontSize:13,fontWeight:600,color:"#38BDF8",cursor:"pointer"}}>
                  Sync from Apple Health
                </button>
              </div>
            )}
          </div>
        </>
      );
    }