/* Field — labelled input / textarea / select. Plus Row helper for 2-col responsive form rows. */

function Label({ children }) {
  return <label className="lbl">{children}</label>;
}

function Field({ label, children }) {
  return (
    <div className="field">
      {label && <Label>{label}</Label>}
      {children}
    </div>
  );
}

function Input({ value, onChange, type = "text", placeholder, ...rest }) {
  return (
    <input
      type={type}
      className="inp"
      value={value || ""}
      placeholder={placeholder}
      onChange={e => onChange && onChange(e.target.value)}
      {...rest}
    />
  );
}

function TextArea({ value, onChange, rows = 2, placeholder }) {
  return (
    <textarea
      className="ta"
      rows={rows}
      placeholder={placeholder}
      value={value || ""}
      onChange={e => onChange && onChange(e.target.value)}
    />
  );
}

function Select({ value, onChange, children }) {
  return (
    <select
      className="lot-sel"
      value={value || ""}
      onChange={e => onChange && onChange(e.target.value)}
    >{children}</select>
  );
}

function TwoCol({ children }) {
  return <div className="two-col">{children}</div>;
}

function Divider() {
  return <div className="div"></div>;
}

Object.assign(window, { Label, Field, Input, TextArea, Select, TwoCol, Divider });
