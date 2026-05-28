/* History — list of past daily reports + detail view that reuses RoundSummary.
   Reads real snapshots from localStorage (saved when user marks a round/day done in App.jsx),
   falls back to seeded mock entries so the kit has something to show on first open. */

const LS_HISTORY = "qc_anjali_history_v1";

const MOCK_HISTORY = [
  { id: "2026-05-25", date: "25/05/2026", rep: "อัญชลี", rounds: 6, lots: 38, issues: 0, snapshot: null },
  { id: "2026-05-24", date: "24/05/2026", rep: "อัญชลี", rounds: 6, lots: 35, issues: 2, snapshot: null },
  { id: "2026-05-23", date: "23/05/2026", rep: "อัญชลี", rounds: 5, lots: 28, issues: 0, snapshot: null },
];

function loadHistory() {
  try {
    const raw = localStorage.getItem(LS_HISTORY);
    const real = raw ? JSON.parse(raw) : [];
    // Merge: real entries take precedence by date, then mock fill-ins
    const seen = new Set(real.map(r => r.id));
    const filler = MOCK_HISTORY.filter(m => !seen.has(m.id));
    return [...real, ...filler].sort((a, b) => b.id.localeCompare(a.id));
  } catch (e) { return MOCK_HISTORY; }
}

/* Called from App.jsx whenever the user marks a round done or saves the day.
   Upserts today's snapshot by ISO id so the same day stays one row. */
function saveSnapshot(state) {
  try {
    const raw = localStorage.getItem(LS_HISTORY);
    const list = raw ? JSON.parse(raw) : [];
    const id = state.date.split("/").reverse().join("-"); // DD/MM/YYYY → YYYY-MM-DD
    const doneRounds = ROUNDS.filter(r => state.rounds[r.k].done).length;
    const totalLots = ROUNDS.reduce((s, r) => s + state.rounds[r.k].lots.length, 0);
    const issues = countIssues(state);
    const entry = {
      id, date: state.date, rep: state.rep,
      rounds: doneRounds, lots: totalLots, issues,
      snapshot: state, savedAt: new Date().toISOString(),
    };
    const idx = list.findIndex(r => r.id === id);
    if (idx >= 0) list[idx] = entry; else list.unshift(entry);
    localStorage.setItem(LS_HISTORY, JSON.stringify(list));
  } catch (e) { /* swallow */ }
}

/* Count problem flags across the whole day — used as the red badge on hist-meta. */
function countIssues(state) {
  let n = 0;
  ROUNDS.forEach(r => {
    const rd = state.rounds[r.k];
    if (!rd) return;
    // Boiler warn rows
    ["temp","press","water","pump"].forEach(k => { if (rd.boiler?.[k] === "warn") n++; });
    if (rd.boiler?.smoke === "black") n++;
    // Stir / Mill / Pack warn flags
    if (rd.stir?.sy === "warn") n++;
    if (rd.stir?.fl === "warn") n++;
    if (rd.stir?.col === "dark" || rd.stir?.col === "light") n++;
    if (rd.mill?.cv === "warn") n++;
    ["st","se","sr","ex","wt","sl","pkg"].forEach(k => { if (rd.pack?.[k] === "warn") n++; });
    // LOT-level NG
    (rd.lots || []).forEach(l => {
      if (l.taste === "ng") n++;
      if (l.smell === "ng") n++;
      if (l.color === "dark" || l.color === "light") n++;
    });
    // Mill RM contamination
    Object.values(rd.mill?.rmCheck || {}).forEach(c => { if (c.contam === "found") n++; });
  });
  return n;
}

