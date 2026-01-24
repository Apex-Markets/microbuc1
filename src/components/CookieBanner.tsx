import { useState, useEffect } from "react";
import { setCookie, getCookie } from "@/lib/cookies";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (getCookie("cookieConsent") !== "yes") {
      const timeout = setTimeout(() => setShow(true), 4000);
      return () => clearTimeout(timeout);
    }
  }, []);

  const acceptCookies = () => {
    setCookie("cookieConsent", "yes", 365);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.21)", pointerEvents: "auto" }}
      aria-modal="true"
      tabIndex={-1}
      role="dialog"
    >
      <div
        style={{
          background: "#fff",
          color: "#222",
          maxWidth: 530,
          width: "92%",
          borderRadius: "1.375rem", // ~22px
          border: "1.5px solid #bdbdbd",
          boxShadow: "0 7px 32px 0 #0001",
          padding: "2rem 2rem 1.5rem 2rem",
          fontFamily: `Inter, 'Segoe UI', Arial, sans-serif`,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "1.06rem", // ≈ 17px
            marginBottom: "0.75rem",
            color: "#585858",
            letterSpacing: "0",
          }}
        >
          How we use cookies and your consent
        </div>
        <div
          style={{
            fontWeight: 400,
            fontSize: "0.88rem", // ≈ 14px
            color: "#666",
            lineHeight: 1.75,
            marginBottom: "1.6rem",
          }}
        >
          We use cookies and similar technologies to improve our website, measure performance, understand usage, and personalize your experience. Some cookies may be used to deliver more relevant content or advertising based on your interests. You can manage your cookie preferences at any time. Essential cookies are always active to ensure the website works properly.
        </div>
        <div className="flex flex-row justify-center">
          <button
            style={{
              background: "#e96717",
              color: "#fff",
              border: "none",
              padding: "0.92rem 2.35rem",
              borderRadius: "2.2rem",
              fontWeight: 600,
              fontSize: "1.07rem",
              letterSpacing: "0.01em",
              boxShadow: "0 2px 12px 0 #0002",
              margin: "0 0.3rem",
              cursor: "pointer",
              outline: "none",
              transition: "background 0.18s",
              display: "block",
            }}
            onMouseOver={e => (e.currentTarget.style.background = "#c15105")}
            onMouseOut={e => (e.currentTarget.style.background = "#e96717")}
            onClick={acceptCookies}
            autoFocus
          >
            Accept cookies
          </button>
        </div>
      </div>
    </div>
  );
}