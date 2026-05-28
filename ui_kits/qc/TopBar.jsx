/* TopBar — sticky dark-green header with company name + app title + save status. */

function TopBar({ status }) {
  const dotCls =
    status === "saving" ? "status-dot saving" :
    status === "error"  ? "status-dot error"  :
                          "status-dot";
  const label =
    status === "saving" ? "กำลังบันทึก..." :
    status === "saved"  ? "บันทึกแล้ว"      :
    status === "error"  ? "บันทึกไม่สำเร็จ"  :
                          "พร้อมใช้งาน";
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-main">
          <div className="topbar-co">บริษัท อัญชลี ฟรุ๊ต โปรดักส์ จำกัด</div>
          <div className="topbar-title">ระบบ QC ประจำวัน</div>
        </div>
        <div className="topbar-status">
          <div className={dotCls}></div>
          <span>{label}</span>
        </div>
      </div>
    </header>
  );
}

Object.assign(window, { TopBar });
