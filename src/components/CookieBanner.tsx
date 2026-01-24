import { useState } from "react";
import { setCookie, getCookie } from "@/lib/cookies";

export default function CookieBanner() {
  const [show, setShow] = useState(getCookie("cookieConsent") !== "yes");

  const acceptCookies = () => {
    setCookie("cookieConsent", "yes", 365);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-[10000] flex items-center justify-center"
      style={{
        minHeight: "120px", // Tall!
        padding: "2rem 2rem 2.5rem 2rem",
        background: "linear-gradient(90deg,#e11d48 0%,#7e22ce 100%)", // High contrast: red → purple
        color: "#fff",
        fontSize: "1.35rem", // Big text!
        fontWeight: 600,
        boxShadow: "0 -12px 36px 4px #0008, 0 0 0 4px #e11d4880", // Glowy + big shadow
        borderTopLeftRadius: "1.5rem",
        borderTopRightRadius: "1.5rem",
        transition: "all 0.3s cubic-bezier(.17,.67,.83,.67)",
      }}
    >
      <span style={{flex: 1, marginRight: "1rem"}}>
        🍪 Cookies help us keep our website safe and give you a better experience.
        By visiting our website, you agree to our use of essential cookies.<br/>
        With your consent, we also use analytics cookies for personalized ads/content and to analyze our traffic.
        <a
          href="/privacy"
          style={{
            marginLeft: "1rem",
            textDecoration: "underline",
            color: "#fffb",
            fontWeight: 500
          }}
        >
          Privacy Policy
        </a>
      </span>
      <button
        className="ml-8"
        style={{
          background: "linear-gradient(90deg,#65dea4 0%,#09c 100%)",
          color: "#222",
          fontWeight: 700,
          fontSize: "1.2rem",
          border: "none",
          borderRadius: "0.75rem",
          padding: "1rem 2rem",
          cursor: "pointer",
          boxShadow: "0 2px 18px 2px #09c8",
          transition: "transform .13s cubic-bezier(.17,.67,.83,.67), background .25s",
        }}
        onClick={acceptCookies}
        autoFocus
        onMouseOver={e => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        ACCEPT COOKIES
      </button>
    </div>
  );
}