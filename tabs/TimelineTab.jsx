const renderTimeline = () => {
              const TIMELINE_PHASES = [
                {
                  id:"p1", label:"Weeks 1–4", title:"Adaptation & Titration",
                  startWeek:1, endWeek:4, color:C.amber,
                  subtitle:"Full peptide stack starts Day 1. Retatrutide titration only. Baseline bloodwork.",
                  outcomes:[
                    "Full stack running from Day 1 — only Reta dose is being titrated",
                    "Appetite suppression within 3–7 days",
                    "Mild nausea from Reta — resolves by week 2",
                    "Fasted glucose stabilizing on CGM",
                    "Initial visceral fat mobilization begins",
                  ],
                  milestones:[
                    "Retatrutide: 0.5mg → 1mg",
                    "Baseline bloodwork (IGF-1, fasting insulin, CMP)",
                    "All oral supplements introduced",
                    "Injection technique dialed in",
                  ],
                  retatrutide:"0.5 → 1mg",
                },
                {
                  id:"p2", label:"Weeks 5–12", title:"Primary Fat Loss",
                  startWeek:5, endWeek:12, color:C.cyan,
                  subtitle:"Full stack running. Maximum fat oxidation. Muscle preservation.",
                  outcomes:[
                    "1–2 lbs fat loss per week",
                    "Improved body composition visibly",
                    "CGM glucose flattening",
                    "Better sleep quality from DSIP + Epithalon",
                    "Joint/gut recovery from BPC-157 + KPV",
                  ],
                  milestones:[
                    "Retatrutide: 1mg → 2mg",
                    "Bloodwork at week 6 (adjust if needed)",
                    "InBody/DEXA scan at week 8",
                    "AOD-9604 fasted window optimized",
                  ],
                  retatrutide:"1 → 2mg",
                },
                {
                  id:"p3", label:"Weeks 13–20", title:"Recomp & Peak",
                  startWeek:13, endWeek:20, color:C.violet,
                  subtitle:"Body recomp phase. GH peptides prioritized. DEXA-guided adjustment.",
                  outcomes:[
                    "Lean mass maintained or gained",
                    "Visceral fat near target",
                    "HRV and recovery improving",
                    "Skin and connective tissue improvement from GHK-Cu",
                  ],
                  milestones:[
                    "Retatrutide: 2mg → 2–4mg (DEXA-guided)",
                    "DEXA scan at week 12 — adjust protocol",
                    "Bloodwork at week 14",
                    "Evaluate BPC-157/KPV cycle status",
                  ],
                  retatrutide:"2 → 4mg",
                },
                {
                  id:"p4", label:"Week 20", title:"Assessment & Exit Decision",
                  startWeek:20, endWeek:20, color:C.green,
                  subtitle:"Final DEXA + full bloodwork. Trigger exit or extend.",
                  outcomes:[
                    "Target body fat % reached",
                    "All bloodwork markers in range",
                    "Lean mass delta measured",
                    "Metabolic flexibility maintained",
                  ],
                  milestones:[
                    "Final DEXA scan + InBody",
                    "Full bloodwork panel",
                    "Exit protocol decision",
                    "Transition to maintenance stack",
                  ],
                  retatrutide:"Taper or maintain",
                },
              ];

              const currentWeek = protocolWeek || 0;

              return (
                <div style={{paddingBottom:24}}>
                  <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.5)",letterSpacing:"0.08em",marginBottom:16}}>20-WEEK PROTOCOL TIMELINE</div>

                  {/* Timeline */}
                  <div style={{position:"relative"}}>
                    {/* Vertical line */}
                    <div style={{position:"absolute",left:52,top:8,bottom:8,width:2,background:"rgba(255,255,255,0.08)",borderRadius:1}}/>

                    {TIMELINE_PHASES.map((phase, pi) => {
                      const isActive = currentWeek >= phase.startWeek && currentWeek <= phase.endWeek;
                      const isPast = currentWeek > phase.endWeek;
                      const isFuture = currentWeek < phase.startWeek;
                      const expanded = expandedCard === `timeline-${phase.id}`;
                      const toggleExpanded = () => toggleExpandedCard(`timeline-${phase.id}`, `timeline-phase-${phase.id}`);

                      return (
                        <div key={phase.id} id={`timeline-phase-${phase.id}`} style={{display:"flex",gap:12,marginBottom:10,position:"relative"}}>
                          {/* Week label + dot */}
                          <div style={{width:38,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",paddingTop:2}}>
                            <div style={{fontSize:11,fontWeight:700,color:isActive?phase.color:isPast?"#34D399":"rgba(255,255,255,0.3)",marginBottom:5,whiteSpace:"nowrap",letterSpacing:"0.04em"}}>{phase.label.split("–")[0].trim()}</div>
                            <div style={{width:12,height:12,borderRadius:"50%",background:isActive?phase.color:isPast?"#34D399":"rgba(255,255,255,0.15)",border:`2px solid ${isActive?phase.color:isPast?"#34D399":"rgba(255,255,255,0.2)"}`,boxShadow:isActive?`0 0 10px ${phase.color}80`:"none",flexShrink:0,zIndex:1}}/>
                          </div>

                          {/* Card */}
                          <div style={{flex:1,background:isActive?`${phase.color}18`:"rgba(255,255,255,0.08)",border:`1px solid ${isActive?`${phase.color}40`:isPast?"rgba(52,211,153,0.2)":"rgba(255,255,255,0.1)"}`,borderRadius:14,overflow:"hidden",opacity:(protocolStartDate&&isFuture)?0.6:1,transition:"all 0.2s"}}>
                            {/* Header */}
                            <div onClick={toggleExpanded} style={{padding:"11px 14px",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
                                <div style={{display:"flex",alignItems:"center",gap:7}}>
                                  <span style={{fontSize:15,fontWeight:600,color:isActive?phase.color:isPast?"#34D399":"#fff"}}>{phase.title}</span>
                                  {isActive&&<span style={{fontSize:11,fontWeight:700,color:phase.color,background:`${phase.color}20`,padding:"2px 7px",borderRadius:6,letterSpacing:"0.06em"}}>NOW</span>}
                                  {isPast&&<span style={{fontSize:11,fontWeight:700,color:"#34D399",background:"rgba(52,211,153,0.12)",padding:"2px 7px",borderRadius:6}}>✓</span>}
                                </div>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{transform:expanded?"rotate(180deg)":"none",transition:"0.2s",flexShrink:0}}>
                                  <path d="M4 6l4 4 4-4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:7}}>{phase.subtitle}</div>
                              <span style={{fontSize:12,fontWeight:700,color:C.rose,background:"rgba(248,113,113,0.12)",border:"1px solid rgba(248,113,113,0.2)",padding:"2px 8px",borderRadius:6}}>Reta: {phase.retatrutide}</span>
                            </div>

                            {/* Expanded content */}
                            {expanded && (
                              <div style={{borderTop:"1px solid rgba(255,255,255,0.07)",background:"rgba(0,0,0,0.35)"}}>
                                {/* Outcomes */}
                                <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.45)",letterSpacing:"0.08em",marginBottom:8}}>WHAT TO EXPECT</div>
                                  {phase.outcomes.map((o,i)=>(
                                    <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:6}}>
                                      <div style={{width:6,height:6,borderRadius:"50%",background:phase.color,flexShrink:0,marginTop:5}}/>
                                      <span style={{fontSize:13,color:"#fff",lineHeight:1.5}}>{o}</span>
                                    </div>
                                  ))}
                                </div>
                                {/* Milestones */}
                                <div style={{padding:"12px 16px"}}>
                                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.45)",letterSpacing:"0.08em",marginBottom:8}}>MILESTONES</div>
                                  {phase.milestones.map((m,i)=>(
                                    <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:6}}>
                                      <div style={{fontSize:12,color:phase.color,flexShrink:0,marginTop:1}}>◆</div>
                                      <span style={{fontSize:13,color:"#fff",lineHeight:1.5}}>{m}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            };