import { BRAND } from "./theme.js";
import { navigate } from "./router.js";
import FeedbackSection from "./FeedbackSection.jsx";

export default function FeedbackPage() {
  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: BRAND.warm, color: BRAND.text, minHeight: "100vh",
      padding: "24px 0 60px",
    }}>
      <div className="container" style={{ maxWidth: 520 }}>
        <button
          onClick={() => navigate("#/")}
          style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            color: BRAND.green, fontSize: 14, fontWeight: 600, fontFamily: "inherit",
            marginBottom: 18,
          }}
        >← Back to shop</button>

        <div style={{
          background: "#fff", borderRadius: 16,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.04)",
        }}>
          <FeedbackSection />
        </div>
      </div>
    </div>
  );
}
