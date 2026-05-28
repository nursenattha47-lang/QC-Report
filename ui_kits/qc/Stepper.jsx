/* Stepper — horizontal progress indicator with 8 steps + station completion ticks. */

function Stepper({ step, totalSteps, labels, savedKeys, onJump, accent }) {
  return (
    <div className="stepper">
      <div className="stepper-track">
        {labels.map((lb, i) => {
          const done = savedKeys[i];
          const active = i === step;
          return (
            <button
              key={i}
              className={"stepper-dot" + (active ? " active" : "") + (done ? " done" : "")}
              style={active && accent ? { borderColor: accent, color: accent } : null}
              onClick={() => onJump(i)}
              title={lb}
            >
              <span className="stepper-num">{i + 1}</span>
            </button>
          );
        })}
      </div>
      <div className="stepper-meta">
        <span className="stepper-current">ขั้นที่ {step + 1}/{totalSteps}</span>
        <span className="stepper-label">{labels[step]}</span>
      </div>
    </div>
  );
}

function BottomNav({ onPrev, onNext, nextLabel, prevDisabled, nextDisabled, accent, lastStep, savedTime }) {
  return (
    <div className="bottom-nav">
      <div className="bottom-nav-inner">
        <button
          className="btn-nav btn-nav-prev"
          onClick={onPrev}
          disabled={prevDisabled}
        >← ย้อน</button>
        <div className="bottom-nav-meta">
          {savedTime && <span className="saved-stamp">บันทึก {savedTime} น.</span>}
        </div>
        <button
          className="btn-nav btn-nav-next"
          style={accent ? { background: accent } : null}
          onClick={onNext}
          disabled={nextDisabled}
        >{nextLabel || "บันทึก + ถัดไป →"}</button>
      </div>
    </div>
  );
}

/* PageHeader — sits at the top of each wizard page, accent-colored. */

function PageHeader({ title, subtitle, accent, code, savedTime }) {
  return (
    <div className="page-header" style={accent ? { background: accent } : null}>
      <div className="page-header-main">
        {code && <span className="page-header-code">{code}</span>}
        <div>
          {subtitle && <div className="page-header-sub">{subtitle}</div>}
          <div className="page-header-title">{title}</div>
        </div>
      </div>
      {savedTime && <div className="page-header-stamp">{savedTime} น.</div>}
    </div>
  );
}

Object.assign(window, { Stepper, BottomNav, PageHeader });
