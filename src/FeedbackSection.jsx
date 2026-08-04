import { useState, useRef } from "react";
import { upload } from "@vercel/blob/client";
import { FRUITS } from "../lib/catalog.js";
import { BRAND } from "./theme.js";

const FEEDBACK_ITEMS = FRUITS.flatMap(cat => cat.items.map(item => item.name));
const MAX_MEDIA_BYTES = 50 * 1024 * 1024;

export default function FeedbackSection() {
  const todayStr = () => new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ name: "", date: todayStr(), orderId: "", item: "", details: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | uploading | submitting | success | error
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: "" }));
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_MEDIA_BYTES) {
      setErrors(er => ({ ...er, file: "File is too large (max 50MB)" }));
      return;
    }
    setErrors(er => ({ ...er, file: "" }));
    setFile(f);
    setPreview({ url: URL.createObjectURL(f), type: f.type.startsWith("video") ? "video" : "image", name: f.name });
  }

  function removeFile() {
    setPreview(p => {
      if (p) URL.revokeObjectURL(p.url);
      return null;
    });
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.details.trim()) e.details = "Please share a few details";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setErrorMsg("");
    try {
      let mediaUrl = "";
      if (file) {
        setStatus("uploading");
        setProgress(0);
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/feedback-upload",
          multipart: true,
          onUploadProgress: ({ percentage }) => setProgress(percentage),
        });
        mediaUrl = blob.url;
      }

      setStatus("submitting");
      const res = await fetch("/api/feedback-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mediaUrl }),
      });
      if (!res.ok) throw new Error("Failed to submit");

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or reach us on WhatsApp.");
    }
  }

  function resetForm() {
    setForm({ name: "", date: todayStr(), orderId: "", item: "", details: "" });
    removeFile();
    setStatus("idle");
    setProgress(0);
  }

  const busy = status === "uploading" || status === "submitting";

  const fieldStyle = (key) => ({
    width: "100%", padding: "11px 12px", borderRadius: 10, fontSize: 14,
    fontFamily: "inherit", boxSizing: "border-box", outline: "none",
    border: `1.5px solid ${errors[key] ? "#DC2626" : "#e5e5e5"}`,
    background: "#fff", color: BRAND.text,
  });

  const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: BRAND.text, marginBottom: 6 };

  return (
    <div style={{ padding: "12px 20px 40px" }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: BRAND.green, margin: "0 0 4px" }}>
        Share Your Feedback
      </h2>
      <p style={{ color: BRAND.muted, fontSize: 14, margin: "0 0 20px" }}>
        Tell us how your order went — good or bad, we read every word.
      </p>

      <div>
        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🙏</div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: BRAND.green, margin: "0 0 8px" }}>
              Thank you!
            </h3>
            <p style={{ color: BRAND.muted, fontSize: 14, margin: "0 0 20px" }}>
              Your feedback has been sent. We appreciate you taking the time.
            </p>
            <button
              onClick={resetForm}
              style={{
                padding: "10px 20px", background: "transparent", color: BRAND.green,
                border: `2px solid ${BRAND.green}`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}
            >Share more feedback</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Name</label>
              <input
                type="text" placeholder="Your full name" value={form.name}
                onChange={e => set("name", e.target.value)} style={fieldStyle("name")}
              />
              {errors.name && <div style={{ fontSize: 12, color: "#DC2626", marginTop: 4 }}>{errors.name}</div>}
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Date</label>
                <input
                  type="date" value={form.date}
                  onChange={e => set("date", e.target.value)} style={fieldStyle("date")}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Order ID <span style={{ fontWeight: 400, color: BRAND.muted }}>(optional)</span></label>
                <input
                  type="text" placeholder="e.g. 1029" value={form.orderId}
                  onChange={e => set("orderId", e.target.value)} style={fieldStyle("orderId")}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Fruit / Item <span style={{ fontWeight: 400, color: BRAND.muted }}>(optional)</span></label>
              <select
                value={form.item} onChange={e => set("item", e.target.value)}
                style={fieldStyle("item")}
              >
                <option value="">General / not sure</option>
                {FEEDBACK_ITEMS.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Details</label>
              <textarea
                placeholder="What happened? The more detail, the faster we can help."
                value={form.details} onChange={e => set("details", e.target.value)}
                rows={4} style={{ ...fieldStyle("details"), resize: "none" }}
              />
              {errors.details && <div style={{ fontSize: 12, color: "#DC2626", marginTop: 4 }}>{errors.details}</div>}
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={labelStyle}>Photo / Video <span style={{ fontWeight: 400, color: BRAND.muted }}>(optional, up to 50MB)</span></label>

              {!preview ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: "100%", padding: "20px 12px", borderRadius: 10,
                    border: `1.5px dashed ${BRAND.green}55`, background: BRAND.warm,
                    color: BRAND.green, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  }}
                >
                  <span style={{ fontSize: 22 }}>📎</span>
                  Tap to add a photo or video
                </button>
              ) : (
                <div style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                  borderRadius: 10, border: "1.5px solid #e5e5e5",
                }}>
                  {preview.type === "image" ? (
                    <img src={preview.url} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <video src={preview.url} style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} muted />
                  )}
                  <span style={{ flex: 1, fontSize: 13, color: BRAND.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {preview.name}
                  </span>
                  <button
                    type="button" onClick={removeFile}
                    style={{
                      width: 28, height: 28, borderRadius: 8, border: "none", background: "#f5f5f5",
                      color: BRAND.muted, fontSize: 16, cursor: "pointer", flexShrink: 0,
                    }}
                  >✕</button>
                </div>
              )}
              <input
                ref={fileInputRef} type="file" accept="image/*,video/*"
                onChange={handleFileChange} style={{ display: "none" }}
              />
              {errors.file && <div style={{ fontSize: 12, color: "#DC2626", marginTop: 4 }}>{errors.file}</div>}
            </div>

            {status === "error" && (
              <div style={{
                marginBottom: 16, padding: "10px 12px", borderRadius: 8,
                background: "#FEF2F2", color: "#DC2626", fontSize: 13,
              }}>{errorMsg}</div>
            )}

            <button
              onClick={handleSubmit}
              disabled={busy}
              style={{
                width: "100%", padding: "14px", background: BRAND.green, color: "#fff",
                border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600,
                cursor: busy ? "default" : "pointer",
                opacity: busy ? 0.7 : 1,
              }}
            >
              {status === "uploading" ? `Uploading… ${progress}%` : status === "submitting" ? "Sending…" : "Send Feedback"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
