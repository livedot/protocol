const renderDiet = () => {
        const dow = new Date().getDay();
        const isSunday = dow === 0;
        const toggleDiet = (id) => toggleExpandedCard(`diet-${id}`, `diet-card-${id}`);

        const meals = isSunday
          ? DIET_MEALS.map(m=>({...m, macros:{...m.macros, c:m.macros.c*2, cal:m.macros.cal+(m.macros.c*4)}}))
          : DIET_MEALS;

        const totalP   = meals.reduce((s,m)=>s+m.macros.p,0);
        const totalC   = meals.reduce((s,m)=>s+m.macros.c,0);
        const totalF   = meals.reduce((s,m)=>s+m.macros.f,0);
        const totalCal = meals.reduce((s,m)=>s+m.macros.cal,0);

        const Chevron = ({open}) => (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{transform:open?"rotate(180deg)":"none",transition:"0.2s",flexShrink:0}}>
            <path d="M4 6l4 4 4-4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );

        const MacroBar = ({p,f,c}) => {
          const total = p*4 + f*9 + c*4;
          if(!total) return null;
          const pPct = Math.round((p*4/total)*100);
          const fPct = Math.round((f*9/total)*100);
          const cPct = 100-pPct-fPct;
          return (
            <div style={{height:5,borderRadius:3,overflow:"hidden",display:"flex",gap:1,marginTop:8}}>
              <div style={{width:`${pPct}%`,background:"#38BDF8",borderRadius:2}}/>
              <div style={{width:`${fPct}%`,background:"#F59E0B",borderRadius:2}}/>
              <div style={{width:`${cPct}%`,background:"#34D399",borderRadius:2}}/>
            </div>
          );
        };

        return (
          <div>

            {isSunday&&(
              <div style={{background:"rgba(245,158,11,0.12)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:14,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:22}}>🔄</div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:"#F59E0B",marginBottom:2}}>Sunday Refeed Active</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.65)"}}>2× carbs today · Resets leptin + glycogen (Trigili)</div>
                </div>
              </div>
            )}

            <SectionLabel>{isSunday?"REFEED TARGETS":"DAILY TARGETS"}</SectionLabel>
            <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"12px 14px",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                  <span style={{fontSize:22,fontWeight:800,color:"#38BDF8",letterSpacing:"-0.5px",lineHeight:1}}>{totalP}g</span>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,letterSpacing:"0.06em"}}>PROTEIN</span>
                </div>
                <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                  <span style={{fontSize:18,fontWeight:700,color:"#fff"}}>{totalCal}</span>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,letterSpacing:"0.06em"}}>KCAL</span>
                </div>
                <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                  <span style={{fontSize:15,fontWeight:700,color:"#F59E0B"}}>{totalF}g</span>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.45)",fontWeight:600}}>FAT</span>
                </div>
                <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                  <span style={{fontSize:15,fontWeight:700,color:"#34D399"}}>{totalC}g</span>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.45)",fontWeight:600}}>CARBS</span>
                </div>
              </div>
              <MacroBar p={totalP} f={totalF} c={totalC}/>
            </div>

            <SectionLabel style={{marginTop:18}}>EATING WINDOW</SectionLabel>
            <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"14px 16px",marginBottom:18}}>
              {[
                {dot:"#A78BFA",label:"Fasted window",detail:"12 AM → 9:30 AM · Protects 5:30 + 7:30 AM injections"},
                {dot:"#34D399",label:"Eating window",detail:"9:30 AM → 6:30 PM · ~9 hrs"},
                {dot:"#818CF8",label:"Shake allowed",detail:"8:00–8:30 PM · Water only, digests before 9 PM GH"},
                {dot:"#A78BFA",label:"GH injection",detail:"9 PM → fasted state required"},
              ].map((row,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:i<3?8:0}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:row.dot,flexShrink:0,marginTop:3}}/>
                  <div>
                    <span style={{fontSize:13,fontWeight:600,color:"#fff"}}>{row.label}</span>
                    <span style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginLeft:6}}>{row.detail}</span>
                  </div>
                </div>
              ))}
            </div>

            <SectionLabel>MEALS</SectionLabel>
            {meals.map((meal,mi)=>{
              const isOpen = expandedCard === `diet-${meal.id}`;
              const isOptional = meal.id === "m4";
              return (
                <div key={meal.id} id={`diet-card-${meal.id}`} style={{marginBottom:10}}>
                  {isOptional&&(
                    <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.35)",letterSpacing:"0.08em",marginBottom:5,paddingLeft:4}}>OPTIONAL — ONLY IF SHORT ON PROTEIN</div>
                  )}

                  <Card>
                    <div onClick={()=>toggleDiet(meal.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                      <div style={{width:38,height:38,borderRadius:10,background:`${meal.color}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <Icon name={meal.icon} size={18} color={meal.color}/>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                          <div style={{fontSize:15,fontWeight:600,color:isOptional?"rgba(255,255,255,0.55)":"#fff"}}>{meal.label}</div>
                          {isOptional&&<div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.07)",padding:"2px 6px",borderRadius:4,letterSpacing:"0.05em"}}>OPT</div>}
                        </div>
                        <div style={{fontSize:13,color:meal.color,fontWeight:600}}>{meal.time}</div>
                      </div>
                      <div style={{textAlign:"right",marginRight:8,flexShrink:0}}>
                        <div style={{fontSize:15,fontWeight:700,color:"#38BDF8"}}>{meal.macros.p}g P</div>
                        <div style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>{meal.macros.cal} cal</div>
                      </div>
                      <Chevron open={isOpen}/>
                    </div>

                    {isOpen&&(
                      <div style={{borderTop:"1px solid rgba(255,255,255,0.08)"}}>
                        <div style={{padding:"10px 16px",background:`${meal.color}0d`,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.55,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                          {meal.note}
                        </div>
                        <div style={{display:"flex",gap:8,padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                          {[["P",meal.macros.p+"g","#38BDF8"],["F",meal.macros.f+"g","#F59E0B"],["C",meal.macros.c+"g","#34D399"],["kcal",meal.macros.cal,"rgba(255,255,255,0.45)"]].map(([l,v,c],i)=>(
                            <div key={i} style={{flex:1,textAlign:"center",background:"rgba(255,255,255,0.05)",borderRadius:8,padding:"7px 4px"}}>
                              <div style={{fontSize:13,fontWeight:700,color:c}}>{v}</div>
                              <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:1}}>{l}</div>
                            </div>
                          ))}
                        </div>
                        {meal.options.map((opt,oi)=>{
                          const optKey=`${meal.id}-opt${oi}`;
                          const optOpen=!!dietOpen[optKey];
                          const optP=opt.items.reduce((s,it)=>s+it.p,0);
                          const optCal=opt.items.reduce((s,it)=>s+it.cal,0);
                          return(
                            <div key={oi} style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                              <div onClick={()=>setDietOpen(p=>({...p,[optKey]:!p[optKey]}))} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                                <div style={{width:6,height:6,borderRadius:"50%",background:meal.color,flexShrink:0}}/>
                                <span style={{flex:1,fontSize:14,fontWeight:500,color:"rgba(255,255,255,0.85)"}}>{opt.label}</span>
                                <span style={{fontSize:13,color:"#38BDF8",fontWeight:600,marginRight:6}}>{optP}g P · {optCal} cal</span>
                                <Chevron open={optOpen}/>
                              </div>
                              {optOpen&&(
                                <div style={{background:"rgba(0,0,0,0.15)",paddingBottom:4}}>
                                  {opt.items.map((item,ii)=>(
                                    <div key={ii} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 16px 9px 28px",borderTop:ii>0?"1px solid rgba(255,255,255,0.05)":"none"}}>
                                      <div style={{flex:1,fontSize:13,color:"rgba(255,255,255,0.8)"}}>{item.name}</div>
                                      <div style={{display:"flex",gap:10,flexShrink:0}}>
                                        <span style={{fontSize:13,color:"#38BDF8",fontWeight:600}}>{item.p}g P</span>
                                        <span style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>{item.cal} cal</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {meal.supps.length>0&&(
                          <div style={{borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                            <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.35)",letterSpacing:"0.08em",padding:"10px 16px 6px"}}>TAKE WITH THIS MEAL</div>
                            {meal.supps.map((s,i)=>(
                              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
                                <div style={{width:6,height:6,borderRadius:"50%",background:meal.color,flexShrink:0}}/>
                                <span style={{fontSize:13,fontWeight:500,color:"rgba(255,255,255,0.85)"}}>{s.name}</span>
                                {s.dose&&<span style={{fontSize:12,color:meal.color,background:`${meal.color}18`,padding:"2px 8px",borderRadius:5,fontWeight:600}}>{s.dose}</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}

            {!isSunday&&(
              <div style={{background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.18)",borderRadius:14,padding:"12px 16px",marginTop:6}}>
                <div style={{fontSize:13,fontWeight:700,color:"#F59E0B",marginBottom:4}}>Sunday Refeed Protocol</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.6}}>2× carbs · Add 200g rice or potato to Meal 2. Resets leptin + glycogen. Prevents adaptive metabolic slowdown at week 8+.</div>
              </div>
            )}

          </div>
        );
      };

      // ─── TAB: SETTINGS (tabs/SettingsTab.jsx)