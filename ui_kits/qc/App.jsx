/* App — wizard-based QC entry with sticky bottom nav.
   Steps: 0=เริ่ม, 1=เลือกรอบ, 2=LOT, 3=โรงกวน, 4=บอยเลอร์, 5=โรงโม่, 6=โรงแพ็ค, 7=ปิดรอบ.
   "บันทึก + ถัดไป" stamps a per-station timestamp and advances. Sections stay visible
   without scrolling — each step is its own short page. */

const LS_KEY = "qc_anjali_kit_v2";
const LS_REPORTER = "qc_anjali_last_reporter"; // persists across days

const STEP_LABELS = [
  "ข้อมูลผู้รายงาน",
  "เลือกรอบ QC",
  "LOT ในรอบนี้",
  "โรงกวน",
  "บอยเลอร์",
  "โรงโม่",
  "โรงแพ็ค",
  "ปิดรอบ + สรุป",
];
const STATION_KEYS = [null, null, "lot", "stir", "boiler", "mill", "pack", null];

/* Date helpers — Thai factory convention is DD/MM/YYYY (with Western year) */
function todayDMY() {
  const d = new Date();
  return pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear();
}

function initialState() {
  const rounds = {};
  ROUNDS.forEach(r => { rounds[r.k] = newRoundData(); });
  let lastReporter = "อัญชลี";
  try { lastReporter = localStorage.getItem(LS_REPORTER) || "อัญชลี"; } catch (e) {}
  return {
    date: todayDMY(), rep: lastReporter,
    pc: "", pct: "", pcc: "", pcf: "",
    rounds, _savedAt: null,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return initialState();
    const saved = JSON.parse(raw);
    ROUNDS.forEach(r => {
      if (!saved.rounds[r.k]) saved.rounds[r.k] = newRoundData();
      if (!saved.rounds[r.k].saved) saved.rounds[r.k].saved = { lot: "", stir: "", boiler: "", mill: "", pack: "" };
    });
    // Migrate legacy ISO date (YYYY-MM-DD) to DD/MM/YYYY
    if (saved.date && /^\d{4}-\d{2}-\d{2}$/.test(saved.date)) {
      const [y, m, d] = saved.date.split("-");
      saved.date = `${d}/${m}/${y}`;
    }
    if (!saved.date) saved.date = todayDMY();
    // Backfill rep from separate-key if main state didn't have it
    if (!saved.rep) {
      try { saved.rep = localStorage.getItem(LS_REPORTER) || "อัญชลี"; } catch (e) {}
    }
    return saved;
  } catch (e) { return initialState(); }
}

