// ─── Backup Tab Component ─────────────────────────────────────────────────
    function BackupTab({ theme }) {
      const t = theme || C;
      const [backupStatus, setBackupStatus] = useState(null);
      const [backupMsg, setBackupMsg] = useState("");
      const [restoreStatus, setRestoreStatus] = useState(null);
      const [restoreMsg, setRestoreMsg] = useState("");
      const [history, setHistory] = useState(() => getBackupHistory());
      const [showConfirm, setShowConfirm] = useState(false);
      const [pendingRestore, setPendingRestore] = useState(null);
      const [dataStats] = useState(() => {
        const d = collectAllData();
        const chkKeys = Object.keys(d.keys).filter(k => k.startsWith("chk-"));
        return { total: Object.keys(d.keys).length, days: chkKeys.length };
      });

      // Cloud sync state
      const [cloudUid, setCloudUid] = useState(() => localStorage.getItem('_fbUid') || null);
      const [cloudStatus, setCloudStatus] = useState(window._fbReady ? (window._fbUid ? 'connected' : 'offline') : 'connecting');
      const [linkCode, setLinkCode] = useState('');
      const [linkMsg, setLinkMsg] = useState('');
      const [linking, setLinking] = useState(false);

      useEffect(() => {
        if (!window._fbReady) {
          window._fbOnReady.push(() => {
            setCloudStatus(window._fbUid ? 'connected' : 'offline');
            setCloudUid(window._fbUid);
          });
        }
      }, []);

      const doLinkDevice = async () => {
        const code = linkCode.trim();
        if (!code) return;
        setLinking(true); setLinkMsg('');
        try {
          // Pull data from the entered UID
          await window._fbPull(code);
          // Now also write all our local data to the entered UID going forward
          window._fbUid = code;
          localStorage.setItem('_fbUid', code);
          setCloudUid(code);
          // Push all current local data up to the linked UID
          const allData = collectAllData();
          Object.entries(allData.keys).forEach(([k,v]) => {
            try { window._fbSet(k, JSON.parse(v)); } catch {}
          });
          setLinkMsg('✓ Linked! Data merged. Reload the app to sync.');
          setLinking(false);
        } catch(e) {
          setLinkMsg('Failed to link. Check the code and try again.');
          setLinking(false);
        }
      };

      const doExport = () => {
        try {
          const data = collectAllData();
          const json = JSON.stringify(data, null, 2);
          const blob = new Blob([json], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const date = new Date().toISOString().split("T")[0];
          const a = document.createElement("a");
          a.href = url;
          a.download = `protocol-backup-${date}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          recordBackup();
          setHistory(getBackupHistory());
          setBackupStatus("success");
          setBackupMsg(`protocol-backup-${date}.json downloaded — tap Save to Files → iCloud Drive`);
          setTimeout(() => setBackupStatus(null), 10000);
        } catch (e) {
          setBackupStatus("error");
          setBackupMsg("Export failed: " + e.message);
        }
      };

      const doImport = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const data = JSON.parse(ev.target.result);
            if (!data.keys) throw new Error("Not a valid Protocol backup file");
            const keyCount = Object.keys(data.keys).length;
            const exportDate = data.exportedAt
              ? new Date(data.exportedAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"})
              : "unknown date";
            setPendingRestore({ data, keyCount, exportDate });
            setShowConfirm(true);
          } catch (err) {
            setRestoreStatus("error");
            setRestoreMsg("Invalid file: " + err.message);
          }
        };
        reader.readAsText(file);
        e.target.value = "";
      };

      const confirmRestore = () => {
        try {
          restoreAllData(pendingRestore.data);
          setRestoreStatus("success");
          setRestoreMsg(`Restored ${pendingRestore.keyCount} keys. Reloading in 2s…`);
          setShowConfirm(false);
          setPendingRestore(null);
          setTimeout(() => window.location.reload(), 2000);
        } catch (err) {
          setRestoreStatus("error");
          setRestoreMsg("Restore failed: " + err.message);
          setShowConfirm(false);
        }
      };

      const fmtDate = (iso) => {
        try { return new Date(iso).toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}); }
        catch { return iso; }
      };

      return (
        <div>
          {/* Cloud Sync Status */}
          <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.65)",letterSpacing:"0.08em",marginBottom:10}}>CLOUD SYNC</div>
          <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,overflow:"hidden",marginBottom:16}}>
            <div style={{padding:"14px 16px",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <div style={{width:8,height:8,borderRadius:"50%",flexShrink:0,
                  background:cloudStatus==="connected"?"#34D399":cloudStatus==="connecting"?"#F59E0B":"#F87171",
                  boxShadow:cloudStatus==="connected"?"0 0 6px #34D399":cloudStatus==="connecting"?"0 0 6px #F59E0B":"none"
                }}/>
                <span style={{fontSize:15,fontWeight:600,color:"#fff"}}>
                  {cloudStatus==="connected"?"Syncing to Cloud":cloudStatus==="connecting"?"Connecting…":"Offline — Local Only"}
                </span>
              </div>
              {cloudUid&&(
                <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",fontFamily:"monospace",wordBreak:"break-all",paddingLeft:18}}>
                  Device ID: {cloudUid}
                </div>
              )}
            </div>
            {/* Link another device */}
            <div style={{padding:"14px 16px"}}>
              <div style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.75)",marginBottom:4}}>Link Another Device</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginBottom:10}}>Paste your Device ID from another device to merge and sync data across both.</div>
              <div style={{display:"flex",gap:8}}>
                <input
                  value={linkCode}
                  onChange={e=>setLinkCode(e.target.value)}
                  placeholder="Paste Device ID…"
                  style={{flex:1,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"10px 12px",fontSize:13,color:"#fff",outline:"none",fontFamily:"monospace"}}
                />
                <div onClick={doLinkDevice} style={{padding:"10px 16px",background:"rgba(99,102,241,0.7)",borderRadius:10,fontSize:13,fontWeight:600,color:"#fff",cursor:linking?"not-allowed":"pointer",opacity:linking?0.6:1,flexShrink:0,WebkitTapHighlightColor:"transparent"}}>
                  {linking?"…":"Link"}
                </div>
              </div>
              {linkMsg&&<div style={{fontSize:13,color:linkMsg.startsWith("✓")?"#34D399":"#F87171",marginTop:8}}>{linkMsg}</div>}
            </div>
          </div>

          {/* What's backed up */}
          <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.65)",letterSpacing:"0.08em",marginBottom:10}}>BACKED UP DATA</div>
          <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,overflow:"hidden",marginBottom:16}}>
            {[
              {icon:"today",    label:"Daily checklists",  val:`${dataStats.days} days`,  color:"#34D399"},
              {icon:"inject",   label:"Protocol start date",val:"Included",               color:"#A78BFA"},
              {icon:"inventory",label:"Order statuses",     val:"Included",               color:"#F59E0B"},
              {icon:"pill",     label:"Supplement statuses",val:"Included",               color:"#F87171"},
              {icon:"hrv",      label:"Bio inputs",         val:"Included",               color:"#2DD4BF"},
              {icon:"calculator",label:"Total keys",        val:String(dataStats.total),  color:"#38BDF8"},
            ].map((item,i,arr)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 16px",borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.08)":"none"}}>
                <div style={{width:34,height:34,borderRadius:9,background:`${item.color}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Icon name={item.icon} size={16} color={item.color}/>
                </div>
                <div style={{flex:1,fontSize:15,color:"rgba(255,255,255,0.75)"}}>{item.label}</div>
                <div style={{fontSize:13,fontWeight:600,color:item.color}}>{item.val}</div>
              </div>
            ))}
          </div>

          {/* Export */}
          <button onClick={doExport} style={{width:"100%",padding:"16px",marginBottom:12,background:"linear-gradient(180deg,#F5A94A 0%,#F08C28 100%)",border:"none",borderRadius:28,fontSize:15,fontWeight:700,fontSize:13,fontWeight:600,color:"#fff",cursor:"pointer",WebkitTapHighlightColor:"transparent",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            <Icon name="backup" size={20} color="#fff"/> Export Backup
          </button>

          {backupStatus && (
            <div style={{marginBottom:12,padding:"12px 14px",borderRadius:12,background:backupStatus==="success"?"rgba(52,211,153,0.1)":"rgba(248,113,113,0.1)",border:`1px solid ${backupStatus==="success"?"rgba(52,211,153,0.25)":"rgba(248,113,113,0.25)"}`,fontSize:13,color:backupStatus==="success"?"#34D399":"#F87171",lineHeight:1.6}}>
              {backupStatus==="success"?"✓ ":"⚠ "}{backupMsg}
            </div>
          )}

          {/* Restore */}
          <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.65)",letterSpacing:"0.08em",margin:"20px 0 10px"}}>RESTORE</div>
          <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"16px",marginBottom:12}}>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.6,marginBottom:14}}>
              Choose a <code style={{background:"rgba(255,255,255,0.12)",padding:"2px 6px",borderRadius:6,fontSize:13}}>protocol-backup-*.json</code> from Files or iCloud Drive. Current data will be replaced.
            </div>
            <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"14px",background:"rgba(251,191,36,0.08)",border:"1px dashed rgba(251,191,36,0.35)",borderRadius:12,fontSize:15,fontWeight:600,color:"#F59E0B",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
              <Icon name="backup" size={18} color="#F59E0B"/> Choose Backup File
              <input type="file" accept=".json,application/json" onChange={doImport} style={{display:"none"}}/>
            </label>
            {restoreStatus && (
              <div style={{marginTop:10,padding:"10px 14px",borderRadius:10,background:restoreStatus==="success"?"rgba(52,211,153,0.1)":"rgba(248,113,113,0.1)",border:`1px solid ${restoreStatus==="success"?"rgba(52,211,153,0.25)":"rgba(248,113,113,0.25)"}`,fontSize:13,color:restoreStatus==="success"?"#34D399":"#F87171"}}>
                {restoreStatus==="success"?"✓ ":"⚠ "}{restoreMsg}
              </div>
            )}
          </div>

          {/* Confirm modal */}
          {showConfirm && pendingRestore && (
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:2000,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"0 0 env(safe-area-inset-bottom)"}}>
              <div style={{background:"rgba(255,255,255,0.07)",borderRadius:"20px 20px 0 0",padding:"24px 20px",width:"100%",maxWidth:480}}>
                <div style={{width:40,height:4,borderRadius:2,background:"rgba(255,255,255,0.35)",margin:"0 auto 20px"}}/>
                <div style={{fontSize:15,fontWeight:600,color:"#fff",marginBottom:8,textAlign:"center"}}>Replace All Data?</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.65,marginBottom:24,textAlign:"center"}}>
                  Restoring <span style={{color:"#F59E0B",fontWeight:600}}>{pendingRestore.keyCount} keys</span> from <span style={{color:"#38BDF8",fontWeight:600}}>{pendingRestore.exportDate}</span>. Current data will be overwritten.
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>{setShowConfirm(false);setPendingRestore(null);}} style={{flex:1,padding:"14px",background:"rgba(255,255,255,0.07)",border:"none",borderRadius:28,fontSize:15,fontWeight:600,color:"rgba(255,255,255,0.75)",cursor:"pointer"}}>Cancel</button>
                  <button onClick={confirmRestore} style={{flex:2,padding:"14px",background:"#34D399",border:"none",borderRadius:28,fontSize:15,fontWeight:600,color:"#fff",cursor:"pointer"}}>Restore Now</button>
                </div>
              </div>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <>
              <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.65)",letterSpacing:"0.08em",margin:"20px 0 10px"}}>BACKUP HISTORY</div>
              <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,overflow:"hidden",marginBottom:16}}>
                {history.map((h,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<history.length-1?"1px solid rgba(255,255,255,0.08)":"none"}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:i===0?"#34D399":"rgba(255,255,255,0.35)",flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:15,fontWeight:500,color:i===0?"#fff":"rgba(255,255,255,0.75)"}}>{fmtDate(h.at)}</div>
                      <div style={{fontSize:13,color:"rgba(255,255,255,0.65)",marginTop:1}}>{h.keys} keys</div>
                    </div>
                    {i===0&&<span style={{fontSize:13,fontWeight:700,color:"#34D399",background:"rgba(52,211,153,0.12)",padding:"3px 9px",borderRadius:20}}>latest</span>}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* How-to */}
          <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.65)",letterSpacing:"0.08em",marginBottom:10}}>HOW TO SAVE TO iCLOUD</div>
          <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,overflow:"hidden"}}>
            {[
              'Tap "Export Backup" above',
              'A .json file downloads to your phone',
              'Tap the download → "Save to Files"',
              'Choose iCloud Drive → tap Save',
              'File syncs to all your Apple devices',
            ].map((step,i,arr)=>(
              <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start",padding:"13px 16px",borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.08)":"none"}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:"rgba(167,139,250,0.12)",border:"1px solid rgba(167,139,250,0.25)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#A78BFA"}}>{i+1}</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.5,paddingTop:3}}>{step}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:12,padding:"12px 14px",background:"rgba(167,139,250,0.06)",border:"1px solid rgba(167,139,250,0.15)",borderRadius:12,fontSize:13,color:"rgba(255,255,255,0.75)"}}>
            💡 Back up every Sunday. Takes 10 seconds.
          </div>
        </div>
      );
    }