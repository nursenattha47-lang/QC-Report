/* TabBar — 2-tab routing: form / history. */

function TabBar({ active, onChange }) {
  const tabs = [
    { k: "form", lb: "📋 กรอก QC" },
    { k: "hist", lb: "📁 ประวัติ" },
  ];
  return (
    <div className="tabs-wrap">
      <div className="tabs">
        {tabs.map(t => (
          <button
            key={t.k}
            className={"tab-btn" + (active === t.k ? " active" : "")}
            onClick={() => onChange(t.k)}
          >{t.lb}</button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { TabBar });