function App() {
  const [state, setState] = React.useState(loadState);
  const [tab, setTab] = React.useState("form");
  const [activeRound, setActiveRound] = React.useState("m1");
  const [step, setStep] = React.useState(0);
  const [saveStatus, setSaveStatus] = React.useState("idle");
  const [toast, setToast] = React.useState({ show: false, msg: "" });
  const saveTimerRef = React.useRef(null);

  // Debounced auto-save (state changes → localStorage in 400 ms)
  React.useEffect(() => {
    setSaveStatus("saving");
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try { localStorage.setItem(LS_KEY, JSON.stringify({ ...state, _savedAt: new Date().toISOString() })); } catch (e) {}
      setSaveStatus("saved");
    }, 400);
    return () => clearTimeout(saveTimerRef.current);
  }, [state]);

  // Scroll to top when step changes — operator never has to scroll to find controls.
  React.useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [step, activeRound, tab]);

  const showToast = msg => {
    setToast({ show: true, msg });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2200);
  };

  const updateRound = (k, patch) => setState(s => ({
    ...s, rounds: { ...s.rounds, [k]: { ...s.rounds[k], ...patch } }
  }));

  const stampAndAdvance = () => {
    const stationKey = STATION_KEYS[step];
    if (stationKey) {
      const rd = state.rounds[activeRound];
      updateRound(activeRound, { saved: { ...rd.saved, [stationKey]: nowHM() } });
      showToast(`บันทึก ${STEP_LABELS[step]} · ${nowHM()} น.`);
    }
    if (step < STEP_LABELS.length - 1) setStep(step + 1);
  };

  const round = ROUNDS.find(r => r.k === activeRound);
  const rd = state.rounds[activeRound];
  const totalLots = ROUNDS.reduce((sum, r) => sum + state.rounds[r.k].lots.length, 0);
  const doneKeys = ROUNDS.filter(r => state.rounds[r.k].done).map(r => r.k);

  // Saved-keys array for the stepper — step is "done" if its station has a timestamp
  const savedKeys = STEP_LABELS.map((_, i) => {
    const sk = STATION_KEYS[i];
    return sk ? !!rd.saved[sk] : false;
  });

  return (
    <>
      <TopBar status={saveStatus} />
      <TabBar active={tab} onChange={t => { setTab(t); setStep(0); }} />

      {tab === "form" && (
        <>
          <Stepper
            step={step}
            totalSteps={STEP_LABELS.length}
            labels={STEP_LABELS}
            savedKeys={savedKeys}
            onJump={setStep}
            accent={round.cl}
          />

          <div className="wrap wrap-wizard">

            {step === 0 && (
              <div data-screen-label="01 ข้อมูลผู้รายงาน">
                <Card title="ข้อมูลผู้รายงาน">
                  <TwoCol>
                    <Field label="วันที่">
                      <Input value={state.date} placeholder="DD/MM/YYYY" onChange={v => setState(s => ({ ...s, date: v }))} />
                    </Field>
                    <Field label="ชื่อผู้รายงาน">
                      <Input value={state.rep} onChange={v => {
                        setState(s => ({ ...s, rep: v }));
                        try { localStorage.setItem(LS_REPORTER, v); } catch (e) {}
                      }} />
                    </Field>
                  </TwoCol>
                  <div style={{ fontSize: 13, color: "var(--g6)", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: "var(--mono)", fontWeight: 800, background: "var(--g6)", color: "var(--w)", width: 16, height: 16, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>✓</span>
                    จำชื่อผู้รายงานจากครั้งล่าสุด — แก้ไขเฉพาะถ้าเปลี่ยนคน
                  </div>
                </Card>

                <Card title="จิ้มสินค้าทุก LOT ที่ไม่ได้ล็อคผลิตวันนี้">
                  <Field label="สถานะ">
                    <ChipGroup>
                      <Chip active={state.pc === "yes"} variant="ok" onClick={() => setState(s => ({ ...s, pc: "yes", pct: nowHM() }))}>✓ ทำเสร็จแล้ว</Chip>
                      <Chip active={state.pc === "no"}  variant="ng" onClick={() => setState(s => ({ ...s, pc: "no" }))}>✗ ยังไม่เสร็จ</Chip>
                    </ChipGroup>
                    {state.pc === "yes" && state.pct && (
                      <Alert kind="ok">บันทึกเวลา: {state.pct} น.</Alert>
                    )}
                  </Field>
                  <Field label="Comment — ความนิ่ม / เหนียว / กลิ่น / สี">
                    <TextArea value={state.pcc} onChange={v => setState(s => ({ ...s, pcc: v }))} />
                  </Field>
                  <Field label="LOT ที่ต้องแก้ไข">
                    <Input value={state.pcf} placeholder="-" onChange={v => setState(s => ({ ...s, pcf: v }))} />
                  </Field>
                </Card>
              </div>
            )}

            {step === 1 && (
              <div data-screen-label="02 เลือกรอบ QC">
                <Card title="เลือกรอบ QC ที่จะบันทึก">
                  <RoundGrid activeKey={activeRound} doneKeys={doneKeys} onSelect={setActiveRound} />
                  <div style={{ fontSize: 13, color: "var(--gr5)", marginTop: 10 }}>
                    กดเลือกรอบที่ต้องการบันทึก · ✓ = บันทึกเสร็จแล้ว
                  </div>
                </Card>
                <PageHeader round={round} title={round.lb} subtitle="รอบที่เลือก" accent={round.cl} code={round.ic} />
              </div>
            )}

            {step === 2 && (
              <div data-screen-label="03 LOT">
                <PageHeader title={round.lb + " — LOT ในรอบนี้"} subtitle={`รวมทั้งวัน ${totalLots} LOT`} accent={round.cl} code={round.ic} savedTime={rd.saved.lot} />
                <Card>
                  {rd.lots.length === 0 && (
                    <div style={{ textAlign: "center", color: "var(--gr5)", fontSize: 14, padding: "16px 0" }}>
                      ยังไม่มี LOT — กด ＋ เพิ่ม LOT ด้านล่าง
                    </div>
                  )}
                  {rd.lots.map((lot, i) => (
                    <LotItem
                      key={i} index={i} lot={lot} accent={round.cl}
                      onChange={next => updateRound(activeRound, { lots: rd.lots.map((l, j) => j === i ? next : l) })}
                      onDelete={() => updateRound(activeRound, { lots: rd.lots.filter((_, j) => j !== i) })}
                    />
                  ))}
                  <AddButton color={round.cl} textColor={round.cl} onClick={() => updateRound(activeRound, { lots: [...rd.lots, newLot()] })}>
                    ＋ เพิ่ม LOT
                  </AddButton>
                </Card>
              </div>
            )}

            {step === 3 && (
              <div data-screen-label="04 โรงกวน">
                <PageHeader title="โรงกวน" subtitle={round.lb} accent={round.cl} code={round.ic} savedTime={rd.saved.stir} />
                <Card>
                  <StirForm value={rd.stir} onChange={v => updateRound(activeRound, { stir: v })} />
                </Card>
              </div>
            )}

            {step === 4 && (
              <div data-screen-label="05 บอยเลอร์">
                <PageHeader title="บอยเลอร์" subtitle={round.lb} accent={round.cl} code={round.ic} savedTime={rd.saved.boiler} />
                <Card>
                  <BoilerForm value={rd.boiler} onChange={v => updateRound(activeRound, { boiler: v })} />
                </Card>
              </div>
            )}

            {step === 5 && (
              <div data-screen-label="06 โรงโม่">
                <PageHeader title="โรงโม่" subtitle={round.lb} accent={round.cl} code={round.ic} savedTime={rd.saved.mill} />
                <Card>
                  <MillForm value={rd.mill} onChange={v => updateRound(activeRound, { mill: v })} />
                </Card>
              </div>
            )}

            {step === 6 && (
              <div data-screen-label="07 โรงแพ็ค">
                <PageHeader title="โรงแพ็ค" subtitle={round.lb} accent={round.cl} code={round.ic} savedTime={rd.saved.pack} />
                <Card>
                  <PackForm value={rd.pack} onChange={v => updateRound(activeRound, { pack: v })} />
                </Card>
              </div>
            )}

            {step === 7 && (
              <div data-screen-label="08 ปิดรอบ">
                <PageHeader title={"ปิดรอบ · " + round.lb} subtitle={rd.done ? "บันทึกเรียบร้อย" : "รอยืนยัน"} accent={round.cl} code={round.ic} savedTime={rd.dt} />
                <RoundSummary round={round} rd={rd} dayState={state} />

                <Button variant="outline" onClick={() => showToast("Copy สรุปรอบ → LINE (เลียนแบบ)")}>Copy สรุปรอบนี้ → LINE</Button>
                <div style={{ height: 10 }}></div>
                {!rd.done && (
                  <Button variant="primary" style={{ background: round.cl }}
                    onClick={() => { updateRound(activeRound, { done: true, dt: nowHM() }); showToast("ปิดรอบเรียบร้อย"); }}>
                    ยืนยันจบ{round.lb}
                  </Button>
                )}
                <div style={{ height: 18 }}></div>
                <Button variant="dark" onClick={() => showToast("บันทึก Supabase + Copy ทั้งวัน (เลียนแบบ)")}>
                  บันทึกทั้งวัน · Copy → LINE
                </Button>
              </div>
            )}

          </div>

          <BottomNav
            onPrev={() => setStep(Math.max(0, step - 1))}
            onNext={stampAndAdvance}
            prevDisabled={step === 0}
            nextDisabled={step === STEP_LABELS.length - 1}
            accent={round.cl}
            nextLabel={STATION_KEYS[step] ? "บันทึก + ถัดไป →" : "ถัดไป →"}
            savedTime={STATION_KEYS[step] ? rd.saved[STATION_KEYS[step]] : ""}
          />
        </>
      )}

      {tab === "hist" && <HistoryView onToast={showToast} />}

      <Toast show={toast.show} message={toast.msg} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
