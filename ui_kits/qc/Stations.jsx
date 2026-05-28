/* Stations — Boiler, Stir, Mill, Pack collapsible inspection forms.
   Each maps the original station's chip groups to ok/warn-state Chips + a warn-bound note. */

function OkWarnChips({ value, onChange, okLabel = "✓ ปกติ", warnLabel = "! ไม่ปกติ" }) {
  return (
    <ChipGroup>
      <Chip active={value === "ok"}   variant="ok" onClick={() => onChange("ok")}>{okLabel}</Chip>
      <Chip active={value === "warn"} variant="ng" onClick={() => onChange("warn")}>{warnLabel}</Chip>
    </ChipGroup>
  );
}

/* ── BOILER — temp / pressure / water / pump / smoke + per-row warn notes ── */

function BoilerForm({ value, onChange }) {
  const b = value;
  const setKey = (k, v) => onChange({ ...b, [k]: v });
  const setNote = (k, v) => onChange({ ...b, notes: { ...b.notes, [k]: v } });

  const rows = [
    { k: "temp",  lb: "อุณหภูมิ (≤40°C)" },
    { k: "press", lb: "แรงดัน" },
    { k: "water", lb: "ระดับน้ำ 2 หลอด" },
    { k: "pump",  lb: "น้ำยา / ปั๊มทำงาน" },
  ];
  const allOk = rows.every(r => b[r.k] === "ok") && b.smoke === "none";

  return (
    <>
      {rows.map((row, i) => (
        <React.Fragment key={row.k}>
          <Field label={row.lb}>
            <OkWarnChips value={b[row.k]} onChange={v => setKey(row.k, v)} />
            {b[row.k] === "warn" && (
              <Alert kind="warn" label="สาเหตุ / วิธีแก้ไข">
                <TextArea value={b.notes[row.k]} onChange={v => setNote(row.k, v)} />
              </Alert>
            )}
          </Field>
          {i < rows.length - 1 && <Divider />}
        </React.Fragment>
      ))}
      <Divider />
      <Field label="ควัน">
        <ChipGroup>
          <Chip active={b.smoke === "none"}  variant="ok" onClick={() => setKey("smoke", "none")}>✓ ไม่ดำ</Chip>
          <Chip active={b.smoke === "black"} variant="ng" onClick={() => setKey("smoke", "black")}>! ดำ</Chip>
        </ChipGroup>
        {b.smoke === "black" && (
          <Alert kind="warn" label="สาเหตุ / วิธีแก้ไข">
            <TextArea value={b.notes.smoke} onChange={v => setNote("smoke", v)} />
          </Alert>
        )}
      </Field>
      {allOk && (
        <Alert kind="ok" style={{ textAlign: "center" }}>บอยเลอร์ทำงานปกติทุกรายการ</Alert>
      )}
    </>
  );
}

/* ── STIR — 9 machines + oven + sugar/syrup + color + taste + docs + cleanliness score ── */

