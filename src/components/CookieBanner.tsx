import { useState, useEffect } from "react";
import { setCookie, getCookie } from "@/lib/cookies";

const getUserAgent = () =>
  typeof navigator !== "undefined" ? navigator.userAgent : "";

const getGeolocation = () =>
  new Promise(resolve => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 1500 }
    );
  });

export default function CookieBanner({ userId, email, name }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (getCookie("cookieConsent") !== "yes" && getCookie("cookieConsent") !== "essential") {
      const timeout = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timeout);
    }
  }, []);

  const acceptCookies = async () => {
    setCookie("cookieConsent", "yes", 365);
    setShow(false);

    const geo = await getGeolocation();
    fetch("https://microbuc-backend.onrender.com/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        consent: "yes",
        userAgent: getUserAgent(),
        geolocation: geo ? geo : "unknown",
        userId: userId || null,
        email: email || null,
        name: name || null
      })
    });
  };

  const acceptEssentialOnly = async () => {
    setCookie("cookieConsent", "essential", 365);
    setShow(false);

    fetch("https://microbuc-backend.onrender.com/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        consent: "essential"
      })
    });
  };

  if (!show) return null;

  // --- START SMALL, STRATEGIC BANNER ---
  return (
    <div
      style={{
        position: "fixed",
        bottom: 22,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: "#fff",
        color: "#333",
        borderRadius: "1rem",
        boxShadow: "0 3px 14px #0002",
        padding: "0.9rem 1.3rem 0.9rem 1.3rem",
        fontSize: "0.97rem",
        fontFamily: "Inter, 'Segoe UI', Arial, sans-serif",
        border: "1px solid #e0e0e0",
        maxWidth: "98vw",
        width: "325px",
        display: "flex",
        flexDirection: "column",
        gap: "0.55rem",
      }}
      aria-modal="true"
      tabIndex={-1}
      role="dialog"
    >
      <span style={{fontWeight:600, fontSize:"1em", marginBottom:2}}>
        We use cookies to improve our site.
      </span>
      <div style={{display:"flex",gap:"0.6rem",justifyContent:"flex-end"}}>
        <button
          style={{
            background: "#e96717",
            color: "#fff",
            border: "none",
            padding: "0.58rem 1.5rem",
            borderRadius: "2rem",
            fontWeight: 600,
            fontSize: "0.97rem",
            boxShadow: "0 1px 5px #0001",
            cursor: "pointer",
            outline: "none",
          }}
          autoFocus
          onClick={acceptCookies}
        >
          Accept cookies
        </button>
        <button
          style={{
            background: "#fff",
            color: "#444",
            border: "1.3px solid #ccc",
            padding: "0.58rem 0.7rem",
            borderRadius: "2rem",
            fontWeight: 500,
            fontSize: "0.97rem",
            boxShadow: "none",
            cursor: "pointer",
            outline: "none",
          }}
          onClick={acceptEssentialOnly}
        >
          Essential only
        </button>
      </div>
      <span style={{fontSize:"0.83em",color:"#888",marginLeft:1,marginTop:1}}>
        <a href="/privacy" style={{textDecoration:"underline",color:"#e96717"}}>Privacy Policy</a>
      </span>
    </div>
  );
}