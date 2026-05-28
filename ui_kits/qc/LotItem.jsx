/* LotSummary — day-wide LOT counter card. Dark-green with mono numeral. */

function LotSummary({ total, accent }) {
  return (
    <div className="lot-summary" style={accent ? { background: accent } : null}>
      <div>
        <div className="lot-sub">LOT ชิมทั้งวัน</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--w)" }}>รวมทุกรอบ</div>
      </div>
      <div className="lot-summary-num">{total}</div>
    </div>
  );
}

/* LotItem — one fruit batch: LOT-code builder + 3 sensory-criteria chip groups + fix note. */

function LotItem({ index, lot, accent, onChange, onDelete }) {
  const set = (patch) => onChange({ ...lot, ...patch });

  const codeObj = LOT_CODES.find(c => c.code === lot.bcode);
  const codeName = codeObj ? `${codeObj.emoji} ${codeObj.name}` : "";
  const preview = lot.bcode
    ? `${lot.bcode}${lot.boven || "1"}-${lot.bday || "?"}-${lot.bmonth || "?"}-${lot.byear || "?"}-${lot.btimes || "1"}`
    : (lot.num || "— เลือกรหัสก่อน —");

  const baseYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 4 }, (_, j) => String(baseYear - 1 + j).slice(-2));

  return (
    <div className="lot-item">
      <div className="lot-item-head">
        <span className="lot-item-num">
          LOT {index + 1}
          {lot.num && <span style={{ fontFamily: "var(--mono)", color: "var(--g7)" }}> — {lot.num}</span>}
        </span>
        <button className="btn-lot-del" onClick={onDelete}>ลบ</button>
      </div>

      {/* LOT code builder */}
      <div className="lot-builder">
        <div className="lot-builder-title">สร้างเลข LOT อัตโนมัติ</div>
        <div className="lot-builder-grid">
          <div>
            <div className="lot-sel-label">รหัส (สินค้า)</div>
            <Select value={lot.bcode} onChange={v => set({ bcode: v })}>
              <option value="">— เลือกรหัส —</option>
              {LOT_CODES.map(c => (
                <option key={c.code} value={c.code}>{c.code} — {c.emoji} {c.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <div className="lot-sel-label">เตาที่</div>
            <Select value={lot.boven || "1"} onChange={v => set({ boven: v })}>
              {[1,2,3,4,5,6,7,8,9].map(v => <option key={v} value={v}>{v}</option>)}
            </Select>
          </div>
          <div>
            <div className="lot-sel-label">วันที่</div>
            <Select value={lot.bday || pad(new Date().getDate())} onChange={v => set({ bday: v })}>
              {Array.from({ length: 31 }, (_, d) => pad(d + 1)).map(v => (
                <option key={v} value={v}>{parseInt(v, 10)}</option>
              ))}
            </Select>
          </div>
          <div>
            <div className="lot-sel-label">เดือน</div>
            <Select value={lot.bmonth || pad(new Date().getMonth() + 1)} onChange={v => set({ bmonth: v })}>
              {["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."].map((mn, mi) => (
                <option key={mi} value={pad(mi + 1)}>{mn}</option>
              ))}
            </Select>
          </div>
          <div>
            <div className="lot-sel-label">ปี (2 หลัก)</div>
            <Select value={lot.byear || String(baseYear).slice(-2)} onChange={v => set({ byear: v })}>
              {yearOptions.map(v => <option key={v} value={v}>{v}</option>)}
            </Select>
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <div className="lot-sel-label">ครั้งที่กวน</div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {[1,2,3,4,5,6,7,8,9].map(t => (
              <CChip
                key={t}
                active={String(lot.btimes || "1") === String(t)}
                variant="ok"
                onClick={() => set({ btimes: String(t) })}
              >{t}</CChip>
            ))}
          </div>
        </div>

        <div className="lot-builder-result">
          <div>
            <div className="lot-sel-label">ตัวอย่างเลข LOT</div>
            <div className="lot-builder-result-code">{preview}</div>
            {codeName && <div style={{ fontSize: 11, color: "var(--g6)", marginTop: 2 }}>{codeName}</div>}
          </div>
          <button
            className="btn-lot-apply"
            disabled={!lot.bcode}
            style={!lot.bcode ? { opacity: .4 } : null}
            onClick={() => lot.bcode && set({
              num: `${lot.bcode}${lot.boven || "1"}-${lot.bday || "1"}-${lot.bmonth || "1"}-${lot.byear || "26"}-${lot.btimes || "1"}`
            })}
          >ใช้เลขนี้</button>
        </div>

      </div>

      {/* Manual LOT input — for random tasting samples (not from production line) */}
      <div style={{
        background: "#fff",
        border: "1.5px dashed #b45309",
        borderRadius: "var(--rmd)",
        padding: "10px 12px",
        marginBottom: 10,
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px",
          color: "#b45309", marginBottom: 6, display: "flex", alignItems: "center", gap: 6,
        }}>
          พิมพ์เลข LOT เอง — กรณีสุ่มชิม
        </div>
        <input
          className="inp"
          style={{ fontFamily: "var(--mono)", letterSpacing: 1 }}
          value={lot.num || ""}
          placeholder="เช่น B7-12-5-26-3"
          onChange={e => set({ num: e.target.value })}
        />
        <div style={{ fontSize: 10, color: "#b45309", marginTop: 6 }}>
          ใช้ช่องนี้เมื่อเลือกชิมแบบสุ่ม ไม่ใช่ LOT ที่ผลิตเอง
        </div>
      </div>

      {/* Sensory criteria */}
      <div style={{ marginTop: 10, borderTop: "1px solid var(--gr1)", paddingTop: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, color: "var(--gr5)", marginBottom: 8 }}>
          เกณฑ์การประเมิน
        </div>

        <CriteriaGroup label="รสชาติ">
          <CChip active={lot.taste === "ok"} variant="ok" onClick={() => set({ taste: "ok" })}>เปรี้ยวอมหวาน / ปกติ</CChip>
          <CChip active={lot.taste === "ng"} variant="ng" onClick={() => set({ taste: "ng" })}>! ไม่ปกติ</CChip>
        </CriteriaGroup>

        <CriteriaGroup label="กลิ่น">
          <CChip active={lot.smell === "ok"} variant="ok" onClick={() => set({ smell: "ok" })}>หอมปกติ</CChip>
          <CChip active={lot.smell === "ng"} variant="ng" onClick={() => set({ smell: "ng" })}>! ไม่ปกติ</CChip>
        </CriteriaGroup>

        <CriteriaGroup label="สี">
          <CChip active={lot.color === "ok"} variant="ok" onClick={() => set({ color: "ok" })}>ปกติ</CChip>
          <CChip active={lot.color === "dark"} variant="warn" onClick={() => set({ color: "dark" })}>เข้มเกิน</CChip>
          <CChip active={lot.color === "light"} variant="ng" onClick={() => set({ color: "light" })}>สว่างเกิน</CChip>
        </CriteriaGroup>

        <div style={{ marginTop: 8 }}>
          <Label>การแก้ไข / หมายเหตุ</Label>
          <Input value={lot.fix} placeholder="-" onChange={v => set({ fix: v })} />
        </div>
      </div>
    </div>
  );
}

function CriteriaGroup({ label, children }) {
  return (
    <div className="criteria-group">
      <div className="criteria-group-label">{label}</div>
      <div className="criteria-chips">{children}</div>
    </div>
  );
}

function newLot() {
  const d = new Date();
  return {
    num: "", bcode: "", boven: "1",
    bday: pad(d.getDate()),
    bmonth: pad(d.getMonth() + 1),
    byear: String(d.getFullYear()).slice(-2),
    btimes: "1",
    taste: "", smell: "", color: "", fix: "",
  };
}

Object.assign(window, { LotSummary, LotItem, CriteriaGroup, newLot });
