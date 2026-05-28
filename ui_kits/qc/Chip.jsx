/* Chip — large (44 px) and small (cchip / 36 px). Variant prop: ok / ng / warn / gray / blue. */

function Chip({ active, variant = "ok", onClick, children }) {
  const cls = "chip" + (active ? " " + variant : "");
  return <button className={cls} onClick={onClick}>{children}</button>;
}

function CChip({ active, variant = "ok", onClick, children }) {
  const cls = "cchip" + (active ? " " + variant : "");
  return <button className={cls} onClick={onClick}>{children}</button>;
}

function ChipGroup({ children, style }) {
  return <div className="chips" style={style}>{children}</div>;
}

Object.assign(window, { Chip, CChip, ChipGroup });
