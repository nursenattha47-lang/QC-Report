/* PhotoUpload — drop-in photo capture / upload widget for QC reports.
   On mobile, `capture="environment"` opens the camera; on desktop, the file picker.
   Photos are stored as base64 data URLs in state so they survive auto-save to localStorage. */

function PhotoUpload({ photos = [], onChange, label = "ถ่ายรูป / เพิ่มรูป" }) {
  const inputRef = React.useRef(null);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList).slice(0, 6); // cap per upload action
    Promise.all(files.map(f => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(f);
    }))).then(urls => {
      onChange([...photos, ...urls]);
    });
  };

  const removePhoto = (i) => onChange(photos.filter((_, j) => j !== i));

  return (
    <div className="photo-up">
      {photos.length > 0 && (
        <div className="photo-grid">
          {photos.map((src, i) => (
            <div key={i} className="photo-thumb">
              <img src={src} alt={`photo ${i + 1}`} />
              <button className="photo-del" onClick={() => removePhoto(i)} title="ลบรูป">✕</button>
            </div>
          ))}
        </div>
      )}
      <button className="photo-trigger" onClick={() => inputRef.current && inputRef.current.click()}>
        <span className="photo-trigger-ic">📷</span>
        <span>{label}</span>
        {photos.length > 0 && <span className="photo-count">{photos.length} รูป</span>}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        style={{ display: "none" }}
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  );
}

Object.assign(window, { PhotoUpload });
