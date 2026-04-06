const parseTotalMg = (mgStr) => {
        if (!mgStr || mgStr === "—") return null;
        const s = mgStr.trim().toLowerCase();
        const n = parseFloat(s);
        if (isNaN(n)) return null;
        if (s.endsWith("g") && !s.endsWith("mg")) return n * 1000;
        return n;
      };
      // Parse a dose string like "5mg", "300mcg", "100–200mcg", "500mg–1g" → mg (use lower bound)
      // Parse a dose range string, return {low, high, unit, display}
      const parseDoseRange = (doseStr) => {
        if (!doseStr) return null;
        const raw = doseStr.trim();
        const unitMatch = raw.match(/(mcg|mg|g|IU)/i);
        const unit = unitMatch ? unitMatch[1] : 'mg';
        const toMg = (n) => {
          const u = unit.toLowerCase();
          if (u === 'mcg') return n / 1000;
          if (u === 'g') return n * 1000;
          return n;
        };
        const nums = raw.match(/[\d.]+/g);
        if (!nums || nums.length === 0) return null;
        const low = parseFloat(nums[0]);
        const high = nums.length >= 2 ? parseFloat(nums[1]) : low;
        const isRange = nums.length >= 2;
        return { low, high, lowMg: toMg(low), highMg: toMg(high), unit, isRange,
          displayLow: `${low}${unit}`, displayHigh: `${high}${unit}` };
      };

      // Week-by-week titration schedules for compounds that don't follow simple low/high
      const TITRATION_SCHEDULES = {
        "Retatrutide": [
          {week:1,  dose:"0.5mg"}, {week:2,  dose:"0.5mg"},
          {week:3,  dose:"1mg"},   {week:4,  dose:"1mg"},
          {week:5,  dose:"1.5mg"}, {week:6,  dose:"1.5mg"},
          {week:7,  dose:"2mg"},   {week:8,  dose:"2mg"},
          {week:9,  dose:"2mg"},   {week:10, dose:"2mg"},
          {week:11, dose:"2mg"},   {week:12, dose:"2mg"},
          {week:13, dose:"2mg"},   {week:14, dose:"3mg"},
          {week:15, dose:"3mg"},   {week:16, dose:"3mg"},
          {week:17, dose:"4mg"},   {week:18, dose:"4mg"},
          {week:19, dose:"4mg"},   {week:20, dose:"4mg"},
        ],
      };

      // Compounds that run at HIGH dose from day 1 (GI protection for Reta front-load)
      const HIGH_FROM_START = new Set(["TUDCA","KPV","Magnesium Citrate","Digestive Enzymes"]);

      // Return the active dose string for current protocol week
      // Named compounds with TITRATION_SCHEDULES use week-by-week lookup.
      // HIGH_FROM_START compounds always use high end.
      // Other range doses: Weeks 1–4 low end, Week 5+ high end.
      const getActiveDose = (doseStr, itemName) => {
        if (!doseStr) return doseStr;
        // Check named titration schedule first
        if (itemName && TITRATION_SCHEDULES[itemName] && protocolWeek) {
          const schedule = TITRATION_SCHEDULES[itemName];
          const entry = schedule.find(s => s.week === protocolWeek)
            || schedule[schedule.length - 1];
          return entry.dose;
        }
        // Simple range fallback
        const parsed = parseDoseRange(doseStr);
        if (!parsed || !parsed.isRange) return doseStr;
        // GI protection supps always use high end
        const useHigh = (itemName && HIGH_FROM_START.has(itemName)) || (protocolWeek && protocolWeek >= 5);
        const val = useHigh ? parsed.high : parsed.low;
        return `${val}${parsed.unit}`;
      };

      // Return active dose in mg for inventory deduction
      const parseDoseMg = (doseStr, itemName) => {
        if (!doseStr) return null;
        const activeDose = getActiveDose(doseStr, itemName);
        const parsed = parseDoseRange(activeDose);
        if (!parsed) return null;
        return parsed.lowMg;
      };

      // invRemaining: {[orderIndex]: remainingMg} — initialized from ORDERS totalMg
      const [invRemaining, setInvRemaining] = useState(() => {
        const saved = LS.get("invRemaining", null);
        if (saved) return saved;
        const init = {};
        ORDERS.forEach((o,i) => { const t = parseTotalMg(o.mg); if (t !== null) init[i] = t; });
        return init;
      });

      // Deduct or refund dose from inventory by peptide name
      const adjustInv = (itemName, doseMg, deduct) => {
        if (!doseMg || doseMg <= 0) return;
        const indices = ORDERS.map((o,i)=>({o,i})).filter(({o})=>o.name.toLowerCase()===itemName.toLowerCase());
        if (!indices.length) return;
        // Pool total for this peptide across all matching order rows
        const poolTotal = indices.reduce((sum,{o}) => sum + (parseTotalMg(o.mg) ?? 0), 0);
        setInvRemaining(prev => {
          const next = {...prev};
          // Current pooled remaining
          const curPooled = indices.reduce((sum,{i}) => sum + (next[i] ?? (parseTotalMg(ORDERS[i].mg) ?? 0)), 0);
          const newPooled = deduct
            ? Math.max(0, curPooled - doseMg)
            : Math.min(poolTotal, curPooled + doseMg);
          // Distribute new pooled value back across rows (fill first row first)
          let toDistribute = newPooled;
          for (const {i, o} of indices) {
            const rowTotal = parseTotalMg(o.mg) ?? 0;
            next[i] = Math.min(rowTotal, toDistribute);
            toDistribute = Math.max(0, toDistribute - rowTotal);
          }
          LS.set("invRemaining", next);
          return next;
        });
      };
      const [suppStatuses, setSuppStatuses] = useState(() => LS.get("suppStatuses",LOCAL_SUPPS.reduce((acc,ls,i)=>({...acc,[i]:"needed"}),{})));
      const setSuppStatus = (i,val) => setSuppStatuses(p=>{const next={...p,[i]:val};LS.set("suppStatuses",next);return next;});

      // Parse total count from spec string e.g. "250mg · 60ct" → 60, "1kg" → null
      const parseSuppCount = (spec) => {
        if (!spec) return null;
        const m = spec.match(/(\d+)\s*ct/i);
        return m ? parseInt(m[1]) : null;
      };

      // suppInvRemaining: {[suppIndex]: remainingCount}
      const [suppInvRemaining, setSuppInvRemaining] = useState(() => {
        const saved = LS.get("suppInvRemaining", null);
        if (saved) return saved;
        const init = {};
        LOCAL_SUPPS.forEach((ls,i) => { const t = parseSuppCount(ls.spec); if (t !== null) init[i] = t; });
        return init;
      });

      // Parse per-cap/per-unit strength from spec e.g. "250mg · 60ct" → 250
      const parseSuppStrengthMg = (spec) => {
        if (!spec) return null;
        const m = spec.match(/^([\d,.]+)\s*(mg|g|mcg|iu|IU)/i);
        if (!m) return null;
        const val = parseFloat(m[1].replace(',',''));
        const unit = m[2].toLowerCase();
        if (unit === 'g') return val * 1000;
        if (unit === 'mcg') return val / 1000;
        return val; // mg or IU — treat IU numerically
      };

      // Calculate how many caps/units needed for a given dose
      const calcCapsNeeded = (doseStr, spec) => {
        const activeDose = getActiveDose(doseStr);
        const parsed = parseDoseRange(activeDose);
        const strengthMg = parseSuppStrengthMg(spec);
        if (!parsed || !strengthMg) return 1;
        return Math.ceil(parsed.lowMg / strengthMg);
      };

      // Deduct or refund caps from supplement inventory by name and dose string
      const adjustSuppInv = (suppName, doseStr, deduct) => {
        const idx = LOCAL_SUPPS.findIndex(ls => ls.name.toLowerCase() === suppName.toLowerCase());
        if (idx === -1) return;
        const total = parseSuppCount(LOCAL_SUPPS[idx].spec);
        if (total === null) return;
        const caps = calcCapsNeeded(doseStr, LOCAL_SUPPS[idx].spec);
        setSuppInvRemaining(prev => {
          const cur = prev[idx] ?? total;
          const next = {...prev, [idx]: deduct ? Math.max(0, cur - caps) : Math.min(total, cur + caps)};
          LS.set("suppInvRemaining", next);
          return next;
        });
      };