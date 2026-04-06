const renderSettings = () => {
              const SettingRow = ({icon, iconColor, label, subtitle, right, onPress}) => (
                <div onClick={onPress} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",cursor:onPress?"pointer":"default",WebkitTapHighlightColor:"transparent"}}>
                  <div style={{width:34,height:34,borderRadius:9,background:`${iconColor}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon name={icon} size={17} color={iconColor}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:15,fontWeight:500,color:"#fff"}}>{label}</div>
                    {subtitle&&<div style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginTop:2}}>{subtitle}</div>}
                  </div>
                  {right&&<div style={{flexShrink:0}}>{right}</div>}
                </div>
              );

              const Toggle = ({value, onToggle, color="#A78BFA"}) => (
                <div onClick={onToggle} style={{width:51,height:31,borderRadius:16,cursor:"pointer",background:value?color:"rgba(255,255,255,0.2)",position:"relative",transition:"background 0.25s",flexShrink:0}}>
                  <div style={{position:"absolute",top:2,left:value?"calc(100% - 29px)":"2px",width:27,height:27,borderRadius:"50%",background:"#fff",transition:"left 0.25s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
                </div>
              );

              const Divider = () => <div style={{height:1,background:"rgba(255,255,255,0.06)",marginLeft:16}}/>;

              return (
                <div>
                  {/* Protocol */}
                  {/* Schedule Configurator */}
                  <SectionLabel>DISPLAY</SectionLabel>
                  <Card style={{marginBottom:16}}>
                    <SettingRow icon="appearance" iconColor={T.amber} label="Background"
                      subtitle={bgMode === 'night' ? 'Night — deep dark sky' : 'Day — bright sky blue'}
                      right={
                        <div style={{display:"flex",gap:4,background:"rgba(255,255,255,0.07)",borderRadius:20,padding:3}}>
                          {["day","night"].map(m=>(
                            <div key={m} onClick={()=>{ setBgModeState(m); window.setBgMode(m); }} style={{padding:"5px 14px",borderRadius:16,fontSize:12,fontWeight:600,cursor:"pointer",WebkitTapHighlightColor:"transparent",background:bgMode===m?"rgba(167,139,250,0.3)":"transparent",color:bgMode===m?"#A78BFA":"rgba(255,255,255,0.4)",transition:"all 0.2s"}}>
                              {m==="day"?"☀️ Day":"🌙 Night"}
                            </div>
                          ))}
                        </div>
                      }
                    />
                  </Card>

                  <SectionLabel>DAY SCHEDULE</SectionLabel>
                  {["weekday","weekend"].map(dayType => {
                    const s = userSchedule[dayType];
                    const cardId = `schedule-${dayType}`;
                    const isOpen = expandedCard === cardId;
                    const slots = dayType === "weekday"
                      ? [
                          {key:"preTrain", label:"Pre-Train Blend", color:T.green},
                          {key:"training", label:"Training", color:T.amber},
                          {key:"postTrain", label:"Post-Train Blend", color:T.amber},
                          {key:"coffee",   label:"First Coffee", color:T.amber},
                          {key:"meal1",    label:"Meal 1", color:T.teal},
                          {key:"meal2",    label:"Meal 2", color:T.teal},
                          {key:"meal3",    label:"Meal 3", color:T.teal},
                          {key:"evening",  label:"Evening Blend", color:T.violet},
                          {key:"sleep",    label:"Pre-Sleep", color:"#8B7FE8"},
                        ]
                      : [
                          {key:"morning",  label:"Morning Blend", color:T.green},
                          {key:"coffee",   label:"Coffee + Meal 1", color:T.amber},
                          {key:"meal1",    label:"Meal 1", color:T.teal},
                          {key:"meal2",    label:"Meal 2", color:T.teal},
                          {key:"meal3",    label:"Meal 3", color:T.teal},
                          {key:"evening",  label:"Evening Blend", color:T.violet},
                          {key:"sleep",    label:"Pre-Sleep", color:"#8B7FE8"},
                        ];
                    return (
                      <Card key={dayType} style={{marginBottom:10}}>
                        <div onClick={()=>toggleExpandedCard(cardId, `schedule-card-${dayType}`)} id={`schedule-card-${dayType}`} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 16px",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                          <span style={{fontSize:15,fontWeight:500,color:"#fff"}}>{dayType === "weekday" ? "Weekdays (Mon–Fri)" : "Weekends (Sat–Sun)"}</span>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontSize:13,color:"rgba(255,255,255,0.35)"}}>{slots.length}</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{transform:isOpen?"rotate(180deg)":"none",transition:"0.2s",flexShrink:0}}>
                              <path d="M4 6l4 4 4-4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                        {isOpen && (
                          <div style={{borderTop:"1px solid rgba(255,255,255,0.07)"}}>
                            {slots.map((slot,si) => {
                              const val = s[slot.key] ?? 0;
                              const hrs = Math.floor(val);
                              const mins = Math.round((val - hrs) * 60);
                              return (
                                <div key={slot.key} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                                  <div style={{width:8,height:8,borderRadius:"50%",background:slot.color,flexShrink:0}}/>
                                  <span style={{fontSize:14,fontWeight:500,color:"#fff",flex:1}}>{slot.label}</span>
                                  <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                                    <select
                                      value={hrs}
                                      onChange={e=>{const s=window.scrollY;updateSchedule(dayType,slot.key,parseInt(e.target.value)+mins/60);requestAnimationFrame(()=>window.scrollTo(0,s));}}
                                      style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#fff",fontSize:13,fontWeight:600,padding:"5px 8px",outline:"none",cursor:"pointer"}}
                                    >
                                      {Array.from({length:24},(_,i)=>(<option key={i} value={i}>{i===0?12:i>12?i-12:i}</option>))}
                                    </select>
                                    <select
                                      value={mins}
                                      onChange={e=>{const s=window.scrollY;updateSchedule(dayType,slot.key,hrs+parseInt(e.target.value)/60);requestAnimationFrame(()=>window.scrollTo(0,s));}}
                                      style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#fff",fontSize:13,fontWeight:600,padding:"5px 8px",outline:"none",cursor:"pointer"}}
                                    >
                                      {[0,15,30,45].map(m=>(<option key={m} value={m}>{String(m).padStart(2,"0")}</option>))}
                                    </select>
                                    <span style={{fontSize:12,color:"rgba(255,255,255,0.4)",minWidth:22}}>{hrs<12?"AM":"PM"}</span>
                                  </div>
                                </div>
                              );
                            })}
                            <div onClick={resetSchedule} style={{padding:"12px 16px",fontSize:13,color:"rgba(255,255,255,0.35)",cursor:"pointer",WebkitTapHighlightColor:"transparent",textAlign:"center",borderTop:"1px solid rgba(255,255,255,0.06)"}}>Reset to defaults</div>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                  
                  <SectionLabel>PROTOCOL</SectionLabel>
                  <Card style={{marginBottom:16}}>
                    <SettingRow icon="today" iconColor={T.violet} label="Protocol Day"
                      subtitle={protocolStartDate ? `Day ${protocolDay} · Week ${protocolWeek} of 20` : "Not started"}
                      right={protocolStartDate&&<button onClick={resetProtocol} style={{background:"rgba(248,113,113,0.12)",border:"none",borderRadius:8,padding:"6px 12px",fontSize:13,fontWeight:600,color:"#F87171",cursor:"pointer"}}>Reset</button>}
                    />
                    <Divider/>
                    <SettingRow icon="today" iconColor={T.amber} label="Start Date"
                      subtitle={protocolStartDate ? new Date(protocolStartDate).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}) : "Tap to start"}
                      onPress={!protocolStartDate?startProtocol:undefined}
                      right={!protocolStartDate&&<span style={{fontSize:13,color:T.amber}}>Start ›</span>}
                    />
                  </Card>

                  {/* Display */}
                  {/* Data */}
                  <SectionLabel>DATA</SectionLabel>
                  <Card style={{marginBottom:16}}>
                    <SettingRow icon="inventory" iconColor={T.green} label="Reset Peptide Inventory"
                      subtitle="Restore all peptide stock to original quantities"
                      onPress={()=>{
                        const fresh = {};
                        ORDERS.forEach((o,i)=>{ const t=parseTotalMg(o.mg); if(t!==null) fresh[i]=t; });
                        setInvRemaining(fresh); LS.set("invRemaining",fresh);
                      }}
                      right={<span style={{fontSize:13,color:T.rose}}>Reset</span>}
                    />
                    <Divider/>
                    <SettingRow icon="inventory" iconColor={T.teal} label="Reset Supplement Inventory"
                      subtitle="Restore all supplement counts to original quantities"
                      onPress={()=>{
                        const fresh = {};
                        LOCAL_SUPPS.forEach((ls,i)=>{ const t=parseSuppCount(ls.spec); if(t!==null) fresh[i]=t; });
                        setSuppInvRemaining(fresh); LS.set("suppInvRemaining",fresh);
                      }}
                      right={<span style={{fontSize:13,color:T.rose}}>Reset</span>}
                    />
                    <Divider/>
                    <SettingRow icon="calculator" iconColor={T.amber} label="Clear Saved Doses"
                      subtitle="Remove all calculator results"
                      onPress={()=>{ setSavedDoses({}); LS.set("savedDoses",{}); }}
                      right={<span style={{fontSize:13,color:T.rose}}>Clear</span>}
                    />
                    <Divider/>
                    <SettingRow icon="today" iconColor={T.rose} label="Clear All Checklists"
                      subtitle="Wipes all daily check history"
                      onPress={()=>{
                        for(let i=0;i<90;i++){const d=new Date();d.setDate(d.getDate()-i);localStorage.removeItem(`chk-${d.toISOString().split("T")[0]}`);}
                        setChk({});
                      }}
                      right={<span style={{fontSize:13,color:T.rose}}>Clear</span>}
                    />
                  </Card>

                  {/* App info */}
                  <SectionLabel>APP</SectionLabel>
                  <Card style={{marginBottom:16}}>
                    <SettingRow icon="stack" iconColor="rgba(255,255,255,0.4)" label="Protocol Version"
                      subtitle="Nick Trigili 20-Week Fat Loss & Recomp"
                      right={<span style={{fontSize:13,color:"rgba(255,255,255,0.3)"}}>v2.0</span>}
                    />
                    <Divider/>
                    <SettingRow icon="backup" iconColor="rgba(255,255,255,0.4)" label="Backup & Restore"
                      subtitle="Export or import your data"
                      onPress={()=>{setTab("backup");setShowMore(false);}}
                      right={<span style={{fontSize:15,color:"rgba(255,255,255,0.4)"}}>›</span>}
                    />
                  </Card>
                </div>
              );
            };