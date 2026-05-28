/* Alert — ok / warn / info / note variants. Often paired with an optional uppercase mini-label. */

function Alert({ kind = "ok", label, children, style }) {
  return (
    <div className={"alert " + kind} style={style}>
      {label && <div className="alert-label">{label}</div>}
      {children}
    </div>
  );
}

Object.assign(window, { Alert });
