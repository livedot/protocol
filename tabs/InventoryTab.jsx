const renderOrders = () => {
        const total=ORDERS.reduce((s,o)=>{const n=parseFloat(o.cost.replace(/[^0-9.]/g,""));return s+(isNaN(n)?0:n);},0);
        const SC={covered:T.green,topup:T.amber,backup:"rgba(255,255,255,0.65)",ordered:T.cyan,needed:T.rose};
        const SRC={"HE Peptides":T.cyan,"zztai Peptide":T.violet,"Hebei Feisite":T.teal};
        const sel=(col)=>({background:"rgba(255,255,255,0.07)",border:"none",color:col,borderRadius:8,
          padding:"2px 20px 2px 7px",fontSize:11,fontWeight:600,outline:"none",cursor:"pointer",
          appearance:"none",WebkitAppearance:"none",
          backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,0.3)'/%3E%3C/svg%3E")`,
          backgroundRepeat:"no-repeat",backgroundPosition:"right 8px center"});
        return (
          <div>
            {/* Cost summary */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
              {[{label:"Total",value:`$${total.toLocaleString()}`,color:T.cyan},{label:"Per Week",value:"~$73",color:T.green},{label:"Per Day",value:"~$10",color:T.amber}].map((s,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
                  <div style={{fontSize:14,fontWeight:700,color:s.color,marginBottom:2}}>{s.value}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Peptides */}
            <SectionLabel>PEPTIDES</SectionLabel>
            <Card style={{marginBottom:20}}>
              {ORDERS.map((o,i)=>{
                const cs=orderStatuses[i]||o.status; const sc=SC[cs]||"rgba(255,255,255,0.65)";
                const cSrc=orderSources[i]||o.src;
                const totalMg = parseTotalMg(o.mg);
                const remMg = invRemaining[i] ?? totalMg;
                const pct = totalMg > 0 ? Math.max(0, Math.min(100, (remMg / totalMg) * 100)) : null;
                const remColor = pct === null ? T.muted : pct > 50 ? T.green : pct > 20 ? T.amber : T.rose;
                const fmtMg = (mg) => mg >= 1000 ? `${(mg/1000).toFixed(2).replace(/\.?0+$/,"")}g` : `${parseFloat(mg.toFixed(2))}mg`;
                return (
                  <div key={i} style={{padding:"14px 16px",borderBottom:i<ORDERS.length-1?"1px solid rgba(255,255,255,0.08)":"none"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <div style={{width:7,height:7,borderRadius:"50%",background:sc,flexShrink:0}}/>
                        <span style={{fontSize:13,fontWeight:500,color:"#fff"}}>{o.name}</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        {pct !== null && remMg !== totalMg && <span style={{fontSize:13,fontWeight:700,color:remColor}}>{fmtMg(remMg)} left</span>}
                        {pct !== null && remMg !== totalMg && (
                          <span onClick={()=>{
                            setInvRemaining(prev=>{const next={...prev,[i]:totalMg};LS.set("invRemaining",next);return next;});
                          }} style={{fontSize:11,color:"rgba(255,255,255,0.3)",cursor:"pointer",WebkitTapHighlightColor:"transparent",padding:"2px 6px",background:"rgba(255,255,255,0.06)",borderRadius:5}}>reset</span>
                        )}
                        <span style={{fontSize:13,fontWeight:600,color:T.green}}>{o.cost}</span>
                      </div>
                    </div>
                    {pct !== null && remMg !== totalMg && (
                      <div style={{marginBottom:8,paddingLeft:16}}>
                        <div style={{height:4,background:"rgba(255,255,255,0.08)",borderRadius:2,overflow:"hidden"}}>
                          <div style={{height:"100%",borderRadius:2,width:`${pct}%`,background:remColor,transition:"width 0.4s"}}/>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                          <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>0</span>
                          <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{o.mg} total</span>
                        </div>
                      </div>
                    )}
                    <div style={{display:"flex",gap:5,marginBottom:9,paddingLeft:16,flexWrap:"nowrap",alignItems:"center"}}>
                      {[o.spec,`Qty ${o.qty}`].map((t,j)=><Tag key={j}>{t}</Tag>)}
                      <select value={cSrc} onChange={e=>{const s=window.scrollY;setOrderSource(i,e.target.value);requestAnimationFrame(()=>window.scrollTo(0,s));}} style={sel(SRC[cSrc]||T.muted)}>{SOURCES.map(s=><option key={s}>{s}</option>)}</select>
                      <select value={cs} onChange={e=>{const s=window.scrollY;setOrderStatus(i,e.target.value);requestAnimationFrame(()=>window.scrollTo(0,s));}} style={sel(sc)}>
                        <option value="covered">Covered</option><option value="topup">Top-up</option>
                        <option value="backup">Backup</option><option value="ordered">Ordered</option>
                        <option value="needed">Needed</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </Card>

            {/* Supplements */}
            <SectionLabel>SUPPLEMENTS</SectionLabel>
            <Card style={{marginBottom:20}}>
              {LOCAL_SUPPS.map((ls,i)=>{
                const cs=suppStatuses[i]||"needed"; const sc=SC[cs]||"rgba(255,255,255,0.65)";
                return (() => {
                  const totalCt = parseSuppCount(ls.spec);
                  const remCt = suppInvRemaining[i] ?? totalCt;
                  const pct = totalCt ? Math.round((remCt / totalCt) * 100) : null;
                  const remColor = pct === null ? T.muted : pct > 50 ? T.green : pct > 20 ? T.amber : T.rose;
                  return (
                  <div key={i} style={{padding:"14px 16px",borderBottom:i<LOCAL_SUPPS.length-1?"1px solid rgba(255,255,255,0.08)":"none"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <div style={{width:7,height:7,borderRadius:"50%",background:sc,flexShrink:0}}/>
                        <span style={{fontSize:13,fontWeight:500,color:"#fff"}}>{ls.name}</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        {pct !== null && remCt !== totalCt && <span style={{fontSize:13,fontWeight:700,color:remColor}}>{remCt} left</span>}
                        {pct !== null && remCt !== totalCt && (
                          <span onClick={()=>{setSuppInvRemaining(prev=>{const next={...prev,[i]:totalCt};LS.set("suppInvRemaining",next);return next;});}} style={{fontSize:11,color:"rgba(255,255,255,0.3)",cursor:"pointer",WebkitTapHighlightColor:"transparent",padding:"2px 6px",background:"rgba(255,255,255,0.06)",borderRadius:5}}>reset</span>
                        )}
                        <span style={{fontSize:13,fontWeight:600,color:T.green}}>{ls.cost}</span>
                      </div>
                    </div>
                    {pct !== null && remCt !== totalCt && (
                      <div style={{marginBottom:8,paddingLeft:16}}>
                        <div style={{height:4,background:"rgba(255,255,255,0.08)",borderRadius:2,overflow:"hidden"}}>
                          <div style={{height:"100%",borderRadius:2,width:`${pct}%`,background:remColor,transition:"width 0.4s"}}/>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                          <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>0</span>
                          <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{totalCt} total</span>
                        </div>
                      </div>
                    )}
                    <div style={{display:"flex",gap:5,paddingLeft:16,flexWrap:"nowrap",alignItems:"center"}}>
                      {ls.spec&&ls.spec!=="—"&&<Tag>{ls.spec}</Tag>}
                      {ls.brand&&<Tag color={T.green}>{ls.brand}</Tag>}
                      <select value={cs} onChange={e=>{const s=window.scrollY;setSuppStatus(i,e.target.value);requestAnimationFrame(()=>window.scrollTo(0,s));}} style={sel(sc)}>
                        <option value="covered">Covered</option><option value="ordered">Ordered</option>
                        <option value="topup">Top-up</option><option value="needed">Needed</option>
                        <option value="backup">Backup</option>
                      </select>
                    </div>
                  </div>
                  );
                })();
              })}
            </Card>

            {/* Supplies */}
            <SectionLabel>SUPPLIES</SectionLabel>
            <Card>
              {SHOPPING_LIST.map((item,i)=>{
                const cs=shopStatuses[i]||"needed"; const sc=SC[cs]||"rgba(255,255,255,0.65)";
                return (
                  <div key={i} style={{padding:"14px 16px",borderBottom:i<SHOPPING_LIST.length-1?"1px solid rgba(255,255,255,0.08)":"none"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <div style={{width:7,height:7,borderRadius:"50%",background:sc,flexShrink:0}}/>
                        <span style={{fontSize:15,fontWeight:500,color:"#fff"}}>{item.item}</span>
                      </div>
                      <span style={{fontSize:13,fontWeight:600,color:T.green}}>{item.est}</span>
                    </div>
                    <div style={{display:"flex",gap:6,marginBottom:9,paddingLeft:16,flexWrap:"wrap"}}>
                      <Tag>{item.spec}</Tag><Tag>Qty {item.qty}</Tag>
                    </div>
                    <div style={{paddingLeft:16}}>
                      <select value={cs} onChange={e=>{const s=window.scrollY;setShopStatus(i,e.target.value);requestAnimationFrame(()=>window.scrollTo(0,s));}} style={sel(sc)}>
                        <option value="covered">Covered</option><option value="ordered">Ordered</option>
                        <option value="topup">Top-up</option><option value="needed">Needed</option>
                        <option value="backup">Backup</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        );
      };

      // ─── TAB: DIET (tabs/DietTab.jsx)