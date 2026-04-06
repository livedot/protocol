function getDayCompletion(dateStr) {
      const dow = new Date(dateStr).getDay();
      const chkData = LS.get(`chk-${dateStr}`, {});
      let checked = 0;
      DAILY.forEach((blk, bi) => {
        blk.items.forEach(item => { if (chkData[`${dow}-${bi}-${item.name}`]) checked++; });
      });
      const weeklyInjs = WEEKLY_INJECTIONS[dow] || [];
      weeklyInjs.forEach((_, i) => { if (chkData[`${dow}-weekly-${i}`]) checked++; });
      const total = TOTAL_DAILY_ITEMS + weeklyInjs.length;
      return { checked, total, pct: total > 0 ? checked / total : 0 };
    }