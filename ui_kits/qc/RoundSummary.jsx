/* RoundSummary — comprehensive read-only report of every inspection topic
   in the active round. Used on step 7 (ปิดรอบ + สรุป). Each station block lists every
   field the operator was asked about + the verdict / value they entered. */

function Row({ label, value, variant, note, photos }) {
  const valueClass = "sumry-row-value" + (variant ? " " + variant : "");
  return (
    <div className="sumry-row">
      <div className="sumry-row-label">{label}</div>
      <div className={valueClass}>{value}</div>
      {note && <div className="sumry-row-note">{note}</div>}
      {photos && photos.length > 0 && (
        <div className="sumry-photos">
          <div className="sumry-photo-thumbs">
            {photos.map((src, i) => <img key={i} className="sumry-photo-thumb" src={src} alt="" />)}
          </div>
        </div>
      )}
    </div>
  );
}

function statusText(v) {
  if (v === "ok")    return { value: "ปกติ",       variant: "ok"   };
  if (v === "warn")  return { value: "ไม่ปกติ",     variant: "warn" };
  if (v === "none")  return { value: "ไม่ดำ",       variant: "ok"   };
  if (v === "black") return { value: "ดำ",          variant: "warn" };
  if (v === "dark")  return { value: "เข้มเกิน",     variant: "warn" };
  if (v === "light") return { value: "สว่างเกิน",    variant: "warn" };
  if (v === "yes")   return { value: "ทำเสร็จแล้ว",  variant: "ok"   };
  if (v === "no")    return { value: "ยังไม่เสร็จ",   variant: "warn" };
  return { value: "— ยังไม่ระบุ —", variant: "muted" };
}

function SumrySection({ title, time, children }) {
  return (
    <div className="sumry-section">
      <div className="sumry-section-head">
        <span className="sumry-section-title">{title}</span>
        {time
          ? <span className="sumry-section-time">บันทึก {time} น.</span>
          : <span className="sumry-section-time missing">ยังไม่บันทึก</span>}
      </div>
      <div className="sumry-body">{children}</div>
    </div>
  );
}

