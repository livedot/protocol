function InjectionTimer({ theme, chk={}, viewDay=0 }) {
      const t = theme || C;
      const [now, setNow] = useState(new Date());
      useEffect(() => { const ti = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(ti); }, []);

      const schedule = [
        {label:"Pre-Train",    icon:"inject", color:"#34D399", hour:5,  min:30, closeHour:6,  blockIdx:0},
        {label:"Post-Train",   icon:"sun",    color:"#F59E0B", hour:7,  min:30, closeHour:10, blockIdx:2},
        {label:"Evening Blend",icon:"moon",   color:"#A78BFA", hour:20, min:0,  closeHour:24, blockIdx:6},
        {label:"Pre-Sleep",    icon:"sleep",  color:"#8B5CF6", hour:22, min:0,  closeHour:24, blockIdx:7},
      ];

      const todayMins = now.getHours()*60+now.getMinutes();
      const curHour = now.getHours();

      const enriched = schedule.map(s => {
        const openMins = s.hour*60+s.min;
        const closeMins = s.closeHour*60;
        const isActive = curHour>=s.hour && curHour<s.closeHour;
        const isPast   = todayMins >= closeMins;
        const isUpcoming = !isActive && !isPast;
        const blockItems = DAILY[s.blockIdx]?.items || [];
        const checkedCount = blockItems.filter(it => chk[`${viewDay}-${s.blockIdx}-${it.name}`]).length;
        // also count weekly injections in post-train block
        const weeklyInjs = s.blockIdx===2 ? (WEEKLY_INJECTIONS[viewDay]||[]) : [];
        const weeklyDone = weeklyInjs.filter((_,wi) => chk[`${viewDay}-weekly-${wi}`]).length;
        const total = blockItems.length + weeklyInjs.length;
        const done = checkedCount + weeklyDone;
        return {...s, openMins, isActive, isPast, isUpcoming, done, total};
      });

      const nextWin = enriched.find(s=>s.isActive) || enriched.find(s=>s.isUpcoming) || enriched[0];
      const diffMins = nextWin.openMins > todayMins ? nextWin.openMins - todayMins : (24*60 - todayMins) + nextWin.openMins;
      const hrs = Math.floor(diffMins/60), mins = diffMins%60;

      return (
        <div style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:16,marginBottom:12,overflow:"hidden"}}>
          <div style={{padding:"14px 16px 4px"}}>
            <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.65)",letterSpacing:"0.08em",marginBottom:10}}>NEXT INJECTION</div>
            {enriched.map((s,i)=>{
              const isNext = s.label === nextWin.label;
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{width:32,height:32,borderRadius:9,background:`${s.color}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon name={s.icon} size={15} color={s.color}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                      <span style={{fontSize:13,fontWeight:isNext?600:400,color:s.isPast?"rgba(255,255,255,0.45)":isNext?"#fff":"rgba(255,255,255,0.75)",textDecoration:s.isPast?"line-through":"none"}}>{s.label}</span>
                      {s.isActive&&<span style={{fontSize:11,fontWeight:700,color:s.color,background:`${s.color}18`,padding:"2px 6px",borderRadius:6}}>NOW</span>}
                      {isNext&&!s.isActive&&<span style={{fontSize:11,fontWeight:700,color:"#F59E0B",background:"rgba(245,158,11,0.12)",padding:"2px 6px",borderRadius:6}}>NEXT · {hrs>0?`${hrs}h `:""}${mins}m</span>}
                      {s.isPast&&s.done===s.total&&s.total>0&&<span style={{fontSize:11,color:"#34D399"}}>✓</span>}
                      {s.isPast&&s.done<s.total&&<span style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.35)"}}>missed</span>}
                      {s.isUpcoming&&!isNext&&<span style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{s.hour>12?s.hour-12:s.hour}:{String(s.min).padStart(2,"0")} {s.hour<12?"AM":"PM"}</span>}
                    </div>
                    <div style={{height:4,background:"rgba(255,255,255,0.08)",borderRadius:2,overflow:"hidden"}}>
                      <div style={{height:"100%",borderRadius:2,
                        background: s.done===s.total&&s.total>0 ? "#34D399" : s.color,
                        width: s.total>0 ? `${(s.done/s.total)*100}%` : "0%",
                        transition:"width 0.3s"}}/>
                    </div>
                  </div>
                  <span style={{fontSize:13,color:"rgba(255,255,255,0.5)",flexShrink:0,minWidth:28,textAlign:"right"}}>{s.done}/{s.total}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }