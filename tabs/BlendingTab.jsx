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