/* RoundGrid — 6-tile selector for the 6 QC inspection rounds.
   States: idle, active (colored border + tint), done (green border + ✓ corner mark). */

function RoundGrid({ activeKey, doneKeys, onSelect }) {
  return (
    <div className="round-grid">
      {ROUNDS.map(r => {
        const isActive = activeKey === r.k;
        const isDone   = doneKeys.indexOf(r.k) >= 0;
        const style = {
          border:
            isActive ? `2px solid ${r.cl}` :
            isDone   ? "1.5px solid var(--g4)" :
                       "1px solid var(--gr3)",
          background:
            isActive ? r.cl + "18" :
            isDone   ? "var(--g0)"  :
                       "var(--w)",
        };
        const lblColor =
          isActive ? r.cl :
          isDone   ? "var(--g7)" :
                     "var(--gr7)";
        return (
          <button
            key={r.k}
            className={"round-btn" + (isDone ? " done" : "")}
            style={style}
            onClick={() => onSelect(r.k)}
          >
            <div className="round-ico">{r.ic}</div>
            <div className="round-lbl" style={{ color: lblColor }}>{r.lb}</div>
          </button>
        );
      })}
    </div>
  );
}

function RoundBanner({ round, done, doneTime }) {
  return (
    <div className="round-banner" style={{ background: round.cl }}>
      <div>
        <div className="round-banner-sub">{done ? "บันทึกเรียบร้อย" : "กำลังบันทึก"}</div>
        <div className="round-banner-name">{round.ic} {round.lb}</div>
      </div>
      {done && doneTime && <div className="time-badge">{doneTime} น.</div>}
    </div>
  );
}

Object.assign(window, { RoundGrid, RoundBanner });
