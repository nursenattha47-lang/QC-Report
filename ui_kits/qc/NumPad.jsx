/* NumPad — machine-number toggle grid (1..N) + score row (1-10). Tap targets ≥38 px. */

function NumPad({ range = [1,2,3,4,5,6,7,8,9], selected = [], onToggle, sm = false }) {
  return (
    <div className="num-grid">
      {range.map(n => (
        <button
          key={n}
          className={"num-btn" + (selected.indexOf(n) >= 0 ? " on" : "") + (sm ? " sm" : "")}
          onClick={() => onToggle && onToggle(n)}
        >{n}</button>
      ))}
    </div>
  );
}

function ScoreRow({ value, onChange }) {
  return (
    <div className="score-row">
      {[1,2,3,4,5,6,7,8,9,10].map(n => (
        <button
          key={n}
          className={"score-btn" + (String(value) === String(n) ? " on" : "")}
          onClick={() => onChange && onChange(String(n))}
        >{n}</button>
      ))}
    </div>
  );
}

Object.assign(window, { NumPad, ScoreRow });
