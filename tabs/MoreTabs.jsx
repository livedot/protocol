const renderTools = () => <ReconCalcWizard onSave={saveDose} onDelete={deleteDose} savedDoses={savedDoses}/>;

      // ─── Card primitives ──────────────────────────────────────────────────────
      const Card = ({children, style={}}) => (
        <div style={{background:"rgba(255,255,255,0.07)",borderRadius:16,border:"1px solid rgba(255,255,255,0.08)",overflow:"hidden",...style}}>
          {children}
        </div>
      );
      const CardHeader = ({icon,iconColor="#F59E0B",title,subtitle,right}) => (
        <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px"}}>
          <div style={{width:38,height:38,borderRadius:10,background:`${iconColor}22`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name={icon} size={18} color={iconColor}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:15,fontWeight:600,color:"#fff",marginBottom:right?0:2}}>{title}</div>
            {subtitle&&<div style={{fontSize:13,color:"rgba(255,255,255,0.75)",marginTop:2}}>{subtitle}</div>}
          </div>
          {right&&<div style={{flexShrink:0}}>{right}</div>}
        </div>
      );
      const Divider = () => <div style={{height:1,background:"rgba(255,255,255,0.06)",marginLeft:16}}/>;
      const SectionLabel = ({children,style={}}) => (
        <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.65)",letterSpacing:"0.08em",marginBottom:10,...style}}>{children}</div>
      );
      const Tag = ({children,color}) => (
        <span style={{fontSize:11,color:color||"rgba(255,255,255,0.65)",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.08)",padding:"2px 7px",borderRadius:20,display:"inline-block",whiteSpace:"nowrap"}}>{children}</span>
      );
      const Row = ({left,right,sub,dot,last=false}) => (
        <div style={{padding:"13px 16px",borderBottom:last?"none":"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              {dot&&<div style={{width:7,height:7,borderRadius:"50%",background:dot,flexShrink:0}}/>}
              <span style={{fontSize:15,fontWeight:500,color:"#fff"}}>{left}</span>
            </div>
            {right&&<div style={{flexShrink:0,marginLeft:12}}>{right}</div>}
          </div>
          {sub&&<div style={{fontSize:13,color:"rgba(255,255,255,0.75)",marginTop:4,paddingLeft:dot?17:0,lineHeight:1.5}}>{sub}</div>}
        </div>
      );

      // ─── Weekly ───────────────────────────────────────────────────────────────
      const renderWeekly = () => {
        const DAY_META = {
          0:{icon:"moon",  color:"#8B5CF6"},
          1:{icon:"inject",color:T.rose},
          2:{icon:"pill",  color:"rgba(255,255,255,0.65)"},
          3:{icon:"inject",color:T.teal},
          4:{icon:"pill",  color:"rgba(255,255,255,0.65)"},
          5:{icon:"inject",color:T.violet},
          6:{icon:"pill",  color:"rgba(255,255,255,0.65)"},
        };
        return (
          <div>
            {Object.entries(DAY_NOTES).map(([dow])=>{
              const d=parseInt(dow);
              const injs=WEEKLY_INJECTIONS[d]||[];
              const isToday=d===new Date().getDay();
              const meta=DAY_META[d];
              return (
                <Card key={d} style={{marginBottom:10,border:isToday?"1px solid rgba(255,255,255,0.18)":"1px solid rgba(255,255,255,0.07)"}}>
                  <CardHeader
                    icon={meta.icon} iconColor={meta.color}
                    title={DAY_NAMES[d]}
                    subtitle={DAY_NOTES[d].note}
                    right={isToday&&<span style={{fontSize:13,fontWeight:700,color:meta.color,background:`${meta.color}20`,padding:"3px 9px",borderRadius:20,letterSpacing:"0.05em"}}>TODAY</span>}
                  />
                  {injs.length>0&&(
                    <>
                      <Divider/>
                      <div style={{padding:"12px 16px 4px"}}>
                        <SectionLabel style={{marginBottom:8}}>{injs.length} INJECTION{injs.length>1?"S":""} THIS DAY</SectionLabel>
                        {injs.map((inj,j)=>(
                          <div key={j} style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:12}}>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <div style={{width:7,height:7,borderRadius:"50%",background:inj.color,flexShrink:0}}/>
                              <span style={{fontSize:15,fontWeight:500,color:"#fff"}}>{inj.name}</span>
                            </div>
                            <span style={{fontSize:13,color:"rgba(255,255,255,0.75)"}}>{inj.dose}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </Card>
              );
            })}
          </div>
        );
      };

      // ─── Blending ─────────────────────────────────────────────────────────────
      // ─── TAB: BLENDING (tabs/BlendingTab.jsx)
      const renderBlending = () => (
        <div>
          <SectionLabel>INJECTION BLENDS</SectionLabel>
          {BLENDS.map((bl,i)=>{
            const cardId = `blend-${bl.id}`;
            const isOpen = expandedCard === cardId;
            const toggle = () => toggleExpandedCard(cardId, `blend-card-${bl.id}`);
            return (
              <Card key={i} id={`blend-card-${bl.id}`} style={{marginBottom:10}}>
                <div onClick={toggle} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                  <div style={{width:34,height:34,borderRadius:9,background:`${bl.color}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon name={bl.icon} size={17} color={bl.color}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:15,fontWeight:600,color:"#fff",marginBottom:2}}>{bl.label}</div>
                    <span style={{fontSize:12,color:bl.color,background:`${bl.color}18`,padding:"2px 8px",borderRadius:6,fontWeight:600}}>{bl.time}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                    <span style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>{bl.items.length}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{transform:isOpen?"rotate(180deg)":"none",transition:"0.2s"}}>
                      <path d="M4 6l4 4 4-4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                {isOpen && (
                  <>
                    <Divider/>
                    <div style={{padding:"12px 16px 4px"}}>
                      <SectionLabel style={{marginBottom:10}}>{bl.items.length} COMPOUNDS</SectionLabel>
                      {bl.items.map((item,j)=>{
                        const text = typeof item === "string" ? item : item.text;
                        const days = typeof item === "object" ? item.days : null;
                        const itemNote = typeof item === "object" ? item.note : null;
                        const blendName = text.split(" — ")[0].trim();
                        return (
                          <div key={j} style={{paddingBottom:10,borderBottom:j<bl.items.length-1?"1px solid rgba(255,255,255,0.08)":"none",marginBottom:j<bl.items.length-1?10:4}}>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <div style={{width:6,height:6,borderRadius:"50%",background:bl.color,flexShrink:0}}/>
                              <span style={{fontSize:13,color:"rgba(255,255,255,0.75)",flex:1}}>{text}</span>
                              {days&&days.map(d=>(
                                <span key={d} style={{fontSize:11,fontWeight:700,color:bl.color,background:`${bl.color}18`,border:`1px solid ${bl.color}33`,padding:"2px 6px",borderRadius:8,letterSpacing:"0.04em",flexShrink:0}}>{d}</span>
                              ))}
                              <UnitTag name={blendName}/>
                            </div>
                            {itemNote&&<div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:4,paddingLeft:16}}>{itemNote}</div>}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{margin:"0 16px 14px",padding:"10px 12px",background:"rgba(255,255,255,0.04)",borderRadius:10,fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.6}}>
                      {bl.note.split(". ").filter(Boolean).map((s,i,arr)=>(
                        <div key={i} style={{marginBottom:i<arr.length-1?6:0}}>{s}</div>
                      ))}
                    </div>
                  </>
                )}
              </Card>
            );
          })}
        </div>
      );

      // ─── Cycle & Labs ─────────────────────────────────────────────────────────
      const renderCycle = () => (
        <div>
          <SectionLabel>CYCLE STRUCTURE — 20 WEEKS</SectionLabel>
          {PHASES.map((p,i)=>(
            <Card key={i} style={{marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px"}}>
                <div style={{width:38,height:38,borderRadius:10,background:`${p.color}22`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:17,fontWeight:700,color:p.color}}>{i+1}</span>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:600,color:"#fff",marginBottom:2}}>{p.phase}</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    <Tag>{p.dur}</Tag>
                  </div>
                </div>
              </div>
              <Divider/>
              <div style={{padding:"12px 16px",fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.65}}>{p.focus}</div>
            </Card>
          ))}

          <SectionLabel style={{marginTop:20}}>BLOODWORK TARGETS</SectionLabel>
          <Card>
            {BLOODWORK.map((b,i)=>(
              <div key={i} style={{padding:"13px 16px",borderBottom:i<BLOODWORK.length-1?"1px solid rgba(255,255,255,0.08)":"none"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
                  <span style={{fontSize:15,fontWeight:500,color:"#fff"}}>{b.marker}{b.t&&<span style={{color:T.rose,marginLeft:5,fontSize:13}}>★</span>}</span>
                  <span style={{fontSize:13,color:"rgba(255,255,255,0.65)"}}>{b.freq}</span>
                </div>
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                  <span style={{fontSize:13,color:T.green,background:`${T.green}18`,padding:"3px 9px",borderRadius:8}}>✓ {b.target}</span>
                  <span style={{fontSize:13,color:T.rose,background:`${T.rose}18`,padding:"3px 9px",borderRadius:8}}>⚠ {b.flag}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      );

      // ─── Stack ────────────────────────────────────────────────────────────────
      const renderSynergy = () => {
        const LAYER_ICONS  = {"Hormonal Foundation":"inject","GH Axis":"hrv","Fat Loss":"exit","Recovery":"pill","Sleep & CNS":"sleep","Organ Protection":"pill","Supplement Synergy":"pill"};
        const LAYER_COLORS = {"Hormonal Foundation":T.cyan,"GH Axis":T.violet,"Fat Loss":T.amber,"Recovery":T.teal,"Sleep & CNS":"#8B5CF6","Organ Protection":T.rose,"Supplement Synergy":T.rose};
        const peptideLayers=[...new Set(SYNERGY.filter(s=>!s.supp).map(s=>s.layer))];
        const suppItems=SYNERGY.filter(s=>s.supp);
        const toggleLayer = (layer) => toggleExpandedCard(`stack-${layer}`, `stack-layer-${layer.replace(/\s+/g,'-')}`);
        const Chevron = ({open}) => (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{transform:open?"rotate(180deg)":"none",transition:"0.2s",flexShrink:0}}>
            <path d="M4 6l4 4 4-4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
        return (
          <div>
            <SectionLabel>PEPTIDE STACK</SectionLabel>
            {peptideLayers.map(layer=>{
              const items=SYNERGY.filter(s=>s.layer===layer&&!s.supp);
              const lc=LAYER_COLORS[layer]; const li=LAYER_ICONS[layer];
              const isOpen = expandedCard === `stack-${layer}`;
              return (
                <Card key={layer} id={`stack-layer-${layer.replace(/\s+/g,'-')}`} style={{marginBottom:10}}>
                  <div onClick={()=>toggleLayer(layer)} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                    <div style={{width:32,height:32,borderRadius:9,background:`${lc}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <Icon name={li} size={16} color={lc}/>
                    </div>
                    <span style={{fontSize:13,fontWeight:700,color:lc,letterSpacing:"0.06em",textTransform:"uppercase",flex:1}}>{layer}</span>
                    <span style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginRight:6}}>{items.length}</span>
                    <Chevron open={isOpen}/>
                  </div>
                  {isOpen&&(
                    <div style={{borderTop:"1px solid rgba(255,255,255,0.07)"}}>
                      {items.map((syn,i)=>(
                        <div key={i} style={{padding:"13px 16px",borderBottom:i<items.length-1?"1px solid rgba(255,255,255,0.07)":"none"}}>
                          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:5}}>
                            <div style={{width:6,height:6,borderRadius:"50%",background:lc,flexShrink:0}}/>
                            <span style={{fontSize:15,fontWeight:600,color:"#fff"}}>{syn.combo}</span>
                          </div>
                          <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.6,paddingLeft:15}}>{syn.role}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}

            <SectionLabel style={{marginTop:20}}>SUPPLEMENT SYNERGIES</SectionLabel>
            <Card id="stack-supps" style={{marginBottom:20}}>
              <div onClick={()=>toggleExpandedCard('stack-supps','stack-supps')} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 16px",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                <span style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.75)"}}>How orals amplify the peptide stack</span>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>{suppItems.length}</span>
                  <Chevron open={expandedCard==='stack-supps'}/>
                </div>
              </div>
              {expandedCard==='stack-supps'&&(
                <div style={{borderTop:"1px solid rgba(255,255,255,0.07)"}}>
                  {suppItems.map((syn,i)=>(
                    <div key={i} style={{padding:"13px 16px",borderBottom:i<suppItems.length-1?"1px solid rgba(255,255,255,0.07)":"none"}}>
                      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:5}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:syn.color,flexShrink:0}}/>
                        <span style={{fontSize:15,fontWeight:600,color:"#fff"}}>{syn.combo}</span>
                      </div>
                      <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.6,paddingLeft:15}}>{syn.role}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <SectionLabel>DAILY SUPPLEMENTS</SectionLabel>
            <Card id="stack-daily-supps">
              <div onClick={()=>toggleExpandedCard('stack-daily-supps','stack-daily-supps')} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 16px",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                <span style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.75)"}}>Oral compounds & timing</span>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>{SUPPS.length}</span>
                  <Chevron open={expandedCard==='stack-daily-supps'}/>
                </div>
              </div>
              {expandedCard==='stack-daily-supps'&&(
                <div style={{borderTop:"1px solid rgba(255,255,255,0.07)"}}>
                  {SUPPS.map((sup,i)=>(
                    <div key={i} style={{padding:"13px 16px",borderBottom:i<SUPPS.length-1?"1px solid rgba(255,255,255,0.07)":"none"}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
                        <div style={{display:"flex",alignItems:"center",gap:9}}>
                          <div style={{width:6,height:6,borderRadius:"50%",background:T.amber,flexShrink:0}}/>
                          <span style={{fontSize:15,fontWeight:500,color:"#fff"}}>{sup.name}{sup.t&&<span style={{color:T.rose,fontSize:13,marginLeft:5}}>★</span>}</span>
                        </div>
                        <Tag>{sup.cat}</Tag>
                      </div>
                      <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",paddingLeft:15,marginBottom:3}}>{sup.dose} · {sup.timing}</div>
                      <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.55,paddingLeft:15}}>{sup.purpose}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        );
      };

      // ─── Inventory ────────────────────────────────────────────────────────────
      // ─── Taper Off ────────────────────────────────────────────────────────────
      const renderExit = () => (
        <div>
          <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,107,138,0.3)",borderRadius:16,padding:"16px",marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:700,color:T.rose,marginBottom:8}}>⚠ {EXIT_PROBLEM.title}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.65}}>{EXIT_PROBLEM.body}</div>
          </div>

          <SectionLabel>RETATRUTIDE TAPER</SectionLabel>
          <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"16px",marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:0,overflow:"auto"}}>
              {[{dose:"4mg",label:"Full Dose",color:T.rose},{dose:"2mg",label:"Wk 1–2",color:T.amber},{dose:"1mg",label:"Wk 3–4",color:T.amber},{dose:"0.5mg",label:"Wk 5–6",color:T.green},{dose:"Off",label:"Bridge",color:"rgba(255,255,255,0.65)"}].map((s,i,arr)=>(
                <div key={i} style={{display:"flex",alignItems:"center",flex:1,minWidth:0}}>
                  <div style={{flex:1,textAlign:"center"}}>
                    <div style={{fontSize:15,fontWeight:700,color:s.color}}>{s.dose}</div>
                    <div style={{fontSize:13,color:"rgba(255,255,255,0.65)",marginTop:3}}>{s.label}</div>
                  </div>
                  {i<arr.length-1&&<div style={{width:20,height:2,background:"rgba(255,255,255,0.25)",flexShrink:0}}/>}
                </div>
              ))}
            </div>
          </div>

          <SectionLabel>EXIT STEPS</SectionLabel>
          <Card>
            {EXIT.map((e,i)=>(
              <div key={i} style={{padding:"16px",borderBottom:i<EXIT.length-1?"1px solid rgba(255,255,255,0.08)":"none"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                  <div style={{width:36,height:36,borderRadius:10,background:`${e.color}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon name={i===0?"today":i===1?"exit":i===2?"train":i===3?"meal":i===4?"pill":"inject"} size={16} color={e.color}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:15,fontWeight:600,color:"#fff",marginBottom:3}}>{e.step}</div>
                    <div style={{fontSize:13,color:"rgba(255,255,255,0.65)",marginBottom:6}}>{e.detail}</div>
                    <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.6}}>{e.action}</div>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      );