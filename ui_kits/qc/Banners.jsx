/* Banners — recovery prompt, sync state, toast. Three independent components. */

function RecoveryBanner({ onRestore, onDismiss }) {
  return (
    <div className="recovery-banner">
      <span>🔄 พบข้อมูลที่บันทึกไว้ก่อนหน้า — ต้องการกู้คืนหรือไม่?</span>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button className="btn-restore" onClick={onRestore}>กู้คืน</button>
        <button className="btn-dismiss" onClick={onDismiss}>✕</button>
      </div>
    </div>
  );
}

function SyncBanner({ kind, message }) {
  if (!kind) return null;
  return <div className={`sync-banner ${kind}`}>{message}</div>;
}

function Toast({ show, message }) {
  return <div className={"toast" + (show ? " show" : "")}>{message}</div>;
}

Object.assign(window, { RecoveryBanner, SyncBanner, Toast });