function StirForm({ value, onChange }) {
  const st = value;
  const set = patch => onChange({ ...st, ...patch });
  const inactive = [1,2,3,4,5,6,7,8,9].filter(n => st.am.indexOf(n) < 0);

  const toggleMachine = n => {
    const i = st.am.indexOf(n);
    if (i >= 0) {
      const am = [...st.am]; am.splice(i, 1);
      set({ am, ist: { ...st.ist, [n]: "idle" } });
    } else {
      set({ am: [...st.am, n] });
    }
  };

  return (
    <>
      <Field label="เครื่องกวนที่ใช้งาน (1-9)">
        <NumPad selected={st.am} onToggle={toggleMachine} />
        {st.am.length > 0 && (
          <Alert kind="ok">เครื่องที่ใช้งาน: {[...st.am].sort((a,b)=>a-b).join(", ")} ทำงานปกติ</Alert>
        )}
      </Field>

      {inactive.length > 0 && (
        <>
          <Divider />
          <Label>เครื่องที่ไม่ได้ใช้ — ระบุสาเหตุ</Label>
          {inactive.map(n => (
            <div key={n} className="machine-card">
              <div className="machine-card-title">เครื่อง {n}</div>
              <ChipGroup style={{ marginBottom: 7 }}>
                <Chip active={st.ist[n] === "idle"}   variant="gray" onClick={() => set({ ist: { ...st.ist, [n]: "idle"   } })}>ไม่ได้ใช้</Chip>
                <Chip active={st.ist[n] === "broken"} variant="ng"   onClick={() => set({ ist: { ...st.ist, [n]: "broken" } })}>! เสีย</Chip>
              </ChipGroup>
              <Input value={st.ino[n]} placeholder="หมายเหตุ..." onChange={v => set({ ino: { ...st.ino, [n]: v } })} />
            </div>
          ))}
        </>
      )}

      <Divider />
      <Field label="ปริมาณแบะแซและน้ำตาล">
        <OkWarnChips value={st.sy} onChange={v => set({ sy: v })} okLabel="✓ พอดีตามสัดส่วน" warnLabel="! ไม่พอดี" />
        <div style={{ marginTop: 8 }}>
          <Label>Comment</Label>
          <TextArea value={st.syn} onChange={v => set({ syn: v })} />
        </div>
      </Field>

      <Divider />
      <Field label="โทนสีขณะกวน">
        <ChipGroup>
          <Chip active={st.col === "ok"}    variant="ok"   onClick={() => set({ col: "ok" })}>✓ ปกติ</Chip>
          <Chip active={st.col === "dark"}  variant="blue" onClick={() => set({ col: "dark" })}>เข้มเกิน</Chip>
          <Chip active={st.col === "light"} variant="warn" onClick={() => set({ col: "light" })}>สว่างเกิน</Chip>
        </ChipGroup>
        <Alert kind="note" label="กรณีสีผิดปกติ — แนวทางแก้ไข">
          <TextArea value={st.coln} onChange={v => set({ coln: v })} />
        </Alert>
        <div style={{ marginTop: 10 }}>
          <PhotoUpload photos={st.colorImgs || []} onChange={p => set({ colorImgs: p })} label="ถ่ายรูปสี / เปรียบเทียบโทน" />
        </div>
      </Field>

      <Divider />
      <Field label="รสชาติ">
        <OkWarnChips value={st.fl} onChange={v => set({ fl: v })} okLabel="✓ เปรี้ยวอมหวาน / ปกติ" />
        {st.fl === "warn" && (
          <Alert kind="warn"><TextArea value={st.fln} onChange={v => set({ fln: v })} /></Alert>
        )}
      </Field>

      <Divider />
      <Field label="คะแนนความสะอาด (1-10)">
        <ScoreRow value={st.cs} onChange={v => set({ cs: v })} />
        <div style={{ marginTop: 8 }}>
          <Label>Comment</Label>
          <Input value={st.cn} onChange={v => set({ cn: v })} />
        </div>
      </Field>
    </>
  );
}

/* ── MILL — 3 machines (with idle/broken state) + raw-material checks + cart inspection ── */

