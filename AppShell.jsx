// ─── Fixed header with back button ──────────────────────────────────────────
    function ScrollHeader({ tab, tabs, protocolDay, protocolWeek, protocolStartDate, onBack }) {
      const tabInfo = tabs.find(t => t.id === tab);
      const textColor = "#fff";
      const mutedColor = "rgba(255,255,255,0.65)";
      return (
        <>
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
            background: "rgba(20,21,45,0.98)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            padding: "calc(env(safe-area-inset-top) + 12px) 20px 12px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <button onClick={onBack} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "4px 8px 4px 0", display: "flex", alignItems: "center",
              WebkitTapHighlightColor: "transparent", flexShrink: 0,
            }}>
              <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
                <path d="M9.5 1.5L1.5 9.5L9.5 17.5"
                  stroke="rgba(255,255,255,0.75)"
                  strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div style={{flex:1}}>
              <div style={{fontSize:17,fontWeight:600,color:"#fff",letterSpacing:"-0.2px",display:"flex",alignItems:"center",gap:8}}>
                {tabInfo && <Icon name={tabInfo.icon} size={17} color={textColor}/>}
                {tabInfo?.label}
              </div>
              {protocolStartDate && (
                <div style={{fontSize:13,color:mutedColor,marginTop:1}}>
                  Day {protocolDay} · Week {protocolWeek} of 20
                </div>
              )}
            </div>
          </div>
          {/* Spacer so content clears the fixed bar */}
          <div style={{height: "calc(env(safe-area-inset-top) + 54px)"}}/>
        </>
      );
    }

    function SwipeBackWrapper({ children, onBack }) {
      const startX = React.useRef(null);
      const startY = React.useRef(null);

      const onTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
        startY.current = e.touches[0].clientY;
      };

      const onTouchEnd = (e) => {
        if (startX.current === null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        const dy = Math.abs(e.changedTouches[0].clientY - startY.current);
        // Only trigger if: started within 40px of left edge, swiped right >60px, mostly horizontal
        if (startX.current < 40 && dx > 60 && dy < 80) {
          onBack();
        }
        startX.current = null;
        startY.current = null;
      };

      return (
        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{flex:1}}>
          {children}
        </div>
      );
    }

    // ─── MAIN APP ──────────────────────────────────────────────────────────────