import { useState, useEffect } from "react";
import { setCookie, getCookie } from "@/lib/cookies";

// Optional helper: get browser user agent
const getUserAgent = () =>
  typeof navigator !== "undefined" ? navigator.userAgent : "";

// Optional: get user's geolocation (used if allowed)
const getGeolocation = () =>
  new Promise(resolve => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      pos =>
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        }),
      () => resolve(null),
      { timeout: 1500 }
    );
  });

export default function CookieBanner({ userId, email, name }) {
  const [show, setShow] = useState(false);

  // Show banner if consent cookie is missing
  useEffect(() => {
    if (getCookie("cookieConsent") !== "yes" && getCookie("cookieConsent") !== "essential") {
      const timeout = setTimeout(() => setShow(true), 4000);
      return () => clearTimeout(timeout);
    }
  }, []);

  // Accept all cookies
  const acceptCookies = async () => {
    setCookie("cookieConsent", "yes", 365);
    setShow(false);

    const geo = await getGeolocation();

    fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        consent: "yes",
        userAgent: getUserAgent(),
        geolocation: geo,
        userId: userId || null,  // optionally pass logged-in user
        email: email || null,
        name: name || null
      })
    })
      .then(res => res.json())
      .then(data => console.log("Consent logged:", data))
      .catch(err => console.error("Consent logging error:", err));
  };

  // Accept only essential cookies
  const acceptEssentialOnly = async () => {
    setCookie("cookieConsent", "essential", 365);
    setShow(false);

    const geo = await getGeolocation();

    fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        consent: "essential",
        userAgent: getUserAgent(),
        geolocation: geo,
        userId: userId || null,
        email: email || null,
        name: name || null
      })
    })
      .then(res => res.json())
      .then(data => console.log("Consent logged:", data))
      .catch(err => console.error("Consent logging error:", err));
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
          borderRadius: "1.375rem",
          border: "1.5px solid #bdbdbd",
          boxShadow: "0 7px 32px 0 #0001",
          padding: "2rem 2rem 1.6rem 2rem",
          fontFamily: `Inter, 'Segoe UI', Arial, sans-serif`,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "1.06rem",
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
            fontSize: "0.88rem",
            color: "#666",
            lineHeight: 1.75,
            marginBottom: "1.6rem",
          }}
        >
          We use cookies and similar technologies to improve our website, measure performance, understand usage, and personalize your experience. Some cookies may be used to deliver more relevant content or advertising based on your interests. You can manage your cookie preferences at any time. Essential cookies are always active to ensure the website works properly.
        </div>
        <div className="flex flex-row justify-center gap-3">
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
          <button
            style={{
              background: "#fff",
              color: "#e96717",
              border: "1.5px solid #e96717",
              padding: "0.92rem 1.6rem",
              borderRadius: "2.2rem",
              fontWeight: 600,
              fontSize: "1.02rem",
              letterSpacing: "0.01em",
              boxShadow: "0 1px 6px 0 #0001",
              cursor: "pointer",
              outline: "none",
              transition: "background 0.13s,color 0.13s",
              display: "block",
              marginLeft: "0.6rem"
            }}
            onClick={acceptEssentialOnly}
          >
            Essential only
          </button>
        </div>
      </div>
    </div>
  );
}