function HistoryView({ onToast }) {
  const [list] = React.useState(loadHistory);
  const [selected, setSelected] = React.useState(null);

  if (selected) {
    return <HistoryDetail report={selected} onBack={() => setSelected(null)} onToast={onToast} />;
  }

  return (
    <div className="wrap" data-screen-label="02 History">
      <Card title="ประวัติรายงาน QC">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {list.map(h => (
            <div key={h.id} className="hist-item">
              <div className="hist-main" onClick={() => h.snapshot ? setSelected(h) : onToast("ไม่มีรายละเอียดของวันนี้ (mock)")}>
                <div className="hist-date">{h.date}</div>
                <div className="hist-meta">
                  {h.rounds} รอบ · {h.lots} LOT · ผู้รายงาน: {h.rep}
                  {h.issues > 0 && <span className="hist-issue"> · มีปัญหา {h.issues} จุด</span>}
                  {!h.snapshot && <span className="hist-meta-tag"> (ตัวอย่าง)</span>}
                </div>
              </div>
              <div className="hist-actions">
                <button className="btn-hist-view" disabled={!h.snapshot} onClick={() => h.snapshot && setSelected(h)}>ดู</button>
                <button className="btn-hist-pdf" onClick={() => openPDF(h, onToast)}>
                  <span className="pdf-glyph">PDF</span>ส่งออก
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function HistoryDetail({ report, onBack, onToast }) {
  const snap = report.snapshot;
  return (
    <div className="wrap" data-screen-label="03 History Detail">
      <button className="btn-back" onClick={onBack}>← กลับไปรายการ</button>

      <div className="hist-detail-head">
        <div>
          <div className="hist-detail-date">{report.date}</div>
          <div className="hist-detail-meta">ผู้รายงาน: {report.rep} · {report.rounds} รอบ · {report.lots} LOT</div>
        </div>
        <button className="btn-pdf-large" onClick={() => openPDF(report, onToast)}>
          <span className="pdf-glyph">PDF</span>ส่งออก
        </button>
      </div>

      {snap && ROUNDS.map(r => {
        const rd = snap.rounds[r.k];
        if (!rd) return null;
        return (
          <div key={r.k} style={{ marginBottom: 18 }}>
            <div className="hist-round-banner" style={{ background: r.cl }}>
              <span style={{ fontSize: 22 }}>{r.ic}</span>
              <span>{r.lb}</span>
              {rd.dt && <span className="hist-round-time" style={{ marginLeft: "auto", background: "rgba(255,255,255,.22)", color: "#fff" }}>ปิดรอบ {rd.dt} น.</span>}
            </div>
            <RoundSummary round={r} rd={rd} dayState={snap} hideDayHeader={true} />
          </div>
        );
      })}
    </div>
  );
}

/* Open a print-friendly PDF window using the same RoundSummary layout. */
function openPDF(report, onToast) {
  if (!report.snapshot) {
    onToast("ไม่มีรายละเอียดของวันนี้ — เปิดได้เฉพาะวันที่บันทึกจริง");
    return;
  }
  const w = window.open("", "_blank", "width=900,height=1100");
  if (!w) { onToast("กรุณาอนุญาตให้เปิด popup เพื่อสร้าง PDF"); return; }

  // Stash snapshot for the print window
  w.__snapshot = report.snapshot;
  w.__report = report;

  w.document.write(`<!DOCTYPE html><html lang="th"><head>
<meta charset="utf-8"/>
<title>รายงาน QC ${report.date}</title>
<link rel="stylesheet" href="${location.origin}${location.pathname.replace(/[^/]*$/, '')}styles.css"/>
<style>
  body { background: #fff; padding: 32px; max-width: 760px; margin: 0 auto; }
  .pdf-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid var(--g8); padding-bottom: 14px; margin-bottom: 22px; }
  .pdf-title { font-size: 26px; font-weight: 700; color: var(--g8); }
  .pdf-co { font-size: 13px; color: var(--g6); letter-spacing: .5px; margin-bottom: 4px; }
  .pdf-date { font-family: var(--mono); font-size: 17px; font-weight: 700; color: var(--gr7); }
  .pdf-rep { font-size: 13px; color: var(--gr5); margin-top: 3px; }
  .pdf-section-banner { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: var(--rmd); color: #fff; margin: 24px 0 12px; font-size: 18px; font-weight: 700; }
  .pdf-actions { position: sticky; top: 0; background: rgba(255,255,255,.96); backdrop-filter: blur(6px); padding: 12px 0; margin: -32px -32px 22px; padding: 14px 32px; border-bottom: 1px solid var(--gr1); display: flex; justify-content: flex-end; gap: 8px; z-index: 100; }
  @media print {
    .pdf-actions { display: none !important; }
    body { padding: 16px 24px; }
    .pdf-section-banner { break-inside: avoid; }
    .sumry-section { break-inside: avoid; box-shadow: none !important; }
  }
</style>
</head><body>
<div class="pdf-actions">
  <button onclick="window.print()" style="background:var(--g6);color:#fff;border:none;padding:10px 18px;border-radius:8px;font-family:var(--font);font-size:15px;font-weight:700;cursor:pointer">🖨️ พิมพ์ / Save as PDF</button>
  <button onclick="window.close()" style="background:var(--gr1);color:var(--gr7);border:none;padding:10px 18px;border-radius:8px;font-family:var(--font);font-size:15px;font-weight:700;cursor:pointer">ปิด</button>
</div>

<div class="pdf-header">
  <div>
    <div class="pdf-co">บริษัท อัญชลี ฟรุ๊ต โปรดักส์ จำกัด</div>
    <div class="pdf-title">รายงาน QC ประจำวัน</div>
    <div class="pdf-rep">ผู้รายงาน: ${report.rep}</div>
  </div>
  <div style="text-align:right">
    <div class="pdf-date">${report.date}</div>
    <div class="pdf-rep">${report.rounds} รอบ · ${report.lots} LOT${report.issues > 0 ? ` · มีปัญหา ${report.issues} จุด` : " · ผ่านเกณฑ์ทุกรายการ"}</div>
  </div>
</div>

<div id="report-root"></div>

<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>
<script type="text/babel" src="${location.origin}${location.pathname.replace(/[^/]*$/, '')}constants.jsx"></script>
<script type="text/babel" src="${location.origin}${location.pathname.replace(/[^/]*$/, '')}RoundSummary.jsx"></script>
<script type="text/babel" data-presets="env,react">
  function PDFReport() {
    const snap = window.__snapshot;
    return (
      <>
        {ROUNDS.map(r => {
          const rd = snap.rounds[r.k];
          if (!rd) return null;
          return (
            <div key={r.k}>
              <div className="pdf-section-banner" style={{ background: r.cl }}>
                <span style={{ fontSize: 22 }}>{r.ic}</span>
                <span>{r.lb}</span>
                {rd.dt && <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 13, fontWeight: 600, background: "rgba(255,255,255,.22)", padding: "4px 10px", borderRadius: 100 }}>ปิดรอบ {rd.dt} น.</span>}
              </div>
              <RoundSummary round={r} rd={rd} dayState={snap} hideDayHeader={r.k !== "m1"} />
            </div>
          );
        })}
      </>
    );
  }
  ReactDOM.createRoot(document.getElementById("report-root")).render(<PDFReport />);
</script>
</body></html>`);
  w.document.close();
  onToast("เปิดหน้ารายงาน PDF แล้ว — กด 🖨️ เพื่อบันทึกเป็น PDF");
}

Object.assign(window, { HistoryView, HistoryDetail, saveSnapshot });
