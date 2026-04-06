function HealthSyncModal({ onSync, onClose }) {
      const [pasteVal, setPasteVal] = useState("");
      const [tab, setTab] = useState("paste");
      const [parsed, setParsed] = useState(null);
      const [error, setError] = useState("");
      const SHORTCUT_INSTRUCTIONS = [
        {step:"1",text:'Open Shortcuts → tap "+" → name it "Protocol Sync"'},
        {step:"2",text:'Add: "Find Health Samples" → Sleep Analysis → Latest 1'},
        {step:"3",text:'Add: "Find Health Samples" → Blood Glucose → Latest 1'},
        {step:"4",text:'Add: "Find Health Samples" → Heart Rate Variability SDNN → Latest 1'},
        {step:"5",text:'Add: "Find Health Samples" → Steps → Latest 1'},
        {step:"6",text:'Add: "Find Health Samples" → Body Mass → Latest 1'},
        {step:"7",text:'Add: "Copy to Clipboard" → text: sleep:[Sleep hours] glucose:[Glucose mg/dL] hrv:[HRV ms] steps:[Steps count] weight:[Body Mass lbs]'},
        {step:"8",text:'Add shortcut to Home Screen for one-tap access'},
      ];
      const tryParse = (raw) => {
        setPasteVal(raw); setError(""); setParsed(null);
        const sleepM=raw.match(/sleep[:\s]+([0-9.]+)/i);
        const glucM =raw.match(/glucose[:\s]+([0-9.]+)/i);
        const hrvM  =raw.match(/hrv[:\s]+([0-9.]+)/i);
        const stepsM=raw.match(/steps[:\s]+([0-9]+)/i);
        const wtM   =raw.match(/weight[:\s]+([0-9.]+)/i);
        if (sleepM||glucM||hrvM||stepsM||wtM) {
          setParsed({sleep:sleepM?parseFloat(sleepM[1]):null,glucose:glucM?parseFloat(glucM[1]):null,
            hrv:hrvM?parseFloat(hrvM[1]):null,steps:stepsM?parseInt(stepsM[1]):null,weight:wtM?parseFloat(wtM[1]):null});
        } else if (raw.trim().length>3) setError("Could not parse. Use format: sleep:7 glucose:88 hrv:55 steps:8000 weight:195");
      };
      const applySync = () => { if (parsed) { onSync(parsed); onClose(); } };

      return (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"0 0 env(safe-area-inset-bottom)"}} onClick={onClose}>
          <div style={{background:"rgba(255,255,255,0.07)",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"85vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:"20px 20px 16px",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
              <div style={{width:40,height:4,borderRadius:2,background:"rgba(255,255,255,0.35)",margin:"0 auto 16px"}}/>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:44,borderRadius:12,background:"rgba(52,211,153,0.12)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Icon name="backup" size={22} color="#34D399"/>
                </div>
                <div>
                  <div style={{fontSize:15,fontWeight:600,color:"#fff"}}>Sync from Apple Health</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.65)",marginTop:2}}>Via iOS Shortcuts</div>
                </div>
                <button onClick={onClose} style={{marginLeft:"auto",background:"none",border:"none",fontSize:20,color:"rgba(255,255,255,0.65)",cursor:"pointer"}}>✕</button>
              </div>
            </div>
            <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
              {[["paste","Paste Data"],["instructions","Setup"]].map(([id,label])=>(
                <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"12px",border:"none",background:"transparent",cursor:"pointer",fontSize:13,fontWeight:tab===id?600:400,color:tab===id?"#38BDF8":"rgba(255,255,255,0.65)",borderBottom:`2px solid ${tab===id?"#38BDF8":"transparent"}`,transition:"all 0.15s"}}>{label}</button>
              ))}
            </div>
            {tab==="paste"&&(
              <div style={{padding:"20px"}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
                  {[{icon:"😴",label:"Sleep",key:"sleep",color:"#A78BFA"},{icon:"🩸",label:"Glucose",key:"glucose",color:"#F87171"},{icon:"💓",label:"HRV",key:"hrv",color:"#38BDF8"},{icon:"👟",label:"Steps",key:"steps",color:"#34D399"},{icon:"⚖️",label:"Weight",key:"weight",color:"#F59E0B"}].map(f=>(
                    <div key={f.key} style={{background:`${f.color}10`,border:`1px solid ${f.color}25`,borderRadius:12,padding:"12px 8px",textAlign:"center"}}>
                      <div style={{fontSize:20,marginBottom:4}}>{f.icon}</div>
                      <div style={{fontSize:13,fontWeight:600,color:f.color}}>{f.label}</div>
                      {parsed&&parsed[f.key]!=null&&<div style={{fontSize:15,fontWeight:700,color:f.color,marginTop:4}}>{parsed[f.key]}</div>}
                    </div>
                  ))}
                </div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.65)",marginBottom:8}}>Run "Protocol Sync" shortcut, then paste below:</div>
                <textarea value={pasteVal} onChange={e=>tryParse(e.target.value)}
                  placeholder={"sleep:7.5 glucose:88 hrv:55 steps:8000 weight:195"}
                  style={{width:"100%",minHeight:80,background:"rgba(255,255,255,0.07)",border:`1px solid ${error?"#F87171":parsed?"#34D399":"rgba(255,255,255,0.12)"}`,borderRadius:10,padding:"12px",fontSize:13,color:"#fff",outline:"none",resize:"vertical",fontFamily:"monospace",boxSizing:"border-box"}}/>
                {error&&<div style={{fontSize:13,color:"#F87171",marginTop:6}}>{error}</div>}
                {parsed&&(
                  <div style={{marginTop:10,padding:"10px 12px",background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:10}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#34D399",marginBottom:6}}>✓ PARSED</div>
                    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                      {parsed.sleep!=null&&<span style={{fontSize:13,color:"#fff"}}>😴 <b>{parsed.sleep}h</b></span>}
                      {parsed.glucose!=null&&<span style={{fontSize:13,color:"#fff"}}>🩸 <b>{parsed.glucose}</b></span>}
                      {parsed.hrv!=null&&<span style={{fontSize:13,color:"#fff"}}>💓 <b>{parsed.hrv}ms</b></span>}
                      {parsed.steps!=null&&<span style={{fontSize:13,color:"#fff"}}>👟 <b>{parsed.steps?.toLocaleString()}</b></span>}
                      {parsed.weight!=null&&<span style={{fontSize:13,color:"#fff"}}>⚖️ <b>{parsed.weight}lbs</b></span>}
                    </div>
                  </div>
                )}
                <button onClick={applySync} disabled={!parsed} style={{width:"100%",marginTop:12,padding:"14px",background:parsed?"linear-gradient(135deg,#34D399,#38BDF8)":"rgba(255,255,255,0.06)",border:"none",borderRadius:12,fontSize:13,fontWeight:600,color:parsed?"#fff":"rgba(255,255,255,0.65)",cursor:parsed?"pointer":"not-allowed"}}>
                  {parsed?"Apply Data":"Paste data above"}
                </button>
              </div>
            )}
            {tab==="instructions"&&(
              <div style={{padding:"20px"}}>
                {SHORTCUT_INSTRUCTIONS.map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-start"}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:"rgba(56,189,248,0.12)",border:"1px solid rgba(56,189,248,0.3)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#38BDF8"}}>{s.step}</div>
                    <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.5,paddingTop:2}}>{s.text}</div>
                  </div>
                ))}
                <div style={{padding:"12px 14px",background:"rgba(167,139,250,0.08)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:10,marginTop:8}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#A78BFA",marginBottom:6}}>OUTPUT FORMAT</div>
                  <code style={{fontSize:13,color:"rgba(255,255,255,0.75)",fontFamily:"monospace",lineHeight:1.6,display:"block"}}>sleep:[v] glucose:[v] hrv:[v] steps:[v] weight:[v]</code>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }