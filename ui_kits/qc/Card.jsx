/* Card — universal white container. Head is optional. */

function Card({ title, headRight, children }) {
  return (
    <div className="card">
      {title && (
        <div className="card-head">
          <div className="card-title">{title}</div>
          {headRight}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
}

Object.assign(window, { Card });
