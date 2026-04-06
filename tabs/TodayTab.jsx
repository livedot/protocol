const renderDaily = () => {
        const today=new Date().getDay(); const weeklyInjs=WEEKLY_INJECTIONS[viewDay]||[];
        const dayInfo=DAY_NOTES[viewDay]; const isToday=viewDay===today;
        const isSunday=viewDay===0;
        const isWeekend = viewDay === 0 || viewDay === 6;

        // ── Build unified timeline ──────────────────────────────────────────
        const timeline = [];

        const sched = isWeekend ? userSchedule.weekend : userSchedule.weekday;

        if (isWeekend) {
          const preTrain = DAILY[0];
          const postTrain = DAILY[2];
          const electrolytes = DAILY[1];
          const mergedItems = [...preTrain.items, ...electrolytes.items, ...postTrain.items];
          const extraItems = weeklyInjs.map((w, wi) => ({
            name: w.name, dose: w.dose, method: w.method, purpose: w.purpose,
            note: w.note, color: w.color, t: false, cycle: {type:"daily"},
            weekly: true, weeklyIdx: wi,
          }));
          timeline.push({
              sortHour: sched.morning, type: "inject", key: "daily-merged",
              label: "Morning Blend — Fasted", time: fmtHour(sched.morning),
              color: C.green, icon: "inject",
              blend: `${blendNote("pre-train")} ${blendNote("post-train-a")} ${blendNote("aod")}`,
              items: [...mergedItems, ...extraItems], bi: 0,
            });
          [6, 7].forEach(bi => {
            const blk = DAILY[bi];
            if (!blk) return;
            const slotKey = bi === 6 ? "evening" : "sleep";
            const sh = sched[slotKey] ?? blk.timeHour;
            timeline.push({
              sortHour: sh, type: "inject", key: `daily-${bi}`,
              label: blk.label, time: fmtHour(sh), color: blk.color, icon: blk.icon,
              blend: blk.blend || null, items: blk.items, bi,
            });
          });
        } else {
          DAILY.forEach((blk, bi) => {
            if (blk.icon === "meal") return;
            const slotMap = {0:"preTrain", 1:"training", 2:"postTrain", 3:"coffee", 6:"evening", 7:"sleep"};
            const slotKey = slotMap[bi];
            const sh = slotKey ? (sched[slotKey] ?? blk.timeHour) : blk.timeHour;
            const extraItems = bi === 2
              ? weeklyInjs.map((w, wi) => ({
                  name: w.name, dose: w.dose, method: w.method, purpose: w.purpose,
                  note: w.note, color: w.color, t: false, cycle: {type:"daily"},
                  weekly: true, weeklyIdx: wi,
                }))
              : [];
            timeline.push({
              sortHour: sh, type: "inject", key: `daily-${bi}`,
              label: blk.label, time: slotKey ? fmtHour(sh) : blk.time,
              color: blk.color, icon: blk.icon,
              blend: blk.blend || null, items: [...blk.items, ...extraItems], bi,
            });
          });
        }

        // 2) Diet meals (from DIET_MEALS) — insert in time order
        const mealHours = {
          m1: sched.meal1,
          m2: sched.meal2,
          m3: sched.meal3,
          m4: 20.25,
        };
        const activeMeals = isSunday
          ? DIET_MEALS.filter(m=>m.id!=="m3").map(m=>m.id==="m2"?{...m,macros:{...m.macros,c:m.macros.c*2,cal:m.macros.cal+(m.macros.c*4)}}:m)
          : DIET_MEALS;
        // Filter out disabled meals

        activeMeals.forEach(meal => {
          timeline.push({
            sortHour: mealHours[meal.id] || 12, type: "meal", key: `meal-${meal.id}`,
            label: meal.label, time: fmtHour(mealHours[meal.id] || 12),
            color: meal.color, icon: meal.icon,
            mealId: meal.id, mealNote: meal.note, mealOptions: meal.options,
            mealSupps: meal.supps, macros: meal.macros, optional: meal.id === "m4",
          });
        });

        // Sort by hour
        timeline.sort((a,b) => a.sortHour - b.sortHour);

        // ── Count trackable items for progress ──────────────────────────────
        let totalItems = 0, totalDone = 0;
        // DAILY items — only count cycle-active ones, skip weekly items (counted below)
        DAILY.forEach((blk, bi) => {
          blk.items.forEach(it => {
            if (it.weekly) return;
            const cs = getCycleStatus(it, protocolDay, viewDay);
            if (!cs.active) return;
            totalItems++;
            if (chk[`${viewDay}-${bi}-${it.name}`]) totalDone++;
          });
        });
        // Weekly injs
        weeklyInjs.forEach((_,wi) => {
          totalItems++;
          if (chk[`${viewDay}-weekly-${wi}`]) totalDone++;
        });
        // Diet meals (each meal = 1 checkable)
        activeMeals.forEach(meal => {
          if (meal.id !== "m4") { totalItems++; if (chk[`${viewDay}-meal-${meal.id}`]) totalDone++; }
        });

        const pct = totalItems > 0 ? Math.round((totalDone/totalItems)*100) : 0;

        // ── Sub-components ─────────────────────────────────────────────────
        const Chevron = ({open}) => (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{transform:open?"rotate(180deg)":"none",transition:"0.2s",flexShrink:0}}>
            <path d="M4 6l4 4 4-4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );

        const CheckBox = ({done, color}) => (
          <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,
            border:`2px solid ${done ? color : "rgba(255,255,255,0.35)"}`,
            background: done ? color : "transparent",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:12,color:"#fff",fontWeight:700,transition:"all 0.18s"}}>
            {done && "✓"}
          </div>
        );

        // Render a single timeline entry card
        const scrollToCard = (id) => setTimeout(() => document.getElementById(id)?.scrollIntoView({behavior:"smooth", block:"start"}), 50);

        const TimelineCard = ({entry}) => {
          const cardKey = entry.key;
          const isExpanded = expandedCard === `today-${cardKey}`;
          const toggleCard = () => toggleExpandedCard(`today-${cardKey}`, `card-${cardKey}`);

          // ── MEAL card ────────────────────────────────────────────────────
          if (entry.type === "meal") {
            const mealDone = !!chk[`${viewDay}-meal-${entry.mealId}`];
            const checkMeal = () => check(`${viewDay}-meal-${entry.mealId}`);
            const optKey = `${viewDay}-mealopt-${entry.mealId}`;
            const suppTotal = entry.mealSupps.length;
            const suppDone = entry.mealSupps.filter((_,i)=>!!chk[`${viewDay}-mealsupp-${entry.mealId}-${i}`]).length;
            const allDone = mealDone && (suppTotal === 0 || suppDone === suppTotal);
            return (
              <div id={`card-${cardKey}`} style={{marginBottom:8}}>
                {entry.optional && (
                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.3)",letterSpacing:"0.08em",marginBottom:4,paddingLeft:2}}>OPTIONAL — ONLY IF SHORT ON PROTEIN</div>
                )}
                <div style={{background:allDone?"rgba(52,211,153,0.06)":"rgba(255,255,255,0.07)",border:`1px solid ${allDone?"rgba(52,211,153,0.3)":"rgba(255,255,255,0.08)"}`,borderLeft:`3px solid ${allDone?"#34D399":entry.color}`,borderRadius:14,overflow:"hidden",transition:"all 0.2s"}}>
                  <div onClick={toggleCard} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                    <div style={{width:30,height:30,borderRadius:8,background:allDone?"rgba(52,211,153,0.2)":`${entry.color}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {allDone
                        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        : <Icon name={entry.icon} size={17} color={entry.color}/>
                      }
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3,flexWrap:"wrap"}}>
                        <span style={{fontSize:15,fontWeight:600,color:allDone?"#34D399":"#fff"}}>{entry.label}</span>
                        {entry.optional&&<div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.07)",padding:"2px 6px",borderRadius:4,letterSpacing:"0.05em"}}>OPT</div>}
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:13,color:allDone?"#34D399":entry.color,fontWeight:600,background:allDone?"rgba(52,211,153,0.12)":`${entry.color}18`,padding:"2px 8px",borderRadius:6}}>{allDone?"✓ Complete":entry.time}</span>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                      {suppTotal > 0 && (
                        <span style={{fontSize:13,color:suppDone===suppTotal&&mealDone?"#34D399":"rgba(255,255,255,0.45)",fontWeight:suppDone===suppTotal&&mealDone?600:400}}>{mealDone?suppDone:0}/{suppTotal}</span>
                      )}
                      <Chevron open={isExpanded}/>
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{borderTop:"1px solid rgba(255,255,255,0.08)"}}>
                      {/* Mark eaten row */}
                      <div onClick={checkMeal} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 12px",borderBottom:"1px solid rgba(255,255,255,0.06)",cursor:"pointer",background:mealDone?"rgba(52,211,153,0.06)":"transparent",WebkitTapHighlightColor:"transparent"}}>
                        <CheckBox done={mealDone} color={entry.color}/>
                        <span style={{fontSize:14,fontWeight:600,color:mealDone?"#34D399":"rgba(255,255,255,0.65)"}}>{mealDone?"Meal logged ✓":"Mark meal as eaten"}</span>
                        <span style={{fontSize:12,color:"#38BDF8",background:"rgba(56,189,248,0.15)",padding:"2px 8px",borderRadius:5,fontWeight:700}}>{entry.macros.p}g P</span>
                      </div>
                      {/* Protocol note */}
                      <div style={{padding:"10px 14px",background:`${entry.color}0d`,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.55,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                        {entry.mealNote}
                      </div>
                      {/* Supplements with this meal */}
                      {entry.mealSupps.length > 0 && (
                        <div style={{borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                          <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.3)",letterSpacing:"0.08em",padding:"10px 14px 6px"}}>TAKE WITH THIS MEAL</div>
                          {entry.mealSupps.map((s,i)=>{
                            const sk=`${viewDay}-mealsupp-${entry.mealId}-${i}`;
                            const sdone=!!chk[sk];
                            return(
                              <div key={i} onClick={()=>{const wasChecked=!!chk[sk];check(sk);adjustSuppInv(s.name,getActiveDose(s.dose,s.name),!wasChecked);}} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderTop:"1px solid rgba(255,255,255,0.05)",cursor:"pointer",background:sdone?"rgba(52,211,153,0.04)":"transparent",WebkitTapHighlightColor:"transparent"}}>
                                <CheckBox done={sdone} color={entry.color}/>
                                <span style={{fontSize:14,fontWeight:500,color:sdone?"rgba(255,255,255,0.4)":"#fff",textDecoration:sdone?"line-through":"none"}}>{s.name}</span>
                                {s.dose&&<span style={{fontSize:12,color:entry.color,background:`${entry.color}18`,padding:"2px 8px",borderRadius:5,fontWeight:600}}>{getActiveDose(s.dose,s.name)}</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // ── WEEKLY INJECTION card ─────────────────────────────────────────
          // ── INJECT / TRAIN / COFFEE card ──────────────────────────────────
          const doneCount = entry.items.filter(it=>{
            if (it.weekly) return !!chk[`${viewDay}-weekly-${it.weeklyIdx}`];
            const cs = getCycleStatus(it, protocolDay, viewDay);
            return cs.active && chk[`${viewDay}-${entry.bi}-${it.name}`];
          }).length;
          const activeCount = entry.items.filter(it=>it.weekly || getCycleStatus(it,protocolDay,viewDay).active).length;
          const allDone = activeCount > 0 && doneCount === activeCount;
          return (
            <div id={`card-${cardKey}`} style={{background:allDone?"rgba(52,211,153,0.06)":"rgba(255,255,255,0.07)",border:`1px solid ${allDone?"rgba(52,211,153,0.3)":"rgba(255,255,255,0.08)"}`,borderLeft:`3px solid ${allDone?"#34D399":entry.color}`,borderRadius:14,marginBottom:6,overflow:"hidden",transition:"all 0.2s"}}>
              <div onClick={toggleCard} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                <div style={{width:30,height:30,borderRadius:8,background:allDone?"rgba(52,211,153,0.2)":`${entry.color}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {allDone
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : <Icon name={entry.icon} size={17} color={entry.color}/>
                  }
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:15,fontWeight:600,color:allDone?"#34D399":"#fff",marginBottom:3}}>{entry.label}</div>
                  <span style={{fontSize:13,color:allDone?"#34D399":entry.color,background:allDone?"rgba(52,211,153,0.12)":`${entry.color}18`,padding:"2px 8px",borderRadius:6,fontWeight:600}}>{allDone?"✓ Complete":entry.time}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                  <span style={{fontSize:13,color:allDone?"#34D399":"rgba(255,255,255,0.5)",fontWeight:allDone?600:400}}>{doneCount}/{activeCount}</span>
                  <Chevron open={isExpanded}/>
                </div>
              </div>
              {isExpanded && (
                <div style={{borderTop:"1px solid rgba(255,255,255,0.08)"}}>
                  {entry.items.map((item,ii) => {
                    const isWeekly = !!item.weekly;
                    const k = isWeekly
                      ? `${viewDay}-weekly-${item.weeklyIdx}`
                      : `${viewDay}-${entry.bi}-${item.name}`;
                    const done=chk[k];
                    const cs = isWeekly ? {active:true,tag:null} : getCycleStatus(item, protocolDay, viewDay);
                    const itemColor = item.color || entry.color;
                    const activeDose = getActiveDose(item.dose, item.name);
                    const itemDoseMg = parseDoseMg(item.dose, item.name);
                    return (
                      <div key={ii} onClick={cs.active?()=>{check(k, item.name, itemDoseMg); if(!item.weekly && !PEPTIDE_LIST.includes(item.name)) adjustSuppInv(item.name, activeDose, !chk[k]);} :undefined} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 12px",borderBottom:ii<entry.items.length-1?"1px solid rgba(255,255,255,0.07)":"none",cursor:cs.active?"pointer":"default",background:done?"rgba(52,211,153,0.04)":!cs.active?"rgba(0,0,0,0.15)":"transparent",WebkitTapHighlightColor:"transparent",opacity:cs.active?1:0.45}}>
                        <CheckBox done={done} color={cs.active?itemColor:"rgba(255,255,255,0.2)"}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3,flexWrap:"wrap"}}>
                            <span style={{fontSize:15,fontWeight:500,color:done?"rgba(255,255,255,0.45)":cs.active?"#fff":"rgba(255,255,255,0.4)",textDecoration:done?"line-through":"none"}}>{item.name}</span>
                            {isWeekly && <span style={{fontSize:11,fontWeight:700,color:itemColor,background:`${itemColor}18`,padding:"2px 6px",borderRadius:10,letterSpacing:"0.04em"}}>WEEKLY</span>}
                            <UnitTag name={item.name}/>
                            {cs.active
                              ? <span style={{fontSize:12,color:itemColor,background:`${itemColor}18`,padding:"2px 7px",borderRadius:5}}>{activeDose}</span>
                              : <span style={{fontSize:11,fontWeight:700,color:"#F87171",background:"rgba(248,113,113,0.12)",border:"1px solid rgba(248,113,113,0.25)",padding:"2px 8px",borderRadius:5,letterSpacing:"0.04em"}}>{cs.tag}</span>
                            }
                            {cs.active && <span style={{fontSize:12,color:"rgba(255,255,255,0.55)",background:"rgba(255,255,255,0.06)",padding:"2px 7px",borderRadius:5}}>{item.method}</span>}
                            {cs.active && cs.tag && <span style={{fontSize:11,fontWeight:600,color:"#34D399",background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.2)",padding:"2px 7px",borderRadius:5}}>{cs.tag}</span>}
                            {item.t && cs.active && <span style={{fontSize:12,color:"#F87171",background:"rgba(248,113,113,0.12)",padding:"2px 6px",borderRadius:5}}>★</span>}
                          </div>
                          {cs.active && <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.5}}>{item.purpose}</div>}
                          {cs.active && item.note && <div style={{fontSize:12,color:itemColor,background:`${itemColor}0f`,border:`1px solid ${itemColor}22`,borderRadius:6,padding:"4px 8px",marginTop:4}}>{item.note}</div>}
                          {!cs.active && item.cycle?.note && <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",lineHeight:1.4}}>{item.cycle.note}</div>}
                        </div>
                      </div>
                    );
                  })}
                  {entry.blend && (
                    <div style={{margin:"0 14px 12px",padding:"10px 12px",background:"rgba(255,255,255,0.04)",borderRadius:10,fontSize:13,color:"rgba(255,255,255,0.75)",fontWeight:400,lineHeight:1.6}}>
                      {entry.blend.split(". ").filter(Boolean).map((s,i,arr)=>(
                        <div key={i} style={{marginBottom:i<arr.length-1?6:0}}>{s}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        };

        if (!protocolStartDate) {
          return (
            <div style={{
              height:"calc(100vh - 80px)",
              maxHeight:"calc(100vh - 80px)",
              overflow:"hidden",
              overscrollBehavior:"contain",
              display:"flex", flexDirection:"column",
              justifyContent:"center",
              padding:`calc(env(safe-area-inset-top) + 40px) 24px calc(env(safe-area-inset-bottom) + 24px)`,
              gap:32,
            }}>
              <div style={{textAlign:"center"}}>
                <div style={{width:64,height:64,borderRadius:18,background:"rgba(167,139,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
                  <Icon name="inject" size={28} color="#A78BFA"/>
                </div>
                <div style={{fontSize:20,fontWeight:700,color:"#fff"}}>Protocol Not Started</div>
              </div>
              <div>
                {!showStartConfirm ? (
                  <button onClick={()=>setShowStartConfirm(true)} style={{width:"100%",padding:"17px",background:"linear-gradient(180deg,#F5A94A 0%,#F08C28 100%)",border:"none",borderRadius:28,fontSize:17,fontWeight:600,color:"#fff",cursor:"pointer"}}>
                    Start Protocol Today
                  </button>
                ) : (
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    <div style={{fontSize:13,color:"#F5A94A",fontWeight:600,textAlign:"center"}}>⚠ This sets today as Day 1. Ready?</div>
                    <div style={{display:"flex",gap:10}}>
                      <button onClick={startProtocol} style={{flex:2,padding:"15px",background:"#34D399",border:"none",borderRadius:28,fontSize:15,fontWeight:600,color:"#fff",cursor:"pointer"}}>Start Now</button>
                      <button onClick={()=>setShowStartConfirm(false)} style={{flex:1,padding:"15px",background:"rgba(255,255,255,0.1)",border:"none",borderRadius:28,fontSize:15,fontWeight:600,color:"rgba(255,255,255,0.75)",cursor:"pointer"}}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }

        return (
          <div style={{padding:"0 16px"}}>
            {renderDaySelector()}

            {isToday&&<><ReadinessScore chk={chk} viewDay={viewDay} theme={T}/><InjectionTimer chk={chk} viewDay={viewDay} theme={T}/></>}

            {isSunday && (
              <div style={{background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.28)",borderRadius:12,padding:"11px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
                <div style={{fontSize:18}}>🔄</div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#F59E0B"}}>Sunday Refeed</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>2× carbs today · Resets leptin + glycogen</div>
                </div>
              </div>
            )}

            <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.4)",letterSpacing:"0.08em",marginBottom:10,marginTop:4}}>TIMELINE — {DAY_NAMES[viewDay].toUpperCase()}</div>

            {timeline.map((entry) => (
              <TimelineCard key={entry.key} entry={entry}/>
            ))}

          </div>
        );
      };