function MillForm({ value, onChange }) {
  const ml = value;
  const set = patch => onChange({ ...ml, ...patch });
  if (!ml.mist) ml.mist = {};
  if (!ml.mino) ml.mino = {};
  if (!ml.rmCheck) ml.rmCheck = {};
  if (!ml.contamPhotos) ml.contamPhotos = [];

  const toggleMill = n => {
    const i = ml.mc.indexOf(n);
    if (i >= 0) { const mc = [...ml.mc]; mc.splice(i, 1); set({ mc }); }
    else        { set({ mc: [...ml.mc, n], mist: { ...ml.mist, [n]: undefined }, mino: { ...ml.mino, [n]: "" } }); }
  };
  const inactiveMills = [1,2,3].filter(n => ml.mc.indexOf(n) < 0);

  const [draft, setDraft] = React.useState("");
  const addVehicle = (n) => {
    const num = parseInt(n, 10);
    if (!num || ml.vh.indexOf(num) >= 0) return;
    set({ vh: [...ml.vh, num] });
    setDraft("");
  };
  const removeVehicle = (n) => set({ vh: ml.vh.filter(v => v !== n) });
  const nextNums = (() => {
    const max = ml.vh.length ? Math.max(...ml.vh) : 0;
    return [max + 1, max + 2, max + 3, max + 4];
  })();

  /* Raw-material check helpers */
  const rmTypes = [
    { k: "pineapple", lb: "สับปะรดสด หัว/แกน" },
    { k: "papaya",    lb: "มะละกอ" },
    { k: "dry",       lb: "ของแห้ง", needDetail: true },
    { k: "other",     lb: "อื่นๆ",   needDetail: true },
  ];
  const setRM = (k, patch) => set({ rmCheck: { ...ml.rmCheck, [k]: { ...(ml.rmCheck[k] || {}), ...patch } } });

  return (
    <>
      <Field label="เครื่องโม่ที่ใช้งาน (1-3)">
        <ChipGroup>
          {[1,2,3].map(n => (
            <Chip key={n} active={ml.mc.indexOf(n) >= 0} variant="ok" onClick={() => toggleMill(n)}>เครื่อง {n}</Chip>
          ))}
        </ChipGroup>
        {ml.mc.length > 0 && (
          <Alert kind="ok">ใช้งาน: เครื่อง {[...ml.mc].sort((a,b)=>a-b).join(", ")}</Alert>
        )}
      </Field>

      {inactiveMills.length > 0 && (
        <>
          <Divider />
          <Label>เครื่องที่ไม่ได้ใช้ — ระบุสถานะ</Label>
          {inactiveMills.map(n => (
            <div key={n} className="machine-card">
              <div className="machine-card-title">เครื่อง {n}</div>
              <ChipGroup style={{ marginBottom: 8 }}>
                <Chip active={ml.mist[n] === "idle"}   variant="gray" onClick={() => set({ mist: { ...ml.mist, [n]: "idle" } })}>ไม่ได้ใช้</Chip>
                <Chip active={ml.mist[n] === "broken"} variant="ng"   onClick={() => set({ mist: { ...ml.mist, [n]: "broken" } })}>! เสีย</Chip>
              </ChipGroup>
              {ml.mist[n] === "broken" && (
                <Alert kind="warn" label="สาเหตุ / วิธีแก้ไข">
                  <TextArea value={ml.mino[n]} onChange={v => set({ mino: { ...ml.mino, [n]: v } })} />
                </Alert>
              )}
            </div>
          ))}
        </>
      )}

      <Divider />
      <Field label={`ตรวจวัตถุดิบเสร็จแล้วคันที่ — ${ml.vh.length} คัน`}>
        <div className="veh-wrap">
          {ml.vh.length > 0 && (
            <div className="veh-chips">
              {[...ml.vh].sort((a,b)=>a-b).map(n => (
                <span key={n} className="veh-chip">{n}<button className="veh-chip-x" onClick={() => removeVehicle(n)}>✕</button></span>
              ))}
            </div>
          )}
          <div className="veh-add-row">
            <input
              className="veh-add-input"
              type="number"
              placeholder="เลขคันถัดไป"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addVehicle(draft); }}
            />
            <button className="veh-add-btn" onClick={() => addVehicle(draft)}>＋ เพิ่ม</button>
          </div>
          <div>
            <div className="veh-quick">เพิ่มเร็ว — ลำดับต่อไป</div>
            <div className="veh-quick-row" style={{ marginTop: 5 }}>
              {nextNums.map(n => (
                <button key={n} className="veh-quick-chip" onClick={() => addVehicle(n)}>+{n}</button>
              ))}
            </div>
          </div>
        </div>
      </Field>

      <Divider />
      <Label>ตรวจวัตถุดิบรอส่งไปแผนกโม่</Label>
      {rmTypes.map(t => {
        const ck = ml.rmCheck[t.k] || {};
        return (
          <div key={t.k} className="machine-card">
            <ChipGroup style={{ marginBottom: 8 }}>
              <Chip active={!!ck.sel} variant="ok" onClick={() => setRM(t.k, { sel: !ck.sel })}>{t.lb}</Chip>
            </ChipGroup>
            {ck.sel && (
              <>
                {t.needDetail && (
                  <div style={{ marginBottom: 8 }}>
                    <Input value={ck.detail} placeholder={t.k === "dry" ? "ระบุว่าคืออะไร..." : "แจ้งมาว่าคืออะไร..."} onChange={v => setRM(t.k, { detail: v })} />
                  </div>
                )}
                <ChipGroup>
                  <Chip active={ck.contam === "none"}  variant="ok" onClick={() => setRM(t.k, { contam: "none" })}>✓ ไม่พบสิ่งปนเปื้อน</Chip>
                  <Chip active={ck.contam === "found"} variant="ng" onClick={() => setRM(t.k, { contam: "found" })}>! พบสิ่งปนเปื้อน</Chip>
                </ChipGroup>
                {ck.contam === "found" && (
                  <Alert kind="warn" label="รายละเอียดสิ่งปนเปื้อน / วิธีแก้ไข">
                    <TextArea value={ck.note} onChange={v => setRM(t.k, { note: v })} />
                  </Alert>
                )}
              </>
            )}
          </div>
        );
      })}

      <Divider />
      <Field label="รูปประกอบสิ่งปนเปื้อน / สภาพวัตถุดิบ">
        <PhotoUpload photos={ml.contamPhotos} onChange={p => set({ contamPhotos: p })} label="ถ่ายรูป / เพิ่มรูปวัตถุดิบ" />
      </Field>

      <Divider />
      <Field label="การปิดคลุมผ้าหลังโม่เสร็จ">
        <OkWarnChips value={ml.cv} onChange={v => set({ cv: v })} okLabel="✓ มิดชิดเรียบร้อย" warnLabel="! ไม่มิดชิด" />
      </Field>

      <Divider />
      <Field label="การลงเอกสาร">
        <OkWarnChips value={ml.dr} onChange={v => set({ dr: v })} okLabel="✓ ครบถ้วน" warnLabel="! ไม่ครบ" />
      </Field>

      <Divider />
      <Field label="คะแนนความสะอาด (1-10)">
        <ScoreRow value={ml.cs} onChange={v => set({ cs: v })} />
        <div style={{ marginTop: 8 }}>
          <Label>Comment</Label>
          <Input value={ml.cn3} onChange={v => set({ cn3: v })} />
        </div>
      </Field>
    </>
  );
}

