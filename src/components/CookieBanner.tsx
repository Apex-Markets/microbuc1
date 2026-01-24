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
      style={{
        background: "rgba(0,0,0,0.33)",
        pointerEvents: "auto",
      }}
      aria-modal="true"
      tabIndex={-1}
      role="dialog"
    >
      <div
        style={{
          background: "#fff",
          color: "#222",
          maxWidth: "480px",
          width: "90%",
          borderRadius: "1.3rem",
          border: "1.5px solid #bbb",
          boxShadow: "0 4px 40px 0 #0003",
          padding: "2rem 1.7rem 1.5rem 1.7rem",
          fontFamily:
            'Inter, "Segoe UI", system-ui, Arial, sans-serif',
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "1.15rem",
            marginBottom: "0.7rem",
            letterSpacing: "-0.01em",
          }}
        >
          How we use cookies and your consent
        </div>
        <div
          style={{
            fontWeight: 400,
            fontSize: "0.99rem",
            color: "#444",
            lineHeight: "1.7",
            marginBottom: "1.4rem",
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
              padding: "0.95rem 2.4rem",
              borderRadius: "2rem",
              fontWeight: 600,
              fontSize: "1.11rem",
              letterSpacing: "0.02em",
              boxShadow: "0 2px 8px 0 #0002",
              margin: "0 0.5rem",
              cursor: "pointer",
              outline: "none",
              transition: "background 0.18s",
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