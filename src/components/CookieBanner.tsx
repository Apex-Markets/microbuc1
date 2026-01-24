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
      style={{ background: "rgba(0,0,0,0.24)", pointerEvents: "auto" }}
      aria-modal="true"
      tabIndex={-1}
      role="dialog"
    >
      <div
        style={{
          background: "#fff",
          color: "#222",
          maxWidth: 430,
          width: "92%",
          borderRadius: "1rem",
          border: "1px solid #c0c0c0",
          boxShadow: "0 4px 32px 2px #0002",
          padding: "1.25rem 1.25rem 1.1rem 1.25rem",
          fontFamily: 'Inter, "Segoe UI", system-ui, Arial, sans-serif',
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "1.025rem",
            marginBottom: "0.55rem",
            letterSpacing: "0",
          }}
        >
          How we use cookies and your consent
        </div>
        <div
          style={{
            fontWeight: 400,
            fontSize: "0.925rem",
            color: "#444",
            lineHeight: 1.54,
            marginBottom: "1.15rem",
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
              padding: "0.64rem 2.05rem",
              borderRadius: "1.15rem",
              fontWeight: 600,
              fontSize: "0.98rem",
              letterSpacing: "0.005em",
              boxShadow: "0 2px 6px 0 #0001",
              margin: "0 0.2rem",
              cursor: "pointer",
              outline: "none",
              transition: "background 0.14s",
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