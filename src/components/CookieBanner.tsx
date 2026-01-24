import { useState, useEffect } from "react";
import { setCookie, getCookie } from "@/lib/cookies";

export default function CookieBanner() {
  // State is only true after 4s and after user hasn't consented yet
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show if not already accepted
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
        background: "rgba(0,0,0,0.38)",
        pointerEvents: "auto",
      }}
      aria-modal="true"
      tabIndex={-1}
      role="dialog"
    >
      <div
        className="bg-white dark:bg-gray-900 dark:text-white"
        style={{
          maxWidth: 500,
          width: "90%",
          padding: "2.5rem 2rem 1.5rem 2rem",
          borderRadius: "1.2rem",
          boxShadow: "0 2px 36px 4px #0005",
          border: "2px solid #eee",
          position: "relative",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "1.19rem", marginBottom: "0.7rem" }}>
          How we use cookies and your consent
        </div>
        <div style={{ fontWeight: 400, fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "1.4rem" }}>
          We use cookies and similar technologies on our websites to improve them,
          measure their performance, understand our audience and enhance the user experience.
          By using our website, you agree to our use of <b>essential cookies</b>.
          With your consent, we also use analytics cookies to personalize content and analyze our traffic.
          Read our{" "}
          <a
            href="/privacy"
            style={{ textDecoration: "underline", color: "#2e5ae0" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          .
        </div>
        <div className="flex flex-row justify-center">
          <button
            style={{
              background: "#f58220",
              color: "#fff",
              border: "none",
              padding: "0.95rem 2.2rem",
              borderRadius: "2rem",
              fontWeight: 600,
              fontSize: "1.15rem",
              boxShadow: "0 2px 8px 0 #0002",
              margin: "0 0.5rem",
              cursor: "pointer",
            }}
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