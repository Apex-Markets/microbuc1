import { useState, useEffect, useRef } from "react";
import { setCookie, getCookie } from "@/lib/cookies";

function getDeviceId() {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = self.crypto?.randomUUID ? self.crypto.randomUUID() :
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}

function buildAnonymousPersona() {
  return {
    deviceId: getDeviceId(),
    userAgent: getUserAgent(),
    language: navigator.language,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    platform: navigator.platform,
    referrer: document.referrer,
    // Add this line:
    geolocation: null, // will be filled in later
  };
}

// Helper for user agent
const getUserAgent = () =>
  typeof navigator !== "undefined" ? navigator.userAgent : "";

// Helper for geolocation
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
  const appearedAtRef = useRef(null);
  const acceptClicksRef = useRef(0);
  const essentialClicksRef = useRef(0);

 useEffect(() => {
  // Build the persona right away!
  const persona = buildAnonymousPersona();

  // Fill in geolocation asynchronously
  getGeolocation().then(geo => {
    persona.geolocation = geo || "unknown";
    fetch("https://microbuc-backend.onrender.com/api/persona", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(persona),
    }).catch(() => {});
  });

  // Existing consent logic (for banner) stays as you have it!
  if (getCookie("cookieConsent") !== "yes" && getCookie("cookieConsent") !== "essential") {
    const timeout = setTimeout(() => {
      setShow(true);
      appearedAtRef.current = Date.now();
    }, 4000);
    return () => clearTimeout(timeout);
  }
}, []);

  // Track duration the cookie banner was visible
  const logDuration = () => {
    if (!appearedAtRef.current) return;
    const now = Date.now();
    const durationSecs = Math.floor((now - appearedAtRef.current) / 1000);
    appearedAtRef.current = null; // reset
    fetch("https://microbuc-backend.onrender.com/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "banner_duration",
        value: durationSecs,
        userId: userId || null,
        email: email || null,
        name: name || null,
        page: window.location.pathname,
        userAgent: getUserAgent(),
      }),
    }).catch(() => {});
  };

  // Track button clicks/counts
  const logClick = (buttonType, count) => {
    fetch("https://microbuc-backend.onrender.com/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "button_click",
        button: buttonType,
        count,
        userId: userId || null,
        email: email || null,
        name: name || null,
        page: window.location.pathname,
        userAgent: getUserAgent(),
      }),
    }).catch(() => {});
  };

  // Accept all cookies
const acceptCookies = async () => {
  acceptClicksRef.current += 1;
  logClick("accept", acceptClicksRef.current);
  setCookie("cookieConsent", "yes", 365);
  setShow(false);
  logDuration();

  const geo = await getGeolocation();
  const payload = {
    consent: "yes",
    userAgent: getUserAgent(),
    geolocation: geo ? geo : "unknown",
    userId: userId || null,
    email: email || null,
    name: name || null,
    deviceId: getDeviceId(),
  };
  console.log("Consent fetch payload:", payload); // ADD THIS LINE!
  fetch("https://microbuc-backend.onrender.com/api/consent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(res => res.json())
    .then(data => console.log("Consent logged:", data))
    .catch(err => console.error("Consent logging error:", err));
};

// Accept only essential cookies
const acceptEssentialOnly = async () => {
  essentialClicksRef.current += 1;
  logClick("essential", essentialClicksRef.current);

  setCookie("cookieConsent", "essential", 365);
  setShow(false);
  logDuration();

  fetch("https://microbuc-backend.onrender.com/api/consent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      consent: "essential",
      deviceId: getDeviceId(),    // <--- add this line
      // You can decide whether to include other fields here
    }),
  })
    .then(res => res.json())
    .then(data => console.log("Consent logged:", data))
    .catch(err => console.error("Consent logging error:", err));
};

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.13)", pointerEvents: "auto" }}
      aria-modal="true"
      tabIndex={-1}
      role="dialog"
    >
      <div
        style={{
          background: "#fff",
          color: "#222",
          maxWidth: 310,
          width: "94%",
          borderRadius: "0.86rem",
          border: "1px solid #bdbdbd",
          boxShadow: "0 3px 16px #00000012",
          padding: "0.88rem 1rem 0.64rem 1rem",
          fontFamily: `Inter, 'Segoe UI', Arial, sans-serif`,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "0.83rem",
            marginBottom: "0.32rem",
            color: "#585858",
            letterSpacing: "0",
          }}
        >
          Cookies & consent
        </div>
        <div
          style={{
            fontWeight: 400,
            fontSize: "0.74rem",
            color: "#666",
            lineHeight: 1.42,
            marginBottom: "1rem",
          }}
        >
          We use cookies to improve this website. Essential cookies are always active. You can choose your preferences below.
        </div>
        <div className="flex flex-row justify-center gap-2">
          <button
            style={{
              background: "#e96717",
              color: "#fff",
              border: "none",
              padding: "0.48rem 1.2rem",
              borderRadius: "1.2rem",
              fontWeight: 600,
              fontSize: "0.84rem",
              letterSpacing: "0.01em",
              boxShadow: "0 1px 6px #00000015",
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
            Accept
          </button>
          <button
            style={{
              background: "#fff",
              color: "#e96717",
              border: "1px solid #e96717",
              padding: "0.48rem 1rem",
              borderRadius: "1.19rem",
              fontWeight: 600,
              fontSize: "0.80rem",
              letterSpacing: "0.01em",
              boxShadow: "0 1px 4px #00000010",
              cursor: "pointer",
              outline: "none",
              transition: "background 0.13s,color 0.13s",
              display: "block",
              marginLeft: "0.22rem",
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