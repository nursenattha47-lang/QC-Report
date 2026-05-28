/* Section — collapsible station container with chevron + colored title. */

function Section({ icon, title, color, defaultOpen = false, children, headStyle }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="section">
      <div className="section-head" style={headStyle} onClick={() => setOpen(!open)}>
        <div className="section-title" style={{ color: color || undefined }}>
          {icon && <span>{icon}</span>} {title}
        </div>
        <span className={"section-arrow" + (open ? " open" : "")}>▼</span>
      </div>
      {open && <div className="section-body">{children}</div>}
    </div>
  );
}

Object.assign(window, { Section });
