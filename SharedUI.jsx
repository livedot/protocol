const TAG_T = () => (
      <span style={{background:"rgba(255,107,138,0.15)",color:C.rose,border:"1px solid rgba(255,107,138,0.3)",
        fontSize:13,fontWeight:700,padding:"2px 6px",borderRadius:20,marginLeft:6,verticalAlign:"middle"}}>★</span>
    );

    function Pill({children, color}) {
      return <span style={{background:`${color}20`,color,border:`1px solid ${color}40`,
        fontSize:13,fontWeight:700,padding:"2px 8px",borderRadius:20,display:"inline-block"}}>{children}</span>;
    }

    function SectionTitle({children, color, theme}) {
      const t = theme || C;
      return <div style={{fontSize:15,fontWeight:700,letterSpacing:"0.04em",color:t.text,
        marginBottom:14,marginTop:4,display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:4,height:20,borderRadius:2,background:color,flexShrink:0}}/>
        {children}
      </div>;
    }

    function Th({children, theme}) {
      const t = theme || C;
      return <th style={{padding:"8px 12px",textAlign:"left",fontSize:13,fontWeight:700,
        letterSpacing:"0.1em",color:t.muted,background:t.surface==="#182435"?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.03)",
        borderBottom:`1px solid ${t.border}`}}>{children}</th>;
    }
    function Td({children, i, highlight, theme}) {
      const t = theme || C;
      return <td style={{padding:"9px 12px",fontSize:13,borderBottom:`1px solid ${t.border}`,
        background:i%2===0?"transparent":"rgba(255,255,255,0.015)",verticalAlign:"top",
        color:highlight||t.text}}>{children}</td>;
    }