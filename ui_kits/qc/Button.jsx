/* Button — primary / dark / outline / add-dashed / btn-sm variants. */

function Button({ variant = "primary", onClick, style, children }) {
  const cls =
    variant === "dark"    ? "btn btn-dark"    :
    variant === "outline" ? "btn btn-outline" :
                            "btn btn-primary";
  return <button className={cls} style={style} onClick={onClick}>{children}</button>;
}

function AddButton({ color = "#52aa70", textColor = "#2e6b42", onClick, children }) {
  return (
    <button
      className="btn-add-lot"
      style={{ borderColor: color, color: textColor }}
      onClick={onClick}
    >{children}</button>
  );
}

function SmallButton({ onClick, children }) {
  return <button className="btn-sm" onClick={onClick}>{children}</button>;
}

Object.assign(window, { Button, AddButton, SmallButton });