/* ── PACK — sticker / seal / shrink machines + expiry / weight / seal / package ── */

function PackForm({ value, onChange }) {
  const pk = value;
  const set = patch => onChange({ ...pk, ...patch });
  const rows = [
    { k: "st", lb: "เครื่องติดสติกเกอร์" },
    { k: "se", lb: "เครื่องซีล" },
    { k: "sr", lb: "เครื่องรัดกล่อง" },
  ];
  return (
    <>
      {rows.map((r, i) => (
        <React.Fragment key={r.k}>
          <Field label={r.lb}>
            <OkWarnChips value={pk[r.k]} onChange={v => set({ [r.k]: v })} />
            {pk[r.k] === "warn" && <Alert kind="warn"><TextArea value={pk[r.k + "n"]} onChange={v => set({ [r.k + "n"]: v })} /></Alert>}
          </Field>
          {i < rows.length - 1 && <Divider />}
        </React.Fragment>
      ))}

      <Divider />
      <Field label="การปั๊มวันหมดอายุ">
        <OkWarnChips value={pk.ex} onChange={v => set({ ex: v })} okLabel="✓ ถูกต้อง" warnLabel="! ไม่ถูกต้อง" />
        <Alert kind="note" label="กรณีสั่งแก้แล้ว — ระบุรายละเอียด">
          <TextArea value={pk.exn} onChange={v => set({ exn: v })} />
        </Alert>
        <div style={{ marginTop: 10 }}>
          <PhotoUpload photos={pk.expiryImgs || []} onChange={p => set({ expiryImgs: p })} label="ถ่ายรูปวันหมดอายุที่ปั๊ม" />
        </div>
      </Field>

      <Divider />
      <Field label="สุ่มชั่งน้ำหนัก">
        <OkWarnChips value={pk.wt} onChange={v => set({ wt: v })} okLabel="✓ ตามเกณฑ์" warnLabel="! ไม่ตามเกณฑ์" />
      </Field>

      <Divider />
      <Field label="รอยซีล">
        <OkWarnChips value={pk.sl} onChange={v => set({ sl: v })} okLabel="✓ ตามเกณฑ์" warnLabel="! ไม่ตามเกณฑ์" />
      </Field>
    </>
  );
}

/* Factory defaults for a fresh round, mirroring source/qc_anjali_original.html → newRD(). */

function newRoundData() {
  return {
    done: false, dt: "", lots: [],
    /* per-station timestamps, recorded when user taps "บันทึก + ถัดไป" */
    saved: { lot: "", stir: "", boiler: "", mill: "", pack: "" },
    boiler: { temp: "", press: "", water: "", pump: "", smoke: "", notes: {} },
    stir:   { am: [], ist: {}, ino: {}, ou: "", ook: "", on2: "", sy: "", syn: "", col: "", coln: "", fl: "", fln: "", dr: "", dn: "", cs: "", cn: "" },
    mill:   { mc: [], fs: {}, fn: {}, vh: [], ci: null, cn2: "", cv: "", cvn: "", dr: "", cs: "", cn3: "", mist: {}, mino: {}, rmCheck: {} },
    pack:   { st: "", se: "", sr: "", ex: "", exn: "", mt: null, mn: "", dr: "", cs: "", cn: "", ct: "", wt: "", wtn: "", sl: "", sln: "", pkg: "", pkgn: "" },
  };
}

Object.assign(window, { BoilerForm, StirForm, MillForm, PackForm, newRoundData, OkWarnChips });
