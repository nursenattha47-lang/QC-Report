/* DoneBox — round-confirm card. Pending → primary CTA to mark done.
   Complete → outline "Copy to LINE" button + green tick badge. */

function DoneBox({ round, done, doneTime, onMarkDone, onCopy }) {
  return (
    <div className={"done-box " + (done ? "complete" : "pending")}>
      <div className="done-head">
        <span className="done-label">
          {done ? `✅ ${round.lb} เสร็จสิ้น` : `⏳ กำลังตรวจ ${round.lb}`}
        </span>
        {done && doneTime && (
          <div className="time-badge" style={{ background: "var(--g2)", color: "var(--g8)" }}>{doneTime} น.</div>
        )}
      </div>
      {!done ? (
        <Button variant="primary" style={{ background: round.cl }} onClick={onMarkDone}>
          🏁 ยืนยันจบ{round.lb}
        </Button>
      ) : (
        <Button variant="outline" onClick={onCopy}>📋 Copy สรุปรอบนี้ → LINE</Button>
      )}
    </div>
  );
}

Object.assign(window, { DoneBox });