function RoundSummary({ round, rd, dayState, hideDayHeader }) {
  return (
    <>
      {/* DAY-LEVEL pre-check */}
      {!hideDayHeader && (
        <SumrySection title="ข้อมูลผู้รายงาน (ทั้งวัน)" time="">
          <Row label="วันที่" value={dayState.date || "—"} />
          <Row label="ผู้รายงาน" value={dayState.rep || "—"} />
          <Row label="จิ้มสินค้า pre-check" {...statusText(dayState.pc)} note={dayState.pct ? `บันทึกเวลา ${dayState.pct} น.` : null} />
          {dayState.pcc && <Row label="Comment" value={dayState.pcc} />}
          {dayState.pcf && <Row label="LOT ที่ต้องแก้ไข" value={dayState.pcf} />}
        </SumrySection>
      )}

      {/* LOTs in this round */}
      <SumrySection title={`LOT ในรอบ ${round.lb} — ${rd.lots.length} รายการ`} time={rd.saved.lot}>
        {rd.lots.length === 0 && <Row label="" value="ไม่มี LOT ในรอบนี้" variant="muted" />}
        {rd.lots.map((lot, i) => {
          const codeObj = LOT_CODES.find(c => c.code === lot.bcode);
          const codeName = codeObj ? `${codeObj.emoji} ${codeObj.name}` : "";
          return (
            <div key={i} style={{ borderBottom: "1px solid var(--gr1)", padding: "10px 0" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--g8)", marginBottom: 4 }}>
                LOT {i + 1} — <span style={{ fontFamily: "var(--mono)" }}>{lot.num || "—"}</span> {codeName && <span style={{ fontSize: 13, color: "var(--g6)" }}>· {codeName}</span>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, fontSize: 13 }}>
                <div>รสชาติ: <b style={{ color: lot.taste === "ok" ? "var(--g7)" : (lot.taste === "ng" ? "var(--r5)" : "var(--gr5)") }}>{lot.taste === "ok" ? "ปกติ" : lot.taste === "ng" ? "ไม่ปกติ" : "—"}</b></div>
                <div>กลิ่น: <b style={{ color: lot.smell === "ok" ? "var(--g7)" : (lot.smell === "ng" ? "var(--r5)" : "var(--gr5)") }}>{lot.smell === "ok" ? "ปกติ" : lot.smell === "ng" ? "ไม่ปกติ" : "—"}</b></div>
                <div>สี: <b style={{ color: lot.color === "ok" ? "var(--g7)" : (lot.color ? "var(--r5)" : "var(--gr5)") }}>{lot.color === "ok" ? "ปกติ" : lot.color === "dark" ? "เข้มเกิน" : lot.color === "light" ? "สว่างเกิน" : "—"}</b></div>
              </div>
              {lot.fix && <div style={{ fontSize: 13, color: "var(--a5)", marginTop: 4 }}>หมายเหตุ: {lot.fix}</div>}
            </div>
          );
        })}
      </SumrySection>

      {/* STIR */}
      <SumrySection title="โรงกวน" time={rd.saved.stir}>
        <Row label="เครื่องที่ใช้งาน" value={rd.stir.am.length > 0 ? [...rd.stir.am].sort((a,b)=>a-b).join(", ") : "—"} />
        {[1,2,3,4,5,6,7,8,9].filter(n => rd.stir.am.indexOf(n) < 0 && rd.stir.ist[n]).map(n => {
          const st = rd.stir.ist[n];
          return <Row key={n} label={`เครื่อง ${n}`} value={st === "broken" ? "เสีย" : "ไม่ได้ใช้"} variant={st === "broken" ? "warn" : "muted"} note={st === "broken" ? rd.stir.ino[n] : null} />;
        })}
        <Row label="แบะแซและน้ำตาล" {...statusText(rd.stir.sy)} note={rd.stir.syn || null} />
        <Row label="โทนสีขณะกวน" {...statusText(rd.stir.col)} note={rd.stir.coln || null} photos={rd.stir.colorImgs} />
        <Row label="รสชาติ" {...statusText(rd.stir.fl)} note={rd.stir.fl === "warn" ? rd.stir.fln : null} />
        <Row label="การลงเอกสาร" {...statusText(rd.stir.dr)} />
        <Row label="คะแนนความสะอาด" value={rd.stir.cs ? `${rd.stir.cs} / 10` : "—"} variant={rd.stir.cs ? null : "muted"} note={rd.stir.cn || null} />
      </SumrySection>

      {/* BOILER */}
      <SumrySection title="บอยเลอร์" time={rd.saved.boiler}>
        <Row label="อุณหภูมิ (≤40°C)" {...statusText(rd.boiler.temp)} note={rd.boiler.notes?.temp || null} />
        <Row label="แรงดัน" {...statusText(rd.boiler.press)} note={rd.boiler.notes?.press || null} />
        <Row label="ระดับน้ำ 2 หลอด" {...statusText(rd.boiler.water)} note={rd.boiler.notes?.water || null} />
        <Row label="น้ำยา / ปั๊ม" {...statusText(rd.boiler.pump)} note={rd.boiler.notes?.pump || null} />
        <Row label="ควัน" {...statusText(rd.boiler.smoke)} note={rd.boiler.notes?.smoke || null} />
      </SumrySection>

      {/* MILL */}
      <SumrySection title="โรงโม่" time={rd.saved.mill}>
        <Row label="เครื่องโม่ที่ใช้งาน" value={rd.mill.mc.length > 0 ? [...rd.mill.mc].sort((a,b)=>a-b).map(n => `เครื่อง ${n}`).join(", ") : "—"} />
        {[1,2,3].filter(n => rd.mill.mc.indexOf(n) < 0 && (rd.mill.mist?.[n])).map(n => {
          const st = rd.mill.mist[n];
          return <Row key={n} label={`เครื่อง ${n}`} value={st === "broken" ? "เสีย" : "ไม่ได้ใช้"} variant={st === "broken" ? "warn" : "muted"} note={st === "broken" ? rd.mill.mino?.[n] : null} />;
        })}
        <Row label="ตรวจวัตถุดิบเสร็จแล้ว" value={`${rd.mill.vh.length} คัน${rd.mill.vh.length > 0 ? " — คันที่ " + [...rd.mill.vh].sort((a,b)=>a-b).join(", ") : ""}`} />
        {[
          { k: "pineapple", lb: "ตรวจสับปะรดสด หัว/แกน" },
          { k: "papaya",    lb: "ตรวจมะละกอ" },
          { k: "dry",       lb: "ตรวจของแห้ง" },
          { k: "other",     lb: "ตรวจวัตถุดิบอื่นๆ" },
        ].map(t => {
          const ck = rd.mill.rmCheck?.[t.k];
          if (!ck || !ck.sel) return null;
          const detail = ck.detail ? ` (${ck.detail})` : "";
          const result = ck.contam === "none"  ? { value: "ไม่พบสิ่งปนเปื้อน",  variant: "ok"   }
                       : ck.contam === "found" ? { value: "พบสิ่งปนเปื้อน",     variant: "warn" }
                       : { value: "— ยังไม่ระบุ —", variant: "muted" };
          return <Row key={t.k} label={t.lb + detail} {...result} note={ck.contam === "found" ? ck.note : null} />;
        })}
        {rd.mill.contamPhotos && rd.mill.contamPhotos.length > 0 && (
          <Row label="รูปสิ่งปนเปื้อน / วัตถุดิบ" value={`${rd.mill.contamPhotos.length} รูป`} photos={rd.mill.contamPhotos} />
        )}
        <Row label="การปิดคลุมผ้าหลังโม่เสร็จ" {...statusText(rd.mill.cv)} note={rd.mill.cvn || null} />
        <Row label="การลงเอกสาร" {...statusText(rd.mill.dr)} />
        <Row label="คะแนนความสะอาด" value={rd.mill.cs ? `${rd.mill.cs} / 10` : "—"} variant={rd.mill.cs ? null : "muted"} note={rd.mill.cn3 || null} />
      </SumrySection>

      {/* PACK */}
      <SumrySection title="โรงแพ็ค" time={rd.saved.pack}>
        <Row label="เครื่องติดสติกเกอร์" {...statusText(rd.pack.st)} note={rd.pack.stn || null} />
        <Row label="เครื่องซีล" {...statusText(rd.pack.se)} note={rd.pack.sen || null} />
        <Row label="เครื่องรัดกล่อง" {...statusText(rd.pack.sr)} note={rd.pack.srn || null} />
        <Row label="การปั๊มวันหมดอายุ" {...statusText(rd.pack.ex)} note={rd.pack.exn || null} photos={rd.pack.expiryImgs} />
        <Row label="สุ่มชั่งน้ำหนัก" {...statusText(rd.pack.wt)} note={rd.pack.wtn || null} />
        <Row label="รอยซีล" {...statusText(rd.pack.sl)} note={rd.pack.sln || null} />
        <Row label="บรรจุภัณฑ์" {...statusText(rd.pack.pkg)} note={rd.pack.pkgn || null} />
      </SumrySection>
    </>
  );
}

Object.assign(window, { RoundSummary });
